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
exports.WorkspaceController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const workspace_guard_1 = require("./workspace.guard");
const roles_decorator_1 = require("../roles/roles.decorator");
const roles_guard_1 = require("../roles/roles.guard");
const workspace_service_1 = require("./workspace.service");
const create_workspace_dto_1 = require("./dto/create-workspace.dto");
const update_workspace_dto_1 = require("./dto/update-workspace.dto");
const invite_member_dto_1 = require("./dto/invite-member.dto");
const accept_invite_dto_1 = require("./dto/accept-invite.dto");
const batch_invite_members_dto_1 = require("./dto/batch-invite-members.dto");
const claim_invite_dto_1 = require("./dto/claim-invite.dto");
const member_response_dto_1 = require("./dto/member-response.dto");
const member_detail_response_dto_1 = require("./dto/member-detail-response.dto");
const common_2 = require("../../../../libs/common/src");
const auth_cookies_1 = require("../auth/auth.cookies");
let WorkspaceController = class WorkspaceController {
    workspaceService;
    constructor(workspaceService) {
        this.workspaceService = workspaceService;
    }
    async create(dto, req) {
        const workspace = await this.workspaceService.create(req.user.id, dto);
        return (0, common_2.ok)(workspace, 'Workspace created successfully');
    }
    async findAll(req) {
        const workspaces = await this.workspaceService.findAllForUser(req.user.id);
        return (0, common_2.ok)(workspaces);
    }
    async findOne(req) {
        const workspace = await this.workspaceService.findOne(req.workspaceContext.workspaceId, req.user.id);
        return (0, common_2.ok)(workspace);
    }
    async listMembers(req) {
        const members = await this.workspaceService.listMembers(req.workspaceContext.workspaceId);
        return (0, common_2.ok)(members, 'Members returned successfully');
    }
    async getMember(workspaceId, memberId) {
        const member = await this.workspaceService.getMember(workspaceId, memberId);
        return (0, common_2.ok)(member, 'Member returned successfully');
    }
    async update(req, dto) {
        const workspace = await this.workspaceService.update(req.workspaceContext.workspaceId, req.user.id, req.workspaceContext.role, dto);
        return (0, common_2.ok)(workspace, 'Workspace updated successfully');
    }
    async remove(req) {
        await this.workspaceService.remove(req.workspaceContext.workspaceId, req.user.id, req.workspaceContext.role);
        return (0, common_2.ok)(null, 'Workspace deleted successfully');
    }
    async sendInvite(req, dto) {
        await this.workspaceService.sendInvite(req.workspaceContext.workspaceId, req.user.id, req.workspaceContext.role, dto);
        return (0, common_2.ok)(null, 'Invite sent successfully');
    }
    async sendBatchInvites(req, dto) {
        const result = await this.workspaceService.sendBatchInvites(req.workspaceContext.workspaceId, req.user.id, req.workspaceContext.role, dto);
        return (0, common_2.ok)(result, 'Batch invite processed');
    }
    async getInviteDetails(token) {
        const details = await this.workspaceService.getInviteDetails(token);
        return (0, common_2.ok)(details);
    }
    async claimInvite(dto, res) {
        const { refreshToken, ...result } = await this.workspaceService.claimInvite(dto);
        this.setRefreshCookie(res, refreshToken);
        return (0, common_2.ok)(result, 'Invite claimed successfully');
    }
    async acceptInvite(req, dto) {
        const result = await this.workspaceService.acceptInvite(dto.token, req.user.id, req.user.email);
        return (0, common_2.ok)(result, 'Invite accepted successfully');
    }
    setRefreshCookie(res, token) {
        res.cookie('refresh_token', token, (0, auth_cookies_1.buildRefreshCookieOptions)());
    }
};
exports.WorkspaceController = WorkspaceController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new workspace with onboarding metadata' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Workspace created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Authentication required' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_workspace_dto_1.CreateWorkspaceDto, Object]),
    __metadata("design:returntype", Promise)
], WorkspaceController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'List all workspaces the current user belongs to' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Workspaces returned' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WorkspaceController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':workspaceId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, workspace_guard_1.WorkspaceGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get a single workspace' }),
    (0, swagger_1.ApiHeader)({ name: 'x-workspace-id', required: true }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Workspace returned' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Not a member' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Workspace not found' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WorkspaceController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':workspaceId/members'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, workspace_guard_1.WorkspaceGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiHeader)({ name: 'x-workspace-id', required: true }),
    (0, swagger_1.ApiOperation)({ summary: 'List members in a workspace' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Members returned', type: [member_response_dto_1.MemberResponseDto] }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Not a member' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Workspace not found' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WorkspaceController.prototype, "listMembers", null);
__decorate([
    (0, common_1.Get)(':workspaceId/members/:memberId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get a single workspace member by id (protected by JWT)' }),
    (0, swagger_1.ApiParam)({ name: 'workspaceId', description: 'Workspace UUID' }),
    (0, swagger_1.ApiParam)({ name: 'memberId', description: 'Workspace member id or user id' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Member returned', type: member_detail_response_dto_1.MemberDetailResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Authentication required' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Member not found' }),
    __param(0, (0, common_1.Param)('workspaceId')),
    __param(1, (0, common_1.Param)('memberId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], WorkspaceController.prototype, "getMember", null);
__decorate([
    (0, common_1.Patch)(':workspaceId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, workspace_guard_1.WorkspaceGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('OWNER'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update workspace settings (OWNER only)' }),
    (0, swagger_1.ApiHeader)({ name: 'x-workspace-id', required: true }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Workspace updated' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Not a member or not an owner' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Workspace not found' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_workspace_dto_1.UpdateWorkspaceDto]),
    __metadata("design:returntype", Promise)
], WorkspaceController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':workspaceId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, workspace_guard_1.WorkspaceGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('OWNER'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Soft delete a workspace (OWNER only)' }),
    (0, swagger_1.ApiHeader)({ name: 'x-workspace-id', required: true }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Workspace deleted' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Not a member or not an owner' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Workspace not found' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WorkspaceController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':workspaceId/invite'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, workspace_guard_1.WorkspaceGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('OWNER'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Send a workspace invite email (OWNER only)' }),
    (0, swagger_1.ApiHeader)({ name: 'x-workspace-id', required: true }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Invite sent' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Not a member or not an owner' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Workspace not found' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, invite_member_dto_1.InviteMemberDto]),
    __metadata("design:returntype", Promise)
], WorkspaceController.prototype, "sendInvite", null);
__decorate([
    (0, common_1.Post)(':workspaceId/invites'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, workspace_guard_1.WorkspaceGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('OWNER'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Send workspace invite emails in bulk (OWNER only)' }),
    (0, swagger_1.ApiHeader)({ name: 'x-workspace-id', required: true }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        type: batch_invite_members_dto_1.BatchInviteResponseDto,
        description: 'Batch invite processed',
    }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Not a member or not an owner' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Workspace not found' }),
    (0, swagger_1.ApiResponse)({ status: 422, description: 'Validation failed' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, batch_invite_members_dto_1.BatchInviteMembersDto]),
    __metadata("design:returntype", Promise)
], WorkspaceController.prototype, "sendBatchInvites", null);
__decorate([
    (0, common_1.Get)('invite/:token'),
    (0, swagger_1.ApiOperation)({ summary: 'Peek at invite details without consuming it (public)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Invite details returned' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Invite not found, used, or expired' }),
    __param(0, (0, common_1.Param)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WorkspaceController.prototype, "getInviteDetails", null);
__decorate([
    (0, common_1.Post)('invite/claim'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Create an account from a workspace invite and join immediately',
        description: 'Public endpoint for invite recipients. Validates the invite token, creates or upgrades the invited account without OTP, signs the user in, and accepts the invite.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        type: claim_invite_dto_1.ClaimInviteResponseDto,
        description: 'Invite claimed successfully and auth tokens issued',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Invite not found, already used, or expired',
    }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: 'A verified account already exists for the invite email',
    }),
    (0, swagger_1.ApiResponse)({ status: 422, description: 'Validation failed' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [claim_invite_dto_1.ClaimInviteDto, Object]),
    __metadata("design:returntype", Promise)
], WorkspaceController.prototype, "claimInvite", null);
__decorate([
    (0, common_1.Post)('invite/accept'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Accept a workspace invite (authenticated)',
        description: 'User must be logged in. The logged-in email must match the invited email.',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Invite accepted, added to workspace' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invite was sent to a different email' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Not authenticated' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Invite not found, used, or expired' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, accept_invite_dto_1.AcceptInviteDto]),
    __metadata("design:returntype", Promise)
], WorkspaceController.prototype, "acceptInvite", null);
exports.WorkspaceController = WorkspaceController = __decorate([
    (0, swagger_1.ApiTags)('workspaces'),
    (0, common_1.Controller)('workspaces'),
    __metadata("design:paramtypes", [workspace_service_1.WorkspaceService])
], WorkspaceController);
//# sourceMappingURL=workspace.controller.js.map