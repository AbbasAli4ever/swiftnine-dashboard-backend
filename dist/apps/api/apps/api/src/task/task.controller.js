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
exports.TaskController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const workspace_guard_1 = require("../workspace/workspace.guard");
const task_service_1 = require("./task.service");
const update_task_dto_1 = require("./dto/update-task.dto");
const create_subtask_dto_1 = require("./dto/create-subtask.dto");
const add_assignees_dto_1 = require("./dto/add-assignees.dto");
const add_tag_to_task_dto_1 = require("./dto/add-tag-to-task.dto");
const list_tasks_query_dto_1 = require("./dto/list-tasks-query.dto");
const task_list_item_response_dto_1 = require("./dto/task-list-item-response.dto");
const task_search_swagger_1 = require("./task-search.swagger");
const common_2 = require("../../../../libs/common/src");
let TaskController = class TaskController {
    taskService;
    constructor(taskService) {
        this.taskService = taskService;
    }
    async findWorkspaceTasks(req, query) {
        const result = await this.taskService.findTasksByWorkspace(req.workspaceContext.workspaceId, req.user.id, query);
        return (0, common_2.paginated)(result.items, result.total, result.page, result.limit);
    }
    async findOne(req, taskId) {
        const task = await this.taskService.findOne(req.workspaceContext.workspaceId, req.user.id, taskId);
        return (0, common_2.ok)(task);
    }
    async update(req, taskId, dto) {
        const task = await this.taskService.update(req.workspaceContext.workspaceId, req.user.id, taskId, dto);
        return (0, common_2.ok)(task, 'Task updated successfully');
    }
    async remove(req, taskId) {
        await this.taskService.remove(req.workspaceContext.workspaceId, req.user.id, taskId, req.workspaceContext.role);
        return (0, common_2.ok)(null, 'Task deleted successfully');
    }
    async complete(req, taskId) {
        const task = await this.taskService.complete(req.workspaceContext.workspaceId, req.user.id, taskId);
        return (0, common_2.ok)(task, 'Task marked as complete');
    }
    async uncomplete(req, taskId) {
        const task = await this.taskService.uncomplete(req.workspaceContext.workspaceId, req.user.id, taskId);
        return (0, common_2.ok)(task, 'Task marked as incomplete');
    }
    async createSubtask(req, taskId, dto) {
        const subtask = await this.taskService.createSubtask(req.workspaceContext.workspaceId, req.user.id, taskId, dto);
        return (0, common_2.ok)(subtask, 'Subtask created successfully');
    }
    async findSubtasks(req, taskId) {
        const subtasks = await this.taskService.findSubtasks(req.workspaceContext.workspaceId, req.user.id, taskId);
        return (0, common_2.ok)(subtasks);
    }
    async addAssignees(req, taskId, dto) {
        const task = await this.taskService.addAssignees(req.workspaceContext.workspaceId, req.user.id, taskId, dto);
        return (0, common_2.ok)(task, 'Assignees added successfully');
    }
    async removeAssignee(req, taskId, targetUserId) {
        const task = await this.taskService.removeAssignee(req.workspaceContext.workspaceId, req.user.id, taskId, targetUserId);
        return (0, common_2.ok)(task, 'Assignee removed successfully');
    }
    async addTag(req, taskId, dto) {
        const task = await this.taskService.addTag(req.workspaceContext.workspaceId, req.user.id, taskId, dto);
        return (0, common_2.ok)(task, 'Tag added successfully');
    }
    async removeTag(req, taskId, tagId) {
        const task = await this.taskService.removeTag(req.workspaceContext.workspaceId, req.user.id, taskId, tagId);
        return (0, common_2.ok)(task, 'Tag removed successfully');
    }
};
exports.TaskController = TaskController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Search and filter tasks across the active workspace',
        description: 'Workspace-wide ClickUp-style task search. Use this for global task search, My Tasks, dashboard task widgets, and assignee-focused task views.',
    }),
    (0, task_search_swagger_1.TaskSearchSwaggerQueries)(),
    (0, swagger_1.ApiOkResponse)({ description: 'Paginated workspace tasks returned', type: task_list_item_response_dto_1.PaginatedTasksResponseDto }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, list_tasks_query_dto_1.ListTasksQueryDto]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "findWorkspaceTasks", null);
__decorate([
    (0, common_1.Get)(':taskId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get full task detail (assignees, tags, subtasks, time entries)' }),
    (0, swagger_1.ApiParam)({ name: 'taskId', description: 'Task UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Task detail returned' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Authentication required' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Task not found' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('taskId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':taskId'),
    (0, swagger_1.ApiOperation)({
        summary: 'Update task fields',
        description: 'Patch any combination of title, description (plain or rich JSON), status, priority, dates, or list. Only provided fields are updated.',
    }),
    (0, swagger_1.ApiParam)({ name: 'taskId', description: 'Task UUID' }),
    (0, swagger_1.ApiBody)({
        schema: {
            example: {
                title: 'Updated title',
                descriptionJson: {
                    type: 'doc',
                    content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Rich text content.' }] }],
                },
                priority: 'HIGH',
                statusId: 'uuid-here',
                dueDate: '2026-05-15T00:00:00.000Z',
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Task updated' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Authentication required' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Task not found' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('taskId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_task_dto_1.UpdateTaskDto]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':taskId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Soft delete a task (task creator or workspace OWNER only)' }),
    (0, swagger_1.ApiParam)({ name: 'taskId', description: 'Task UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Task deleted' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Authentication required' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Only the task creator or workspace owner can delete' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Task not found' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('taskId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "remove", null);
__decorate([
    (0, common_1.Patch)(':taskId/complete'),
    (0, swagger_1.ApiOperation)({ summary: 'Mark task as completed' }),
    (0, swagger_1.ApiParam)({ name: 'taskId', description: 'Task UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Task marked complete' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Authentication required' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Task not found' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('taskId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "complete", null);
__decorate([
    (0, common_1.Patch)(':taskId/uncomplete'),
    (0, swagger_1.ApiOperation)({ summary: 'Mark task as incomplete' }),
    (0, swagger_1.ApiParam)({ name: 'taskId', description: 'Task UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Task marked incomplete' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Authentication required' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Task not found' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('taskId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "uncomplete", null);
__decorate([
    (0, common_1.Post)(':taskId/subtasks'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create a subtask under a task (max depth 2)' }),
    (0, swagger_1.ApiParam)({ name: 'taskId', description: 'Parent task UUID' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Subtask created' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Subtask nesting limit reached' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Authentication required' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Parent task not found' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('taskId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, create_subtask_dto_1.CreateSubtaskDto]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "createSubtask", null);
__decorate([
    (0, common_1.Get)(':taskId/subtasks'),
    (0, swagger_1.ApiOperation)({ summary: 'List all subtasks of a task' }),
    (0, swagger_1.ApiParam)({ name: 'taskId', description: 'Parent task UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Subtasks returned' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Authentication required' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Task not found' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('taskId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "findSubtasks", null);
__decorate([
    (0, common_1.Post)(':taskId/assignees'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Add assignees to a task' }),
    (0, swagger_1.ApiParam)({ name: 'taskId', description: 'Task UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Assignees added (duplicates silently skipped)' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'One or more users are not workspace members' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Authentication required' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Task not found' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('taskId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, add_assignees_dto_1.AddAssigneesDto]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "addAssignees", null);
__decorate([
    (0, common_1.Delete)(':taskId/assignees/:userId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Remove an assignee from a task' }),
    (0, swagger_1.ApiParam)({ name: 'taskId', description: 'Task UUID' }),
    (0, swagger_1.ApiParam)({ name: 'userId', description: 'User UUID to remove' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Assignee removed' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Authentication required' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Task or assignee not found' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('taskId')),
    __param(2, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "removeAssignee", null);
__decorate([
    (0, common_1.Post)(':taskId/tags'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Add a tag to a task' }),
    (0, swagger_1.ApiParam)({ name: 'taskId', description: 'Task UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Tag added' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Authentication required' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Task or tag not found' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Tag already on this task' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('taskId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, add_tag_to_task_dto_1.AddTagToTaskDto]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "addTag", null);
__decorate([
    (0, common_1.Delete)(':taskId/tags/:tagId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Remove a tag from a task' }),
    (0, swagger_1.ApiParam)({ name: 'taskId', description: 'Task UUID' }),
    (0, swagger_1.ApiParam)({ name: 'tagId', description: 'Tag UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Tag removed' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Authentication required' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Tag not on this task' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('taskId')),
    __param(2, (0, common_1.Param)('tagId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "removeTag", null);
exports.TaskController = TaskController = __decorate([
    (0, swagger_1.ApiTags)('tasks'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('tasks'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, workspace_guard_1.WorkspaceGuard),
    (0, swagger_1.ApiHeader)({ name: 'x-workspace-id', required: true, description: 'Active workspace ID' }),
    __metadata("design:paramtypes", [task_service_1.TaskService])
], TaskController);
//# sourceMappingURL=task.controller.js.map