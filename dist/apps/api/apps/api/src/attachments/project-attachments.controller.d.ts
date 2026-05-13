import { type ApiResponse } from "../../../../libs/common/src";
import type { WorkspaceRequest } from '../workspace/workspace.types';
import { AttachmentsService } from './attachments.service';
import { ConfirmProjectAttachmentDto } from './dto/confirm-project-attachment.dto';
import { CreateProjectLinkDto } from './dto/create-project-link.dto';
import { ListProjectAttachmentsQueryDto } from './dto/list-project-attachments.query.dto';
import { PresignProjectAttachmentDto } from './dto/presign-project-attachment.dto';
import { ProjectAttachmentListResponseDto, ProjectAttachmentResponseDto } from './dto/project-attachment-response.dto';
import { UpdateProjectAttachmentDto } from './dto/update-project-attachment.dto';
export declare class ProjectAttachmentsController {
    private readonly attachmentsService;
    constructor(attachmentsService: AttachmentsService);
    presignProjectAttachment(req: WorkspaceRequest, projectId: string, dto: PresignProjectAttachmentDto): Promise<ApiResponse<{
        uploadUrl: string;
        s3Key: string;
        expiresAt: Date;
        attachmentId: null;
    }>>;
    confirmProjectAttachment(req: WorkspaceRequest, projectId: string, dto: ConfirmProjectAttachmentDto): Promise<ApiResponse<ProjectAttachmentResponseDto>>;
    createProjectLink(req: WorkspaceRequest, projectId: string, dto: CreateProjectLinkDto): Promise<ApiResponse<ProjectAttachmentResponseDto>>;
    listProjectAttachments(req: WorkspaceRequest, projectId: string, query: ListProjectAttachmentsQueryDto): Promise<ApiResponse<ProjectAttachmentListResponseDto>>;
    getProjectAttachment(req: WorkspaceRequest, projectId: string, attachmentId: string): Promise<ApiResponse<ProjectAttachmentResponseDto>>;
    updateProjectAttachment(req: WorkspaceRequest, projectId: string, attachmentId: string, dto: UpdateProjectAttachmentDto): Promise<ApiResponse<ProjectAttachmentResponseDto>>;
    deleteProjectAttachment(req: WorkspaceRequest, projectId: string, attachmentId: string): Promise<ApiResponse<{
        id: string;
        s3Key: string | null;
    }>>;
}
