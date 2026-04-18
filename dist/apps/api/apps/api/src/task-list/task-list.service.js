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
        return list;
    }
    async findAll(workspaceId, projectId, includeArchived) {
        await this.findProjectOrThrow(workspaceId, projectId);
        return this.prisma.taskList.findMany({
            where: {
                projectId,
                deletedAt: null,
                ...(includeArchived ? {} : { isArchived: false }),
            },
            select: task_list_constants_1.TASK_LIST_SELECT,
            orderBy: { position: 'asc' },
        });
    }
    async update(workspaceId, userId, projectId, listId, dto) {
        await this.findProjectOrThrow(workspaceId, projectId);
        const list = await this.findListOrThrow(projectId, listId);
        const name = dto.name.trim();
        if (name === list.name) {
            return list;
        }
        await this.assertUniqueName(projectId, name, listId);
        const updated = await this.prisma.taskList.update({
            where: { id: listId },
            data: { name },
            select: task_list_constants_1.TASK_LIST_SELECT,
        });
        await this.prisma.activityLog.create({
            data: {
                workspaceId,
                entityType: 'task_list',
                entityId: listId,
                action: 'updated',
                fieldName: 'name',
                oldValue: list.name,
                newValue: name,
                metadata: {},
                performedBy: userId,
            },
        });
        return updated;
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
        return updated;
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
        return updated;
    }
    async findProjectOrThrow(workspaceId, projectId) {
        const project = await this.prisma.project.findFirst({
            where: { id: projectId, workspaceId, deletedAt: null },
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
};
exports.TaskListService = TaskListService;
exports.TaskListService = TaskListService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_1.PrismaService])
], TaskListService);
//# sourceMappingURL=task-list.service.js.map