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
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const database_1 = require("../../../../libs/database/src");
const doc_content_1 = require("../docs/doc-content");
const chat_fanout_service_1 = require("./chat-fanout.service");
const attachments_service_1 = require("../attachments/attachments.service");
const chat_gateway_1 = require("./chat.gateway");
const MESSAGE_EDIT_WINDOW_MS = 5 * 60 * 1000;
const CHAT_CURSOR_SEPARATOR = ':';
let ChatService = class ChatService {
    prisma;
    fanout;
    attachments;
    gateway;
    constructor(prisma, fanout, attachments, gateway) {
        this.prisma = prisma;
        this.fanout = fanout;
        this.attachments = attachments;
        this.gateway = gateway;
    }
    async listMessages(workspaceId, userId, channelId, query) {
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
            items: await Promise.all(slice.map((message) => this.toMessageResponse(message))),
            nextCursor: hasMore ? this.encodeCursor(slice[slice.length - 1]) : null,
        };
    }
    async listPinnedMessages(workspaceId, userId, channelId) {
        await this.assertChannelMember(workspaceId, channelId, userId);
        const messages = await this.prisma.channelMessage.findMany({
            where: { channelId, isPinned: true, deletedAt: null },
            include: this.messageInclude(),
            orderBy: [{ pinnedAt: 'desc' }, { createdAt: 'desc' }, { id: 'desc' }],
        });
        return Promise.all(messages.map((message) => this.toMessageResponse(message)));
    }
    async sendMessage(workspaceId, userId, channelId, dto) {
        const membership = await this.assertChannelMember(workspaceId, channelId, userId);
        const normalized = this.normalizeContent(dto.contentJson);
        const mentionedUserIds = await this.validateMentionedUsers(channelId, dto.mentionedUserIds ?? []);
        const attachmentIds = await this.validateAttachmentIds(channelId, userId, dto.attachmentIds ?? []);
        if (!normalized.plaintext && attachmentIds.length === 0) {
            throw new common_1.BadRequestException('Message content or attachments are required');
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
        const fullMessage = await this.findMessageOrThrow(workspaceId, userId, message.id);
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
        this.gateway.emitMessageCreated(response);
        return response;
    }
    async editMessage(workspaceId, userId, messageId, dto) {
        const message = await this.findMessageOrThrow(workspaceId, userId, messageId);
        if (message.kind !== 'USER') {
            throw new common_1.ForbiddenException('System messages cannot be edited');
        }
        if (message.senderId !== userId) {
            throw new common_1.ForbiddenException('Only the author can edit this message');
        }
        if (message.deletedAt) {
            throw new common_1.BadRequestException('Deleted messages cannot be edited');
        }
        if (Date.now() - message.createdAt.getTime() > MESSAGE_EDIT_WINDOW_MS) {
            throw new common_1.ForbiddenException('Messages can only be edited within 5 minutes');
        }
        const normalized = this.normalizeContent(dto.contentJson);
        const mentionedUserIds = await this.validateMentionedUsers(message.channelId, dto.mentionedUserIds ?? []);
        if (!normalized.plaintext && message.attachments.length === 0) {
            throw new common_1.BadRequestException('Message content cannot be empty');
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
        const response = await this.toMessageResponse(await this.findMessageOrThrow(workspaceId, userId, messageId));
        this.gateway.emitMessageEdited(response);
        return response;
    }
    async deleteMessage(workspaceId, userId, messageId) {
        const message = await this.findMessageOrThrow(workspaceId, userId, messageId);
        const membership = await this.assertChannelMember(workspaceId, message.channelId, userId);
        const isAdmin = membership.role === 'OWNER' || membership.role === 'ADMIN';
        if (message.kind !== 'USER') {
            throw new common_1.ForbiddenException('System messages cannot be deleted');
        }
        if (message.senderId !== userId && !isAdmin) {
            throw new common_1.ForbiddenException('Only the author or a channel admin can delete this message');
        }
        await this.prisma.channelMessage.update({
            where: { id: messageId },
            data: {
                deletedAt: new Date(),
                contentJson: { deleted: true },
                plaintext: '',
            },
        });
        const response = await this.toMessageResponse(await this.findMessageOrThrow(workspaceId, userId, messageId));
        this.gateway.emitMessageDeleted(response.channelId, response.id, response.deletedAt);
        return response;
    }
    async toggleReaction(workspaceId, userId, messageId, emoji) {
        const message = await this.findMessageOrThrow(workspaceId, userId, messageId);
        if (message.deletedAt) {
            throw new common_1.BadRequestException('Cannot react to a deleted message');
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
            };
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
        };
        this.gateway.emitReaction(message.channelId, response);
        return response;
    }
    async pinMessage(workspaceId, userId, messageId) {
        const message = await this.findMessageOrThrow(workspaceId, userId, messageId);
        const membership = await this.assertChannelMember(workspaceId, message.channelId, userId);
        if (membership.role !== 'OWNER' && membership.role !== 'ADMIN') {
            throw new common_1.ForbiddenException('Only channel admins can pin messages');
        }
        await this.prisma.channelMessage.update({
            where: { id: messageId },
            data: {
                isPinned: true,
                pinnedAt: new Date(),
                pinnedById: userId,
            },
        });
        const response = await this.toMessageResponse(await this.findMessageOrThrow(workspaceId, userId, messageId));
        this.gateway.emitMessagePinned(response);
        return response;
    }
    async unpinMessage(workspaceId, userId, messageId) {
        const message = await this.findMessageOrThrow(workspaceId, userId, messageId);
        const membership = await this.assertChannelMember(workspaceId, message.channelId, userId);
        if (membership.role !== 'OWNER' && membership.role !== 'ADMIN') {
            throw new common_1.ForbiddenException('Only channel admins can unpin messages');
        }
        await this.prisma.channelMessage.update({
            where: { id: messageId },
            data: {
                isPinned: false,
                pinnedAt: null,
                pinnedById: null,
            },
        });
        const response = await this.toMessageResponse(await this.findMessageOrThrow(workspaceId, userId, messageId));
        this.gateway.emitMessageUnpinned(response.channelId, response.id);
        return response;
    }
    async markRead(workspaceId, userId, channelId, dto) {
        const membership = await this.assertChannelMember(workspaceId, channelId, userId);
        const anchor = await this.prisma.channelMessage.findFirst({
            where: { id: dto.lastReadMessageId, channelId },
            select: { id: true, createdAt: true },
        });
        if (!anchor) {
            throw new common_1.NotFoundException('Message not found in this channel');
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
    async setMute(workspaceId, userId, channelId, isMuted) {
        const membership = await this.assertChannelMember(workspaceId, channelId, userId);
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
    async createDm(workspaceId, userId, dto) {
        if (dto.targetUserId === userId) {
            throw new common_1.BadRequestException('You cannot create a DM with yourself');
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
            throw new common_1.NotFoundException('Both users must belong to the workspace');
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
            return tx.channel.findUniqueOrThrow({
                where: { id: created.id },
                include: this.channelIncludeForList(userId),
            });
        });
        return this.toChannelResponse(channel, userId);
    }
    async listDms(workspaceId, userId) {
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
    async searchMessages(workspaceId, userId, query) {
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
            items: await Promise.all(slice.map((message) => this.toMessageResponse(message))),
            nextCursor: hasMore ? this.encodeCursor(slice[slice.length - 1]) : null,
        };
    }
    async getMessageForRealtime(messageId) {
        const message = await this.prisma.channelMessage.findFirst({
            where: { id: messageId },
            include: this.messageInclude(),
        });
        if (!message) {
            throw new common_1.NotFoundException('Message not found');
        }
        return this.toMessageResponse(message);
    }
    normalizeContent(contentJson) {
        (0, doc_content_1.assertContentSize)(contentJson);
        return {
            contentJson: contentJson,
            plaintext: (0, doc_content_1.extractPlaintext)(contentJson),
        };
    }
    async assertReplyTarget(channelId, replyToMessageId) {
        const replyTarget = await this.prisma.channelMessage.findFirst({
            where: { id: replyToMessageId, channelId },
            select: { id: true },
        });
        if (!replyTarget) {
            throw new common_1.BadRequestException('Reply target must belong to the same channel');
        }
    }
    async validateMentionedUsers(channelId, mentionedUserIds) {
        if (mentionedUserIds.length === 0)
            return [];
        const members = await this.prisma.channelMember.findMany({
            where: { channelId, userId: { in: mentionedUserIds } },
            select: { userId: true },
        });
        const memberIds = new Set(members.map((member) => member.userId));
        const invalid = mentionedUserIds.filter((id) => !memberIds.has(id));
        if (invalid.length > 0) {
            throw new common_1.BadRequestException(`Mentioned users are not members of this channel: ${invalid.join(',')}`);
        }
        return mentionedUserIds;
    }
    async validateAttachmentIds(channelId, userId, attachmentIds) {
        if (attachmentIds.length === 0)
            return [];
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
            throw new common_1.BadRequestException('One or more attachments are invalid for this message');
        }
        const expectedPrefix = this.channelAttachmentPrefix(channelId);
        const invalid = attachments.filter((attachment) => !attachment.s3Key.startsWith(expectedPrefix));
        if (invalid.length > 0) {
            throw new common_1.BadRequestException('One or more attachments do not belong to this channel');
        }
        return attachmentIds;
    }
    async assertChannelMember(workspaceId, channelId, userId) {
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
            throw new common_1.ForbiddenException('Channel membership required');
        }
        return membership;
    }
    async findMessageOrThrow(workspaceId, userId, messageId) {
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
            throw new common_1.NotFoundException('Message not found');
        }
        return message;
    }
    messageInclude() {
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
        };
    }
    channelIncludeForList(userId) {
        return {
            members: {
                include: {
                    user: { select: { id: true, fullName: true, avatarUrl: true } },
                },
            },
        };
    }
    async toMessageResponse(message) {
        return {
            id: message.id,
            channelId: message.channelId,
            senderId: message.senderId,
            kind: message.kind,
            contentJson: message.contentJson,
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
            attachments: await Promise.all(message.attachments.map((attachment) => this.attachments.toViewAttachment(attachment))),
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
    toChannelResponse(channel, userId) {
        const selfMembership = channel.members.find((member) => member.userId === userId);
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
    encodeCursor(record) {
        return Buffer.from(`${record.createdAt.toISOString()}${CHAT_CURSOR_SEPARATOR}${record.id}`, 'utf8').toString('base64url');
    }
    decodeCursor(cursor) {
        if (!cursor)
            return null;
        try {
            const decoded = Buffer.from(cursor, 'base64url').toString('utf8');
            const [createdAt, id] = decoded.split(CHAT_CURSOR_SEPARATOR);
            if (!createdAt || !id)
                throw new Error('Invalid cursor');
            const date = new Date(createdAt);
            if (Number.isNaN(date.getTime()))
                throw new Error('Invalid cursor date');
            return { createdAt: date, id };
        }
        catch {
            throw new common_1.BadRequestException('Invalid cursor');
        }
    }
    channelAttachmentPrefix(channelId) {
        const rawBasePrefix = process.env.AWS_S3_PREFIX ?? 'swiftnine/docs/app';
        const basePrefix = rawBasePrefix.replace(/^\/+|\/+$/g, '');
        return `${basePrefix}/attachments/channel-${channelId}/`;
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_1.PrismaService,
        chat_fanout_service_1.ChatFanoutService,
        attachments_service_1.AttachmentsService,
        chat_gateway_1.ChatGateway])
], ChatService);
//# sourceMappingURL=chat.service.js.map