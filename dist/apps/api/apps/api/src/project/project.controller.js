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
exports.ProjectController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const workspace_guard_1 = require("../workspace/workspace.guard");
const project_service_1 = require("./project.service");
const create_project_dto_1 = require("./dto/create-project.dto");
const update_project_dto_1 = require("./dto/update-project.dto");
const common_2 = require("../../../../libs/common/src");
let ProjectController = class ProjectController {
    projectService;
    constructor(projectService) {
        this.projectService = projectService;
    }
    async create(req, dto) {
        const project = await this.projectService.create(req.workspaceContext.workspaceId, req.user.id, dto);
        return (0, common_2.ok)(project, 'Project created successfully');
    }
    async findAll(req) {
        const projects = await this.projectService.findAll(req.workspaceContext.workspaceId);
        return (0, common_2.ok)(projects);
    }
    async findOne(req, projectId) {
        const project = await this.projectService.findOne(req.workspaceContext.workspaceId, projectId);
        return (0, common_2.ok)(project);
    }
    async update(req, projectId, dto) {
        const project = await this.projectService.update(req.workspaceContext.workspaceId, projectId, req.user.id, dto);
        return (0, common_2.ok)(project, 'Project updated successfully');
    }
    async remove(req, projectId) {
        await this.projectService.remove(req.workspaceContext.workspaceId, projectId, req.user.id, req.workspaceContext.role);
        return (0, common_2.ok)(null, 'Project deleted successfully');
    }
};
exports.ProjectController = ProjectController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new project in the workspace' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Project created with 4 default statuses' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Task ID prefix already taken in this workspace' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_project_dto_1.CreateProjectDto]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List all active (non-archived) projects in the workspace' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Projects returned' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':projectId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a single project with its statuses' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Project returned' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Project not found' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('projectId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':projectId'),
    (0, swagger_1.ApiOperation)({ summary: 'Update project name, description, color, or icon' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Project updated' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Project not found' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('projectId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_project_dto_1.UpdateProjectDto]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':projectId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Soft delete a project and all its data (OWNER only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Project deleted' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Only workspace owner can delete projects' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Project not found' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('projectId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "remove", null);
exports.ProjectController = ProjectController = __decorate([
    (0, swagger_1.ApiTags)('projects'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('projects'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, workspace_guard_1.WorkspaceGuard),
    (0, swagger_1.ApiHeader)({ name: 'x-workspace-id', required: true, description: 'Active workspace ID' }),
    __metadata("design:paramtypes", [project_service_1.ProjectService])
], ProjectController);
//# sourceMappingURL=project.controller.js.map