import type { PresignAttachmentDto } from './dto/presign-attachment.dto';
import { PrismaService } from '@app/database';
import { ActivityService } from '../activity/activity.service';
import { DocPermissionsService } from '../docs/doc-permissions.service';
export declare class AttachmentsService {
    private readonly prisma;
    private readonly activity;
    private readonly docPermissions;
    private readonly s3;
    constructor(prisma: PrismaService, activity: ActivityService, docPermissions: DocPermissionsService);
    presignUpload(userId: string, dto: PresignAttachmentDto): Promise<{
        uploadUrl: any;
        s3Key: string;
        expiresAt: Date;
    }>;
    createAttachment(actorId: string, taskId: string, memberId: string, s3Key: string, fileName?: string, mimeType?: string, fileSize?: number): Promise<any>;
    createAttachmentForDoc(actorId: string, docId: string, s3Key: string, fileName?: string, mimeType?: string, fileSize?: number): Promise<any>;
    listAttachmentsForTask(actorId: string, taskId: string, memberId: string): Promise<any>;
    listAttachmentsForDoc(actorId: string, docId: string): Promise<any>;
    deleteAttachment(actorId: string, taskId: string, memberId: string, s3Key: string): Promise<{
        id: any;
        s3Key: string;
    }>;
    deleteAttachmentForDoc(actorId: string, docId: string, s3Key: string): Promise<{
        id: any;
        s3Key: string;
    }>;
    private resolveWorkspaceMember;
    private findDocOrThrow;
    private resolveUploadedFileMetadata;
    private assertDocAttachmentKey;
    private toViewAttachment;
}
