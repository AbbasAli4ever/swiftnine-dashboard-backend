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
exports.TaskListController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const common_2 = require("../../../../libs/common/src");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const workspace_guard_1 = require("../workspace/workspace.guard");
const task_list_service_1 = require("./task-list.service");
const create_task_list_dto_1 = require("./dto/create-task-list.dto");
const update_task_list_dto_1 = require("./dto/update-task-list.dto");
const reorder_task_lists_dto_1 = require("./dto/reorder-task-lists.dto");
let TaskListController = class TaskListController {
    taskListService;
    constructor(taskListService) {
        this.taskListService = taskListService;
    }
    async create(req, projectId, dto) {
        const list = await this.taskListService.create(req.workspaceContext.workspaceId, req.user.id, projectId, dto);
        return (0, common_2.ok)(list, 'Task list created successfully');
    }
    async findAll(req, projectId, includeArchived) {
        const lists = await this.taskListService.findAll(req.workspaceContext.workspaceId, projectId, includeArchived === 'true');
        return (0, common_2.ok)(lists);
    }
    async reorder(req, projectId, dto) {
        const lists = await this.taskListService.reorder(req.workspaceContext.workspaceId, req.user.id, projectId, dto);
        return (0, common_2.ok)(lists, 'Task lists reordered successfully');
    }
    async update(req, projectId, listId, dto) {
        const list = await this.taskListService.update(req.workspaceContext.workspaceId, req.user.id, projectId, listId, dto);
        return (0, common_2.ok)(list, 'Task list updated successfully');
    }
    async archive(req, projectId, listId) {
        const list = await this.taskListService.archive(req.workspaceContext.workspaceId, req.user.id, projectId, listId);
        return (0, common_2.ok)(list, 'Task list archived successfully');
    }
    async restore(req, projectId, listId) {
        const list = await this.taskListService.restore(req.workspaceContext.workspaceId, req.user.id, projectId, listId);
        return (0, common_2.ok)(list, 'Task list restored successfully');
    }
    async remove(req, projectId, listId) {
        await this.taskListService.remove(req.workspaceContext.workspaceId, req.user.id, projectId, listId);
        return (0, common_2.ok)(null, 'Task list deleted successfully');
    }
};
exports.TaskListController = TaskListController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new task list inside a project' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Task list created' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('projectId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, create_task_list_dto_1.CreateTaskListDto]),
    __metadata("design:returntype", Promise)
], TaskListController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all task lists for a project (active by default)' }),
    (0, swagger_1.ApiQuery)({ name: 'includeArchived', required: false, type: Boolean }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Task lists returned' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('projectId')),
    __param(2, (0, common_1.Query)('includeArchived')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], TaskListController.prototype, "findAll", null);
__decorate([
    (0, common_1.Put)('reorder'),
    (0, swagger_1.ApiOperation)({ summary: 'Reorder task lists using drag and drop' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Task lists reordered' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('projectId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, reorder_task_lists_dto_1.ReorderTaskListsDto]),
    __metadata("design:returntype", Promise)
], TaskListController.prototype, "reorder", null);
__decorate([
    (0, common_1.Patch)(':listId'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a task list and its optional dashboard metadata' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Task list updated' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Task list not found' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('projectId')),
    __param(2, (0, common_1.Param)('listId')),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, update_task_list_dto_1.UpdateTaskListDto]),
    __metadata("design:returntype", Promise)
], TaskListController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':listId/archive'),
    (0, swagger_1.ApiOperation)({ summary: 'Archive a task list' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Task list archived' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Task list not found' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('projectId')),
    __param(2, (0, common_1.Param)('listId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], TaskListController.prototype, "archive", null);
__decorate([
    (0, common_1.Patch)(':listId/restore'),
    (0, swagger_1.ApiOperation)({ summary: 'Restore an archived task list' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Task list restored' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Task list not found' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('projectId')),
    __param(2, (0, common_1.Param)('listId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], TaskListController.prototype, "restore", null);
__decorate([
    (0, common_1.Delete)(':listId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a task list (soft delete)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Task list deleted' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Task list not found' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('projectId')),
    __param(2, (0, common_1.Param)('listId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], TaskListController.prototype, "remove", null);
exports.TaskListController = TaskListController = __decorate([
    (0, swagger_1.ApiTags)('task-lists'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('projects/:projectId/lists'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, workspace_guard_1.WorkspaceGuard),
    (0, swagger_1.ApiHeader)({ name: 'x-workspace-id', required: true, description: 'Active workspace ID' }),
    __metadata("design:paramtypes", [task_list_service_1.TaskListService])
], TaskListController);
//# sourceMappingURL=task-list.controller.js.map