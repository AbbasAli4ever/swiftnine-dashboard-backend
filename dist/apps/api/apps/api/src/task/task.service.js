"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskService = void 0;
const common_1 = require("@nestjs/common");
const database_1 = require("../../../../libs/database/src");
const client_1 = require("../../../../libs/database/src/generated/prisma/client");
const task_constants_1 = require("./task.constants");
const activity_service_1 = require("../activity/activity.service");
const notifications_service_1 = require("../notifications/notifications.service");
const favorites_service_1 = require("../favorites/favorites.service");
const doc_content_1 = require("../docs/doc-content");
const project_security_service_1 = require("../project-security/project-security.service");
let TaskService = class TaskService {
    prisma;
    activity;
    notifications;
    projectSecurity;
    favorites;
    constructor(prisma, activity, notifications, projectSecurity, favorites) {
        this.prisma = prisma;
        this.activity = activity;
        this.notifications = notifications;
        this.projectSecurity = projectSecurity;
        this.favorites = favorites;
    }
    async create(workspaceId, userId, projectId, listId, dto) {
        await this.projectSecurity.assertUnlocked(workspaceId, projectId, userId);
        await this.findListOrThrow(workspaceId, projectId, listId);
        await this.findStatusOrThrow(projectId, dto.statusId);
        if (dto.assigneeIds?.length) {
            await this.assertUsersAreMembers(workspaceId, dto.assigneeIds);
        }
        if (dto.tagIds?.length) {
            await this.assertTagsInWorkspace(workspaceId, dto.tagIds);
        }
        const position = await this.getNextPosition(listId);
        const boardPosition = await this.getNextBoardPosition(projectId, dto.statusId);
        let descriptionPlaintext = null;
        if (dto.descriptionJson) {
            (0, doc_content_1.assertContentSize)(dto.descriptionJson);
            descriptionPlaintext = (0, doc_content_1.extractPlaintext)(dto.descriptionJson);
        }
        const raw = await this.prisma.$transaction(async (tx) => {
            const project = await tx.project.update({
                where: { id: projectId },
                data: { taskCounter: { increment: 1 } },
                select: { taskCounter: true },
            });
            const task = await tx.task.create({
                data: {
                    listId,
                    title: dto.title.trim(),
                    description: dto.description?.trim() ?? null,
                    ...(dto.descriptionJson !== undefined
                        ? { descriptionJson: dto.descriptionJson, descriptionPlaintext }
                        : {}),
                    statusId: dto.statusId,
                    priority: dto.priority ?? 'NONE',
                    startDate: dto.startDate ?? null,
                    dueDate: dto.dueDate ?? null,
                    position,
                    boardPosition,
                    taskNumber: project.taskCounter,
                    createdBy: userId,
                    ...(dto.assigneeIds?.length
                        ? {
                            assignees: {
                                createMany: {
                                    data: dto.assigneeIds.map((uid) => ({ userId: uid, assignedBy: userId })),
                                },
                            },
                        }
                        : {}),
                    ...(dto.tagIds?.length
                        ? {
                            tags: {
                                createMany: {
                                    data: dto.tagIds.map((tid) => ({ tagId: tid })),
                                },
                            },
                        }
                        : {}),
                },
                select: { id: true },
            });
            await this.activity.log({
                workspaceId,
                entityType: 'task',
                entityId: task.id,
                action: 'created',
                metadata: { taskTitle: dto.title.trim(), projectId, listId, statusId: dto.statusId },
                performedBy: userId,
            }, tx);
            return tx.task.findFirstOrThrow({
                where: { id: task.id },
                select: task_constants_1.TASK_DETAIL_SELECT,
            });
        });
        if (dto.assigneeIds && dto.assigneeIds.length) {
            for (const assigneeUserId of dto.assigneeIds) {
                if (assigneeUserId === userId)
                    continue;
                try {
                    await this.notifications.createNotification(dto.workspaceId ?? workspaceId, assigneeUserId, userId, 'task:assigned', 'You were assigned to a task', `Assigned to task ${raw.title}`, 'task', raw.id);
                }
                catch { }
            }
        }
        return this.toDetail(raw);
    }
    async findAllByList(workspaceId, userId, projectId, listId) {
        await this.findListOrThrow(workspaceId, projectId, listId, true);
        const tasks = await this.prisma.task.findMany({
            where: { listId, depth: 0, deletedAt: null },
            select: task_constants_1.TASK_LIST_ITEM_SELECT,
            orderBy: { position: 'asc' },
        });
        return this.toListItems(userId, tasks);
    }
    async findTasksByList(workspaceId, userId, projectId, listId, query) {
        await this.findListOrThrow(workspaceId, projectId, listId, true);
        return this.searchTasks({ workspaceId, userId, projectId, listId }, query);
    }
    async findTasksByProject(workspaceId, userId, projectId, query) {
        await this.findProjectOrThrow(workspaceId, projectId, true);
        return this.searchTasks({ workspaceId, userId, projectId }, query);
    }
    async findTasksByWorkspace(workspaceId, userId, query) {
        return this.searchTasks({ workspaceId, userId }, query, true);
    }
    async getProjectBoard(workspaceId, userId, projectId, query) {
        await this.findProjectOrThrow(workspaceId, projectId, true);
        const [statuses, tasks] = await Promise.all([
            this.prisma.status.findMany({
                where: { projectId, deletedAt: null },
                select: {
                    id: true,
                    name: true,
                    color: true,
                    group: true,
                    position: true,
                    isDefault: true,
                    isProtected: true,
                    isClosed: true,
                },
                orderBy: [{ group: 'asc' }, { position: 'asc' }],
            }),
            this.prisma.task.findMany({
                where: this.buildTaskSearchWhere({ workspaceId, userId, projectId }, query),
                select: task_constants_1.TASK_LIST_ITEM_SELECT,
                orderBy: [
                    { boardPosition: 'asc' },
                    { listId: 'asc' },
                    { id: 'asc' },
                ],
            }),
        ]);
        const favoriteIds = await this.taskFavoriteIds(userId, tasks.map((task) => task.id));
        const tasksByStatus = new Map();
        for (const task of tasks) {
            const mapped = this.toListItem(task, favoriteIds.has(task.id));
            const columnTasks = tasksByStatus.get(mapped.status.id) ?? [];
            columnTasks.push(mapped);
            tasksByStatus.set(mapped.status.id, columnTasks);
        }
        const columns = statuses.map((status) => {
            const columnTasks = tasksByStatus.get(status.id) ?? [];
            return {
                status,
                tasks: columnTasks,
                total: columnTasks.length,
            };
        });
        return {
            groupBy: 'status',
            projectId,
            columns,
            total: tasks.length,
        };
    }
    async findOne(workspaceId, userId, taskId) {
        await this.assertTaskUnlocked(workspaceId, userId, taskId);
        const raw = await this.prisma.task.findFirst({
            where: {
                id: taskId,
                deletedAt: null,
                list: {
                    deletedAt: null,
                    isArchived: false,
                    project: { workspaceId, deletedAt: null, isArchived: false },
                },
            },
            select: task_constants_1.TASK_DETAIL_SELECT,
        });
        if (!raw)
            throw new common_1.NotFoundException(task_constants_1.TASK_NOT_FOUND);
        return this.toDetail(raw, await this.isTaskFavorite(userId, raw.id));
    }
    async update(workspaceId, userId, taskId, dto) {
        await this.assertTaskUnlocked(workspaceId, userId, taskId);
        const task = await this.findTaskMinimalOrThrow(workspaceId, taskId);
        const updateData = {};
        const logEntries = [];
        if (dto.title !== undefined) {
            const title = dto.title.trim();
            if (title !== task.title) {
                updateData.title = title;
                logEntries.push({ fieldName: 'title', oldValue: task.title, newValue: title });
            }
        }
        if (dto.description !== undefined && dto.description !== task.description) {
            updateData.description = dto.description;
            logEntries.push({ fieldName: 'description', oldValue: task.description, newValue: dto.description });
        }
        if (dto.descriptionJson !== undefined) {
            if (dto.descriptionJson === null) {
                updateData.descriptionJson = client_1.Prisma.JsonNull;
                updateData.descriptionPlaintext = null;
            }
            else {
                (0, doc_content_1.assertContentSize)(dto.descriptionJson);
                updateData.descriptionJson = dto.descriptionJson;
                updateData.descriptionPlaintext = (0, doc_content_1.extractPlaintext)(dto.descriptionJson);
            }
            logEntries.push({
                fieldName: 'descriptionJson',
                oldValue: task.descriptionJson ? '[content]' : null,
                newValue: dto.descriptionJson ? '[content]' : null,
            });
        }
        if (dto.priority !== undefined && dto.priority !== task.priority) {
            updateData.priority = dto.priority;
            logEntries.push({ fieldName: 'priority', oldValue: task.priority, newValue: dto.priority });
        }
        if (dto.startDate !== undefined && this.dateString(task.startDate) !== dto.startDate) {
            updateData.startDate = dto.startDate;
            logEntries.push({ fieldName: 'startDate', oldValue: task.startDate, newValue: dto.startDate ?? null });
        }
        if (dto.dueDate !== undefined && this.dateString(task.dueDate) !== dto.dueDate) {
            updateData.dueDate = dto.dueDate;
            logEntries.push({ fieldName: 'dueDate', oldValue: task.dueDate, newValue: dto.dueDate ?? null });
        }
        if (dto.statusId !== undefined && dto.statusId !== task.statusId) {
            const newStatus = await this.findStatusOrThrow(task.list.project.id, dto.statusId);
            updateData.status = { connect: { id: dto.statusId } };
            updateData.boardPosition = await this.getNextBoardPosition(task.list.project.id, dto.statusId);
            logEntries.push({
                fieldName: 'status',
                oldValue: task.status.name,
                newValue: newStatus.name,
                action: 'status_changed',
                metadata: {
                    oldStatusId: task.statusId,
                    newStatusId: dto.statusId,
                    oldStatusName: task.status.name,
                    newStatusName: newStatus.name,
                },
            });
        }
        if (dto.listId !== undefined && dto.listId !== task.listId) {
            const newList = await this.prisma.taskList.findFirst({
                where: { id: dto.listId, projectId: task.list.project.id, deletedAt: null, isArchived: false },
                select: { id: true, name: true },
            });
            if (!newList)
                throw new common_1.NotFoundException(task_constants_1.TASK_LIST_NOT_FOUND);
            const newPosition = await this.getNextPosition(dto.listId);
            updateData.list = { connect: { id: dto.listId } };
            updateData.position = newPosition;
            logEntries.push({
                fieldName: 'listId',
                oldValue: task.list.name,
                newValue: newList.name,
                action: 'moved',
                metadata: { oldListId: task.listId, newListId: dto.listId },
            });
        }
        if (Object.keys(updateData).length === 0)
            return this.findOne(workspaceId, userId, taskId);
        await this.prisma.task.update({ where: { id: taskId }, data: updateData });
        if (logEntries.length > 0) {
            await this.activity.logMany(logEntries.map((entry) => ({
                workspaceId,
                entityType: 'task',
                entityId: taskId,
                action: entry.action ?? 'updated',
                fieldName: entry.fieldName,
                oldValue: entry.oldValue,
                newValue: entry.newValue,
                metadata: {
                    taskTitle: updateData.title ?? task.title,
                    taskNumber: task.taskNumber,
                    projectId: task.list.project.id,
                    projectName: task.list.project.name,
                    listId: dto.listId ?? task.listId,
                    ...(entry.metadata ?? {}),
                },
                performedBy: userId,
            })));
            const changedFields = logEntries.map((e) => e.fieldName).join(', ');
            await this.notifications.notifyTaskAssignees(workspaceId, taskId, userId, {
                type: 'task:updated',
                title: 'Assigned task updated',
                message: `Updated fields: ${changedFields}`,
            });
        }
        return this.findOne(workspaceId, userId, taskId);
    }
    async remove(workspaceId, userId, taskId, role) {
        await this.assertTaskUnlocked(workspaceId, userId, taskId);
        const task = await this.findTaskMinimalOrThrow(workspaceId, taskId);
        if (task.createdBy !== userId && role !== 'OWNER') {
            throw new common_1.ForbiddenException(task_constants_1.FORBIDDEN_DELETE);
        }
        const now = new Date();
        await this.prisma.$transaction(async (tx) => {
            await tx.task.updateMany({
                where: { parentId: taskId, deletedAt: null },
                data: { deletedAt: now },
            });
            await tx.task.update({ where: { id: taskId }, data: { deletedAt: now } });
            await this.activity.log({
                workspaceId,
                entityType: 'task',
                entityId: taskId,
                action: 'deleted',
                metadata: { taskTitle: task.title, taskNumber: task.taskNumber, listId: task.listId },
                performedBy: userId,
            }, tx);
        });
    }
    async complete(workspaceId, userId, taskId) {
        await this.assertTaskUnlocked(workspaceId, userId, taskId);
        const task = await this.findTaskMinimalOrThrow(workspaceId, taskId);
        await this.prisma.task.update({
            where: { id: taskId },
            data: { isCompleted: true, completedAt: new Date() },
        });
        await this.activity.log({
            workspaceId,
            entityType: 'task',
            entityId: taskId,
            action: 'completed',
            fieldName: 'isCompleted',
            oldValue: task.isCompleted,
            newValue: true,
            metadata: { taskTitle: task.title, taskNumber: task.taskNumber },
            performedBy: userId,
        });
        return this.findOne(workspaceId, userId, taskId);
    }
    async uncomplete(workspaceId, userId, taskId) {
        await this.assertTaskUnlocked(workspaceId, userId, taskId);
        const task = await this.findTaskMinimalOrThrow(workspaceId, taskId);
        await this.prisma.task.update({
            where: { id: taskId },
            data: { isCompleted: false, completedAt: null },
        });
        await this.activity.log({
            workspaceId,
            entityType: 'task',
            entityId: taskId,
            action: 'uncompleted',
            fieldName: 'isCompleted',
            oldValue: task.isCompleted,
            newValue: false,
            metadata: { taskTitle: task.title, taskNumber: task.taskNumber },
            performedBy: userId,
        });
        return this.findOne(workspaceId, userId, taskId);
    }
    async createSubtask(workspaceId, userId, parentTaskId, dto) {
        await this.assertTaskUnlocked(workspaceId, userId, parentTaskId);
        const parent = await this.findTaskMinimalOrThrow(workspaceId, parentTaskId);
        if (parent.depth >= 2)
            throw new common_1.BadRequestException(task_constants_1.SUBTASK_DEPTH_LIMIT);
        await this.findStatusOrThrow(parent.list.project.id, dto.statusId);
        const position = await this.getNextSubtaskPosition(parentTaskId);
        const boardPosition = await this.getNextBoardPosition(parent.list.project.id, dto.statusId);
        const raw = await this.prisma.$transaction(async (tx) => {
            const project = await tx.project.update({
                where: { id: parent.list.project.id },
                data: { taskCounter: { increment: 1 } },
                select: { taskCounter: true },
            });
            const subtask = await tx.task.create({
                data: {
                    listId: parent.listId,
                    parentId: parentTaskId,
                    depth: parent.depth + 1,
                    title: dto.title.trim(),
                    description: dto.description?.trim() ?? null,
                    statusId: dto.statusId,
                    priority: dto.priority ?? 'NONE',
                    startDate: dto.startDate ?? null,
                    dueDate: dto.dueDate ?? null,
                    position,
                    boardPosition,
                    taskNumber: project.taskCounter,
                    createdBy: userId,
                },
                select: { id: true },
            });
            await this.activity.log({
                workspaceId,
                entityType: 'task',
                entityId: subtask.id,
                action: 'subtask_created',
                metadata: {
                    taskTitle: dto.title.trim(),
                    parentId: parentTaskId,
                    parentTitle: parent.title,
                },
                performedBy: userId,
            }, tx);
            return tx.task.findFirstOrThrow({
                where: { id: subtask.id },
                select: task_constants_1.TASK_DETAIL_SELECT,
            });
        });
        return this.toDetail(raw);
    }
    async findSubtasks(workspaceId, userId, parentTaskId) {
        await this.assertTaskUnlocked(workspaceId, userId, parentTaskId);
        await this.findTaskMinimalOrThrow(workspaceId, parentTaskId);
        const tasks = await this.prisma.task.findMany({
            where: { parentId: parentTaskId, deletedAt: null },
            select: task_constants_1.TASK_LIST_ITEM_SELECT,
            orderBy: { position: 'asc' },
        });
        return this.toListItems(userId, tasks);
    }
    async addAssignees(workspaceId, userId, taskId, dto) {
        await this.assertTaskUnlocked(workspaceId, userId, taskId);
        const task = await this.findTaskMinimalOrThrow(workspaceId, taskId);
        await this.assertUsersAreMembers(workspaceId, dto.userIds);
        const existing = await this.prisma.taskAssignee.findMany({
            where: { taskId, userId: { in: dto.userIds } },
            select: { userId: true },
        });
        const existingUserIds = new Set(existing.map((assignee) => assignee.userId));
        const newUserIds = dto.userIds.filter((uid) => !existingUserIds.has(uid));
        await this.prisma.taskAssignee.createMany({
            data: dto.userIds.map((uid) => ({ taskId, userId: uid, assignedBy: userId })),
            skipDuplicates: true,
        });
        if (newUserIds.length > 0) {
            await this.activity.log({
                workspaceId,
                entityType: 'task',
                entityId: taskId,
                action: 'assignee_added',
                metadata: { userIds: newUserIds, taskTitle: task.title, taskNumber: task.taskNumber },
                performedBy: userId,
            });
            for (const uid of newUserIds) {
                if (uid === userId)
                    continue;
                try {
                    await this.notifications.createNotification(workspaceId, uid, userId, 'task:assigned', 'You were assigned to a task', `You were added to task ${task.title}`, 'task', taskId);
                }
                catch { }
            }
        }
        return this.findOne(workspaceId, userId, taskId);
    }
    async removeAssignee(workspaceId, userId, taskId, targetUserId) {
        await this.assertTaskUnlocked(workspaceId, userId, taskId);
        const task = await this.findTaskMinimalOrThrow(workspaceId, taskId);
        await this.prisma.taskAssignee.deleteMany({
            where: { taskId, userId: targetUserId },
        });
        await this.activity.log({
            workspaceId,
            entityType: 'task',
            entityId: taskId,
            action: 'assignee_removed',
            metadata: { removedUserId: targetUserId, taskTitle: task.title, taskNumber: task.taskNumber },
            performedBy: userId,
        });
        return this.findOne(workspaceId, userId, taskId);
    }
    async addTag(workspaceId, userId, taskId, dto) {
        await this.assertTaskUnlocked(workspaceId, userId, taskId);
        const task = await this.findTaskMinimalOrThrow(workspaceId, taskId);
        await this.assertTagsInWorkspace(workspaceId, [dto.tagId]);
        const tag = await this.prisma.tag.findFirst({
            where: { id: dto.tagId, workspaceId, deletedAt: null },
            select: { id: true, name: true, color: true },
        });
        const existing = await this.prisma.taskTag.findFirst({
            where: { taskId, tagId: dto.tagId },
            select: { id: true },
        });
        if (existing)
            throw new common_1.ConflictException(task_constants_1.TAG_ALREADY_ON_TASK);
        await this.prisma.taskTag.create({ data: { taskId, tagId: dto.tagId } });
        await this.activity.log({
            workspaceId,
            entityType: 'task',
            entityId: taskId,
            action: 'tag_added',
            metadata: {
                tagId: dto.tagId,
                tagName: tag?.name ?? null,
                taskTitle: task.title,
                taskNumber: task.taskNumber,
            },
            performedBy: userId,
        });
        return this.findOne(workspaceId, userId, taskId);
    }
    async removeTag(workspaceId, userId, taskId, tagId) {
        await this.assertTaskUnlocked(workspaceId, userId, taskId);
        const task = await this.findTaskMinimalOrThrow(workspaceId, taskId);
        const existing = await this.prisma.taskTag.findFirst({
            where: { taskId, tagId },
            select: { id: true, tag: { select: { name: true, color: true } } },
        });
        if (!existing)
            throw new common_1.NotFoundException(task_constants_1.TAG_NOT_ON_TASK);
        await this.prisma.taskTag.delete({ where: { id: existing.id } });
        await this.activity.log({
            workspaceId,
            entityType: 'task',
            entityId: taskId,
            action: 'tag_removed',
            metadata: {
                tagId,
                tagName: existing.tag.name,
                taskTitle: task.title,
                taskNumber: task.taskNumber,
            },
            performedBy: userId,
        });
        return this.findOne(workspaceId, userId, taskId);
    }
    async reorder(workspaceId, userId, projectId, listId, dto) {
        await this.findListOrThrow(workspaceId, projectId, listId);
        const activeTasks = await this.prisma.task.findMany({
            where: { listId, depth: 0, deletedAt: null },
            select: { id: true, position: true },
            orderBy: { position: 'asc' },
        });
        const activeIds = activeTasks.map((t) => t.id);
        if (dto.taskIds.length !== activeIds.length ||
            new Set(dto.taskIds).size !== dto.taskIds.length ||
            activeIds.some((id) => !dto.taskIds.includes(id))) {
            throw new common_1.BadRequestException(task_constants_1.INVALID_REORDER_PAYLOAD);
        }
        const positionById = new Map(activeTasks.map((t) => [t.id, t.position]));
        const updates = dto.taskIds
            .map((id, index) => ({ id, position: (index + 1) * 1000 }))
            .filter((entry) => positionById.get(entry.id) !== entry.position);
        if (updates.length > 0) {
            await this.prisma.$transaction(updates.map((entry) => this.prisma.task.update({
                where: { id: entry.id },
                data: { position: entry.position },
            })));
            await this.activity.log({
                workspaceId,
                entityType: 'task',
                entityId: listId,
                action: 'reordered',
                metadata: { taskIds: dto.taskIds },
                performedBy: userId,
            });
        }
        return this.findAllByList(workspaceId, userId, projectId, listId);
    }
    async reorderProjectBoard(workspaceId, userId, projectId, dto) {
        await this.findProjectOrThrow(workspaceId, projectId);
        const task = await this.findTaskMinimalOrThrow(workspaceId, dto.taskId);
        if (task.list.project.id !== projectId)
            throw new common_1.NotFoundException(task_constants_1.TASK_NOT_FOUND);
        if (task.depth !== 0)
            throw new common_1.BadRequestException(task_constants_1.BOARD_REORDER_SUBTASK_FORBIDDEN);
        const newStatus = await this.findStatusOrThrow(projectId, dto.toStatusId);
        const targetList = dto.toListId
            ? await this.findListForProjectOrThrow(projectId, dto.toListId)
            : null;
        const finalListId = targetList?.id ?? task.listId;
        const activeTargetTasks = await this.prisma.task.findMany({
            where: {
                statusId: dto.toStatusId,
                depth: 0,
                deletedAt: null,
                list: { projectId, deletedAt: null, isArchived: false },
            },
            select: { id: true, listId: true, boardPosition: true },
            orderBy: [{ boardPosition: 'asc' }, { id: 'asc' }],
        });
        const expectedIds = new Set(activeTargetTasks.map((item) => item.id));
        expectedIds.add(dto.taskId);
        if (dto.orderedTaskIds.length !== expectedIds.size ||
            new Set(dto.orderedTaskIds).size !== dto.orderedTaskIds.length ||
            dto.orderedTaskIds.some((id) => !expectedIds.has(id))) {
            throw new common_1.BadRequestException(task_constants_1.INVALID_BOARD_REORDER_PAYLOAD);
        }
        const oldStatusId = task.statusId;
        const oldStatusName = task.status.name;
        const oldListId = task.listId;
        const oldListName = task.list.name;
        const listChanged = finalListId !== task.listId;
        const statusChanged = dto.toStatusId !== task.statusId;
        const finalListName = targetList?.name ?? task.list.name;
        const finalListIdByTaskId = new Map(activeTargetTasks.map((item) => [item.id, item.listId]));
        finalListIdByTaskId.set(dto.taskId, finalListId);
        const affectedListIds = Array.from(new Set([oldListId, finalListId, ...Array.from(finalListIdByTaskId.values())]));
        await this.prisma.$transaction(async (tx) => {
            for (const [index, id] of dto.orderedTaskIds.entries()) {
                const isMovedTask = id === dto.taskId;
                await tx.task.update({
                    where: { id },
                    data: {
                        boardPosition: (index + 1) * 1000,
                        ...(isMovedTask && statusChanged ? { statusId: dto.toStatusId } : {}),
                        ...(isMovedTask && listChanged ? { listId: finalListId } : {}),
                    },
                });
            }
            await this.syncListsFromBoardOrder(tx, projectId, affectedListIds);
            const logs = [
                ...(statusChanged
                    ? [
                        {
                            workspaceId,
                            entityType: 'task',
                            entityId: dto.taskId,
                            action: 'status_changed',
                            fieldName: 'status',
                            oldValue: oldStatusName,
                            newValue: newStatus.name,
                            metadata: {
                                taskTitle: task.title,
                                taskNumber: task.taskNumber,
                                projectId,
                                oldStatusId,
                                newStatusId: dto.toStatusId,
                                oldStatusName,
                                newStatusName: newStatus.name,
                            },
                            performedBy: userId,
                        },
                    ]
                    : []),
                ...(listChanged
                    ? [
                        {
                            workspaceId,
                            entityType: 'task',
                            entityId: dto.taskId,
                            action: 'moved',
                            fieldName: 'listId',
                            oldValue: oldListName,
                            newValue: finalListName,
                            metadata: {
                                taskTitle: task.title,
                                taskNumber: task.taskNumber,
                                projectId,
                                oldListId,
                                newListId: finalListId,
                            },
                            performedBy: userId,
                        },
                    ]
                    : []),
                {
                    workspaceId,
                    entityType: 'task',
                    entityId: dto.taskId,
                    action: 'reordered',
                    metadata: {
                        taskTitle: task.title,
                        taskNumber: task.taskNumber,
                        projectId,
                        statusId: dto.toStatusId,
                        listIds: affectedListIds,
                        taskIds: dto.orderedTaskIds,
                        view: 'board',
                    },
                    performedBy: userId,
                },
            ];
            await this.activity.logMany(logs, tx);
        });
        return this.getProjectBoard(workspaceId, userId, projectId, this.defaultBoardQuery());
    }
    async searchTasks(scope, query, enforceWorkspaceVisibility = false) {
        const where = this.buildTaskSearchWhere(scope, query);
        if (enforceWorkspaceVisibility && !scope.projectId && !scope.listId) {
            const unlockedProjectIds = await this.projectSecurity.activeUnlockedWorkspaceProjectIds(scope.workspaceId, scope.userId);
            const listWhere = where.list;
            where.list = {
                ...listWhere,
                project: {
                    ...(listWhere.project ?? {}),
                    OR: [{ passwordHash: null }, { id: { in: Array.from(unlockedProjectIds) } }],
                },
            };
        }
        const orderBy = this.buildTaskSearchOrderBy(scope, query);
        const skip = (query.page - 1) * query.limit;
        const [total, tasks] = await Promise.all([
            this.prisma.task.count({ where }),
            this.prisma.task.findMany({
                where,
                select: task_constants_1.TASK_LIST_ITEM_SELECT,
                orderBy,
                skip,
                take: query.limit,
            }),
        ]);
        return {
            items: await this.toListItems(scope.userId, tasks),
            total,
            page: query.page,
            limit: query.limit,
        };
    }
    buildTaskSearchWhere(scope, query) {
        const and = [];
        const where = {
            deletedAt: null,
            list: {
                deletedAt: null,
                ...(query.includeArchived ? {} : { isArchived: false }),
                project: {
                    workspaceId: scope.workspaceId,
                    deletedAt: null,
                    ...(scope.projectId ? { id: scope.projectId } : {}),
                    ...(query.includeArchived ? {} : { isArchived: false }),
                },
            },
            ...(scope.listId ? { listId: scope.listId } : {}),
        };
        if (!query.includeSubtasks) {
            where.depth = 0;
        }
        if (query.q) {
            const parsedTaskNumber = this.extractTaskNumber(query.q);
            and.push({
                OR: [
                    { title: { contains: query.q, mode: 'insensitive' } },
                    { description: { contains: query.q, mode: 'insensitive' } },
                    { status: { name: { contains: query.q, mode: 'insensitive' } } },
                    { tags: { some: { tag: { name: { contains: query.q, mode: 'insensitive' } } } } },
                    { assignees: { some: { user: { fullName: { contains: query.q, mode: 'insensitive' } } } } },
                    ...(parsedTaskNumber ? [{ taskNumber: parsedTaskNumber }] : []),
                ],
            });
        }
        if (query.statusIds?.length) {
            and.push({ statusId: { in: query.statusIds } });
        }
        if (query.statusGroups?.length) {
            and.push({ status: { group: { in: query.statusGroups } } });
        }
        else if (!query.includeClosed) {
            and.push({ status: { group: { not: 'CLOSED' } } });
        }
        if (query.priorities?.length) {
            and.push({ priority: { in: query.priorities } });
        }
        const dueDateFilter = this.buildDueDateFilter(query);
        if (dueDateFilter) {
            and.push(dueDateFilter);
        }
        const assigneeFilter = this.buildAssigneeFilter(scope.userId, query);
        if (assigneeFilter) {
            and.push(assigneeFilter);
        }
        const tagFilter = this.buildTagFilter(query);
        if (tagFilter) {
            and.push(tagFilter);
        }
        if (query.createdBy?.length) {
            and.push({ createdBy: { in: query.createdBy } });
        }
        this.pushDateRangeFilter(and, 'createdAt', query.createdFrom, query.createdTo);
        this.pushDateRangeFilter(and, 'updatedAt', query.updatedFrom, query.updatedTo);
        this.pushDateRangeFilter(and, 'completedAt', query.completedFrom, query.completedTo);
        if (query.completed !== undefined) {
            and.push({ isCompleted: query.completed });
        }
        if (and.length > 0) {
            where.AND = and;
        }
        return where;
    }
    buildTaskSearchOrderBy(scope, query) {
        const sortBy = query.sortBy ?? (scope.listId ? 'position' : 'updated_at');
        const order = query.sortBy ? query.sortOrder : scope.listId ? 'asc' : 'desc';
        const primary = sortBy === 'created_at'
            ? { createdAt: order }
            : sortBy === 'updated_at'
                ? { updatedAt: order }
                : sortBy === 'due_date'
                    ? { dueDate: order }
                    : sortBy === 'priority'
                        ? { priority: order }
                        : sortBy === 'status'
                            ? { status: { name: order } }
                            : sortBy === 'title'
                                ? { title: order }
                                : { position: order };
        return scope.listId
            ? [primary, { id: 'asc' }]
            : [primary, { listId: 'asc' }, { position: 'asc' }, { id: 'asc' }];
    }
    buildDueDateFilter(query) {
        if (query.dueDate === 'no_due_date') {
            return { dueDate: null };
        }
        if (query.hasDueDate === true) {
            return { dueDate: { not: null } };
        }
        if (query.hasDueDate === false) {
            return { dueDate: null };
        }
        const presetRange = query.dueDate ? this.getDueDatePresetRange(query.dueDate) : null;
        if (presetRange) {
            return { dueDate: presetRange };
        }
        if (!query.dueDateFrom && !query.dueDateTo)
            return null;
        return {
            dueDate: {
                ...(query.dueDateFrom ? { gte: this.parseDateBoundary(query.dueDateFrom, 'start') } : {}),
                ...(query.dueDateTo ? { lte: this.parseDateBoundary(query.dueDateTo, 'end') } : {}),
            },
        };
    }
    buildAssigneeFilter(userId, query) {
        const rawAssigneeIds = query.assigneeIds ?? [];
        const wantsUnassigned = rawAssigneeIds.includes('unassigned') || query.hasAssignees === false;
        const selectedUserIds = Array.from(new Set([
            ...rawAssigneeIds.filter((id) => id !== 'unassigned'),
            ...(query.me ? [userId] : []),
        ]));
        if (query.hasAssignees === true && selectedUserIds.length === 0) {
            return { assignees: { some: {} } };
        }
        if (selectedUserIds.length === 0) {
            return wantsUnassigned ? { assignees: { none: {} } } : null;
        }
        const assignedFilter = query.assigneeMatch === 'all'
            ? {
                AND: selectedUserIds.map((id) => ({
                    assignees: { some: { userId: id } },
                })),
            }
            : { assignees: { some: { userId: { in: selectedUserIds } } } };
        return wantsUnassigned
            ? { OR: [assignedFilter, { assignees: { none: {} } }] }
            : assignedFilter;
    }
    buildTagFilter(query) {
        if (!query.tagIds?.length)
            return null;
        if (query.tagMatch === 'all') {
            return {
                AND: query.tagIds.map((id) => ({
                    tags: { some: { tagId: id } },
                })),
            };
        }
        return { tags: { some: { tagId: { in: query.tagIds } } } };
    }
    pushDateRangeFilter(filters, field, from, to) {
        if (!from && !to)
            return;
        filters.push({
            [field]: {
                ...(from ? { gte: this.parseDateBoundary(from, 'start') } : {}),
                ...(to ? { lte: this.parseDateBoundary(to, 'end') } : {}),
            },
        });
    }
    getDueDatePresetRange(preset) {
        const todayStart = this.startOfUtcDay(new Date());
        const tomorrowStart = this.addUtcDays(todayStart, 1);
        if (preset === 'overdue')
            return { lt: todayStart };
        if (preset === 'today')
            return { gte: todayStart, lt: tomorrowStart };
        if (preset === 'today_or_earlier')
            return { lt: tomorrowStart };
        if (preset === 'tomorrow')
            return { gte: tomorrowStart, lt: this.addUtcDays(tomorrowStart, 1) };
        const weekStart = this.startOfUtcWeek(todayStart);
        const nextWeekStart = this.addUtcDays(weekStart, 7);
        const followingWeekStart = this.addUtcDays(nextWeekStart, 7);
        if (preset === 'this_week')
            return { gte: weekStart, lt: nextWeekStart };
        return { gte: nextWeekStart, lt: followingWeekStart };
    }
    parseDateBoundary(value, boundary) {
        const parsed = new Date(value);
        if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
            parsed.setUTCHours(boundary === 'start' ? 0 : 23, boundary === 'start' ? 0 : 59, boundary === 'start' ? 0 : 59, boundary === 'start' ? 0 : 999);
        }
        return parsed;
    }
    startOfUtcDay(value) {
        return new Date(Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate()));
    }
    startOfUtcWeek(value) {
        const day = value.getUTCDay() || 7;
        return this.addUtcDays(value, 1 - day);
    }
    addUtcDays(value, days) {
        const next = new Date(value);
        next.setUTCDate(next.getUTCDate() + days);
        return next;
    }
    extractTaskNumber(value) {
        const match = value.trim().match(/(?:^|[-#\s])(\d+)$/);
        if (!match)
            return null;
        const parsed = Number.parseInt(match[1], 10);
        return Number.isNaN(parsed) ? null : parsed;
    }
    async findListOrThrow(workspaceId, projectId, listId, allowArchived = false) {
        const project = await this.prisma.project.findFirst({
            where: {
                id: projectId,
                workspaceId,
                deletedAt: null,
                ...(allowArchived ? {} : { isArchived: false }),
            },
            select: { id: true },
        });
        if (!project)
            throw new common_1.NotFoundException(task_constants_1.PROJECT_NOT_FOUND);
        const list = await this.prisma.taskList.findFirst({
            where: {
                id: listId,
                projectId,
                deletedAt: null,
                ...(allowArchived ? {} : { isArchived: false }),
            },
            select: { id: true },
        });
        if (!list)
            throw new common_1.NotFoundException(task_constants_1.TASK_LIST_NOT_FOUND);
        return list;
    }
    async assertTaskUnlocked(workspaceId, userId, taskId) {
        const task = await this.prisma.task.findFirst({
            where: {
                id: taskId,
                deletedAt: null,
                list: { deletedAt: null, project: { workspaceId, deletedAt: null } },
            },
            select: { list: { select: { projectId: true } } },
        });
        if (!task)
            throw new common_1.NotFoundException(task_constants_1.TASK_NOT_FOUND);
        await this.projectSecurity.assertUnlocked(workspaceId, task.list.projectId, userId);
    }
    async findListForProjectOrThrow(projectId, listId) {
        const list = await this.prisma.taskList.findFirst({
            where: { id: listId, projectId, deletedAt: null, isArchived: false },
            select: { id: true, name: true, position: true },
        });
        if (!list)
            throw new common_1.NotFoundException(task_constants_1.TASK_LIST_NOT_FOUND);
        return list;
    }
    async findProjectOrThrow(workspaceId, projectId, includeArchived = false) {
        const project = await this.prisma.project.findFirst({
            where: {
                id: projectId,
                workspaceId,
                deletedAt: null,
                ...(includeArchived ? {} : { isArchived: false }),
            },
            select: { id: true },
        });
        if (!project)
            throw new common_1.NotFoundException(task_constants_1.PROJECT_NOT_FOUND);
    }
    async findStatusOrThrow(projectId, statusId) {
        const status = await this.prisma.status.findFirst({
            where: { id: statusId, projectId, deletedAt: null },
            select: { id: true, name: true },
        });
        if (!status)
            throw new common_1.NotFoundException(task_constants_1.STATUS_NOT_FOUND);
        return status;
    }
    async findTaskMinimalOrThrow(workspaceId, taskId) {
        const task = await this.prisma.task.findFirst({
            where: {
                id: taskId,
                deletedAt: null,
                list: {
                    deletedAt: null,
                    isArchived: false,
                    project: { workspaceId, deletedAt: null, isArchived: false },
                },
            },
            select: {
                id: true,
                listId: true,
                parentId: true,
                depth: true,
                title: true,
                description: true,
                descriptionJson: true,
                statusId: true,
                priority: true,
                startDate: true,
                dueDate: true,
                position: true,
                isCompleted: true,
                taskNumber: true,
                createdBy: true,
                status: { select: { id: true, name: true, color: true } },
                list: {
                    select: {
                        id: true,
                        name: true,
                        position: true,
                        projectId: true,
                        project: { select: { id: true, workspaceId: true, taskIdPrefix: true, name: true } },
                    },
                },
            },
        });
        if (!task)
            throw new common_1.NotFoundException(task_constants_1.TASK_NOT_FOUND);
        return task;
    }
    dateString(value) {
        return value ? value.toISOString() : null;
    }
    async assertUsersAreMembers(workspaceId, userIds) {
        const members = await this.prisma.workspaceMember.findMany({
            where: { workspaceId, userId: { in: userIds }, deletedAt: null },
            select: { userId: true },
        });
        if (members.length !== userIds.length) {
            throw new common_1.BadRequestException(task_constants_1.USER_NOT_MEMBER);
        }
    }
    async assertTagsInWorkspace(workspaceId, tagIds) {
        const tags = await this.prisma.tag.findMany({
            where: { id: { in: tagIds }, workspaceId, deletedAt: null },
            select: { id: true },
        });
        if (tags.length !== tagIds.length) {
            throw new common_1.BadRequestException(task_constants_1.TAG_NOT_IN_WORKSPACE);
        }
    }
    async getNextPosition(listId) {
        const last = await this.prisma.task.findFirst({
            where: { listId, depth: 0, deletedAt: null },
            orderBy: { position: 'desc' },
            select: { position: true },
        });
        return (last?.position ?? 0) + 1000;
    }
    async getNextBoardPosition(projectId, statusId) {
        const last = await this.prisma.task.findFirst({
            where: {
                statusId,
                depth: 0,
                deletedAt: null,
                list: { projectId, deletedAt: null, isArchived: false },
            },
            orderBy: { boardPosition: 'desc' },
            select: { boardPosition: true },
        });
        return (last?.boardPosition ?? 0) + 1000;
    }
    async getNextSubtaskPosition(parentId) {
        const last = await this.prisma.task.findFirst({
            where: { parentId, deletedAt: null },
            orderBy: { position: 'desc' },
            select: { position: true },
        });
        return (last?.position ?? 0) + 1000;
    }
    toDetail(raw, isFavorite = false) {
        return {
            ...raw,
            taskId: `${raw.list.project.taskIdPrefix}-${raw.taskNumber}`,
            totalTimeLogged: raw.timeEntries.reduce((sum, e) => sum + (e.duration ?? 0), 0),
            isFavorite,
        };
    }
    toListItem(raw, isFavorite = false) {
        return {
            ...raw,
            taskId: `${raw.list.project.taskIdPrefix}-${raw.taskNumber}`,
            isFavorite,
        };
    }
    async toListItems(userId, rawTasks) {
        const favoriteIds = await this.taskFavoriteIds(userId, rawTasks.map((task) => task.id));
        return rawTasks.map((task) => this.toListItem(task, favoriteIds.has(task.id)));
    }
    async isTaskFavorite(userId, taskId) {
        const ids = await this.taskFavoriteIds(userId, [taskId]);
        return ids.has(taskId);
    }
    async taskFavoriteIds(userId, taskIds) {
        if (!this.favorites)
            return new Set();
        return this.favorites.taskFavoriteIds(userId, taskIds);
    }
    defaultBoardQuery() {
        return {
            q: undefined,
            page: 1,
            limit: 100,
            sortBy: undefined,
            sortOrder: 'asc',
            statusIds: undefined,
            statusGroups: undefined,
            priorities: undefined,
            dueDateFrom: undefined,
            dueDateTo: undefined,
            dueDate: undefined,
            assigneeIds: undefined,
            assigneeMatch: 'any',
            tagIds: undefined,
            tagMatch: 'any',
            createdBy: undefined,
            createdFrom: undefined,
            createdTo: undefined,
            updatedFrom: undefined,
            updatedTo: undefined,
            completedFrom: undefined,
            completedTo: undefined,
            includeSubtasks: false,
            includeClosed: true,
            includeArchived: false,
            me: false,
            hasAssignees: undefined,
            hasDueDate: undefined,
            completed: undefined,
        };
    }
    async syncListsFromBoardOrder(tx, projectId, affectedListIds) {
        if (affectedListIds.length === 0)
            return;
        const tasks = await tx.task.findMany({
            where: {
                listId: { in: affectedListIds },
                depth: 0,
                deletedAt: null,
                list: { projectId, deletedAt: null, isArchived: false },
            },
            select: {
                id: true,
                listId: true,
                position: true,
                boardPosition: true,
                status: {
                    select: {
                        id: true,
                        group: true,
                        position: true,
                    },
                },
            },
        });
        const statusGroupRank = {
            NOT_STARTED: 0,
            ACTIVE: 1,
            DONE: 2,
            CLOSED: 3,
        };
        const tasksByList = new Map();
        for (const task of tasks) {
            const listTasks = tasksByList.get(task.listId) ?? [];
            listTasks.push(task);
            tasksByList.set(task.listId, listTasks);
        }
        for (const listTasks of tasksByList.values()) {
            const sortedTasks = [...listTasks].sort((left, right) => {
                const leftGroupRank = statusGroupRank[left.status.group] ?? Number.MAX_SAFE_INTEGER;
                const rightGroupRank = statusGroupRank[right.status.group] ?? Number.MAX_SAFE_INTEGER;
                if (leftGroupRank !== rightGroupRank)
                    return leftGroupRank - rightGroupRank;
                if (left.status.position !== right.status.position) {
                    return left.status.position - right.status.position;
                }
                if (left.boardPosition !== right.boardPosition) {
                    return left.boardPosition - right.boardPosition;
                }
                return left.id.localeCompare(right.id);
            });
            await Promise.all(sortedTasks.map((task, index) => {
                const nextPosition = (index + 1) * 1000;
                if (task.position === nextPosition)
                    return Promise.resolve();
                return tx.task.update({
                    where: { id: task.id },
                    data: { position: nextPosition },
                });
            }));
        }
    }
};
exports.TaskService = TaskService;
exports.TaskService = TaskService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_1.PrismaService,
        activity_service_1.ActivityService,
        notifications_service_1.NotificationsService,
        project_security_service_1.ProjectSecurityService,
        favorites_service_1.FavoritesService])
], TaskService);
//# sourceMappingURL=task.service.js.map