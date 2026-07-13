import { WIRE_ATTACHMENT_TYPES } from '../ai-attachments.constants';
export declare class AiAttachmentResponseDto {
    id: string;
    conversationId: string;
    messageId: string | null;
    fileName: string;
    mimeType: string;
    fileSize: number;
    attachmentType: (typeof WIRE_ATTACHMENT_TYPES)[number];
    url: string | null;
    createdAt: Date;
}
export declare class AiAttachmentListResponseDto {
    items: AiAttachmentResponseDto[];
    nextCursor: string | null;
    limit: number;
}
