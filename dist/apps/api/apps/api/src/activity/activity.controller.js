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
exports.ActivityController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const common_2 = require("../../../../libs/common/src");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const workspace_guard_1 = require("../workspace/workspace.guard");
const activity_service_1 = require("./activity.service");
const list_activity_dto_1 = require("./dto/list-activity.dto");
const activity_feed_item_dto_1 = require("./dto/activity-feed-item.dto");
let ActivityController = class ActivityController {
    activityService;
    constructor(activityService) {
        this.activityService = activityService;
    }
    async listWorkspaceActivity(req, dto) {
        const activity = await this.activityService.listWorkspaceActivity(req.workspaceContext.workspaceId, req.user.id, dto);
        return (0, common_2.ok)(activity);
    }
    async listTaskActivity(req, taskId, dto) {
        const activity = await this.activityService.listTaskActivity(req.workspaceContext.workspaceId, taskId, req.user.id, dto);
        return (0, common_2.ok)(activity);
    }
};
exports.ActivityController = ActivityController;
__decorate([
    (0, common_1.Get)('activity'),
    (0, swagger_1.ApiOperation)({
        summary: 'List workspace activity feed with ClickUp-style filters',
        description: 'Returns a newest-first activity feed scoped to the active workspace. Supports ClickUp-style activity filters, search, Me Mode, location scoping, and cursor pagination. Use this for workspace/project/list activity views and dashboard activity cards.',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'q',
        required: false,
        description: 'Search action, entity type, changed values, field name, actor name, or actor email.',
        example: 'status',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'cursor',
        required: false,
        description: 'Activity row ID from `nextCursor`. Returns activity older than this row.',
        example: '4650c5ff-b89e-4988-9b51-2f6a184c2eba',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        description: 'Page size. Defaults to 25, max 100.',
        example: 25,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'entityType',
        required: false,
        description: 'Filter by producing entity type.',
        enum: [
            'workspace',
            'workspace_member',
            'workspace_invite',
            'project',
            'task_list',
            'status',
            'tag',
            'task',
            'comment',
            'attachment',
            'time_entry',
            'user',
        ],
    }),
    (0, swagger_1.ApiQuery)({
        name: 'entityId',
        required: false,
        description: 'Filter by a specific activity entity ID.',
        example: 'd766605b-7082-4680-b817-d8e4ea5b40fd',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'projectId',
        required: false,
        description: 'Scope feed to a project and its lists/tasks/statuses.',
        example: 'b8fdbd0c-e00d-4770-ac71-3823c9355248',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'listId',
        required: false,
        description: 'Scope feed to a task list and its tasks.',
        example: 'd65ad8c4-f17b-493a-8c81-12206b371589',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'taskId',
        required: false,
        description: 'Scope feed to one task. Prefer `GET /tasks/:taskId/activity` for task side panel usage.',
        example: '5efb9b46-156c-43bb-b7e4-2b4fca537aa7',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'actorIds',
        required: false,
        description: 'Comma-separated or repeated user IDs. Example: `actorIds=id1,id2`.',
        example: '3f6c6c5e-4a8f-4f55-8f49-f6e2d15e7f24,57a817db-e109-4eca-b3bf-eec1e56df1fa',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'actions',
        required: false,
        description: 'Comma-separated or repeated action names. Example: `actions=status_changed,tag_added`.',
        example: 'status_changed,tag_added',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'categories',
        required: false,
        description: 'Comma-separated ClickUp-style categories. Common values: task_creation, name, description, status, priority, start_date, due_date, completion, assignee, tags, attachments, comments, time_tracked, list_moved, subtask, archived_deleted, reorder.',
        example: 'status,assignee,attachments',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'includeSubtasks',
        required: false,
        description: 'Include subtask activity when scoping by task/list/project. Defaults to true.',
        example: true,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'me',
        required: false,
        description: 'Me Mode: only return activity performed by the current user.',
        example: false,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'from',
        required: false,
        description: 'ISO datetime lower bound for activity creation time.',
        example: '2026-04-01T00:00:00.000Z',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'to',
        required: false,
        description: 'ISO datetime upper bound for activity creation time.',
        example: '2026-04-23T23:59:59.999Z',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Activity feed returned', type: activity_feed_item_dto_1.ActivityFeedResponseDto }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, list_activity_dto_1.ListActivityDto]),
    __metadata("design:returntype", Promise)
], ActivityController.prototype, "listWorkspaceActivity", null);
__decorate([
    (0, common_1.Get)('tasks/:taskId/activity'),
    (0, swagger_1.ApiOperation)({
        summary: 'List the task activity timeline',
        description: 'Returns a newest-first task timeline suitable for the ClickUp-style task side panel. Includes task activity plus related attachment/time-entry rows. Comment rows will appear through the same shape once comment CRUD is enabled.',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'q',
        required: false,
        description: 'Search within task activity values, actions, fields, and actor names/emails.',
        example: 'due date',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'cursor',
        required: false,
        description: 'Activity row ID from `nextCursor`. Returns activity older than this row.',
        example: '4650c5ff-b89e-4988-9b51-2f6a184c2eba',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        description: 'Page size. Defaults to 25, max 100.',
        example: 25,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'actorIds',
        required: false,
        description: 'Comma-separated or repeated user IDs.',
        example: '3f6c6c5e-4a8f-4f55-8f49-f6e2d15e7f24',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'actions',
        required: false,
        description: 'Comma-separated or repeated action names.',
        example: 'status_changed,file_uploaded',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'categories',
        required: false,
        description: 'Comma-separated task activity categories: task_creation, name, description, status, priority, start_date, due_date, completion, assignee, tags, attachments, comments, time_tracked, list_moved, subtask, archived_deleted, reorder.',
        example: 'status,comments,attachments',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'includeSubtasks',
        required: false,
        description: 'Include activity for direct subtasks. Defaults to true.',
        example: true,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'me',
        required: false,
        description: 'Only return activity performed by the current user.',
        example: false,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'from',
        required: false,
        description: 'ISO datetime lower bound for activity creation time.',
        example: '2026-04-01T00:00:00.000Z',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'to',
        required: false,
        description: 'ISO datetime upper bound for activity creation time.',
        example: '2026-04-23T23:59:59.999Z',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Task activity feed returned', type: activity_feed_item_dto_1.ActivityFeedResponseDto }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('taskId')),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, list_activity_dto_1.ListActivityDto]),
    __metadata("design:returntype", Promise)
], ActivityController.prototype, "listTaskActivity", null);
exports.ActivityController = ActivityController = __decorate([
    (0, swagger_1.ApiTags)('activity'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, workspace_guard_1.WorkspaceGuard),
    (0, swagger_1.ApiHeader)({ name: 'x-workspace-id', required: true, description: 'Active workspace ID' }),
    __metadata("design:paramtypes", [activity_service_1.ActivityService])
], ActivityController);
//# sourceMappingURL=activity.controller.js.map