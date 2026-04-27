import { AttachmentsService } from './attachments.service';
import { PresignAttachmentDto } from './dto/presign-attachment.dto';
import type { Request } from 'express';
import type { AuthUser } from '../auth/auth.service';
import { CreateAttachmentDto } from './dto/create-attachment.dto';
import { ViewAttachmentsDto } from './dto/view-attachments.dto';
import { DeleteAttachmentDto } from './dto/delete-attachment.dto';
type AuthenticatedRequest = Request & {
    user: AuthUser;
};
export declare class AttachmentsController {
    private readonly attachmentsService;
    constructor(attachmentsService: AttachmentsService);
    presign(req: AuthenticatedRequest, dto: PresignAttachmentDto): Promise<import("@app/common").ApiResponse<{
        uploadUrl: string;
        s3Key: string;
        expiresAt: Date;
    }>>;
    create(req: AuthenticatedRequest, dto: CreateAttachmentDto): Promise<import("@app/common").ApiResponse<{
        fileSize: number;
        id: string;
        createdAt: Date;
        fileName: string;
        s3Key: string;
        mimeType: string;
    }>>;
    view(req: AuthenticatedRequest, dto: ViewAttachmentsDto): Promise<import("@app/common").ApiResponse<{
        fileSize: number;
        url: string;
        expiresAt: Date;
        id: string;
        fileName: string;
        s3Key: string;
        mimeType: string;
    }[]>>;
    remove(req: AuthenticatedRequest, dto: DeleteAttachmentDto): Promise<import("@app/common").ApiResponse<{
        id: string;
        s3Key: string;
    }>>;
}
export {};
