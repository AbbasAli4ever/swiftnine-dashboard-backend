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
exports.OrganizationsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const workspace_service_1 = require("./workspace.service");
const remove_member_dto_1 = require("./dto/remove-member.dto");
const change_member_role_dto_1 = require("./dto/change-member-role.dto");
const common_2 = require("../../../../libs/common/src");
let OrganizationsController = class OrganizationsController {
    workspaceService;
    constructor(workspaceService) {
        this.workspaceService = workspaceService;
    }
    async removeMember(req, dto) {
        await this.workspaceService.removeMember(dto.workspaceId, dto.memberId, req.user.id);
        return (0, common_2.ok)(null, 'Member removed successfully');
    }
    async changeMemberRole(req, memberId, dto) {
        await this.workspaceService.changeMemberRole(dto.workspaceId, memberId, dto.role, req.user.id);
        return (0, common_2.ok)(null, 'Member role updated successfully');
    }
};
exports.OrganizationsController = OrganizationsController;
__decorate([
    (0, common_1.Delete)('members'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Remove a member from a workspace' }),
    (0, swagger_1.ApiBody)({
        type: remove_member_dto_1.RemoveMemberDto,
        description: 'Workspace id and workspace-member id to remove',
        examples: {
            default: {
                summary: 'Remove member payload',
                value: {
                    workspaceId: 'cc6c4f04-6cae-4d0a-a3cb-864d53f92f29',
                    memberId: '2f9c1b8a-3b4a-4f3d-9b2a-1234567890ab',
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Member removed successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Validation failed' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Authentication required' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Not a member or insufficient role' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Member or workspace not found' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, remove_member_dto_1.RemoveMemberDto]),
    __metadata("design:returntype", Promise)
], OrganizationsController.prototype, "removeMember", null);
__decorate([
    (0, common_1.Put)('members/:id/role'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Workspace member id (membership record id)',
        example: '2f9c1b8a-3b4a-4f3d-9b2a-1234567890ab',
    }),
    (0, swagger_1.ApiOperation)({ summary: "Change a member's role in the workspace" }),
    (0, swagger_1.ApiBody)({
        type: change_member_role_dto_1.ChangeMemberRoleDto,
        description: 'Workspace id and new role for the specified membership',
        examples: {
            makeOwner: {
                summary: 'Promote to OWNER',
                value: { workspaceId: 'cc6c4f04-6cae-4d0a-a3cb-864d53f92f29', role: 'OWNER' },
            },
            demote: {
                summary: 'Demote to MEMBER',
                value: { workspaceId: 'cc6c4f04-6cae-4d0a-a3cb-864d53f92f29', role: 'MEMBER' },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Member role updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Validation failed' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Authentication required' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Not a member or insufficient role' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Member or workspace not found' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, change_member_role_dto_1.ChangeMemberRoleDto]),
    __metadata("design:returntype", Promise)
], OrganizationsController.prototype, "changeMemberRole", null);
exports.OrganizationsController = OrganizationsController = __decorate([
    (0, swagger_1.ApiTags)('organizations'),
    (0, common_1.Controller)('organizations'),
    __metadata("design:paramtypes", [workspace_service_1.WorkspaceService])
], OrganizationsController);
//# sourceMappingURL=organizations.controller.js.map