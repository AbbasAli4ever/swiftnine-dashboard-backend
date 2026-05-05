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
exports.ChatController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const common_2 = require("../../../../libs/common/src");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const workspace_guard_1 = require("../workspace/workspace.guard");
const add_reaction_dto_1 = require("./dto/add-reaction.dto");
const create_dm_dto_1 = require("./dto/create-dm.dto");
const edit_message_dto_1 = require("./dto/edit-message.dto");
const list_messages_dto_1 = require("./dto/list-messages.dto");
const message_response_dto_1 = require("./dto/message-response.dto");
const mark_read_dto_1 = require("./dto/mark-read.dto");
const search_messages_dto_1 = require("./dto/search-messages.dto");
const send_message_dto_1 = require("./dto/send-message.dto");
const chat_service_1 = require("./chat.service");
let ChatController = class ChatController {
    chatService;
    constructor(chatService) {
        this.chatService = chatService;
    }
    async listMessages(req, channelId, query) {
        const result = await this.chatService.listMessages(req.workspaceContext.workspaceId, req.user.id, channelId, query);
        return (0, common_2.ok)(result);
    }
    async listPinnedMessages(req, channelId) {
        const result = await this.chatService.listPinnedMessages(req.workspaceContext.workspaceId, req.user.id, channelId);
        return (0, common_2.ok)(result);
    }
    async sendMessage(req, channelId, dto) {
        const result = await this.chatService.sendMessage(req.workspaceContext.workspaceId, req.user.id, channelId, dto);
        return (0, common_2.ok)(result, 'Message sent');
    }
    async editMessage(req, messageId, dto) {
        const result = await this.chatService.editMessage(req.workspaceContext.workspaceId, req.user.id, messageId, dto);
        return (0, common_2.ok)(result, 'Message updated');
    }
    async deleteMessage(req, messageId) {
        const result = await this.chatService.deleteMessage(req.workspaceContext.workspaceId, req.user.id, messageId);
        return (0, common_2.ok)(result, 'Message deleted');
    }
    async toggleReaction(req, messageId, dto) {
        const result = await this.chatService.toggleReaction(req.workspaceContext.workspaceId, req.user.id, messageId, dto.emoji);
        return (0, common_2.ok)(result, `Reaction ${result.action}`);
    }
    async pinMessage(req, messageId) {
        const result = await this.chatService.pinMessage(req.workspaceContext.workspaceId, req.user.id, messageId);
        return (0, common_2.ok)(result, 'Message pinned');
    }
    async unpinMessage(req, messageId) {
        const result = await this.chatService.unpinMessage(req.workspaceContext.workspaceId, req.user.id, messageId);
        return (0, common_2.ok)(result, 'Message unpinned');
    }
    async markRead(req, channelId, dto) {
        const result = await this.chatService.markRead(req.workspaceContext.workspaceId, req.user.id, channelId, dto);
        return (0, common_2.ok)(result, 'Read state updated');
    }
    async mute(req, channelId) {
        const result = await this.chatService.setMute(req.workspaceContext.workspaceId, req.user.id, channelId, true);
        return (0, common_2.ok)(result, 'Channel muted');
    }
    async unmute(req, channelId) {
        const result = await this.chatService.setMute(req.workspaceContext.workspaceId, req.user.id, channelId, false);
        return (0, common_2.ok)(result, 'Channel unmuted');
    }
    async createDm(req, dto) {
        const result = await this.chatService.createDm(req.workspaceContext.workspaceId, req.user.id, dto);
        return (0, common_2.ok)(result, 'DM ready');
    }
    async listDms(req) {
        const result = await this.chatService.listDms(req.workspaceContext.workspaceId, req.user.id);
        return (0, common_2.ok)(result);
    }
    async search(req, query) {
        const result = await this.chatService.searchMessages(req.workspaceContext.workspaceId, req.user.id, query);
        return (0, common_2.ok)(result);
    }
};
exports.ChatController = ChatController;
__decorate([
    (0, common_1.Get)('channels/:channelId/messages'),
    (0, swagger_1.ApiOperation)({ summary: 'List channel messages, newest first' }),
    (0, swagger_1.ApiParam)({ name: 'channelId', description: 'Channel id' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: message_response_dto_1.ChatMessageListResponseDto }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('channelId')),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, list_messages_dto_1.ListMessagesDto]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "listMessages", null);
__decorate([
    (0, common_1.Get)('channels/:channelId/messages/pinned'),
    (0, swagger_1.ApiOperation)({ summary: 'List pinned channel messages' }),
    (0, swagger_1.ApiParam)({ name: 'channelId', description: 'Channel id' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: message_response_dto_1.ChatMessageResponseDto, isArray: true }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('channelId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "listPinnedMessages", null);
__decorate([
    (0, common_1.Post)('channels/:channelId/messages'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Send a channel message' }),
    (0, swagger_1.ApiParam)({ name: 'channelId', description: 'Channel id' }),
    (0, swagger_1.ApiBody)({ type: send_message_dto_1.SendMessageDto }),
    (0, swagger_1.ApiResponse)({ status: 201, type: message_response_dto_1.ChatMessageResponseDto }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('channelId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, send_message_dto_1.SendMessageDto]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "sendMessage", null);
__decorate([
    (0, common_1.Patch)('messages/:messageId'),
    (0, swagger_1.ApiOperation)({ summary: 'Edit a channel message' }),
    (0, swagger_1.ApiParam)({ name: 'messageId', description: 'Message id' }),
    (0, swagger_1.ApiBody)({ type: edit_message_dto_1.EditMessageDto }),
    (0, swagger_1.ApiResponse)({ status: 200, type: message_response_dto_1.ChatMessageResponseDto }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('messageId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, edit_message_dto_1.EditMessageDto]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "editMessage", null);
__decorate([
    (0, common_1.Delete)('messages/:messageId'),
    (0, swagger_1.ApiOperation)({ summary: 'Soft delete a channel message' }),
    (0, swagger_1.ApiParam)({ name: 'messageId', description: 'Message id' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: message_response_dto_1.ChatMessageResponseDto }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('messageId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "deleteMessage", null);
__decorate([
    (0, common_1.Post)('messages/:messageId/reactions'),
    (0, swagger_1.ApiOperation)({ summary: 'Toggle a message reaction' }),
    (0, swagger_1.ApiParam)({ name: 'messageId', description: 'Message id' }),
    (0, swagger_1.ApiBody)({ type: add_reaction_dto_1.AddReactionDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Reaction toggled' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('messageId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, add_reaction_dto_1.AddReactionDto]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "toggleReaction", null);
__decorate([
    (0, common_1.Post)('messages/:messageId/pin'),
    (0, swagger_1.ApiOperation)({ summary: 'Pin a message' }),
    (0, swagger_1.ApiParam)({ name: 'messageId', description: 'Message id' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: message_response_dto_1.ChatMessageResponseDto }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('messageId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "pinMessage", null);
__decorate([
    (0, common_1.Delete)('messages/:messageId/pin'),
    (0, swagger_1.ApiOperation)({ summary: 'Unpin a message' }),
    (0, swagger_1.ApiParam)({ name: 'messageId', description: 'Message id' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: message_response_dto_1.ChatMessageResponseDto }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('messageId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "unpinMessage", null);
__decorate([
    (0, common_1.Post)('channels/:channelId/read'),
    (0, swagger_1.ApiOperation)({ summary: 'Mark a channel as read up to a specific message' }),
    (0, swagger_1.ApiParam)({ name: 'channelId', description: 'Channel id' }),
    (0, swagger_1.ApiBody)({ type: mark_read_dto_1.MarkReadDto }),
    (0, swagger_1.ApiResponse)({ status: 200, type: message_response_dto_1.ChatReadStateResponseDto }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('channelId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, mark_read_dto_1.MarkReadDto]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "markRead", null);
__decorate([
    (0, common_1.Post)('channels/:channelId/mute'),
    (0, swagger_1.ApiOperation)({ summary: 'Mute a channel for the current user' }),
    (0, swagger_1.ApiParam)({ name: 'channelId', description: 'Channel id' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: message_response_dto_1.ChatMuteStateResponseDto }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('channelId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "mute", null);
__decorate([
    (0, common_1.Post)('channels/:channelId/unmute'),
    (0, swagger_1.ApiOperation)({ summary: 'Unmute a channel for the current user' }),
    (0, swagger_1.ApiParam)({ name: 'channelId', description: 'Channel id' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: message_response_dto_1.ChatMuteStateResponseDto }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('channelId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "unmute", null);
__decorate([
    (0, common_1.Post)('dm'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create or return an existing DM channel' }),
    (0, swagger_1.ApiBody)({ type: create_dm_dto_1.CreateDmDto }),
    (0, swagger_1.ApiResponse)({ status: 201, type: message_response_dto_1.ChatChannelResponseDto }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_dm_dto_1.CreateDmDto]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "createDm", null);
__decorate([
    (0, common_1.Get)('dms'),
    (0, swagger_1.ApiOperation)({ summary: 'List the caller’s DM channels in the workspace' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: message_response_dto_1.ChatChannelResponseDto, isArray: true }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "listDms", null);
__decorate([
    (0, common_1.Get)('search'),
    (0, swagger_1.ApiOperation)({ summary: 'Search chat messages in the workspace' }),
    (0, swagger_1.ApiQuery)({ name: 'q', required: true }),
    (0, swagger_1.ApiQuery)({ name: 'channelId', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'cursor', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false }),
    (0, swagger_1.ApiResponse)({ status: 200, type: message_response_dto_1.ChatMessageListResponseDto }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, search_messages_dto_1.SearchMessagesDto]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "search", null);
exports.ChatController = ChatController = __decorate([
    (0, swagger_1.ApiTags)('chat'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('chat'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, workspace_guard_1.WorkspaceGuard),
    (0, swagger_1.ApiHeader)({
        name: 'x-workspace-id',
        required: true,
        description: 'Active workspace ID',
    }),
    __metadata("design:paramtypes", [chat_service_1.ChatService])
], ChatController);
//# sourceMappingURL=chat.controller.js.map