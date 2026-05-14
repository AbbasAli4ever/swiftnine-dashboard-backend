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
exports.ProjectPasswordController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const common_2 = require("../../../../libs/common/src");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const workspace_guard_1 = require("../workspace/workspace.guard");
const project_password_service_1 = require("../project-security/project-password.service");
const project_security_service_1 = require("../project-security/project-security.service");
const change_project_password_dto_1 = require("../project-security/dto/change-project-password.dto");
const confirm_project_password_reset_dto_1 = require("../project-security/dto/confirm-project-password-reset.dto");
const set_project_password_dto_1 = require("../project-security/dto/set-project-password.dto");
const unlock_project_dto_1 = require("../project-security/dto/unlock-project.dto");
let ProjectPasswordController = class ProjectPasswordController {
    projectPasswords;
    projectSecurity;
    constructor(projectPasswords, projectSecurity) {
        this.projectPasswords = projectPasswords;
        this.projectSecurity = projectSecurity;
    }
    async setPassword(req, projectId, dto) {
        const result = await this.projectPasswords.setPassword(req.workspaceContext.workspaceId, projectId, req.user.id, req.workspaceContext.role, dto.password);
        return (0, common_2.ok)(result, 'Project password set successfully');
    }
    async changePassword(req, projectId, dto) {
        const result = await this.projectPasswords.changePassword(req.workspaceContext.workspaceId, projectId, req.user.id, req.workspaceContext.role, dto.currentPassword, dto.newPassword);
        return (0, common_2.ok)(result, 'Project password changed successfully');
    }
    async removePassword(req, projectId) {
        await this.projectPasswords.removePassword(req.workspaceContext.workspaceId, projectId, req.user.id, req.workspaceContext.role);
        return (0, common_2.ok)(null, 'Project password removed successfully');
    }
    async unlock(req, projectId, dto) {
        const result = await this.projectPasswords.unlockProject(req.workspaceContext.workspaceId, projectId, req.user.id, dto.password);
        return (0, common_2.ok)(result, 'Project unlocked successfully');
    }
    async lockStatus(req, projectId) {
        const result = await this.projectSecurity.getLockStatus(req.workspaceContext.workspaceId, projectId, req.user.id);
        return (0, common_2.ok)(result);
    }
    async requestReset(req, projectId) {
        await this.projectPasswords.requestPasswordReset(req.workspaceContext.workspaceId, projectId, req.user.id, req.workspaceContext.role);
        return (0, common_2.ok)(null, 'Project password reset email requested');
    }
    async confirmReset(req, projectId, dto) {
        const result = await this.projectPasswords.resetPasswordWithToken(projectId, dto.token, dto.newPassword, req.user.id);
        return (0, common_2.ok)(result, 'Project password reset successfully');
    }
};
exports.ProjectPasswordController = ProjectPasswordController;
__decorate([
    (0, common_1.Post)(':projectId/password'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Set the initial password for a project' }),
    (0, swagger_1.ApiParam)({ name: 'projectId', description: 'Project UUID' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Project password set' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('projectId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, set_project_password_dto_1.SetProjectPasswordDto]),
    __metadata("design:returntype", Promise)
], ProjectPasswordController.prototype, "setPassword", null);
__decorate([
    (0, common_1.Put)(':projectId/password'),
    (0, swagger_1.ApiOperation)({ summary: 'Change an existing project password' }),
    (0, swagger_1.ApiParam)({ name: 'projectId', description: 'Project UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Project password changed' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('projectId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, change_project_password_dto_1.ChangeProjectPasswordDto]),
    __metadata("design:returntype", Promise)
], ProjectPasswordController.prototype, "changePassword", null);
__decorate([
    (0, common_1.Delete)(':projectId/password'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Remove project password protection' }),
    (0, swagger_1.ApiParam)({ name: 'projectId', description: 'Project UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Project password removed' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('projectId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ProjectPasswordController.prototype, "removePassword", null);
__decorate([
    (0, common_1.Post)(':projectId/unlock'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Unlock a password-protected project for the current user' }),
    (0, swagger_1.ApiParam)({ name: 'projectId', description: 'Project UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Project unlocked' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('projectId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, unlock_project_dto_1.UnlockProjectDto]),
    __metadata("design:returntype", Promise)
], ProjectPasswordController.prototype, "unlock", null);
__decorate([
    (0, common_1.Get)(':projectId/lock-status'),
    (0, swagger_1.ApiOperation)({ summary: 'Get project lock state for the current user' }),
    (0, swagger_1.ApiParam)({ name: 'projectId', description: 'Project UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Project lock status returned' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('projectId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ProjectPasswordController.prototype, "lockStatus", null);
__decorate([
    (0, common_1.Post)(':projectId/password/reset-request'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Send project password reset email to the project creator' }),
    (0, swagger_1.ApiParam)({ name: 'projectId', description: 'Project UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Project password reset email requested' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('projectId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ProjectPasswordController.prototype, "requestReset", null);
__decorate([
    (0, common_1.Post)(':projectId/password/reset-confirm'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Reset project password using an emailed token' }),
    (0, swagger_1.ApiParam)({ name: 'projectId', description: 'Project UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Project password reset' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('projectId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, confirm_project_password_reset_dto_1.ConfirmProjectPasswordResetDto]),
    __metadata("design:returntype", Promise)
], ProjectPasswordController.prototype, "confirmReset", null);
exports.ProjectPasswordController = ProjectPasswordController = __decorate([
    (0, swagger_1.ApiTags)('projects'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('projects'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, workspace_guard_1.WorkspaceGuard),
    (0, swagger_1.ApiHeader)({ name: 'x-workspace-id', required: true, description: 'Active workspace ID' }),
    __metadata("design:paramtypes", [project_password_service_1.ProjectPasswordService,
        project_security_service_1.ProjectSecurityService])
], ProjectPasswordController);
//# sourceMappingURL=project-password.controller.js.map