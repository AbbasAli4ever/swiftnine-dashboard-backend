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
exports.AiAttachmentsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const node_crypto_1 = require("node:crypto");
const database_1 = require("../../../../libs/database/src");
const client_1 = require("../../../../libs/database/src/generated/prisma/client");
const common_2 = require("../../../../libs/common/src");
const ai_conversations_service_1 = require("../ai-conversations/ai-conversations.service");
const ai_attachments_constants_1 = require("./ai-attachments.constants");
const attachment_scanner_1 = require("./scanning/attachment-scanner");
let AiAttachmentsService = class AiAttachmentsService {
    prisma;
    s3;
    config;
    conversations;
    scanner;
    constructor(prisma, s3, config, conversations, scanner) {
        this.prisma = prisma;
        this.s3 = s3;
        this.config = config;
        this.conversations = conversations;
        this.scanner = scanner;
    }
    async presign(userId, workspaceId, dto) {
        await this.conversations.assertOwned(workspaceId, userId, dto.conversationId);
        const contentType = ai_attachments_constants_1.WIRE_TO_CONTENT_TYPE[dto.attachmentType];
        this.s3.validateMimeType(dto.mimeType, ai_attachments_constants_1.ALLOWED_MIME_TYPES_BY_CONTENT_TYPE[contentType]);
        this.s3.validateFileSize(dto.fileSize, ai_attachments_constants_1.MAX_FILE_SIZE_BY_CONTENT_TYPE[contentType]);
        const s3Key = this.buildAttachmentKey(dto.conversationId, dto.fileName);
        const uploadUrl = await this.s3.createPresignedPutUrl(s3Key, ai_attachments_constants_1.AI_ATTACHMENT_PRESIGN_EXPIRES_IN_SECONDS);
        const attachment = await this.prisma.attachment.create({
            data: {
                aiConversationId: dto.conversationId,
                uploadedBy: userId,
                fileName: dto.fileName,
                s3Key,
                mimeType: dto.mimeType,
                fileSize: BigInt(dto.fileSize),
                kind: client_1.AttachmentKind.FILE,
                contentType,
                uploadStatus: client_1.AttachmentUploadStatus.PENDING,
            },
            select: { id: true },
        });
        return {
            attachmentId: attachment.id,
            uploadUrl,
            s3Key,
            expiresIn: ai_attachments_constants_1.AI_ATTACHMENT_PRESIGN_EXPIRES_IN_SECONDS,
        };
    }
    async confirm(userId, workspaceId, attachmentId, dto) {
        const attachment = await this.findOwnedAttachmentOrThrow(workspaceId, userId, attachmentId);
        if (attachment.uploadStatus === client_1.AttachmentUploadStatus.CONFIRMED) {
            return this.toResponse(attachment);
        }
        if (!attachment.aiConversationId || !attachment.s3Key) {
            throw new common_1.BadRequestException('Attachment is missing its S3 key');
        }
        this.assertKeyBelongsToConversation(attachment.aiConversationId, attachment.s3Key);
        const metadata = await this.s3.resolveUploadedFileMetadata(attachment.s3Key, attachment.fileName, attachment.mimeType ?? undefined, undefined);
        if (attachment.contentType) {
            this.s3.validateMimeType(metadata.mimeType, ai_attachments_constants_1.ALLOWED_MIME_TYPES_BY_CONTENT_TYPE[attachment.contentType]);
            this.s3.validateFileSize(Number(metadata.fileSize), ai_attachments_constants_1.MAX_FILE_SIZE_BY_CONTENT_TYPE[attachment.contentType]);
        }
        await this.scanner.scan({ bucket: this.s3.bucket, key: attachment.s3Key });
        const linkedMessageId = dto.messageId
            ? await this.assertMessageOwnedOrThrow(attachment.aiConversationId, dto.messageId)
            : undefined;
        const updated = await this.prisma.attachment.update({
            where: { id: attachmentId },
            data: {
                uploadStatus: client_1.AttachmentUploadStatus.CONFIRMED,
                fileName: metadata.fileName,
                mimeType: metadata.mimeType,
                fileSize: metadata.fileSize,
                aiConversationMessageId: linkedMessageId,
                metadata: dto.metadata,
            },
            select: ai_attachments_constants_1.AI_ATTACHMENT_SELECT,
        });
        return this.toResponse(updated);
    }
    async createGeneratedAttachment(userId, workspaceId, dto) {
        await this.conversations.assertOwned(workspaceId, userId, dto.conversationId);
        const contentType = ai_attachments_constants_1.WIRE_TO_CONTENT_TYPE[dto.attachmentType];
        this.s3.validateMimeType(dto.mimeType, ai_attachments_constants_1.ALLOWED_MIME_TYPES_BY_CONTENT_TYPE[contentType]);
        this.s3.validateFileSize(dto.buffer.length, ai_attachments_constants_1.MAX_FILE_SIZE_BY_CONTENT_TYPE[contentType]);
        const linkedMessageId = dto.messageId
            ? await this.assertMessageOwnedOrThrow(dto.conversationId, dto.messageId)
            : undefined;
        const s3Key = this.buildAttachmentKey(dto.conversationId, dto.fileName);
        await this.s3.putObject(s3Key, dto.buffer, dto.mimeType);
        const attachment = await this.prisma.attachment.create({
            data: {
                aiConversationId: dto.conversationId,
                aiConversationMessageId: linkedMessageId,
                uploadedBy: userId,
                fileName: dto.fileName,
                s3Key,
                mimeType: dto.mimeType,
                fileSize: BigInt(dto.buffer.length),
                kind: client_1.AttachmentKind.FILE,
                contentType,
                uploadStatus: client_1.AttachmentUploadStatus.CONFIRMED,
            },
            select: ai_attachments_constants_1.AI_ATTACHMENT_SELECT,
        });
        return this.toResponse(attachment);
    }
    async list(userId, workspaceId, query) {
        if (query.conversationId) {
            await this.conversations.assertOwned(workspaceId, userId, query.conversationId);
        }
        const cursor = this.decodeCursor(query.cursor);
        const limit = query.limit;
        const attachments = await this.prisma.attachment.findMany({
            where: {
                deletedAt: null,
                uploadStatus: client_1.AttachmentUploadStatus.CONFIRMED,
                aiConversationId: query.conversationId ?? { not: null },
                aiConversation: { workspaceId, userId, deletedAt: null },
                ...(cursor
                    ? {
                        OR: [
                            { createdAt: { lt: cursor.createdAt } },
                            { createdAt: cursor.createdAt, id: { lt: cursor.id } },
                        ],
                    }
                    : {}),
            },
            select: ai_attachments_constants_1.AI_ATTACHMENT_SELECT,
            orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
            take: limit + 1,
        });
        const hasNext = attachments.length > limit;
        const items = hasNext ? attachments.slice(0, limit) : attachments;
        return {
            items: await Promise.all(items.map((item) => this.toResponse(item))),
            nextCursor: hasNext ? this.encodeCursor(items[items.length - 1]) : null,
            limit,
        };
    }
    async listForConversation(userId, workspaceId, conversationId) {
        await this.conversations.assertOwned(workspaceId, userId, conversationId);
        const attachments = await this.prisma.attachment.findMany({
            where: { aiConversationId: conversationId, deletedAt: null, uploadStatus: client_1.AttachmentUploadStatus.CONFIRMED },
            select: ai_attachments_constants_1.AI_ATTACHMENT_SELECT,
            orderBy: { createdAt: 'asc' },
        });
        return Promise.all(attachments.map((item) => this.toResponse(item)));
    }
    async getOne(userId, workspaceId, attachmentId) {
        const attachment = await this.findOwnedAttachmentOrThrow(workspaceId, userId, attachmentId);
        return this.toResponse(attachment);
    }
    async remove(userId, workspaceId, attachmentId) {
        const attachment = await this.findOwnedAttachmentOrThrow(workspaceId, userId, attachmentId);
        await this.prisma.attachment.update({
            where: { id: attachment.id },
            data: { deletedAt: new Date() },
        });
        return { id: attachment.id };
    }
    async findOwnedAttachmentOrThrow(workspaceId, userId, attachmentId) {
        const attachment = await this.prisma.attachment.findFirst({
            where: {
                id: attachmentId,
                deletedAt: null,
                aiConversation: { workspaceId, userId, deletedAt: null },
            },
            select: ai_attachments_constants_1.AI_ATTACHMENT_SELECT,
        });
        if (!attachment)
            throw new common_1.NotFoundException(ai_attachments_constants_1.AI_ATTACHMENT_NOT_FOUND);
        return attachment;
    }
    async assertMessageOwnedOrThrow(conversationId, messageId) {
        const message = await this.prisma.aiConversationMessage.findFirst({
            where: { id: messageId, conversationId },
            select: { id: true },
        });
        if (!message)
            throw new common_1.NotFoundException('Message not found');
        return message.id;
    }
    aiAttachmentsPrefix() {
        const override = this.config.get('AWS_S3_AI_ATTACHMENTS_PREFIX');
        if (override && override.trim()) {
            return override.replace(/^\/+|\/+$/g, '');
        }
        return this.s3.buildKey(this.s3.basePrefix(), ai_attachments_constants_1.AI_ATTACHMENT_KEY_PREFIX);
    }
    conversationKeyPrefix(conversationId) {
        return this.s3.buildKey(this.aiAttachmentsPrefix(), `conversation-${conversationId}`);
    }
    buildAttachmentKey(conversationId, fileName) {
        const id = (0, node_crypto_1.randomUUID)();
        const sanitized = fileName.replace(/\s+/g, '_');
        return this.s3.buildKey(this.conversationKeyPrefix(conversationId), `${id}-${sanitized}`);
    }
    assertKeyBelongsToConversation(conversationId, s3Key) {
        this.s3.assertKeyWithinPrefix(s3Key, this.conversationKeyPrefix(conversationId));
    }
    async toResponse(attachment) {
        const url = attachment.s3Key && attachment.uploadStatus === client_1.AttachmentUploadStatus.CONFIRMED
            ? await this.s3.createPresignedGetUrl(attachment.s3Key)
            : null;
        return {
            id: attachment.id,
            conversationId: attachment.aiConversationId,
            messageId: attachment.aiConversationMessageId,
            fileName: attachment.fileName,
            mimeType: attachment.mimeType ?? 'application/octet-stream',
            fileSize: attachment.fileSize === null ? 0 : Number(attachment.fileSize),
            attachmentType: attachment.contentType
                ? ai_attachments_constants_1.CONTENT_TYPE_TO_WIRE[attachment.contentType]
                : 'document',
            url,
            createdAt: attachment.createdAt,
        };
    }
    decodeCursor(cursor) {
        if (!cursor)
            return null;
        const separatorIndex = cursor.lastIndexOf(':');
        if (separatorIndex <= 0 || separatorIndex === cursor.length - 1) {
            throw new common_1.BadRequestException('Invalid cursor');
        }
        const createdAt = new Date(cursor.slice(0, separatorIndex));
        const id = cursor.slice(separatorIndex + 1);
        if (Number.isNaN(createdAt.getTime()) || !id) {
            throw new common_1.BadRequestException('Invalid cursor');
        }
        return { createdAt, id };
    }
    encodeCursor(attachment) {
        if (!attachment)
            return null;
        return `${attachment.createdAt.toISOString()}:${attachment.id}`;
    }
};
exports.AiAttachmentsService = AiAttachmentsService;
exports.AiAttachmentsService = AiAttachmentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(4, (0, common_1.Inject)(attachment_scanner_1.ATTACHMENT_SCANNER)),
    __metadata("design:paramtypes", [database_1.PrismaService,
        common_2.S3Service,
        config_1.ConfigService,
        ai_conversations_service_1.AiConversationsService, Object])
], AiAttachmentsService);
//# sourceMappingURL=ai-attachments.service.js.map