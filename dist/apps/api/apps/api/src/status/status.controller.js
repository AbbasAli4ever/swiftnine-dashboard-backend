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
exports.StatusController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const common_2 = require("../../../../libs/common/src");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const workspace_guard_1 = require("../workspace/workspace.guard");
const status_service_1 = require("./status.service");
const create_status_dto_1 = require("./dto/create-status.dto");
const update_status_dto_1 = require("./dto/update-status.dto");
const delete_status_dto_1 = require("./dto/delete-status.dto");
const reorder_statuses_dto_1 = require("./dto/reorder-statuses.dto");
const default_statuses_dto_1 = require("./dto/default-statuses.dto");
const list_statuses_dto_1 = require("./dto/list-statuses.dto");
let StatusController = class StatusController {
    statusService;
    constructor(statusService) {
        this.statusService = statusService;
    }
    async create(req, dto) {
        const status = await this.statusService.create(req.workspaceContext.workspaceId, req.user.id, req.workspaceContext.role, dto);
        return (0, common_2.ok)(status, 'Status created successfully');
    }
    async findAll(req, dto) {
        const statuses = await this.statusService.findAll(req.workspaceContext.workspaceId, dto.projectId);
        return (0, common_2.ok)(statuses);
    }
    async reorder(req, dto) {
        const statuses = await this.statusService.reorder(req.workspaceContext.workspaceId, req.user.id, req.workspaceContext.role, dto);
        return (0, common_2.ok)(statuses, 'Statuses reordered successfully');
    }
    async applyDefaultTemplate(req, dto) {
        const statuses = await this.statusService.applyDefaultTemplate(req.workspaceContext.workspaceId, req.user.id, req.workspaceContext.role, dto);
        return (0, common_2.ok)(statuses, 'Default statuses applied successfully');
    }
    async findOne(req, id) {
        const status = await this.statusService.findOne(req.workspaceContext.workspaceId, id);
        return (0, common_2.ok)(status);
    }
    async update(req, id, dto) {
        const status = await this.statusService.update(req.workspaceContext.workspaceId, id, req.user.id, req.workspaceContext.role, dto);
        return (0, common_2.ok)(status, 'Status updated successfully');
    }
    async remove(req, id, dto) {
        await this.statusService.remove(req.workspaceContext.workspaceId, id, req.user.id, req.workspaceContext.role, dto);
        return (0, common_2.ok)(null, 'Status deleted successfully');
    }
};
exports.StatusController = StatusController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create a custom status for a project (OWNER only)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Status created' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Only workspace owner can manage statuses' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_status_dto_1.CreateStatusDto]),
    __metadata("design:returntype", Promise)
], StatusController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List grouped statuses for a project' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Statuses returned' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, list_statuses_dto_1.ListStatusesDto]),
    __metadata("design:returntype", Promise)
], StatusController.prototype, "findAll", null);
__decorate([
    (0, common_1.Put)('reorder'),
    (0, swagger_1.ApiOperation)({ summary: 'Reorder statuses and move them across groups (OWNER only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Statuses reordered' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Only workspace owner can manage statuses' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, reorder_statuses_dto_1.ReorderStatusesDto]),
    __metadata("design:returntype", Promise)
], StatusController.prototype, "reorder", null);
__decorate([
    (0, common_1.Post)('default'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Apply the default status template to a project (OWNER only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Default statuses applied' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Only workspace owner can manage statuses' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, default_statuses_dto_1.DefaultStatusesDto]),
    __metadata("design:returntype", Promise)
], StatusController.prototype, "applyDefaultTemplate", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a single status by id' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Status returned' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Status not found' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], StatusController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a status (OWNER only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Status updated' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Only workspace owner can manage statuses' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_status_dto_1.UpdateStatusDto]),
    __metadata("design:returntype", Promise)
], StatusController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a status and optionally reassign its tasks (OWNER only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Status deleted' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Only workspace owner can manage statuses' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, delete_status_dto_1.DeleteStatusDto]),
    __metadata("design:returntype", Promise)
], StatusController.prototype, "remove", null);
exports.StatusController = StatusController = __decorate([
    (0, swagger_1.ApiTags)('statuses'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('statuses'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, workspace_guard_1.WorkspaceGuard),
    (0, swagger_1.ApiHeader)({ name: 'x-workspace-id', required: true, description: 'Active workspace ID' }),
    __metadata("design:paramtypes", [status_service_1.StatusService])
], StatusController);
//# sourceMappingURL=status.controller.js.map