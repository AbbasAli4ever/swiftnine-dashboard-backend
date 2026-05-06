import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@app/database';
import type { Prisma } from '@app/database/generated/prisma/client';
import { assertContentSize, extractPlaintext } from '../docs/doc-content';
import { ChatFanoutService } from './chat-fanout.service';
import { AttachmentsService } from '../attachments/attachments.service';
import { ChatGateway } from './chat.gateway';
import { ChatRateLimitService } from './chat-rate-limit.service';
import { RealtimeMetricsService } from '../realtime/realtime-metrics.service';
import type { CreateDmDto } from './dto/create-dm.dto';
import type { EditMessageDto } from './dto/edit-message.dto';
import type { ListMessagesQuery } from './dto/list-messages.dto';
import type { MarkReadDto } from './dto/mark-read.dto';
import type { MessageContextQuery } from './dto/message-context.dto';
import type { SearchMessagesQuery } from './dto/search-messages.dto';
import type { SendMessageDto } from './dto/send-message.dto';

const MESSAGE_EDIT_WINDOW_MS = 5 * 60 * 1000;
const CHAT_CURSOR_SEPARATOR = ':';

type CursorRecord = {
  createdAt: string;
  id: string;
};

@Injectable()
export class ChatService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fanout: ChatFanoutService,
    private readonly attachments: AttachmentsService,
    private readonly gateway: ChatGateway,
    private readonly rateLimits: ChatRateLimitService,
    private readonly metrics: RealtimeMetricsService,
  ) {}

  async listMessages(
    workspaceId: string,
    userId: string,
    channelId: string,
    query: ListMessagesQuery,
  ) {
    await this.assertChannelMember(workspaceId, channelId, userId);
    const cursor = this.decodeCursor(query.cursor);

    const messages = await this.prisma.channelMessage.findMany({
      where: {
        channelId,
        ...(cursor
          ? {
              OR: [
                { createdAt: { lt: cursor.createdAt } },
                { createdAt: cursor.createdAt, id: { lt: cursor.id } },
              ],
            }
          : {}),
      },
      include: this.messageInclude(),
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      take: query.limit + 1,
    });

    const hasMore = messages.length > query.limit;
    const slice = hasMore ? messages.slice(0, query.limit) : messages;

    return {
      items: await Promise.all(
        slice.map((message) => this.toMessageResponse(message)),
      ),
      nextCursor: hasMore ? this.encodeCursor(slice[slice.length - 1]) : null,
    };
  }

  async listPinnedMessages(
    workspaceId: string,
    userId: string,
    channelId: string,
  ) {
    await this.assertChannelMember(workspaceId, channelId, userId);

    const messages = await this.prisma.channelMessage.findMany({
      where: { channelId, isPinned: true, deletedAt: null },
      include: this.messageInclude(),
      orderBy: [{ pinnedAt: 'desc' }, { createdAt: 'desc' }, { id: 'desc' }],
    });

    return Promise.all(
      messages.map((message) => this.toMessageResponse(message)),
    );
  }

  async getMessageContext(
    workspaceId: string,
    userId: string,
    channelId: string,
    query: MessageContextQuery,
  ) {
    await this.assertChannelMember(workspaceId, channelId, userId);

    const anchor = await this.prisma.channelMessage.findFirst({
      where: {
        id: query.messageId,
        channelId,
      },
      include: this.messageInclude(),
    });

    if (!anchor) {
      throw new NotFoundException('Message not found in this channel');
    }

    const [beforeMessages, afterMessages] = await Promise.all([
      this.prisma.channelMessage.findMany({
        where: {
          channelId,
          OR: [
            { createdAt: { lt: anchor.createdAt } },
            { createdAt: anchor.createdAt, id: { lt: anchor.id } },
          ],
        },
        include: this.messageInclude(),
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
        take: query.before + 1,
      }),
      this.prisma.channelMessage.findMany({
        where: {
          channelId,
          OR: [
            { createdAt: { gt: anchor.createdAt } },
            { createdAt: anchor.createdAt, id: { gt: anchor.id } },
          ],
        },
        include: this.messageInclude(),
        orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
        take: query.after + 1,
      }),
    ]);

    const hasBefore = beforeMessages.length > query.before;
    const hasAfter = afterMessages.length > query.after;
    const sliceBefore = hasBefore
      ? beforeMessages.slice(0, query.before)
      : beforeMessages;
    const sliceAfter = hasAfter ? afterMessages.slice(0, query.after) : afterMessages;

    const items = await Promise.all([
      ...sliceBefore.reverse().map((message) => this.toMessageResponse(message)),
      this.toMessageResponse(anchor),
      ...sliceAfter.map((message) => this.toMessageResponse(message)),
    ]);

    return {
      items,
      anchorMessageId: anchor.id,
      hasBefore,
      hasAfter,
    };
  }

  async sendMessage(
    workspaceId: string,
    userId: string,
    channelId: string,
    dto: SendMessageDto,
  ) {
    const membership = await this.assertChannelMember(
      workspaceId,
      channelId,
      userId,
    );
    this.rateLimits.assertMessageSend(userId, channelId);
    const normalized = this.normalizeContent(dto.contentJson);
    const mentionedUserIds = await this.validateMentionedUsers(
      channelId,
      dto.mentionedUserIds ?? [],
    );
    const attachmentIds = await this.validateAttachmentIds(
      channelId,
      userId,
      dto.attachmentIds ?? [],
    );

    if (!normalized.plaintext && attachmentIds.length === 0) {
      throw new BadRequestException(
        'Message content or attachments are required',
      );
    }

    if (dto.replyToMessageId) {
      await this.assertReplyTarget(channelId, dto.replyToMessageId);
    }

    const message = await this.prisma.$transaction(async (tx) => {
      const created = await tx.channelMessage.create({
        data: {
          channelId,
          senderId: userId,
          kind: 'USER',
          contentJson: normalized.contentJson,
          plaintext: normalized.plaintext,
          replyToMessageId: dto.replyToMessageId ?? null,
        },
      });

      if (mentionedUserIds.length > 0) {
        await tx.channelMessageMention.createMany({
          data: mentionedUserIds.map((mentionedUserId) => ({
            messageId: created.id,
            mentionedUserId,
          })),
        });
      }

      if (attachmentIds.length > 0) {
        await tx.attachment.updateMany({
          where: {
            id: { in: attachmentIds },
            uploadedBy: userId,
            channelMessageId: null,
            deletedAt: null,
          },
          data: {
            channelMessageId: created.id,
          },
        });
      }

      await this.fanout.incrementUnreadCounts(channelId, userId, tx);

      return created;
    });

    const fullMessage = await this.findMessageOrThrow(
      workspaceId,
      userId,
      message.id,
    );
    const sender = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, fullName: true },
    });

    await this.fanout.notifyMessageCreated({
      workspaceId,
      channelId,
      channelKind: membership.channel.kind,
      channelName: membership.channel.name,
      senderUserId: userId,
      senderName: sender?.fullName ?? 'A member',
      messageId: message.id,
      plaintext: normalized.plaintext,
      mentionedUserIds,
      recipients: membership.channel.members.map((member) => ({
        userId: member.userId,
        isMuted: member.isMuted,
      })),
    });

    const response = await this.toMessageResponse(fullMessage);
    this.metrics.recordMessageSent(channelId, userId);
    this.gateway.emitMessageCreated(response);
    return response;
  }

  async editMessage(
    workspaceId: string,
    userId: string,
    messageId: string,
    dto: EditMessageDto,
  ) {
    const message = await this.findMessageOrThrow(
      workspaceId,
      userId,
      messageId,
    );

    if (message.kind !== 'USER') {
      throw new ForbiddenException('System messages cannot be edited');
    }
    if (message.senderId !== userId) {
      throw new ForbiddenException('Only the author can edit this message');
    }
    if (message.deletedAt) {
      throw new BadRequestException('Deleted messages cannot be edited');
    }
    if (Date.now() - message.createdAt.getTime() > MESSAGE_EDIT_WINDOW_MS) {
      throw new ForbiddenException(
        'Messages can only be edited within 5 minutes',
      );
    }

    const normalized = this.normalizeContent(dto.contentJson);
    const mentionedUserIds = await this.validateMentionedUsers(
      message.channelId,
      dto.mentionedUserIds ?? [],
    );

    if (!normalized.plaintext && message.attachments.length === 0) {
      throw new BadRequestException('Message content cannot be empty');
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.channelMessage.update({
        where: { id: messageId },
        data: {
          contentJson: normalized.contentJson,
          plaintext: normalized.plaintext,
          isEdited: true,
          editedAt: new Date(),
        },
      });

      await tx.channelMessageMention.deleteMany({ where: { messageId } });

      if (mentionedUserIds.length > 0) {
        await tx.channelMessageMention.createMany({
          data: mentionedUserIds.map((mentionedUserId) => ({
            messageId,
            mentionedUserId,
          })),
        });
      }
    });

    const response = await this.toMessageResponse(
      await this.findMessageOrThrow(workspaceId, userId, messageId),
    );
    this.gateway.emitMessageEdited(response);
    return response;
  }

  async deleteMessage(workspaceId: string, userId: string, messageId: string) {
    const message = await this.findMessageOrThrow(
      workspaceId,
      userId,
      messageId,
    );
    const membership = await this.assertChannelMember(
      workspaceId,
      message.channelId,
      userId,
    );
    const isAdmin = membership.role === 'OWNER' || membership.role === 'ADMIN';

    if (message.kind !== 'USER') {
      throw new ForbiddenException('System messages cannot be deleted');
    }
    if (message.senderId !== userId && !isAdmin) {
      throw new ForbiddenException(
        'Only the author or a channel admin can delete this message',
      );
    }

    await this.prisma.channelMessage.update({
      where: { id: messageId },
      data: {
        deletedAt: new Date(),
        contentJson: { deleted: true } as Prisma.InputJsonValue,
        plaintext: '',
      },
    });

    const response = await this.toMessageResponse(
      await this.findMessageOrThrow(workspaceId, userId, messageId),
    );
    this.gateway.emitMessageDeleted(
      response.channelId,
      response.id,
      response.deletedAt,
    );
    return response;
  }

  async toggleReaction(
    workspaceId: string,
    userId: string,
    messageId: string,
    emoji: string,
  ) {
    const message = await this.findMessageOrThrow(
      workspaceId,
      userId,
      messageId,
    );
    this.rateLimits.assertReactionToggle(userId, message.channelId);
    if (message.deletedAt) {
      throw new BadRequestException('Cannot react to a deleted message');
    }

    const existing = await this.prisma.channelMessageReaction.findFirst({
      where: { messageId, userId, emoji },
      select: { id: true },
    });

    if (existing) {
      await this.prisma.channelMessageReaction.delete({
        where: { id: existing.id },
      });
      const response = {
        action: 'removed',
        messageId,
        userId,
        emoji,
      } as const;
      this.gateway.emitReaction(message.channelId, response);
      return response;
    }

    await this.prisma.channelMessageReaction.create({
      data: { messageId, userId, emoji },
    });

    const response = {
      action: 'added',
      messageId,
      userId,
      emoji,
    } as const;
    this.gateway.emitReaction(message.channelId, response);
    return response;
  }

  async pinMessage(workspaceId: string, userId: string, messageId: string) {
    const message = await this.findMessageOrThrow(
      workspaceId,
      userId,
      messageId,
    );
    const membership = await this.assertChannelMember(
      workspaceId,
      message.channelId,
      userId,
    );
    if (membership.role !== 'OWNER' && membership.role !== 'ADMIN') {
      throw new ForbiddenException('Only channel admins can pin messages');
    }

    await this.prisma.channelMessage.update({
      where: { id: messageId },
      data: {
        isPinned: true,
        pinnedAt: new Date(),
        pinnedById: userId,
      },
    });

    const response = await this.toMessageResponse(
      await this.findMessageOrThrow(workspaceId, userId, messageId),
    );
    this.gateway.emitMessagePinned(response);
    return response;
  }

  async unpinMessage(workspaceId: string, userId: string, messageId: string) {
    const message = await this.findMessageOrThrow(
      workspaceId,
      userId,
      messageId,
    );
    const membership = await this.assertChannelMember(
      workspaceId,
      message.channelId,
      userId,
    );
    if (membership.role !== 'OWNER' && membership.role !== 'ADMIN') {
      throw new ForbiddenException('Only channel admins can unpin messages');
    }

    await this.prisma.channelMessage.update({
      where: { id: messageId },
      data: {
        isPinned: false,
        pinnedAt: null,
        pinnedById: null,
      },
    });

    const response = await this.toMessageResponse(
      await this.findMessageOrThrow(workspaceId, userId, messageId),
    );
    this.gateway.emitMessageUnpinned(response.channelId, response.id);
    return response;
  }

  async markRead(
    workspaceId: string,
    userId: string,
    channelId: string,
    dto: MarkReadDto,
  ) {
    const membership = await this.assertChannelMember(
      workspaceId,
      channelId,
      userId,
    );
    const anchor = await this.prisma.channelMessage.findFirst({
      where: { id: dto.lastReadMessageId, channelId },
      select: { id: true, createdAt: true },
    });

    if (!anchor) {
      throw new NotFoundException('Message not found in this channel');
    }

    const unreadCount = await this.prisma.channelMessage.count({
      where: {
        channelId,
        deletedAt: null,
        OR: [
          { createdAt: { gt: anchor.createdAt } },
          { createdAt: anchor.createdAt, id: { gt: anchor.id } },
        ],
      },
    });

    const readAt = new Date();

    await this.prisma.channelMember.update({
      where: { id: membership.id },
      data: {
        lastReadMessageId: anchor.id,
        unreadCount,
      },
    });

    const response = {
      channelId,
      userId,
      lastReadMessageId: anchor.id,
      unreadCount,
      readAt,
    };
    this.gateway.emitMemberRead(response);
    return response;
  }

  async setMute(
    workspaceId: string,
    userId: string,
    channelId: string,
    isMuted: boolean,
  ) {
    const membership = await this.assertChannelMember(
      workspaceId,
      channelId,
      userId,
    );

    await this.prisma.channelMember.update({
      where: { id: membership.id },
      data: { isMuted },
    });

    return {
      channelId,
      userId,
      isMuted,
    };
  }

  async createDm(workspaceId: string, userId: string, dto: CreateDmDto) {
    if (dto.targetUserId === userId) {
      throw new BadRequestException('You cannot create a DM with yourself');
    }

    const [callerMember, targetMember] = await Promise.all([
      this.prisma.workspaceMember.findFirst({
        where: { workspaceId, userId, deletedAt: null },
        select: { id: true },
      }),
      this.prisma.workspaceMember.findFirst({
        where: { workspaceId, userId: dto.targetUserId, deletedAt: null },
        select: { id: true },
      }),
    ]);

    if (!callerMember || !targetMember) {
      throw new NotFoundException('Both users must belong to the workspace');
    }

    const existing = await this.prisma.channel.findFirst({
      where: {
        workspaceId,
        kind: 'DM',
        members: {
          some: { userId },
          every: { userId: { in: [userId, dto.targetUserId] } },
        },
        AND: [{ members: { some: { userId: dto.targetUserId } } }],
      },
      include: this.channelIncludeForList(userId),
    });

    if (existing) {
      return this.toChannelResponse(existing, userId);
    }

    const channel = await this.prisma.$transaction(async (tx) => {
      const created = await tx.channel.create({
        data: {
          workspaceId,
          kind: 'DM',
          name: null,
          description: null,
          privacy: 'PRIVATE',
          projectId: null,
          createdBy: userId,
        },
      });

      await tx.channelMember.createMany({
        data: [
          { channelId: created.id, userId, role: 'MEMBER' },
          { channelId: created.id, userId: dto.targetUserId, role: 'MEMBER' },
        ],
      });

      await tx.channelMessage.create({
        data: {
          channelId: created.id,
          senderId: null,
          kind: 'SYSTEM',
          contentJson: {
            event: 'dm_started',
            actorUserId: userId,
            targetUserId: dto.targetUserId,
          } as Prisma.InputJsonValue,
          plaintext: '',
        },
      });

      return tx.channel.findUniqueOrThrow({
        where: { id: created.id },
        include: this.channelIncludeForList(userId),
      });
    });

    return this.toChannelResponse(channel, userId);
  }

  async listDms(workspaceId: string, userId: string) {
    const channels = await this.prisma.channel.findMany({
      where: {
        workspaceId,
        kind: 'DM',
        members: { some: { userId } },
      },
      include: this.channelIncludeForList(userId),
      orderBy: { createdAt: 'desc' },
    });

    return channels.map((channel) => this.toChannelResponse(channel, userId));
  }

  async searchMessages(
    workspaceId: string,
    userId: string,
    query: SearchMessagesQuery,
  ) {
    const cursor = this.decodeCursor(query.cursor);

    if (query.channelId) {
      await this.assertChannelMember(workspaceId, query.channelId, userId);
    }

    const messages = await this.prisma.channelMessage.findMany({
      where: {
        deletedAt: null,
        plaintext: { contains: query.q, mode: 'insensitive' },
        channel: {
          workspaceId,
          members: { some: { userId } },
          ...(query.channelId ? { id: query.channelId } : {}),
        },
        ...(cursor
          ? {
              OR: [
                { createdAt: { lt: cursor.createdAt } },
                { createdAt: cursor.createdAt, id: { lt: cursor.id } },
              ],
            }
          : {}),
      },
      include: this.messageInclude(),
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      take: query.limit + 1,
    });

    const hasMore = messages.length > query.limit;
    const slice = hasMore ? messages.slice(0, query.limit) : messages;

    return {
      items: await Promise.all(
        slice.map((message) => this.toMessageResponse(message)),
      ),
      nextCursor: hasMore ? this.encodeCursor(slice[slice.length - 1]) : null,
    };
  }

  async getMessageForRealtime(messageId: string) {
    const message = await this.prisma.channelMessage.findFirst({
      where: { id: messageId },
      include: this.messageInclude(),
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    return this.toMessageResponse(message);
  }

  private normalizeContent(contentJson: Record<string, unknown>) {
    assertContentSize(contentJson);

    return {
      contentJson: contentJson as Prisma.InputJsonValue,
      plaintext: extractPlaintext(contentJson),
    };
  }

  private async assertReplyTarget(channelId: string, replyToMessageId: string) {
    const replyTarget = await this.prisma.channelMessage.findFirst({
      where: { id: replyToMessageId, channelId },
      select: { id: true },
    });

    if (!replyTarget) {
      throw new BadRequestException(
        'Reply target must belong to the same channel',
      );
    }
  }

  private async validateMentionedUsers(
    channelId: string,
    mentionedUserIds: string[],
  ) {
    if (mentionedUserIds.length === 0) return [];

    const members = await this.prisma.channelMember.findMany({
      where: { channelId, userId: { in: mentionedUserIds } },
      select: { userId: true },
    });
    const memberIds = new Set(members.map((member) => member.userId));
    const invalid = mentionedUserIds.filter((id) => !memberIds.has(id));

    if (invalid.length > 0) {
      throw new BadRequestException(
        `Mentioned users are not members of this channel: ${invalid.join(',')}`,
      );
    }

    return mentionedUserIds;
  }

  private async validateAttachmentIds(
    channelId: string,
    userId: string,
    attachmentIds: string[],
  ) {
    if (attachmentIds.length === 0) return [];

    const attachments = await this.prisma.attachment.findMany({
      where: {
        id: { in: attachmentIds },
        uploadedBy: userId,
        channelMessageId: null,
        deletedAt: null,
      },
      select: { id: true, s3Key: true },
    });

    if (attachments.length !== attachmentIds.length) {
      throw new BadRequestException(
        'One or more attachments are invalid for this message',
      );
    }

    const expectedPrefix = this.channelAttachmentPrefix(channelId);
    const invalid = attachments.filter(
      (attachment) => !attachment.s3Key.startsWith(expectedPrefix),
    );
    if (invalid.length > 0) {
      throw new BadRequestException(
        'One or more attachments do not belong to this channel',
      );
    }

    return attachmentIds;
  }

  private async assertChannelMember(
    workspaceId: string,
    channelId: string,
    userId: string,
  ) {
    const membership = await this.prisma.channelMember.findFirst({
      where: {
        channelId,
        userId,
        channel: { workspaceId },
      },
      select: {
        id: true,
        role: true,
        isMuted: true,
        unreadCount: true,
        lastReadMessageId: true,
        channel: {
          select: {
            id: true,
            workspaceId: true,
            kind: true,
            name: true,
            privacy: true,
            members: {
              select: {
                userId: true,
                isMuted: true,
              },
            },
          },
        },
      },
    });

    if (!membership) {
      throw new ForbiddenException('Channel membership required');
    }

    return membership;
  }

  private async findMessageOrThrow(
    workspaceId: string,
    userId: string,
    messageId: string,
  ) {
    const message = await this.prisma.channelMessage.findFirst({
      where: {
        id: messageId,
        channel: {
          workspaceId,
          members: { some: { userId } },
        },
      },
      include: this.messageInclude(),
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    return message;
  }

  private messageInclude() {
    return {
      channel: {
        select: {
          id: true,
          workspaceId: true,
          kind: true,
          privacy: true,
          name: true,
        },
      },
      sender: { select: { id: true, fullName: true, avatarUrl: true } },
      pinnedBy: { select: { id: true, fullName: true, avatarUrl: true } },
      replyTo: {
        select: {
          id: true,
          senderId: true,
          kind: true,
          plaintext: true,
          deletedAt: true,
          sender: { select: { id: true, fullName: true, avatarUrl: true } },
        },
      },
      mentions: {
        include: {
          mentionedUser: {
            select: { id: true, fullName: true, avatarUrl: true },
          },
        },
      },
      reactions: {
        include: {
          user: { select: { id: true, fullName: true, avatarUrl: true } },
        },
        orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
      },
      attachments: {
        where: { deletedAt: null },
        select: {
          id: true,
          s3Key: true,
          fileName: true,
          mimeType: true,
          fileSize: true,
          createdAt: true,
        },
        orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
      },
    } satisfies Prisma.ChannelMessageInclude;
  }

  private channelIncludeForList(userId: string) {
    return {
      members: {
        include: {
          user: { select: { id: true, fullName: true, avatarUrl: true } },
        },
      },
    } satisfies Prisma.ChannelInclude;
  }

  private async toMessageResponse(
    message: Prisma.ChannelMessageGetPayload<{
      include: ReturnType<ChatService['messageInclude']>;
    }>,
  ) {
    return {
      id: message.id,
      channelId: message.channelId,
      senderId: message.senderId,
      kind: message.kind,
      contentJson: message.contentJson as Record<string, unknown>,
      plaintext: message.plaintext,
      replyToMessageId: message.replyToMessageId,
      isEdited: message.isEdited,
      editedAt: message.editedAt,
      isPinned: message.isPinned,
      pinnedAt: message.pinnedAt,
      pinnedById: message.pinnedById,
      createdAt: message.createdAt,
      updatedAt: message.updatedAt,
      deletedAt: message.deletedAt,
      sender: message.sender,
      pinnedBy: message.pinnedBy,
      mentions: message.mentions.map((mention) => mention.mentionedUser),
      reactions: message.reactions.map((reaction) => ({
        id: reaction.id,
        messageId: reaction.messageId,
        userId: reaction.userId,
        emoji: reaction.emoji,
        createdAt: reaction.createdAt,
        user: reaction.user,
      })),
      attachments: await Promise.all(
        message.attachments.map((attachment) =>
          this.attachments.toViewAttachment(attachment),
        ),
      ),
      replyTo: message.replyTo
        ? {
            id: message.replyTo.id,
            senderId: message.replyTo.senderId,
            kind: message.replyTo.kind,
            plaintext: message.replyTo.plaintext,
            deletedAt: message.replyTo.deletedAt,
            sender: message.replyTo.sender,
          }
        : null,
      channel: message.channel,
    };
  }

  private toChannelResponse(
    channel: Prisma.ChannelGetPayload<{
      include: ReturnType<ChatService['channelIncludeForList']>;
    }>,
    userId: string,
  ) {
    const selfMembership = channel.members.find(
      (member) => member.userId === userId,
    );

    return {
      id: channel.id,
      workspaceId: channel.workspaceId,
      kind: channel.kind,
      privacy: channel.privacy,
      name: channel.name,
      description: channel.description,
      projectId: channel.projectId,
      createdBy: channel.createdBy,
      createdAt: channel.createdAt,
      updatedAt: channel.updatedAt,
      isMuted: selfMembership?.isMuted ?? false,
      unreadCount: selfMembership?.unreadCount ?? 0,
      lastReadMessageId: selfMembership?.lastReadMessageId ?? null,
      members: channel.members.map((member) => ({
        id: member.id,
        userId: member.userId,
        role: member.role,
        isMuted: member.isMuted,
        unreadCount: member.unreadCount,
        lastReadMessageId: member.lastReadMessageId,
        joinedAt: member.joinedAt,
        user: member.user,
      })),
    };
  }

  private encodeCursor(record: { createdAt: Date; id: string }) {
    return Buffer.from(
      `${record.createdAt.toISOString()}${CHAT_CURSOR_SEPARATOR}${record.id}`,
      'utf8',
    ).toString('base64url');
  }

  private decodeCursor(cursor?: string) {
    if (!cursor) return null;

    try {
      const decoded = Buffer.from(cursor, 'base64url').toString('utf8');
      const [createdAt, id] = decoded.split(CHAT_CURSOR_SEPARATOR);
      if (!createdAt || !id) throw new Error('Invalid cursor');
      const date = new Date(createdAt);
      if (Number.isNaN(date.getTime())) throw new Error('Invalid cursor date');
      return { createdAt: date, id };
    } catch {
      throw new BadRequestException('Invalid cursor');
    }
  }

  private channelAttachmentPrefix(channelId: string) {
    const rawBasePrefix = process.env.AWS_S3_PREFIX ?? 'swiftnine/docs/app';
    const basePrefix = rawBasePrefix.replace(/^\/+|\/+$/g, '');
    return `${basePrefix}/attachments/channel-${channelId}/`;
  }
}
