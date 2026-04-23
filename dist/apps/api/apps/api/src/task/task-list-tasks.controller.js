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
const list_tasks_query_dto_1 = require("./dto/list-tasks-query.dto");
const task_list_item_response_dto_1 = require("./dto/task-list-item-response.dto");
const task_search_swagger_1 = require("./task-search.swagger");
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
    async findAll(req, projectId, listId, query) {
        const result = await this.taskService.findTasksByList(req.workspaceContext.workspaceId, req.user.id, projectId, listId, query);
        return (0, common_2.paginated)(result.items, result.total, result.page, result.limit);
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
    (0, swagger_1.ApiOperation)({
        summary: 'Search and filter tasks in a list',
        description: 'ClickUp-style list view query endpoint. Supports instant keyword search, stacked filters, Me Mode, subtasks-as-separate-tasks, sorting, and pagination.',
    }),
    (0, task_search_swagger_1.TaskSearchSwaggerQueries)(),
    (0, swagger_1.ApiOkResponse)({ description: 'Paginated tasks returned', type: task_list_item_response_dto_1.PaginatedTasksResponseDto }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('projectId')),
    __param(2, (0, common_1.Param)('listId')),
    __param(3, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, list_tasks_query_dto_1.ListTasksQueryDto]),
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