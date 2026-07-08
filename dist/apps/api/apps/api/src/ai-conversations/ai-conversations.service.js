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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiConversationsService = void 0;
const common_1 = require("@nestjs/common");
const database_1 = require("../../../../libs/database/src");
const ai_conversations_constants_1 = require("./ai-conversations.constants");
let AiConversationsService = class AiConversationsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(workspaceId, userId) {
        return this.prisma.aiConversation.findMany({
            where: { workspaceId, userId, deletedAt: null },
            select: ai_conversations_constants_1.AI_CONVERSATION_LIST_SELECT,
            orderBy: { updatedAt: 'desc' },
        });
    }
    async create(workspaceId, userId, dto) {
        return this.prisma.aiConversation.create({
            data: { workspaceId, userId, title: dto.title?.trim() ?? null },
            select: ai_conversations_constants_1.AI_CONVERSATION_LIST_SELECT,
        });
    }
    async findOwnedOrThrow(workspaceId, userId, conversationId) {
        const conversation = await this.prisma.aiConversation.findFirst({
            where: { id: conversationId, workspaceId, userId, deletedAt: null },
            select: { id: true, title: true },
        });
        if (!conversation)
            throw new common_1.NotFoundException(ai_conversations_constants_1.AI_CONVERSATION_NOT_FOUND);
        return conversation;
    }
    async findOne(workspaceId, userId, conversationId) {
        await this.findOwnedOrThrow(workspaceId, userId, conversationId);
        return this.prisma.aiConversation.findFirstOrThrow({
            where: { id: conversationId, workspaceId, userId, deletedAt: null },
            select: {
                ...ai_conversations_constants_1.AI_CONVERSATION_LIST_SELECT,
                messages: { select: ai_conversations_constants_1.AI_CONVERSATION_MESSAGE_SELECT, orderBy: { createdAt: 'asc' } },
            },
        });
    }
    async rename(workspaceId, userId, conversationId, dto) {
        await this.findOwnedOrThrow(workspaceId, userId, conversationId);
        return this.prisma.aiConversation.update({
            where: { id: conversationId },
            data: { title: dto.title.trim() },
            select: ai_conversations_constants_1.AI_CONVERSATION_LIST_SELECT,
        });
    }
    async remove(workspaceId, userId, conversationId) {
        await this.findOwnedOrThrow(workspaceId, userId, conversationId);
        await this.prisma.aiConversation.update({
            where: { id: conversationId },
            data: { deletedAt: new Date() },
        });
    }
    async addMessage(workspaceId, userId, conversationId, dto) {
        const conversation = await this.findOwnedOrThrow(workspaceId, userId, conversationId);
        return this.prisma.$transaction(async (tx) => {
            const message = await tx.aiConversationMessage.create({
                data: {
                    conversationId,
                    role: dto.role,
                    content: dto.content,
                    status: dto.status,
                },
                select: ai_conversations_constants_1.AI_CONVERSATION_MESSAGE_SELECT,
            });
            const shouldSetTitle = !conversation.title && dto.role === 'USER' && !!dto.title;
            await tx.aiConversation.update({
                where: { id: conversationId },
                data: {
                    updatedAt: new Date(),
                    ...(shouldSetTitle ? { title: dto.title.trim() } : {}),
                },
            });
            return message;
        });
    }
    async removeMessage(workspaceId, userId, conversationId, messageId) {
        await this.findOwnedOrThrow(workspaceId, userId, conversationId);
        const message = await this.prisma.aiConversationMessage.findFirst({
            where: { id: messageId, conversationId },
            select: { id: true },
        });
        if (!message)
            throw new common_1.NotFoundException(ai_conversations_constants_1.AI_CONVERSATION_MESSAGE_NOT_FOUND);
        await this.prisma.aiConversationMessage.delete({ where: { id: messageId } });
    }
};
exports.AiConversationsService = AiConversationsService;
exports.AiConversationsService = AiConversationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_1.PrismaService])
], AiConversationsService);
//# sourceMappingURL=ai-conversations.service.js.map