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
exports.TaskListTasksController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const workspace_guard_1 = require("../workspace/workspace.guard");
const task_service_1 = require("./task.service");
const create_task_dto_1 = require("./dto/create-task.dto");
const reorder_tasks_dto_1 = require("./dto/reorder-tasks.dto");
const common_2 = require("../../../../libs/common/src");
let TaskListTasksController = class TaskListTasksController {
    taskService;
    constructor(taskService) {
        this.taskService = taskService;
    }
    async create(req, projectId, listId, dto) {
        const task = await this.taskService.create(req.workspaceContext.workspaceId, req.user.id, projectId, listId, dto);
        return (0, common_2.ok)(task, 'Task created successfully');
    }
    async findAll(req, projectId, listId) {
        const tasks = await this.taskService.findAllByList(req.workspaceContext.workspaceId, projectId, listId);
        return (0, common_2.ok)(tasks);
    }
    async reorder(req, projectId, listId, dto) {
        const tasks = await this.taskService.reorder(req.workspaceContext.workspaceId, req.user.id, projectId, listId, dto);
        return (0, common_2.ok)(tasks, 'Tasks reordered successfully');
    }
};
exports.TaskListTasksController = TaskListTasksController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create a task inside a list' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Task created with auto-incremented task ID (e.g. FH-101)' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Project, list, or status not found' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('projectId')),
    __param(2, (0, common_1.Param)('listId')),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, create_task_dto_1.CreateTaskDto]),
    __metadata("design:returntype", Promise)
], TaskListTasksController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List all top-level tasks in a list (excludes subtasks)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Tasks returned ordered by position' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('projectId')),
    __param(2, (0, common_1.Param)('listId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], TaskListTasksController.prototype, "findAll", null);
__decorate([
    (0, common_1.Put)('reorder'),
    (0, swagger_1.ApiOperation)({ summary: 'Reorder tasks in a list via drag and drop' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Tasks reordered' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Payload must include every active task exactly once' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('projectId')),
    __param(2, (0, common_1.Param)('listId')),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, reorder_tasks_dto_1.ReorderTasksDto]),
    __metadata("design:returntype", Promise)
], TaskListTasksController.prototype, "reorder", null);
exports.TaskListTasksController = TaskListTasksController = __decorate([
    (0, swagger_1.ApiTags)('tasks'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('projects/:projectId/lists/:listId/tasks'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, workspace_guard_1.WorkspaceGuard),
    (0, swagger_1.ApiHeader)({ name: 'x-workspace-id', required: true, description: 'Active workspace ID' }),
    __metadata("design:paramtypes", [task_service_1.TaskService])
], TaskListTasksController);
//# sourceMappingURL=task-list-tasks.controller.js.map