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
exports.AiConversationsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const workspace_guard_1 = require("../workspace/workspace.guard");
const common_2 = require("../../../../libs/common/src");
const ai_conversations_service_1 = require("./ai-conversations.service");
const create_conversation_dto_1 = require("./dto/create-conversation.dto");
const update_conversation_dto_1 = require("./dto/update-conversation.dto");
const create_message_dto_1 = require("./dto/create-message.dto");
let AiConversationsController = class AiConversationsController {
    service;
    constructor(service) {
        this.service = service;
    }
    async findAll(req) {
        const items = await this.service.findAll(req.workspaceContext.workspaceId, req.user.id);
        return (0, common_2.ok)(items);
    }
    async create(req, dto) {
        const conversation = await this.service.create(req.workspaceContext.workspaceId, req.user.id, dto);
        return (0, common_2.ok)(conversation, 'Conversation created successfully');
    }
    async findOne(req, conversationId) {
        const conversation = await this.service.findOne(req.workspaceContext.workspaceId, req.user.id, conversationId);
        return (0, common_2.ok)(conversation);
    }
    async rename(req, conversationId, dto) {
        const conversation = await this.service.rename(req.workspaceContext.workspaceId, req.user.id, conversationId, dto);
        return (0, common_2.ok)(conversation, 'Conversation renamed successfully');
    }
    async remove(req, conversationId) {
        await this.service.remove(req.workspaceContext.workspaceId, req.user.id, conversationId);
        return (0, common_2.ok)(null, 'Conversation deleted successfully');
    }
    async addMessage(req, conversationId, dto) {
        const message = await this.service.addMessage(req.workspaceContext.workspaceId, req.user.id, conversationId, dto);
        return (0, common_2.ok)(message, 'Message added');
    }
    async removeMessage(req, conversationId, messageId) {
        await this.service.removeMessage(req.workspaceContext.workspaceId, req.user.id, conversationId, messageId);
        return (0, common_2.ok)(null, 'Message deleted');
    }
};
exports.AiConversationsController = AiConversationsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: "List the current user's AI conversations in this workspace, most recently updated first",
    }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AiConversationsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new AI conversation' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_conversation_dto_1.CreateConversationDto]),
    __metadata("design:returntype", Promise)
], AiConversationsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':conversationId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a conversation with its full message list' }),
    (0, swagger_1.ApiParam)({ name: 'conversationId', description: 'Conversation UUID' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('conversationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AiConversationsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':conversationId'),
    (0, swagger_1.ApiOperation)({ summary: 'Rename a conversation' }),
    (0, swagger_1.ApiParam)({ name: 'conversationId', description: 'Conversation UUID' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('conversationId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_conversation_dto_1.UpdateConversationDto]),
    __metadata("design:returntype", Promise)
], AiConversationsController.prototype, "rename", null);
__decorate([
    (0, common_1.Delete)(':conversationId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a conversation (soft delete)' }),
    (0, swagger_1.ApiParam)({ name: 'conversationId', description: 'Conversation UUID' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('conversationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AiConversationsController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':conversationId/messages'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Append a message (user turn or assistant turn) to a conversation' }),
    (0, swagger_1.ApiParam)({ name: 'conversationId', description: 'Conversation UUID' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('conversationId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, create_message_dto_1.CreateMessageDto]),
    __metadata("design:returntype", Promise)
], AiConversationsController.prototype, "addMessage", null);
__decorate([
    (0, common_1.Delete)(':conversationId/messages/:messageId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a single message (used when regenerating a response)' }),
    (0, swagger_1.ApiParam)({ name: 'conversationId', description: 'Conversation UUID' }),
    (0, swagger_1.ApiParam)({ name: 'messageId', description: 'Message UUID' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('conversationId')),
    __param(2, (0, common_1.Param)('messageId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], AiConversationsController.prototype, "removeMessage", null);
exports.AiConversationsController = AiConversationsController = __decorate([
    (0, swagger_1.ApiTags)('ai-conversations'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('ai-conversations'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, workspace_guard_1.WorkspaceGuard),
    (0, swagger_1.ApiHeader)({ name: 'x-workspace-id', required: true, description: 'Active workspace ID' }),
    __metadata("design:paramtypes", [ai_conversations_service_1.AiConversationsService])
], AiConversationsController);
//# sourceMappingURL=ai-conversations.controller.js.map