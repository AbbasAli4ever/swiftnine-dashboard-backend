import type { PresignAttachmentDto } from './dto/presign-attachment.dto';
import { PrismaService } from "../../../../libs/database/src";
import { type Role } from "../../../../libs/database/src/generated/prisma/client";
import { ActivityService } from '../activity/activity.service';
import { DocPermissionsService } from '../docs/doc-permissions.service';
import { ProjectSecurityService } from '../project-security/project-security.service';
import type { ConfirmProjectAttachmentInput } from './dto/confirm-project-attachment.dto';
import type { CreateProjectLinkInput } from './dto/create-project-link.dto';
import type { ListProjectAttachmentsQuery } from './dto/list-project-attachments.query.dto';
import type { PresignProjectAttachmentInput } from './dto/presign-project-attachment.dto';
import type { ProjectAttachmentListResponseDto, ProjectAttachmentResponseDto } from './dto/project-attachment-response.dto';
import type { ProjectAttachmentSearchResponseDto } from './dto/project-attachment-search-response.dto';
import type { UpdateProjectAttachmentInput } from './dto/update-project-attachment.dto';
export declare class AttachmentsService {
    private readonly prisma;
    private readonly activity;
    private readonly docPermissions;
    private readonly projectSecurity;
    private readonly s3;
    constructor(prisma: PrismaService, activity: ActivityService, docPermissions: DocPermissionsService, projectSecurity: ProjectSecurityService);
    presignUpload(userId: string, dto: PresignAttachmentDto): Promise<{
        uploadUrl: string;
        s3Key: string;
        expiresAt: Date;
        attachmentId: string | null;
    }>;
    presignProjectUpload(userId: string, workspaceId: string, projectId: string, dto: PresignProjectAttachmentInput): Promise<{
        uploadUrl: string;
        s3Key: string;
        expiresAt: Date;
        attachmentId: null;
    }>;
    confirmProjectUpload(userId: string, workspaceId: string, projectId: string, dto: ConfirmProjectAttachmentInput): Promise<ProjectAttachmentResponseDto>;
    createProjectLink(userId: string, workspaceId: string, projectId: string, dto: CreateProjectLinkInput): Promise<ProjectAttachmentResponseDto>;
    listProjectAttachments(userId: string, workspaceId: string, projectId: string, query: ListProjectAttachmentsQuery): Promise<ProjectAttachmentListResponseDto>;
    getProjectAttachment(userId: string, workspaceId: string, projectId: string, attachmentId: string): Promise<ProjectAttachmentResponseDto>;
    searchProjectAttachments(userId: string, workspaceId: string, query: {
        q: string;
        projectId?: string;
        limit?: number;
    }): Promise<ProjectAttachmentSearchResponseDto[]>;
    updateProjectAttachment(userId: string, workspaceId: string, role: Role, projectId: string, attachmentId: string, dto: UpdateProjectAttachmentInput): Promise<ProjectAttachmentResponseDto>;
    deleteProjectAttachment(userId: string, workspaceId: string, role: Role, projectId: string, attachmentId: string): Promise<{
        id: string;
        s3Key: string | null;
    }>;
    createAttachment(actorId: string, taskId: string, memberId: string, s3Key: string, fileName?: string, mimeType?: string, fileSize?: number): Promise<{
        fileSize: number;
        id: string;
        createdAt: Date;
        fileName: string;
        s3Key: string | null;
        mimeType: string | null;
    }>;
    createAttachmentForDoc(actorId: string, docId: string, s3Key: string, fileName?: string, mimeType?: string, fileSize?: number): Promise<{
        fileSize: number;
        id: string;
        createdAt: Date;
        fileName: string;
        s3Key: string | null;
        mimeType: string | null;
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
        s3Key: string;
        mimeType: string;
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
    private findChannelMemberOrThrow;
    private assertTaskUnlocked;
    private findProjectForAttachmentOrThrow;
    private projectAttachmentPrefix;
    private assertProjectAttachmentKey;
    private normalizeProjectAttachmentLimit;
    private decodeProjectAttachmentCursor;
    private encodeProjectAttachmentCursor;
    private assertCanManageProjectAttachment;
    private projectAttachmentSelect;
    private projectAttachmentSearchSelect;
    private toProjectAttachmentResponse;
    private toProjectAttachmentSearchResponse;
    private resolveUploadedFileMetadata;
    private assertDocAttachmentKey;
    toViewAttachment(att: {
        id: string;
        fileName: string | null;
        mimeType: string | null;
        s3Key: string | null;
        fileSize: bigint | null;
    }): Promise<{
        fileSize: number;
        url: string;
        expiresAt: Date;
        id: string;
        fileName: string;
        s3Key: string;
        mimeType: string;
    }>;
    private assertFileAttachmentMetadata;
}
