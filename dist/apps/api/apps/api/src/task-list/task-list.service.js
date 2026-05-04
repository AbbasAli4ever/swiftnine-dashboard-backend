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
exports.TaskListService = void 0;
const common_1 = require("@nestjs/common");
const database_1 = require("../../../../libs/database/src");
const task_list_constants_1 = require("./task-list.constants");
let TaskListService = class TaskListService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(workspaceId, userId, projectId, dto) {
        await this.findProjectOrThrow(workspaceId, projectId);
        const name = dto.name.trim();
        await this.assertUniqueName(projectId, name);
        const position = await this.getNextPosition(projectId);
        const list = await this.prisma.taskList.create({
            data: {
                projectId,
                name,
                position,
                createdBy: userId,
            },
            select: task_list_constants_1.TASK_LIST_SELECT,
        });
        await this.prisma.activityLog.create({
            data: {
                workspaceId,
                entityType: 'task_list',
                entityId: list.id,
                action: 'created',
                metadata: { listName: list.name },
                performedBy: userId,
            },
        });
        return this.toTaskListData(list);
    }
    async findAll(workspaceId, projectId, includeArchived) {
        await this.findProjectOrThrow(workspaceId, projectId, true);
        const lists = await this.prisma.taskList.findMany({
            where: {
                projectId,
                deletedAt: null,
                ...(includeArchived ? {} : { isArchived: false }),
            },
            select: task_list_constants_1.TASK_LIST_SELECT,
            orderBy: { position: 'asc' },
        });
        return lists.map((list) => this.toTaskListData(list));
    }
    async update(workspaceId, userId, projectId, listId, dto) {
        await this.findProjectOrThrow(workspaceId, projectId);
        const list = await this.findListOrThrow(projectId, listId);
        const updateData = {};
        const logs = [];
        if (dto.name !== undefined) {
            const name = dto.name.trim();
            if (name !== list.name) {
                await this.assertUniqueName(projectId, name, listId);
                updateData.name = name;
                logs.push({ fieldName: 'name', oldValue: list.name, newValue: name });
            }
        }
        const nextStartDate = dto.startDate === undefined ? list.startDate : this.parseDateOnly(dto.startDate);
        const nextEndDate = dto.endDate === undefined ? list.endDate : this.parseDateOnly(dto.endDate);
        if (nextStartDate && nextEndDate && nextStartDate.getTime() > nextEndDate.getTime()) {
            throw new common_1.BadRequestException(task_list_constants_1.TASK_LIST_INVALID_DATE_RANGE);
        }
        if (dto.startDate !== undefined) {
            updateData.startDate = nextStartDate;
            logs.push({
                fieldName: 'startDate',
                oldValue: this.formatDateOnly(list.startDate),
                newValue: this.formatDateOnly(nextStartDate),
            });
        }
        if (dto.endDate !== undefined) {
            updateData.endDate = nextEndDate;
            logs.push({
                fieldName: 'endDate',
                oldValue: this.formatDateOnly(list.endDate),
                newValue: this.formatDateOnly(nextEndDate),
            });
        }
        if (dto.priority !== undefined) {
            updateData.priority = dto.priority;
            logs.push({
                fieldName: 'priority',
                oldValue: list.priority,
                newValue: dto.priority,
            });
        }
        if (dto.ownerId !== undefined) {
            if (dto.ownerId === null) {
                if (list.ownerUserId !== null) {
                    updateData.owner = { disconnect: true };
                    logs.push({
                        fieldName: 'ownerUserId',
                        oldValue: list.owner?.fullName ?? null,
                        newValue: null,
                    });
                }
            }
            else {
                const owner = await this.resolveOwnerOrThrow(workspaceId, dto.ownerId);
                if (owner.userId !== list.ownerUserId) {
                    updateData.owner = { connect: { id: owner.userId } };
                    logs.push({
                        fieldName: 'ownerUserId',
                        oldValue: list.owner?.fullName ?? null,
                        newValue: owner.fullName,
                    });
                }
            }
        }
        if (Object.keys(updateData).length === 0) {
            return this.toTaskListData(list);
        }
        const updated = await this.prisma.taskList.update({
            where: { id: listId },
            data: updateData,
            select: task_list_constants_1.TASK_LIST_SELECT,
        });
        if (logs.length > 0) {
            await this.prisma.activityLog.createMany({
                data: logs.map((log) => ({
                    workspaceId,
                    entityType: 'task_list',
                    entityId: listId,
                    action: 'updated',
                    fieldName: log.fieldName,
                    oldValue: log.oldValue,
                    newValue: log.newValue,
                    metadata: {},
                    performedBy: userId,
                })),
            });
        }
        return this.toTaskListData(updated);
    }
    async remove(workspaceId, userId, projectId, listId) {
        await this.findProjectOrThrow(workspaceId, projectId);
        const list = await this.findListOrThrow(projectId, listId);
        await this.prisma.$transaction(async (tx) => {
            await tx.taskList.update({
                where: { id: listId },
                data: { deletedAt: new Date() },
            });
            await tx.activityLog.create({
                data: {
                    workspaceId,
                    entityType: 'task_list',
                    entityId: listId,
                    action: 'deleted',
                    metadata: { listName: list.name },
                    performedBy: userId,
                },
            });
        });
    }
    async reorder(workspaceId, userId, projectId, dto) {
        await this.findProjectOrThrow(workspaceId, projectId);
        const activeLists = await this.prisma.taskList.findMany({
            where: { projectId, deletedAt: null, isArchived: false },
            select: { id: true, position: true },
            orderBy: { position: 'asc' },
        });
        const activeIds = activeLists.map((l) => l.id);
        if (dto.listIds.length !== activeIds.length ||
            new Set(dto.listIds).size !== dto.listIds.length ||
            activeIds.some((id) => !dto.listIds.includes(id))) {
            throw new common_1.BadRequestException(task_list_constants_1.INVALID_REORDER_PAYLOAD);
        }
        const positionById = new Map(activeLists.map((l) => [l.id, l.position]));
        const updates = dto.listIds
            .map((id, index) => ({ id, position: (index + 1) * 1000 }))
            .filter((entry) => positionById.get(entry.id) !== entry.position);
        if (updates.length > 0) {
            await this.prisma.$transaction(updates.map((entry) => this.prisma.taskList.update({
                where: { id: entry.id },
                data: { position: entry.position },
            })));
            await this.prisma.activityLog.create({
                data: {
                    workspaceId,
                    entityType: 'task_list',
                    entityId: projectId,
                    action: 'reordered',
                    metadata: { listIds: dto.listIds },
                    performedBy: userId,
                },
            });
        }
        return this.findAll(workspaceId, projectId, false);
    }
    async archive(workspaceId, userId, projectId, listId) {
        await this.findProjectOrThrow(workspaceId, projectId);
        const list = await this.findListOrThrow(projectId, listId);
        if (list.isArchived) {
            throw new common_1.BadRequestException(task_list_constants_1.TASK_LIST_ALREADY_ARCHIVED);
        }
        const updated = await this.prisma.taskList.update({
            where: { id: listId },
            data: { isArchived: true },
            select: task_list_constants_1.TASK_LIST_SELECT,
        });
        await this.prisma.activityLog.create({
            data: {
                workspaceId,
                entityType: 'task_list',
                entityId: listId,
                action: 'archived',
                metadata: { listName: list.name },
                performedBy: userId,
            },
        });
        return this.toTaskListData(updated);
    }
    async restore(workspaceId, userId, projectId, listId) {
        await this.findProjectOrThrow(workspaceId, projectId);
        const list = await this.findListOrThrow(projectId, listId, true);
        if (!list.isArchived) {
            throw new common_1.BadRequestException(task_list_constants_1.TASK_LIST_NOT_ARCHIVED);
        }
        const position = await this.getNextPosition(projectId);
        const updated = await this.prisma.taskList.update({
            where: { id: listId },
            data: { isArchived: false, position },
            select: task_list_constants_1.TASK_LIST_SELECT,
        });
        await this.prisma.activityLog.create({
            data: {
                workspaceId,
                entityType: 'task_list',
                entityId: listId,
                action: 'restored',
                metadata: { listName: list.name },
                performedBy: userId,
            },
        });
        return this.toTaskListData(updated);
    }
    async findProjectOrThrow(workspaceId, projectId, includeArchived = false) {
        const project = await this.prisma.project.findFirst({
            where: {
                id: projectId,
                workspaceId,
                deletedAt: null,
                ...(includeArchived ? {} : { isArchived: false }),
            },
            select: { id: true, name: true },
        });
        if (!project) {
            throw new common_1.NotFoundException(task_list_constants_1.PROJECT_NOT_FOUND);
        }
        return project;
    }
    async findListOrThrow(projectId, listId, includeArchived = false) {
        const list = await this.prisma.taskList.findFirst({
            where: {
                id: listId,
                projectId,
                deletedAt: null,
                ...(includeArchived ? {} : {}),
            },
            select: task_list_constants_1.TASK_LIST_SELECT,
        });
        if (!list) {
            throw new common_1.NotFoundException(task_list_constants_1.TASK_LIST_NOT_FOUND);
        }
        return list;
    }
    async resolveOwnerOrThrow(workspaceId, ownerId) {
        let member = await this.prisma.workspaceMember.findFirst({
            where: { id: ownerId, workspaceId, deletedAt: null },
            select: {
                userId: true,
                user: {
                    select: {
                        id: true,
                        fullName: true,
                        avatarUrl: true,
                        avatarColor: true,
                    },
                },
            },
        });
        if (!member) {
            member = await this.prisma.workspaceMember.findFirst({
                where: { userId: ownerId, workspaceId, deletedAt: null },
                select: {
                    userId: true,
                    user: {
                        select: {
                            id: true,
                            fullName: true,
                            avatarUrl: true,
                            avatarColor: true,
                        },
                    },
                },
            });
        }
        if (!member) {
            throw new common_1.BadRequestException(task_list_constants_1.TASK_LIST_OWNER_NOT_IN_WORKSPACE);
        }
        return {
            userId: member.userId,
            fullName: member.user.fullName,
            avatarUrl: member.user.avatarUrl,
            avatarColor: member.user.avatarColor,
        };
    }
    async assertUniqueName(projectId, name, ignoreListId) {
        const existing = await this.prisma.taskList.findFirst({
            where: {
                projectId,
                name,
                deletedAt: null,
                ...(ignoreListId ? { id: { not: ignoreListId } } : {}),
            },
            select: { id: true },
        });
        if (existing) {
            throw new common_1.ConflictException(task_list_constants_1.TASK_LIST_NAME_TAKEN);
        }
    }
    async getNextPosition(projectId) {
        const last = await this.prisma.taskList.findFirst({
            where: { projectId, deletedAt: null },
            orderBy: { position: 'desc' },
            select: { position: true },
        });
        return (last?.position ?? 0) + 1000;
    }
    parseDateOnly(value) {
        return value ? new Date(`${value}T00:00:00.000Z`) : null;
    }
    formatDateOnly(value) {
        return value ? value.toISOString().slice(0, 10) : null;
    }
    toTaskListData(list) {
        return {
            ...list,
            startDate: this.formatDateOnly(list.startDate),
            endDate: this.formatDateOnly(list.endDate),
        };
    }
};
exports.TaskListService = TaskListService;
exports.TaskListService = TaskListService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_1.PrismaService])
], TaskListService);
//# sourceMappingURL=task-list.service.js.map