import type { PresignAttachmentDto } from './dto/presign-attachment.dto';
import { PrismaService } from "../../../../libs/database/src";
import { ActivityService } from '../activity/activity.service';
import { DocPermissionsService } from '../docs/doc-permissions.service';
export declare class AttachmentsService {
    private readonly prisma;
    private readonly activity;
    private readonly docPermissions;
    private readonly s3;
    constructor(prisma: PrismaService, activity: ActivityService, docPermissions: DocPermissionsService);
    presignUpload(userId: string, dto: PresignAttachmentDto): Promise<{
        uploadUrl: string;
        s3Key: string;
        expiresAt: Date;
    }>;
    createAttachment(actorId: string, taskId: string, memberId: string, s3Key: string, fileName?: string, mimeType?: string, fileSize?: number): Promise<{
        fileSize: number;
        id: string;
        createdAt: Date;
        fileName: string;
        s3Key: string;
        mimeType: string;
    }>;
    createAttachmentForDoc(actorId: string, docId: string, s3Key: string, fileName?: string, mimeType?: string, fileSize?: number): Promise<{
        fileSize: number;
        id: string;
        createdAt: Date;
        fileName: string;
        s3Key: string;
        mimeType: string;
    }>;
    listAttachmentsForTask(actorId: string, taskId: string, memberId: string): Promise<{
        fileSize: number;
        url: string;
        expiresAt: Date;
        id: string;
        fileName: string;
        s3Key: string;
        mimeType: string;
    }[]>;
    listAttachmentsForDoc(actorId: string, docId: string): Promise<{
        fileSize: number;
        url: string;
        expiresAt: Date;
        id: string;
        fileName: string;
        mimeType: string;
        s3Key: string;
    }[]>;
    deleteAttachment(actorId: string, taskId: string, memberId: string, s3Key: string): Promise<{
        id: string;
        s3Key: string;
    }>;
    deleteAttachmentForDoc(actorId: string, docId: string, s3Key: string): Promise<{
        id: string;
        s3Key: string;
    }>;
    private resolveWorkspaceMember;
    private findDocOrThrow;
    private resolveUploadedFileMetadata;
    private assertDocAttachmentKey;
    private toViewAttachment;
}
