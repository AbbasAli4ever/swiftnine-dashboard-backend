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
exports.FavoritesService = void 0;
const common_1 = require("@nestjs/common");
const database_1 = require("../../../../libs/database/src");
const project_constants_1 = require("../project/project.constants");
const task_constants_1 = require("../task/task.constants");
let FavoritesService = class FavoritesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async favoriteProject(workspaceId, userId, projectId) {
        await this.findActiveProjectOrThrow(workspaceId, projectId);
        await this.prisma.projectFavorite.upsert({
            where: { userId_projectId: { userId, projectId } },
            update: {},
            create: { workspaceId, userId, projectId },
        });
        return { isFavorite: true };
    }
    async unfavoriteProject(workspaceId, userId, projectId) {
        await this.findProjectOrThrow(workspaceId, projectId);
        await this.prisma.projectFavorite.deleteMany({ where: { userId, projectId } });
        return { isFavorite: false };
    }
    async favoriteTask(workspaceId, userId, taskId) {
        await this.findActiveTaskOrThrow(workspaceId, taskId);
        await this.prisma.taskFavorite.upsert({
            where: { userId_taskId: { userId, taskId } },
            update: {},
            create: { workspaceId, userId, taskId },
        });
        return { isFavorite: true };
    }
    async unfavoriteTask(workspaceId, userId, taskId) {
        await this.findTaskOrThrow(workspaceId, taskId);
        await this.prisma.taskFavorite.deleteMany({ where: { userId, taskId } });
        return { isFavorite: false };
    }
    async listProjectFavorites(workspaceId, userId, includeArchived = false) {
        const rows = await this.prisma.projectFavorite.findMany({
            where: {
                workspaceId,
                userId,
                project: {
                    deletedAt: null,
                    ...(includeArchived ? {} : { isArchived: false }),
                },
            },
            select: {
                createdAt: true,
                project: { select: project_constants_1.PROJECT_WITH_STATUSES_SELECT },
            },
            orderBy: { createdAt: 'desc' },
        });
        return rows.map((row) => ({
            ...row.project,
            isFavorite: true,
            favoritedAt: row.createdAt,
        }));
    }
    async listTaskFavorites(workspaceId, userId, includeArchived = false) {
        const rows = await this.prisma.taskFavorite.findMany({
            where: {
                workspaceId,
                userId,
                task: {
                    deletedAt: null,
                    list: {
                        deletedAt: null,
                        ...(includeArchived ? {} : { isArchived: false }),
                        project: {
                            workspaceId,
                            deletedAt: null,
                            ...(includeArchived ? {} : { isArchived: false }),
                        },
                    },
                },
            },
            select: {
                createdAt: true,
                task: { select: task_constants_1.TASK_LIST_ITEM_SELECT },
            },
            orderBy: { createdAt: 'desc' },
        });
        return rows.map((row) => ({
            ...this.toTaskListItem(row.task),
            isFavorite: true,
            favoritedAt: row.createdAt,
        }));
    }
    async projectFavoriteIds(userId, projectIds) {
        if (projectIds.length === 0)
            return new Set();
        const favorites = await this.prisma.projectFavorite.findMany({
            where: { userId, projectId: { in: projectIds } },
            select: { projectId: true },
        });
        return new Set(favorites.map((favorite) => favorite.projectId));
    }
    async taskFavoriteIds(userId, taskIds) {
        if (taskIds.length === 0)
            return new Set();
        const favorites = await this.prisma.taskFavorite.findMany({
            where: { userId, taskId: { in: taskIds } },
            select: { taskId: true },
        });
        return new Set(favorites.map((favorite) => favorite.taskId));
    }
    async findProjectOrThrow(workspaceId, projectId) {
        const project = await this.prisma.project.findFirst({
            where: { id: projectId, workspaceId, deletedAt: null },
            select: { id: true },
        });
        if (!project)
            throw new common_1.NotFoundException(project_constants_1.PROJECT_NOT_FOUND);
        return project;
    }
    async findActiveProjectOrThrow(workspaceId, projectId) {
        const project = await this.prisma.project.findFirst({
            where: { id: projectId, workspaceId, deletedAt: null, isArchived: false },
            select: { id: true },
        });
        if (!project)
            throw new common_1.NotFoundException(project_constants_1.PROJECT_NOT_FOUND);
        return project;
    }
    async findTaskOrThrow(workspaceId, taskId) {
        const task = await this.prisma.task.findFirst({
            where: {
                id: taskId,
                deletedAt: null,
                list: { deletedAt: null, project: { workspaceId, deletedAt: null } },
            },
            select: { id: true },
        });
        if (!task)
            throw new common_1.NotFoundException(task_constants_1.TASK_NOT_FOUND);
        return task;
    }
    async findActiveTaskOrThrow(workspaceId, taskId) {
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
            select: { id: true },
        });
        if (!task)
            throw new common_1.NotFoundException(task_constants_1.TASK_NOT_FOUND);
        return task;
    }
    toTaskListItem(raw) {
        return {
            ...raw,
            taskId: `${raw.list.project.taskIdPrefix}-${raw.taskNumber}`,
        };
    }
};
exports.FavoritesService = FavoritesService;
exports.FavoritesService = FavoritesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_1.PrismaService])
], FavoritesService);
//# sourceMappingURL=favorites.service.js.map