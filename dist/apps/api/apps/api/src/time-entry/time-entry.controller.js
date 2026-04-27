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
exports.TimeEntryController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const workspace_guard_1 = require("../workspace/workspace.guard");
const time_entry_service_1 = require("./time-entry.service");
const manual_time_entry_dto_1 = require("./dto/manual-time-entry.dto");
const common_2 = require("../../../../libs/common/src");
let TimeEntryController = class TimeEntryController {
    timeEntryService;
    constructor(timeEntryService) {
        this.timeEntryService = timeEntryService;
    }
    async addManual(req, taskId, dto) {
        const entry = await this.timeEntryService.addManual(req.workspaceContext.workspaceId, req.user.id, taskId, dto);
        return (0, common_2.ok)(entry, 'Time logged successfully');
    }
    async startTimer(req, taskId) {
        const result = await this.timeEntryService.startTimer(req.workspaceContext.workspaceId, req.user.id, taskId);
        const message = result.stoppedEntry
            ? 'Previous timer stopped. New timer started.'
            : 'Timer started';
        return (0, common_2.ok)(result, message);
    }
    async stopTimer(req, taskId) {
        const entry = await this.timeEntryService.stopTimer(req.workspaceContext.workspaceId, req.user.id, taskId);
        return (0, common_2.ok)(entry, 'Timer stopped');
    }
    async findAll(req, taskId) {
        const entries = await this.timeEntryService.findAllByTask(req.workspaceContext.workspaceId, taskId);
        return (0, common_2.ok)(entries);
    }
};
exports.TimeEntryController = TimeEntryController;
__decorate([
    (0, common_1.Post)('manual'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Log a manual time entry (startTime+endTime or durationMinutes)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Manual time entry logged' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('taskId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, manual_time_entry_dto_1.ManualTimeEntryDto]),
    __metadata("design:returntype", Promise)
], TimeEntryController.prototype, "addManual", null);
__decorate([
    (0, common_1.Post)('start'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Start a timer on a task (auto-stops any previously running timer)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Timer started. stoppedEntry is non-null if a previous timer was auto-stopped' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('taskId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], TimeEntryController.prototype, "startTimer", null);
__decorate([
    (0, common_1.Post)('stop'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Stop the running timer on this task' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Timer stopped and duration recorded' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'No active timer found for this task' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('taskId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], TimeEntryController.prototype, "stopTimer", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List all time entries for a task' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Time entries returned' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('taskId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], TimeEntryController.prototype, "findAll", null);
exports.TimeEntryController = TimeEntryController = __decorate([
    (0, swagger_1.ApiTags)('time-entries'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('tasks/:taskId/time'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, workspace_guard_1.WorkspaceGuard),
    (0, swagger_1.ApiHeader)({ name: 'x-workspace-id', required: true, description: 'Active workspace ID' }),
    __metadata("design:paramtypes", [time_entry_service_1.TimeEntryService])
], TimeEntryController);
//# sourceMappingURL=time-entry.controller.js.map