import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@app/database';
import {
  AI_CONVERSATION_LIST_SELECT,
  AI_CONVERSATION_MESSAGE_SELECT,
  AI_CONVERSATION_MESSAGE_NOT_FOUND,
  AI_CONVERSATION_NOT_FOUND,
} from './ai-conversations.constants';
import type { CreateConversationDto } from './dto/create-conversation.dto';
import type { UpdateConversationDto } from './dto/update-conversation.dto';
import type { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class AiConversationsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(workspaceId: string, userId: string) {
    return this.prisma.aiConversation.findMany({
      where: { workspaceId, userId, deletedAt: null },
      select: AI_CONVERSATION_LIST_SELECT,
      orderBy: { updatedAt: 'desc' },
    });
  }

  async create(workspaceId: string, userId: string, dto: CreateConversationDto) {
    return this.prisma.aiConversation.create({
      data: { workspaceId, userId, title: dto.title?.trim() ?? null },
      select: AI_CONVERSATION_LIST_SELECT,
    });
  }

  private async findOwnedOrThrow(workspaceId: string, userId: string, conversationId: string) {
    const conversation = await this.prisma.aiConversation.findFirst({
      where: { id: conversationId, workspaceId, userId, deletedAt: null },
      select: { id: true, title: true },
    });
    if (!conversation) throw new NotFoundException(AI_CONVERSATION_NOT_FOUND);
    return conversation;
  }

  async findOne(workspaceId: string, userId: string, conversationId: string) {
    await this.findOwnedOrThrow(workspaceId, userId, conversationId);
    return this.prisma.aiConversation.findFirstOrThrow({
      where: { id: conversationId, workspaceId, userId, deletedAt: null },
      select: {
        ...AI_CONVERSATION_LIST_SELECT,
        messages: { select: AI_CONVERSATION_MESSAGE_SELECT, orderBy: { createdAt: 'asc' } },
      },
    });
  }

  async rename(
    workspaceId: string,
    userId: string,
    conversationId: string,
    dto: UpdateConversationDto,
  ) {
    await this.findOwnedOrThrow(workspaceId, userId, conversationId);
    return this.prisma.aiConversation.update({
      where: { id: conversationId },
      data: { title: dto.title.trim() },
      select: AI_CONVERSATION_LIST_SELECT,
    });
  }

  async remove(workspaceId: string, userId: string, conversationId: string) {
    await this.findOwnedOrThrow(workspaceId, userId, conversationId);
    await this.prisma.aiConversation.update({
      where: { id: conversationId },
      data: { deletedAt: new Date() },
    });
  }

  async addMessage(
    workspaceId: string,
    userId: string,
    conversationId: string,
    dto: CreateMessageDto,
  ) {
    const conversation = await this.findOwnedOrThrow(workspaceId, userId, conversationId);
    return this.prisma.$transaction(async (tx) => {
      const message = await tx.aiConversationMessage.create({
        data: {
          conversationId,
          role: dto.role,
          content: dto.content,
          status: dto.status,
        },
        select: AI_CONVERSATION_MESSAGE_SELECT,
      });
      const shouldSetTitle = !conversation.title && dto.role === 'USER' && !!dto.title;
      await tx.aiConversation.update({
        where: { id: conversationId },
        // Explicit updatedAt: new Date() ensures the conversation is always
        // bumped to the top of the "most recently updated" list on any new
        // message, regardless of whether Prisma auto-bumps @updatedAt on an
        // otherwise-empty data patch.
        data: {
          updatedAt: new Date(),
          ...(shouldSetTitle ? { title: dto.title!.trim() } : {}),
        },
      });
      return message;
    });
  }

  async removeMessage(
    workspaceId: string,
    userId: string,
    conversationId: string,
    messageId: string,
  ) {
    await this.findOwnedOrThrow(workspaceId, userId, conversationId);
    const message = await this.prisma.aiConversationMessage.findFirst({
      where: { id: messageId, conversationId },
      select: { id: true },
    });
    if (!message) throw new NotFoundException(AI_CONVERSATION_MESSAGE_NOT_FOUND);
    await this.prisma.aiConversationMessage.delete({ where: { id: messageId } });
  }
}
