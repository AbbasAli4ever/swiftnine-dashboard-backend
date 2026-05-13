import { AttachmentsService } from './attachments.service';
import { PresignAttachmentDto } from './dto/presign-attachment.dto';
import type { Request } from 'express';
import type { AuthUser } from '../auth/auth.service';
import { CreateAttachmentDto } from './dto/create-attachment.dto';
import { ViewAttachmentsDto } from './dto/view-attachments.dto';
import { DeleteAttachmentDto } from './dto/delete-attachment.dto';
import { CreateDocAttachmentDto } from './dto/create-doc-attachment.dto';
import { ViewDocAttachmentsDto } from './dto/view-doc-attachments.dto';
import { DeleteDocAttachmentDto } from './dto/delete-doc-attachment.dto';
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
        attachmentId: string | null;
    }>>;
    create(req: AuthenticatedRequest, dto: CreateAttachmentDto): Promise<import("@app/common").ApiResponse<{
        fileSize: number;
        id: string;
        createdAt: Date;
        fileName: string;
        s3Key: string | null;
        mimeType: string | null;
    }>>;
    createForDoc(req: AuthenticatedRequest, dto: CreateDocAttachmentDto): Promise<import("@app/common").ApiResponse<{
        fileSize: number;
        id: string;
        createdAt: Date;
        fileName: string;
        s3Key: string | null;
        mimeType: string | null;
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
    viewForDoc(req: AuthenticatedRequest, dto: ViewDocAttachmentsDto): Promise<import("@app/common").ApiResponse<{
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
    removeForDoc(req: AuthenticatedRequest, dto: DeleteDocAttachmentDto): Promise<import("@app/common").ApiResponse<{
        id: string;
        s3Key: string;
    }>>;
}
export {};
