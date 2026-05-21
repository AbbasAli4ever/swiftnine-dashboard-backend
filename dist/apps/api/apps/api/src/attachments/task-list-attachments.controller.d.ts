import { type ApiResponse } from "../../../../libs/common/src";
import type { WorkspaceRequest } from '../workspace/workspace.types';
import { AttachmentsService } from './attachments.service';
import { ConfirmTaskListAttachmentDto } from './dto/confirm-task-list-attachment.dto';
import { CreateTaskListLinkDto } from './dto/create-task-list-link.dto';
import { ListTaskListAttachmentsQueryDto } from './dto/list-task-list-attachments.query.dto';
import { PresignTaskListAttachmentDto } from './dto/presign-task-list-attachment.dto';
import { TaskListAttachmentListResponseDto, TaskListAttachmentResponseDto } from './dto/task-list-attachment-response.dto';
import { UpdateProjectAttachmentDto } from './dto/update-project-attachment.dto';
export declare class TaskListAttachmentsController {
    private readonly attachmentsService;
    constructor(attachmentsService: AttachmentsService);
    presignTaskListAttachment(req: WorkspaceRequest, listId: string, dto: PresignTaskListAttachmentDto): Promise<ApiResponse<{
        uploadUrl: string;
        s3Key: string;
        expiresAt: Date;
        attachmentId: null;
    }>>;
    confirmTaskListAttachment(req: WorkspaceRequest, listId: string, dto: ConfirmTaskListAttachmentDto): Promise<ApiResponse<TaskListAttachmentResponseDto>>;
    createTaskListLink(req: WorkspaceRequest, listId: string, dto: CreateTaskListLinkDto): Promise<ApiResponse<TaskListAttachmentResponseDto>>;
    listTaskListAttachments(req: WorkspaceRequest, listId: string, query: ListTaskListAttachmentsQueryDto): Promise<ApiResponse<TaskListAttachmentListResponseDto>>;
    getTaskListAttachment(req: WorkspaceRequest, listId: string, attachmentId: string): Promise<ApiResponse<TaskListAttachmentResponseDto>>;
    updateTaskListAttachment(req: WorkspaceRequest, listId: string, attachmentId: string, dto: UpdateProjectAttachmentDto): Promise<ApiResponse<TaskListAttachmentResponseDto>>;
    deleteTaskListAttachment(req: WorkspaceRequest, listId: string, attachmentId: string): Promise<ApiResponse<{
        id: string;
        s3Key: string | null;
    }>>;
}
