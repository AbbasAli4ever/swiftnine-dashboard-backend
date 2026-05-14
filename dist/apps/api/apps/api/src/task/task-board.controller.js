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
exports.TaskBoardController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const common_2 = require("../../../../libs/common/src");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const workspace_guard_1 = require("../workspace/workspace.guard");
const project_unlocked_guard_1 = require("../project-security/guards/project-unlocked.guard");
const list_tasks_query_dto_1 = require("./dto/list-tasks-query.dto");
const project_board_response_dto_1 = require("./dto/project-board-response.dto");
const reorder_board_tasks_dto_1 = require("./dto/reorder-board-tasks.dto");
const task_service_1 = require("./task.service");
const task_search_swagger_1 = require("./task-search.swagger");
let TaskBoardController = class TaskBoardController {
    taskService;
    constructor(taskService) {
        this.taskService = taskService;
    }
    async getProjectBoard(req, projectId, query) {
        const board = await this.taskService.getProjectBoard(req.workspaceContext.workspaceId, req.user.id, projectId, query);
        return (0, common_2.ok)(board);
    }
    async reorderProjectBoard(req, projectId, dto) {
        const board = await this.taskService.reorderProjectBoard(req.workspaceContext.workspaceId, req.user.id, projectId, dto);
        return (0, common_2.ok)(board, 'Project board reordered successfully');
    }
};
exports.TaskBoardController = TaskBoardController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get project board tasks grouped by status',
        description: 'Returns every active project status as a board column with filtered tasks from all lists in that project. Cards inside each column are ordered by the task `boardPosition` value.',
    }),
    (0, task_search_swagger_1.TaskSearchSwaggerQueries)(),
    (0, swagger_1.ApiOkResponse)({ description: 'Project board returned', type: project_board_response_dto_1.ProjectBoardResponseDto }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('projectId')),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, list_tasks_query_dto_1.ListTasksQueryDto]),
    __metadata("design:returntype", Promise)
], TaskBoardController.prototype, "getProjectBoard", null);
__decorate([
    (0, common_1.Put)('reorder'),
    (0, swagger_1.ApiOperation)({
        summary: 'Reorder or move a task on the project board',
        description: 'Use this endpoint for board drag/drop. Board order is independent from list order and is stored per status column. If `toStatusId` differs from the task status, the task status is changed. If `toListId` is provided, the task can also move to another list. After the board order is updated, the backend also rewrites `position` values inside affected lists so list view stays aligned with the relative board order for each list.',
    }),
    (0, swagger_1.ApiBody)({
        type: reorder_board_tasks_dto_1.ReorderBoardTasksDto,
        description: '`orderedTaskIds` must contain every active top-level task in the destination status after the move, exactly once. This is the full destination column order after drag/drop, not only the visible cards the user touched.',
        examples: {
            moveAcrossStatuses: {
                summary: 'Move card to another status column',
                value: {
                    mode: 'manual',
                    taskId: 'a843cde2-f8c4-49a1-916b-308941b56f34',
                    toStatusId: '9fa46c52-c13a-4088-89f8-1c321016862f',
                    orderedTaskIds: [
                        '11111111-1111-4111-8111-111111111111',
                        'a843cde2-f8c4-49a1-916b-308941b56f34',
                        '22222222-2222-4222-8222-222222222222',
                    ],
                },
            },
            moveAcrossListsToo: {
                summary: 'Move card to another status and list',
                value: {
                    mode: 'manual',
                    taskId: 'a843cde2-f8c4-49a1-916b-308941b56f34',
                    toStatusId: '9fa46c52-c13a-4088-89f8-1c321016862f',
                    toListId: 'f34f824e-9d99-40ec-b8f8-a9777c7ed3d6',
                    orderedTaskIds: [
                        'a843cde2-f8c4-49a1-916b-308941b56f34',
                        '22222222-2222-4222-8222-222222222222',
                    ],
                },
            },
        },
    }),
    (0, swagger_1.ApiOkResponse)({ description: 'Project board reordered and returned', type: project_board_response_dto_1.ProjectBoardResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid board reorder payload or subtask drag attempted' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Task, project, status, or list not found' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('projectId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, reorder_board_tasks_dto_1.ReorderBoardTasksDto]),
    __metadata("design:returntype", Promise)
], TaskBoardController.prototype, "reorderProjectBoard", null);
exports.TaskBoardController = TaskBoardController = __decorate([
    (0, swagger_1.ApiTags)('tasks'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('projects/:projectId/board/tasks'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, workspace_guard_1.WorkspaceGuard, project_unlocked_guard_1.ProjectUnlockedGuard),
    (0, swagger_1.ApiHeader)({ name: 'x-workspace-id', required: true, description: 'Active workspace ID' }),
    __metadata("design:paramtypes", [task_service_1.TaskService])
], TaskBoardController);
//# sourceMappingURL=task-board.controller.js.map