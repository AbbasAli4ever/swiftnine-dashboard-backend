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
exports.ChannelsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const workspace_guard_1 = require("../workspace/workspace.guard");
const create_channel_dto_1 = require("./dto/create-channel.dto");
const channels_service_1 = require("./channels.service");
const channel_member_dto_1 = require("./dto/channel-member.dto");
const common_2 = require("../../../../libs/common/src");
let ChannelsController = class ChannelsController {
    channelsService;
    constructor(channelsService) {
        this.channelsService = channelsService;
    }
    async create(req, dto) {
        const channel = await this.channelsService.create(req.workspaceContext.workspaceId, req.user.id, dto);
        return (0, common_2.ok)(channel, 'Channel created');
    }
    async addMember(req, channelId, dto) {
        const member = await this.channelsService.addChannelMember(req.workspaceContext.workspaceId, channelId, req.user.id, dto.userId, dto.role);
        return (0, common_2.ok)(member, 'Member added to channel');
    }
    async addMembersBulk(req, channelId, dto) {
        const members = await this.channelsService.addChannelMembersBulk(req.workspaceContext.workspaceId, channelId, req.user.id, dto.members.map((m) => ({ userId: m.userId, role: m.role })));
        return (0, common_2.ok)(members, 'Members processed');
    }
    async removeMember(req, channelId, memberId) {
        await this.channelsService.removeChannelMember(req.workspaceContext.workspaceId, channelId, req.user.id, memberId);
        return (0, common_2.ok)(null, 'Member removed from channel');
    }
};
exports.ChannelsController = ChannelsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new channel in the workspace (optional project-scoped)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Channel created' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_channel_dto_1.CreateChannelDto]),
    __metadata("design:returntype", Promise)
], ChannelsController.prototype, "create", null);
__decorate([
    (0, common_1.Post)(':id/members'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Add a member to a channel (channel admin only)' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Channel id', example: 'cc6c4f04-6cae-4d0a-a3cb-864d53f92f29' }),
    (0, swagger_1.ApiBody)({ type: channel_member_dto_1.AddChannelMemberDto }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Member added to channel' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, channel_member_dto_1.AddChannelMemberDto]),
    __metadata("design:returntype", Promise)
], ChannelsController.prototype, "addMember", null);
__decorate([
    (0, common_1.Post)(':id/members/bulk'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Bulk add members to a channel (channel admin only)' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Channel id', example: 'cc6c4f04-6cae-4d0a-a3cb-864d53f92f29' }),
    (0, swagger_1.ApiBody)({ type: channel_member_dto_1.BulkAddChannelMembersDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Members added/updated' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, channel_member_dto_1.BulkAddChannelMembersDto]),
    __metadata("design:returntype", Promise)
], ChannelsController.prototype, "addMembersBulk", null);
__decorate([
    (0, common_1.Delete)(':id/members/:memberId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Remove a member from a channel (channel admin only)' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Channel id', example: 'cc6c4f04-6cae-4d0a-a3cb-864d53f92f29' }),
    (0, swagger_1.ApiParam)({ name: 'memberId', description: 'Channel member id (channel_members.id)', example: '2f9c1b8a-3b4a-4f3d-9b2a-1234567890ab' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Member removed from channel' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Param)('memberId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], ChannelsController.prototype, "removeMember", null);
exports.ChannelsController = ChannelsController = __decorate([
    (0, swagger_1.ApiTags)('channels'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('channels'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, workspace_guard_1.WorkspaceGuard),
    (0, swagger_1.ApiHeader)({ name: 'x-workspace-id', required: true, description: 'Active workspace ID' }),
    __metadata("design:paramtypes", [channels_service_1.ChannelsService])
], ChannelsController);
//# sourceMappingURL=channels.controller.js.map