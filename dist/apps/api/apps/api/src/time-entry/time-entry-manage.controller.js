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
exports.TimeEntryManageController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const workspace_guard_1 = require("../workspace/workspace.guard");
const time_entry_service_1 = require("./time-entry.service");
const update_time_entry_dto_1 = require("./dto/update-time-entry.dto");
const common_2 = require("../../../../libs/common/src");
let TimeEntryManageController = class TimeEntryManageController {
    timeEntryService;
    constructor(timeEntryService) {
        this.timeEntryService = timeEntryService;
    }
    async getActive(req) {
        const entry = await this.timeEntryService.findActiveTimer(req.workspaceContext.workspaceId, req.user.id);
        return (0, common_2.ok)(entry);
    }
    async update(req, entryId, dto) {
        const entry = await this.timeEntryService.update(req.workspaceContext.workspaceId, req.user.id, entryId, dto);
        return (0, common_2.ok)(entry, 'Time entry updated successfully');
    }
    async remove(req, entryId) {
        await this.timeEntryService.remove(req.workspaceContext.workspaceId, req.user.id, entryId);
        return (0, common_2.ok)(null, 'Time entry deleted successfully');
    }
};
exports.TimeEntryManageController = TimeEntryManageController;
__decorate([
    (0, common_1.Get)('active'),
    (0, swagger_1.ApiOperation)({ summary: 'Get the currently running timer for the authenticated user' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Active timer entry or null if none running' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TimeEntryManageController.prototype, "getActive", null);
__decorate([
    (0, common_1.Patch)(':entryId'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a manual time entry (own entries only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Time entry updated' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Can only update your own time entries' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Time entry not found' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('entryId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_time_entry_dto_1.UpdateTimeEntryDto]),
    __metadata("design:returntype", Promise)
], TimeEntryManageController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':entryId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a time entry (own entries only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Time entry deleted' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Can only delete your own time entries' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Time entry not found' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('entryId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], TimeEntryManageController.prototype, "remove", null);
exports.TimeEntryManageController = TimeEntryManageController = __decorate([
    (0, swagger_1.ApiTags)('time-entries'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('time-entries'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, workspace_guard_1.WorkspaceGuard),
    (0, swagger_1.ApiHeader)({ name: 'x-workspace-id', required: true, description: 'Active workspace ID' }),
    __metadata("design:paramtypes", [time_entry_service_1.TimeEntryService])
], TimeEntryManageController);
//# sourceMappingURL=time-entry-manage.controller.js.map