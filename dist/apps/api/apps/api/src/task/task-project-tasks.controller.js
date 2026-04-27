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
exports.TaskProjectTasksController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const common_2 = require("../../../../libs/common/src");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const workspace_guard_1 = require("../workspace/workspace.guard");
const list_tasks_query_dto_1 = require("./dto/list-tasks-query.dto");
const task_list_item_response_dto_1 = require("./dto/task-list-item-response.dto");
const task_service_1 = require("./task.service");
const task_search_swagger_1 = require("./task-search.swagger");
let TaskProjectTasksController = class TaskProjectTasksController {
    taskService;
    constructor(taskService) {
        this.taskService = taskService;
    }
    async findProjectTasks(req, projectId, query) {
        const result = await this.taskService.findTasksByProject(req.workspaceContext.workspaceId, req.user.id, projectId, query);
        return (0, common_2.paginated)(result.items, result.total, result.page, result.limit);
    }
};
exports.TaskProjectTasksController = TaskProjectTasksController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Search and filter tasks across a project',
        description: 'Project-scoped ClickUp-style task query endpoint. Searches across all active lists in the project and supports the same filters as list and workspace task search.',
    }),
    (0, task_search_swagger_1.TaskSearchSwaggerQueries)(),
    (0, swagger_1.ApiOkResponse)({ description: 'Paginated project tasks returned', type: task_list_item_response_dto_1.PaginatedTasksResponseDto }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('projectId')),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, list_tasks_query_dto_1.ListTasksQueryDto]),
    __metadata("design:returntype", Promise)
], TaskProjectTasksController.prototype, "findProjectTasks", null);
exports.TaskProjectTasksController = TaskProjectTasksController = __decorate([
    (0, swagger_1.ApiTags)('tasks'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('projects/:projectId/tasks'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, workspace_guard_1.WorkspaceGuard),
    (0, swagger_1.ApiHeader)({ name: 'x-workspace-id', required: true, description: 'Active workspace ID' }),
    __metadata("design:paramtypes", [task_service_1.TaskService])
], TaskProjectTasksController);
//# sourceMappingURL=task-project-tasks.controller.js.map