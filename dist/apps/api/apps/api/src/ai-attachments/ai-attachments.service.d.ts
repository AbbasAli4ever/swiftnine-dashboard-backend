import { ConfigService } from '@nestjs/config';
import { PrismaService } from "../../../../libs/database/src";
import { S3Service } from "../../../../libs/common/src";
import { AiConversationsService } from '../ai-conversations/ai-conversations.service';
import type { ConfirmAiAttachmentInput } from './dto/confirm-ai-attachment.dto';
import type { ListAiAttachmentsQuery } from './dto/list-ai-attachments.query.dto';
import type { PresignAiAttachmentInput } from './dto/presign-ai-attachment.dto';
import type { AiAttachmentListResponseDto, AiAttachmentResponseDto } from './dto/ai-attachment-response.dto';
import type { PresignAiAttachmentResponseDto } from './dto/presign-ai-attachment-response.dto';
import { type AttachmentScanner } from './scanning/attachment-scanner';
export interface CreateGeneratedAttachmentInput {
    conversationId: string;
    messageId?: string;
    fileName: string;
    mimeType: string;
    buffer: Buffer;
    attachmentType: 'generated-pdf' | 'generated-ppt';
}
export declare class AiAttachmentsService {
    private readonly prisma;
    private readonly s3;
    private readonly config;
    private readonly conversations;
    private readonly scanner;
    constructor(prisma: PrismaService, s3: S3Service, config: ConfigService, conversations: AiConversationsService, scanner: AttachmentScanner);
    presign(userId: string, workspaceId: string, dto: PresignAiAttachmentInput): Promise<PresignAiAttachmentResponseDto>;
    confirm(userId: string, workspaceId: string, attachmentId: string, dto: ConfirmAiAttachmentInput): Promise<AiAttachmentResponseDto>;
    createGeneratedAttachment(userId: string, workspaceId: string, dto: CreateGeneratedAttachmentInput): Promise<AiAttachmentResponseDto>;
    list(userId: string, workspaceId: string, query: ListAiAttachmentsQuery): Promise<AiAttachmentListResponseDto>;
    listForConversation(userId: string, workspaceId: string, conversationId: string): Promise<AiAttachmentResponseDto[]>;
    getOne(userId: string, workspaceId: string, attachmentId: string): Promise<AiAttachmentResponseDto>;
    remove(userId: string, workspaceId: string, attachmentId: string): Promise<{
        id: string;
    }>;
    private findOwnedAttachmentOrThrow;
    private assertMessageOwnedOrThrow;
    private aiAttachmentsPrefix;
    private conversationKeyPrefix;
    private buildAttachmentKey;
    private assertKeyBelongsToConversation;
    private toResponse;
    private decodeCursor;
    private encodeCursor;
}
