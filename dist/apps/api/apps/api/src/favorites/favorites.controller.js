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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FavoritesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const common_2 = require("../../../../libs/common/src");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const workspace_guard_1 = require("../workspace/workspace.guard");
const favorites_service_1 = require("./favorites.service");
let FavoritesController = class FavoritesController {
    favorites;
    constructor(favorites) {
        this.favorites = favorites;
    }
    async listFavoriteProjects(req, includeArchived) {
        const projects = await this.favorites.listProjectFavorites(req.workspaceContext.workspaceId, req.user.id, includeArchived === 'true');
        return (0, common_2.ok)(projects);
    }
    async listFavoriteTasks(req, includeArchived) {
        const tasks = await this.favorites.listTaskFavorites(req.workspaceContext.workspaceId, req.user.id, includeArchived === 'true');
        return (0, common_2.ok)(tasks);
    }
    async favoriteProject(req, projectId) {
        const result = await this.favorites.favoriteProject(req.workspaceContext.workspaceId, req.user.id, projectId);
        return (0, common_2.ok)(result, 'Project favorited successfully');
    }
    async unfavoriteProject(req, projectId) {
        const result = await this.favorites.unfavoriteProject(req.workspaceContext.workspaceId, req.user.id, projectId);
        return (0, common_2.ok)(result, 'Project unfavorited successfully');
    }
    async favoriteTask(req, taskId) {
        const result = await this.favorites.favoriteTask(req.workspaceContext.workspaceId, req.user.id, taskId);
        return (0, common_2.ok)(result, 'Task favorited successfully');
    }
    async unfavoriteTask(req, taskId) {
        const result = await this.favorites.unfavoriteTask(req.workspaceContext.workspaceId, req.user.id, taskId);
        return (0, common_2.ok)(result, 'Task unfavorited successfully');
    }
};
exports.FavoritesController = FavoritesController;
__decorate([
    (0, common_1.Get)('favorites/projects'),
    (0, swagger_1.ApiOperation)({ summary: 'List favorite projects for the current user' }),
    (0, swagger_1.ApiQuery)({ name: 'includeArchived', required: false, type: Boolean }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Favorite projects returned' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Authentication required' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('includeArchived')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], FavoritesController.prototype, "listFavoriteProjects", null);
__decorate([
    (0, common_1.Get)('favorites/tasks'),
    (0, swagger_1.ApiOperation)({ summary: 'List favorite tasks for the current user' }),
    (0, swagger_1.ApiQuery)({ name: 'includeArchived', required: false, type: Boolean }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Favorite tasks returned' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Authentication required' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('includeArchived')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], FavoritesController.prototype, "listFavoriteTasks", null);
__decorate([
    (0, common_1.Put)('projects/:projectId/favorite'),
    (0, swagger_1.ApiOperation)({ summary: 'Mark a project as favorite for the current user' }),
    (0, swagger_1.ApiParam)({ name: 'projectId', description: 'Project UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Project favorited' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Authentication required' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Project not found' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('projectId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], FavoritesController.prototype, "favoriteProject", null);
__decorate([
    (0, common_1.Delete)('projects/:projectId/favorite'),
    (0, swagger_1.ApiOperation)({ summary: 'Remove a project from favorites for the current user' }),
    (0, swagger_1.ApiParam)({ name: 'projectId', description: 'Project UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Project unfavorited' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Authentication required' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Project not found' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('projectId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], FavoritesController.prototype, "unfavoriteProject", null);
__decorate([
    (0, common_1.Put)('tasks/:taskId/favorite'),
    (0, swagger_1.ApiOperation)({ summary: 'Mark a task as favorite for the current user' }),
    (0, swagger_1.ApiParam)({ name: 'taskId', description: 'Task UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Task favorited' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Authentication required' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Task not found' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('taskId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], FavoritesController.prototype, "favoriteTask", null);
__decorate([
    (0, common_1.Delete)('tasks/:taskId/favorite'),
    (0, swagger_1.ApiOperation)({ summary: 'Remove a task from favorites for the current user' }),
    (0, swagger_1.ApiParam)({ name: 'taskId', description: 'Task UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Task unfavorited' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Authentication required' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Task not found' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('taskId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], FavoritesController.prototype, "unfavoriteTask", null);
exports.FavoritesController = FavoritesController = __decorate([
    (0, swagger_1.ApiTags)('favorites'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, workspace_guard_1.WorkspaceGuard),
    (0, swagger_1.ApiHeader)({ name: 'x-workspace-id', required: true, description: 'Active workspace ID' }),
    __metadata("design:paramtypes", [favorites_service_1.FavoritesService])
], FavoritesController);
//# sourceMappingURL=favorites.controller.js.map