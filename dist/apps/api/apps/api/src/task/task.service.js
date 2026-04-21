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
const task_constants_1 = require("./task.constants");
let TaskService = class TaskService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(workspaceId, userId, projectId, listId, dto) {
        await this.findListOrThrow(workspaceId, projectId, listId);
        await this.findStatusOrThrow(projectId, dto.statusId);
        if (dto.assigneeIds?.length) {
            await this.assertUsersAreMembers(workspaceId, dto.assigneeIds);
        }
        if (dto.tagIds?.length) {
            await this.assertTagsInWorkspace(workspaceId, dto.tagIds);
        }
        const position = await this.getNextPosition(listId);
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
                    statusId: dto.statusId,
                    priority: dto.priority ?? 'NONE',
                    startDate: dto.startDate ?? null,
                    dueDate: dto.dueDate ?? null,
                    position,
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
            await tx.activityLog.create({
                data: {
                    workspaceId,
                    entityType: 'task',
                    entityId: task.id,
                    action: 'created',
                    metadata: { title: dto.title.trim() },
                    performedBy: userId,
                },
            });
            return tx.task.findFirstOrThrow({
                where: { id: task.id },
                select: task_constants_1.TASK_DETAIL_SELECT,
            });
        });
        return this.toDetail(raw);
    }
    async findAllByList(workspaceId, projectId, listId) {
        await this.findListOrThrow(workspaceId, projectId, listId);
        const tasks = await this.prisma.task.findMany({
            where: { listId, depth: 0, deletedAt: null },
            select: task_constants_1.TASK_LIST_ITEM_SELECT,
            orderBy: { position: 'asc' },
        });
        return tasks.map((t) => this.toListItem(t));
    }
    async findOne(workspaceId, taskId) {
        const raw = await this.prisma.task.findFirst({
            where: {
                id: taskId,
                deletedAt: null,
                list: { deletedAt: null, project: { workspaceId, deletedAt: null } },
            },
            select: task_constants_1.TASK_DETAIL_SELECT,
        });
        if (!raw)
            throw new common_1.NotFoundException(task_constants_1.TASK_NOT_FOUND);
        return this.toDetail(raw);
    }
    async update(workspaceId, userId, taskId, dto) {
        const task = await this.findTaskMinimalOrThrow(workspaceId, taskId);
        const updateData = {};
        const logEntries = [];
        if (dto.title !== undefined) {
            updateData.title = dto.title.trim();
            logEntries.push({ fieldName: 'title', oldValue: null, newValue: dto.title.trim() });
        }
        if (dto.description !== undefined) {
            updateData.description = dto.description;
            logEntries.push({ fieldName: 'description', oldValue: null, newValue: dto.description });
        }
        if (dto.priority !== undefined) {
            updateData.priority = dto.priority;
            logEntries.push({ fieldName: 'priority', oldValue: null, newValue: dto.priority });
        }
        if (dto.startDate !== undefined) {
            updateData.startDate = dto.startDate;
            logEntries.push({ fieldName: 'startDate', oldValue: null, newValue: dto.startDate ?? null });
        }
        if (dto.dueDate !== undefined) {
            updateData.dueDate = dto.dueDate;
            logEntries.push({ fieldName: 'dueDate', oldValue: null, newValue: dto.dueDate ?? null });
        }
        if (dto.statusId !== undefined) {
            await this.findStatusOrThrow(task.list.project.id, dto.statusId);
            updateData.status = { connect: { id: dto.statusId } };
            logEntries.push({ fieldName: 'status', oldValue: null, newValue: dto.statusId });
        }
        if (dto.listId !== undefined && dto.listId !== task.listId) {
            const newList = await this.prisma.taskList.findFirst({
                where: { id: dto.listId, projectId: task.list.project.id, deletedAt: null, isArchived: false },
                select: { id: true },
            });
            if (!newList)
                throw new common_1.NotFoundException(task_constants_1.TASK_LIST_NOT_FOUND);
            const newPosition = await this.getNextPosition(dto.listId);
            updateData.list = { connect: { id: dto.listId } };
            updateData.position = newPosition;
            logEntries.push({ fieldName: 'listId', oldValue: task.listId, newValue: dto.listId });
        }
        if (Object.keys(updateData).length === 0)
            return this.findOne(workspaceId, taskId);
        await this.prisma.task.update({ where: { id: taskId }, data: updateData });
        if (logEntries.length > 0) {
            await this.prisma.activityLog.createMany({
                data: logEntries.map((entry) => ({
                    workspaceId,
                    entityType: 'task',
                    entityId: taskId,
                    action: 'updated',
                    fieldName: entry.fieldName,
                    oldValue: entry.oldValue,
                    newValue: entry.newValue,
                    metadata: {},
                    performedBy: userId,
                })),
            });
        }
        return this.findOne(workspaceId, taskId);
    }
    async remove(workspaceId, userId, taskId, role) {
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
            await tx.activityLog.create({
                data: {
                    workspaceId,
                    entityType: 'task',
                    entityId: taskId,
                    action: 'deleted',
                    metadata: {},
                    performedBy: userId,
                },
            });
        });
    }
    async complete(workspaceId, userId, taskId) {
        await this.findTaskMinimalOrThrow(workspaceId, taskId);
        await this.prisma.task.update({
            where: { id: taskId },
            data: { isCompleted: true, completedAt: new Date() },
        });
        await this.prisma.activityLog.create({
            data: {
                workspaceId,
                entityType: 'task',
                entityId: taskId,
                action: 'completed',
                metadata: {},
                performedBy: userId,
            },
        });
        return this.findOne(workspaceId, taskId);
    }
    async uncomplete(workspaceId, userId, taskId) {
        await this.findTaskMinimalOrThrow(workspaceId, taskId);
        await this.prisma.task.update({
            where: { id: taskId },
            data: { isCompleted: false, completedAt: null },
        });
        await this.prisma.activityLog.create({
            data: {
                workspaceId,
                entityType: 'task',
                entityId: taskId,
                action: 'uncompleted',
                metadata: {},
                performedBy: userId,
            },
        });
        return this.findOne(workspaceId, taskId);
    }
    async createSubtask(workspaceId, userId, parentTaskId, dto) {
        const parent = await this.findTaskMinimalOrThrow(workspaceId, parentTaskId);
        if (parent.depth >= 2)
            throw new common_1.BadRequestException(task_constants_1.SUBTASK_DEPTH_LIMIT);
        await this.findStatusOrThrow(parent.list.project.id, dto.statusId);
        const position = await this.getNextSubtaskPosition(parentTaskId);
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
                    taskNumber: project.taskCounter,
                    createdBy: userId,
                },
                select: { id: true },
            });
            await tx.activityLog.create({
                data: {
                    workspaceId,
                    entityType: 'task',
                    entityId: subtask.id,
                    action: 'created',
                    metadata: { title: dto.title.trim(), parentId: parentTaskId },
                    performedBy: userId,
                },
            });
            return tx.task.findFirstOrThrow({
                where: { id: subtask.id },
                select: task_constants_1.TASK_DETAIL_SELECT,
            });
        });
        return this.toDetail(raw);
    }
    async findSubtasks(workspaceId, parentTaskId) {
        await this.findTaskMinimalOrThrow(workspaceId, parentTaskId);
        const tasks = await this.prisma.task.findMany({
            where: { parentId: parentTaskId, deletedAt: null },
            select: task_constants_1.TASK_LIST_ITEM_SELECT,
            orderBy: { position: 'asc' },
        });
        return tasks.map((t) => this.toListItem(t));
    }
    async addAssignees(workspaceId, userId, taskId, dto) {
        await this.findTaskMinimalOrThrow(workspaceId, taskId);
        await this.assertUsersAreMembers(workspaceId, dto.userIds);
        await this.prisma.taskAssignee.createMany({
            data: dto.userIds.map((uid) => ({ taskId, userId: uid, assignedBy: userId })),
            skipDuplicates: true,
        });
        await this.prisma.activityLog.create({
            data: {
                workspaceId,
                entityType: 'task',
                entityId: taskId,
                action: 'assignees_added',
                metadata: { userIds: dto.userIds },
                performedBy: userId,
            },
        });
        return this.findOne(workspaceId, taskId);
    }
    async removeAssignee(workspaceId, userId, taskId, targetUserId) {
        await this.findTaskMinimalOrThrow(workspaceId, taskId);
        await this.prisma.taskAssignee.deleteMany({
            where: { taskId, userId: targetUserId },
        });
        await this.prisma.activityLog.create({
            data: {
                workspaceId,
                entityType: 'task',
                entityId: taskId,
                action: 'assignee_removed',
                metadata: { removedUserId: targetUserId },
                performedBy: userId,
            },
        });
        return this.findOne(workspaceId, taskId);
    }
    async addTag(workspaceId, userId, taskId, dto) {
        await this.findTaskMinimalOrThrow(workspaceId, taskId);
        await this.assertTagsInWorkspace(workspaceId, [dto.tagId]);
        const existing = await this.prisma.taskTag.findFirst({
            where: { taskId, tagId: dto.tagId },
            select: { id: true },
        });
        if (existing)
            throw new common_1.ConflictException(task_constants_1.TAG_ALREADY_ON_TASK);
        await this.prisma.taskTag.create({ data: { taskId, tagId: dto.tagId } });
        await this.prisma.activityLog.create({
            data: {
                workspaceId,
                entityType: 'task',
                entityId: taskId,
                action: 'tag_added',
                metadata: { tagId: dto.tagId },
                performedBy: userId,
            },
        });
        return this.findOne(workspaceId, taskId);
    }
    async removeTag(workspaceId, userId, taskId, tagId) {
        await this.findTaskMinimalOrThrow(workspaceId, taskId);
        const existing = await this.prisma.taskTag.findFirst({
            where: { taskId, tagId },
            select: { id: true },
        });
        if (!existing)
            throw new common_1.NotFoundException(task_constants_1.TAG_NOT_ON_TASK);
        await this.prisma.taskTag.delete({ where: { id: existing.id } });
        await this.prisma.activityLog.create({
            data: {
                workspaceId,
                entityType: 'task',
                entityId: taskId,
                action: 'tag_removed',
                metadata: { tagId },
                performedBy: userId,
            },
        });
        return this.findOne(workspaceId, taskId);
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
            await this.prisma.activityLog.create({
                data: {
                    workspaceId,
                    entityType: 'task',
                    entityId: listId,
                    action: 'reordered',
                    metadata: { taskIds: dto.taskIds },
                    performedBy: userId,
                },
            });
        }
        return this.findAllByList(workspaceId, projectId, listId);
    }
    async findListOrThrow(workspaceId, projectId, listId) {
        const project = await this.prisma.project.findFirst({
            where: { id: projectId, workspaceId, deletedAt: null },
            select: { id: true },
        });
        if (!project)
            throw new common_1.NotFoundException(task_constants_1.PROJECT_NOT_FOUND);
        const list = await this.prisma.taskList.findFirst({
            where: { id: listId, projectId, deletedAt: null, isArchived: false },
            select: { id: true },
        });
        if (!list)
            throw new common_1.NotFoundException(task_constants_1.TASK_LIST_NOT_FOUND);
        return list;
    }
    async findStatusOrThrow(projectId, statusId) {
        const status = await this.prisma.status.findFirst({
            where: { id: statusId, projectId, deletedAt: null },
            select: { id: true },
        });
        if (!status)
            throw new common_1.NotFoundException(task_constants_1.STATUS_NOT_FOUND);
    }
    async findTaskMinimalOrThrow(workspaceId, taskId) {
        const task = await this.prisma.task.findFirst({
            where: {
                id: taskId,
                deletedAt: null,
                list: { deletedAt: null, project: { workspaceId, deletedAt: null } },
            },
            select: {
                id: true,
                listId: true,
                parentId: true,
                depth: true,
                taskNumber: true,
                createdBy: true,
                list: {
                    select: {
                        projectId: true,
                        project: { select: { id: true, workspaceId: true, taskIdPrefix: true } },
                    },
                },
            },
        });
        if (!task)
            throw new common_1.NotFoundException(task_constants_1.TASK_NOT_FOUND);
        return task;
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
    async getNextSubtaskPosition(parentId) {
        const last = await this.prisma.task.findFirst({
            where: { parentId, deletedAt: null },
            orderBy: { position: 'desc' },
            select: { position: true },
        });
        return (last?.position ?? 0) + 1000;
    }
    toDetail(raw) {
        return {
            ...raw,
            taskId: `${raw.list.project.taskIdPrefix}-${raw.taskNumber}`,
            totalTimeLogged: raw.timeEntries.reduce((sum, e) => sum + (e.duration ?? 0), 0),
        };
    }
    toListItem(raw) {
        return {
            ...raw,
            taskId: `${raw.list.project.taskIdPrefix}-${raw.taskNumber}`,
        };
    }
};
exports.TaskService = TaskService;
exports.TaskService = TaskService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_1.PrismaService])
], TaskService);
//# sourceMappingURL=task.service.js.map