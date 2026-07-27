import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '@app/database';
import {
  AttachmentContentType,
  AttachmentKind,
  AttachmentUploadStatus,
  type Prisma,
} from '@app/database/generated/prisma/client';
import { S3Service } from '@app/common';
import { AiConversationsService } from '../ai-conversations/ai-conversations.service';
import { AttachmentContentExtractionService } from './content-extraction/attachment-content-extraction.service';
import type { ExtractedContent } from './content-extraction/content-extractor';
import {
  AI_ATTACHMENT_KEY_PREFIX,
  AI_ATTACHMENT_NOT_FOUND,
  AI_ATTACHMENT_PRESIGN_EXPIRES_IN_SECONDS,
  AI_ATTACHMENT_SELECT,
  ALLOWED_MIME_TYPES_BY_CONTENT_TYPE,
  CONTENT_TYPE_TO_WIRE,
  MAX_FILE_SIZE_BY_CONTENT_TYPE,
  WIRE_TO_CONTENT_TYPE,
} from './ai-attachments.constants';
import type { ConfirmAiAttachmentInput } from './dto/confirm-ai-attachment.dto';
import type { ListAiAttachmentsQuery } from './dto/list-ai-attachments.query.dto';
import type { PresignAiAttachmentInput } from './dto/presign-ai-attachment.dto';
import type { AiAttachmentListResponseDto, AiAttachmentResponseDto } from './dto/ai-attachment-response.dto';
import type { PresignAiAttachmentResponseDto } from './dto/presign-ai-attachment-response.dto';
import { ATTACHMENT_SCANNER, type AttachmentScanner } from './scanning/attachment-scanner';

type AttachmentRow = {
  id: string;
  aiConversationId: string | null;
  aiConversationMessageId: string | null;
  fileName: string;
  mimeType: string | null;
  fileSize: bigint | null;
  s3Key: string | null;
  contentType: AttachmentContentType | null;
  uploadStatus: AttachmentUploadStatus;
  metadata: Prisma.JsonValue | null;
  createdAt: Date;
};

interface AttachmentMetadata {
  extractedText?: string;
  extractionStatus?: 'ok' | 'unsupported' | 'failed';
  [key: string]: unknown;
}

function readMetadata(value: Prisma.JsonValue | null | undefined): AttachmentMetadata {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return value as AttachmentMetadata;
  }
  return {};
}

export interface CreateGeneratedAttachmentInput {
  conversationId: string;
  messageId?: string;
  fileName: string;
  mimeType: string;
  buffer: Buffer;
  attachmentType: 'generated-pdf' | 'generated-ppt';
}

@Injectable()
export class AiAttachmentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly s3: S3Service,
    private readonly config: ConfigService,
    private readonly conversations: AiConversationsService,
    private readonly contentExtraction: AttachmentContentExtractionService,
    @Inject(ATTACHMENT_SCANNER) private readonly scanner: AttachmentScanner,
  ) {}

  async presign(
    userId: string,
    workspaceId: string,
    dto: PresignAiAttachmentInput,
  ): Promise<PresignAiAttachmentResponseDto> {
    await this.conversations.assertOwned(workspaceId, userId, dto.conversationId);

    const contentType = WIRE_TO_CONTENT_TYPE[dto.attachmentType];
    this.s3.validateMimeType(dto.mimeType, ALLOWED_MIME_TYPES_BY_CONTENT_TYPE[contentType]);
    this.s3.validateFileSize(dto.fileSize, MAX_FILE_SIZE_BY_CONTENT_TYPE[contentType]);

    const s3Key = this.buildAttachmentKey(dto.conversationId, dto.fileName);
    const uploadUrl = await this.s3.createPresignedPutUrl(
      s3Key,
      AI_ATTACHMENT_PRESIGN_EXPIRES_IN_SECONDS,
    );

    const attachment = await this.prisma.attachment.create({
      data: {
        aiConversationId: dto.conversationId,
        uploadedBy: userId,
        fileName: dto.fileName,
        s3Key,
        mimeType: dto.mimeType,
        fileSize: BigInt(dto.fileSize),
        kind: AttachmentKind.FILE,
        contentType,
        uploadStatus: AttachmentUploadStatus.PENDING,
      },
      select: { id: true },
    });

    return {
      attachmentId: attachment.id,
      uploadUrl,
      s3Key,
      expiresIn: AI_ATTACHMENT_PRESIGN_EXPIRES_IN_SECONDS,
    };
  }

  async confirm(
    userId: string,
    workspaceId: string,
    attachmentId: string,
    dto: ConfirmAiAttachmentInput,
  ): Promise<AiAttachmentResponseDto> {
    const attachment = await this.findOwnedAttachmentOrThrow(workspaceId, userId, attachmentId);

    if (attachment.uploadStatus === AttachmentUploadStatus.CONFIRMED) {
      // Idempotent: repeated confirm calls just return current state.
      return this.toResponse(attachment);
    }

    if (!attachment.aiConversationId || !attachment.s3Key) {
      throw new BadRequestException('Attachment is missing its S3 key');
    }
    this.assertKeyBelongsToConversation(attachment.aiConversationId, attachment.s3Key);

    const metadata = await this.s3.resolveUploadedFileMetadata(
      attachment.s3Key,
      attachment.fileName,
      attachment.mimeType ?? undefined,
      // Never trust the client-declared size for the final record — always
      // re-verify against the real S3 object via HEAD.
      undefined,
    );

    if (attachment.contentType) {
      this.s3.validateMimeType(
        metadata.mimeType,
        ALLOWED_MIME_TYPES_BY_CONTENT_TYPE[attachment.contentType],
      );
      this.s3.validateFileSize(
        Number(metadata.fileSize),
        MAX_FILE_SIZE_BY_CONTENT_TYPE[attachment.contentType],
      );
    }

    await this.scanner.scan({ bucket: this.s3.bucket, key: attachment.s3Key });

    const extraction = await this.contentExtraction.maybeExtract(
      attachment.contentType,
      metadata.mimeType,
      attachment.s3Key,
    );

    const linkedMessageId = dto.messageId
      ? await this.assertMessageOwnedOrThrow(attachment.aiConversationId, dto.messageId)
      : undefined;

    const updated = await this.prisma.attachment.update({
      where: { id: attachmentId },
      data: {
        uploadStatus: AttachmentUploadStatus.CONFIRMED,
        fileName: metadata.fileName,
        mimeType: metadata.mimeType,
        fileSize: metadata.fileSize,
        aiConversationMessageId: linkedMessageId,
        metadata: this.mergeMetadata(dto.metadata, extraction),
      },
      select: AI_ATTACHMENT_SELECT,
    });

    return this.toResponse(updated);
  }

  private mergeMetadata(
    clientMetadata: Record<string, unknown> | undefined,
    extraction: ExtractedContent | null,
  ): Prisma.InputJsonValue | undefined {
    if (!clientMetadata && !extraction) return undefined;
    return {
      ...(clientMetadata ?? {}),
      ...(extraction
        ? {
            extractedText: extraction.text,
            extractionStatus: extraction.status,
            extractedCharCount: extraction.charCount,
            extractionTruncated: extraction.truncated,
          }
        : {}),
    } as Prisma.InputJsonValue;
  }

  /**
   * For content the backend already holds in-process (a rendered PDF/PPT
   * buffer) — skips the presign/PUT round trip entirely and creates the
   * Attachment row already CONFIRMED, since there's no client upload to wait
   * for.
   */
  async createGeneratedAttachment(
    userId: string,
    workspaceId: string,
    dto: CreateGeneratedAttachmentInput,
  ): Promise<AiAttachmentResponseDto> {
    await this.conversations.assertOwned(workspaceId, userId, dto.conversationId);

    const contentType = WIRE_TO_CONTENT_TYPE[dto.attachmentType];
    this.s3.validateMimeType(dto.mimeType, ALLOWED_MIME_TYPES_BY_CONTENT_TYPE[contentType]);
    this.s3.validateFileSize(dto.buffer.length, MAX_FILE_SIZE_BY_CONTENT_TYPE[contentType]);

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
        kind: AttachmentKind.FILE,
        contentType,
        uploadStatus: AttachmentUploadStatus.CONFIRMED,
      },
      select: AI_ATTACHMENT_SELECT,
    });

    return this.toResponse(attachment);
  }

  async list(
    userId: string,
    workspaceId: string,
    query: ListAiAttachmentsQuery,
  ): Promise<AiAttachmentListResponseDto> {
    if (query.conversationId) {
      await this.conversations.assertOwned(workspaceId, userId, query.conversationId);
    }

    const cursor = this.decodeCursor(query.cursor);
    const limit = query.limit;
    const attachments = await this.prisma.attachment.findMany({
      where: {
        deletedAt: null,
        uploadStatus: AttachmentUploadStatus.CONFIRMED,
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
      select: AI_ATTACHMENT_SELECT,
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

  async listForConversation(
    userId: string,
    workspaceId: string,
    conversationId: string,
  ): Promise<AiAttachmentResponseDto[]> {
    await this.conversations.assertOwned(workspaceId, userId, conversationId);

    const attachments = await this.prisma.attachment.findMany({
      where: { aiConversationId: conversationId, deletedAt: null, uploadStatus: AttachmentUploadStatus.CONFIRMED },
      select: AI_ATTACHMENT_SELECT,
      orderBy: { createdAt: 'asc' },
    });

    return Promise.all(attachments.map((item) => this.toResponse(item)));
  }

  async getOne(userId: string, workspaceId: string, attachmentId: string): Promise<AiAttachmentResponseDto> {
    const attachment = await this.findOwnedAttachmentOrThrow(workspaceId, userId, attachmentId);
    return this.toResponse(attachment);
  }

  async remove(userId: string, workspaceId: string, attachmentId: string): Promise<{ id: string }> {
    const attachment = await this.findOwnedAttachmentOrThrow(workspaceId, userId, attachmentId);
    await this.prisma.attachment.update({
      where: { id: attachment.id },
      data: { deletedAt: new Date() },
    });
    return { id: attachment.id };
  }

  private async findOwnedAttachmentOrThrow(
    workspaceId: string,
    userId: string,
    attachmentId: string,
  ): Promise<AttachmentRow> {
    const attachment = await this.prisma.attachment.findFirst({
      where: {
        id: attachmentId,
        deletedAt: null,
        aiConversation: { workspaceId, userId, deletedAt: null },
      },
      select: AI_ATTACHMENT_SELECT,
    });
    if (!attachment) throw new NotFoundException(AI_ATTACHMENT_NOT_FOUND);
    return attachment;
  }

  private async assertMessageOwnedOrThrow(conversationId: string, messageId: string): Promise<string> {
    const message = await this.prisma.aiConversationMessage.findFirst({
      where: { id: messageId, conversationId },
      select: { id: true },
    });
    if (!message) throw new NotFoundException('Message not found');
    return message.id;
  }

  private aiAttachmentsPrefix(): string {
    const override = this.config.get<string>('AWS_S3_AI_ATTACHMENTS_PREFIX');
    if (override && override.trim()) {
      return override.replace(/^\/+|\/+$/g, '');
    }
    return this.s3.buildKey(this.s3.basePrefix(), AI_ATTACHMENT_KEY_PREFIX);
  }

  private conversationKeyPrefix(conversationId: string): string {
    return this.s3.buildKey(this.aiAttachmentsPrefix(), `conversation-${conversationId}`);
  }

  private buildAttachmentKey(conversationId: string, fileName: string): string {
    const id = randomUUID();
    const sanitized = fileName.replace(/\s+/g, '_');
    return this.s3.buildKey(this.conversationKeyPrefix(conversationId), `${id}-${sanitized}`);
  }

  private assertKeyBelongsToConversation(conversationId: string, s3Key: string): void {
    this.s3.assertKeyWithinPrefix(s3Key, this.conversationKeyPrefix(conversationId));
  }

  private async toResponse(attachment: AttachmentRow): Promise<AiAttachmentResponseDto> {
    const url =
      attachment.s3Key && attachment.uploadStatus === AttachmentUploadStatus.CONFIRMED
        ? await this.s3.createPresignedGetUrl(attachment.s3Key)
        : null;
    const metadata = readMetadata(attachment.metadata);

    return {
      id: attachment.id,
      conversationId: attachment.aiConversationId!,
      messageId: attachment.aiConversationMessageId,
      fileName: attachment.fileName,
      mimeType: attachment.mimeType ?? 'application/octet-stream',
      fileSize: attachment.fileSize === null ? 0 : Number(attachment.fileSize),
      attachmentType: attachment.contentType
        ? CONTENT_TYPE_TO_WIRE[attachment.contentType]
        : 'document',
      url,
      createdAt: attachment.createdAt,
      extractedText: metadata.extractedText ?? null,
      extractionStatus: metadata.extractionStatus ?? null,
    };
  }

  private decodeCursor(cursor?: string): { createdAt: Date; id: string } | null {
    if (!cursor) return null;
    const separatorIndex = cursor.lastIndexOf(':');
    if (separatorIndex <= 0 || separatorIndex === cursor.length - 1) {
      throw new BadRequestException('Invalid cursor');
    }
    const createdAt = new Date(cursor.slice(0, separatorIndex));
    const id = cursor.slice(separatorIndex + 1);
    if (Number.isNaN(createdAt.getTime()) || !id) {
      throw new BadRequestException('Invalid cursor');
    }
    return { createdAt, id };
  }

  private encodeCursor(attachment?: { id: string; createdAt: Date }): string | null {
    if (!attachment) return null;
    return `${attachment.createdAt.toISOString()}:${attachment.id}`;
  }
}
