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
exports.ProjectService = void 0;
const common_1 = require("@nestjs/common");
const database_1 = require("../../../../libs/database/src");
const project_constants_1 = require("./project.constants");
const favorites_service_1 = require("../favorites/favorites.service");
let ProjectService = class ProjectService {
    prisma;
    favorites;
    constructor(prisma, favorites) {
        this.prisma = prisma;
        this.favorites = favorites;
    }
    async create(workspaceId, userId, dto) {
        const prefixTaken = await this.prisma.project.findFirst({
            where: { workspaceId, taskIdPrefix: dto.taskIdPrefix, deletedAt: null },
            select: { id: true },
        });
        if (prefixTaken)
            throw new common_1.ConflictException(project_constants_1.PROJECT_PREFIX_TAKEN);
        return this.prisma.$transaction(async (tx) => {
            const project = await tx.project.create({
                data: {
                    workspaceId,
                    name: dto.name.trim(),
                    description: dto.description?.trim() ?? null,
                    color: dto.color,
                    icon: dto.icon ?? null,
                    taskIdPrefix: dto.taskIdPrefix,
                    createdBy: userId,
                },
                select: project_constants_1.PROJECT_SELECT,
            });
            await tx.status.createMany({
                data: project_constants_1.DEFAULT_STATUSES.map((s) => ({ ...s, projectId: project.id })),
            });
            await tx.activityLog.create({
                data: {
                    workspaceId,
                    entityType: 'project',
                    entityId: project.id,
                    action: 'created',
                    metadata: { projectName: project.name },
                    performedBy: userId,
                },
            });
            const created = await tx.project.findFirstOrThrow({
                where: { id: project.id },
                select: project_constants_1.PROJECT_WITH_STATUSES_SELECT,
            });
            return { ...created, isFavorite: false };
        });
    }
    async findAll(workspaceId, userId, includeArchived = false) {
        const projects = await this.prisma.project.findMany({
            where: {
                workspaceId,
                deletedAt: null,
                ...(includeArchived ? {} : { isArchived: false }),
            },
            select: project_constants_1.PROJECT_WITH_STATUSES_SELECT,
            orderBy: { createdAt: 'asc' },
        });
        return this.withFavoriteState(userId, projects);
    }
    async findArchived(workspaceId, userId) {
        const projects = await this.prisma.project.findMany({
            where: { workspaceId, deletedAt: null, isArchived: true },
            select: project_constants_1.PROJECT_WITH_STATUSES_SELECT,
            orderBy: { updatedAt: 'desc' },
        });
        return this.withFavoriteState(userId, projects);
    }
    async findOne(workspaceId, userId, projectId) {
        const project = await this.prisma.project.findFirst({
            where: { id: projectId, workspaceId, deletedAt: null },
            select: project_constants_1.PROJECT_WITH_STATUSES_SELECT,
        });
        if (!project)
            throw new common_1.NotFoundException(project_constants_1.PROJECT_NOT_FOUND);
        return this.withFavoriteState(userId, project);
    }
    async update(workspaceId, projectId, userId, dto) {
        const project = await this.prisma.project.findFirst({
            where: { id: projectId, workspaceId, deletedAt: null },
            select: project_constants_1.PROJECT_SELECT,
        });
        if (!project)
            throw new common_1.NotFoundException(project_constants_1.PROJECT_NOT_FOUND);
        const updateData = {};
        const logEntries = [];
        if (dto.name !== undefined && dto.name !== project.name) {
            updateData.name = dto.name.trim();
            logEntries.push({ fieldName: 'name', oldValue: project.name, newValue: dto.name.trim() });
        }
        if (dto.description !== undefined && dto.description !== project.description) {
            updateData.description = dto.description;
            logEntries.push({ fieldName: 'description', oldValue: project.description ?? null, newValue: dto.description ?? null });
        }
        if (dto.color !== undefined && dto.color !== project.color) {
            updateData.color = dto.color;
            logEntries.push({ fieldName: 'color', oldValue: project.color, newValue: dto.color });
        }
        if (dto.icon !== undefined && dto.icon !== project.icon) {
            updateData.icon = dto.icon;
            logEntries.push({ fieldName: 'icon', oldValue: project.icon ?? null, newValue: dto.icon ?? null });
        }
        if (Object.keys(updateData).length === 0) {
            return this.findOne(workspaceId, userId, projectId);
        }
        await this.prisma.project.update({
            where: { id: projectId },
            data: updateData,
        });
        if (logEntries.length > 0) {
            await this.prisma.activityLog.createMany({
                data: logEntries.map((entry) => ({
                    workspaceId,
                    entityType: 'project',
                    entityId: projectId,
                    action: 'updated',
                    fieldName: entry.fieldName,
                    oldValue: entry.oldValue,
                    newValue: entry.newValue,
                    metadata: { projectName: updateData.name ?? project.name },
                    performedBy: userId,
                })),
            });
        }
        return this.findOne(workspaceId, userId, projectId);
    }
    async archive(workspaceId, projectId, userId, role) {
        this.assertCanArchive(role);
        const project = await this.prisma.project.findFirst({
            where: { id: projectId, workspaceId, deletedAt: null },
            select: { id: true, name: true, isArchived: true },
        });
        if (!project)
            throw new common_1.NotFoundException(project_constants_1.PROJECT_NOT_FOUND);
        if (project.isArchived)
            throw new common_1.BadRequestException(project_constants_1.PROJECT_ALREADY_ARCHIVED);
        await this.prisma.$transaction(async (tx) => {
            await tx.project.update({
                where: { id: projectId },
                data: { isArchived: true },
            });
            await tx.activityLog.create({
                data: {
                    workspaceId,
                    entityType: 'project',
                    entityId: projectId,
                    action: 'archived',
                    metadata: { projectName: project.name },
                    performedBy: userId,
                },
            });
        });
        return this.findOne(workspaceId, userId, projectId);
    }
    async restore(workspaceId, projectId, userId, role) {
        this.assertCanArchive(role);
        const project = await this.prisma.project.findFirst({
            where: { id: projectId, workspaceId, deletedAt: null },
            select: { id: true, name: true, isArchived: true },
        });
        if (!project)
            throw new common_1.NotFoundException(project_constants_1.PROJECT_NOT_FOUND);
        if (!project.isArchived)
            throw new common_1.BadRequestException(project_constants_1.PROJECT_NOT_ARCHIVED);
        await this.prisma.$transaction(async (tx) => {
            await tx.project.update({
                where: { id: projectId },
                data: { isArchived: false },
            });
            await tx.activityLog.create({
                data: {
                    workspaceId,
                    entityType: 'project',
                    entityId: projectId,
                    action: 'restored',
                    metadata: { projectName: project.name },
                    performedBy: userId,
                },
            });
        });
        return this.findOne(workspaceId, userId, projectId);
    }
    async remove(workspaceId, projectId, userId, role) {
        if (role !== 'OWNER')
            throw new common_1.ForbiddenException(project_constants_1.OWNER_ONLY);
        const project = await this.prisma.project.findFirst({
            where: { id: projectId, workspaceId, deletedAt: null },
            select: { id: true, name: true },
        });
        if (!project)
            throw new common_1.NotFoundException(project_constants_1.PROJECT_NOT_FOUND);
        const now = new Date();
        await this.prisma.$transaction(async (tx) => {
            const taskLists = await tx.taskList.findMany({
                where: { projectId, deletedAt: null },
                select: { id: true },
            });
            const listIds = taskLists.map((l) => l.id);
            if (listIds.length > 0) {
                await tx.task.updateMany({
                    where: { listId: { in: listIds }, deletedAt: null },
                    data: { deletedAt: now },
                });
            }
            await tx.taskList.updateMany({
                where: { projectId, deletedAt: null },
                data: { deletedAt: now },
            });
            await tx.status.updateMany({
                where: { projectId, deletedAt: null },
                data: { deletedAt: now },
            });
            await tx.project.update({
                where: { id: projectId },
                data: { deletedAt: now },
            });
            await tx.activityLog.create({
                data: {
                    workspaceId,
                    entityType: 'project',
                    entityId: projectId,
                    action: 'deleted',
                    metadata: { projectName: project.name },
                    performedBy: userId,
                },
            });
        });
    }
    assertCanArchive(role) {
        if (role !== 'OWNER' && role !== 'ADMIN') {
            throw new common_1.ForbiddenException('Only workspace owners or admins can archive projects');
        }
    }
    async withFavoriteState(userId, input) {
        const projects = Array.isArray(input) ? input : [input];
        const favoriteIds = this.favorites
            ? await this.favorites.projectFavoriteIds(userId, projects.map((project) => project.id))
            : new Set();
        const enriched = projects.map((project) => ({
            ...project,
            isFavorite: favoriteIds.has(project.id),
        }));
        return Array.isArray(input) ? enriched : enriched[0];
    }
};
exports.ProjectService = ProjectService;
exports.ProjectService = ProjectService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_1.PrismaService,
        favorites_service_1.FavoritesService])
], ProjectService);
//# sourceMappingURL=project.service.js.map