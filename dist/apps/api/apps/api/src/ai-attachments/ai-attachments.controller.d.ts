import { type ApiResponse as ApiRes } from "../../../../libs/common/src";
import type { WorkspaceRequest } from '../workspace/workspace.types';
import { AiAttachmentsService } from './ai-attachments.service';
import { ConfirmAiAttachmentDto } from './dto/confirm-ai-attachment.dto';
import { ListAiAttachmentsQueryDto } from './dto/list-ai-attachments.query.dto';
import { PresignAiAttachmentDto } from './dto/presign-ai-attachment.dto';
export declare class AiAttachmentsController {
    private readonly service;
    constructor(service: AiAttachmentsService);
    presign(req: WorkspaceRequest, dto: PresignAiAttachmentDto): Promise<ApiRes<unknown>>;
    confirm(req: WorkspaceRequest, id: string, dto: ConfirmAiAttachmentDto): Promise<ApiRes<unknown>>;
    list(req: WorkspaceRequest, query: ListAiAttachmentsQueryDto): Promise<ApiRes<unknown>>;
    getOne(req: WorkspaceRequest, id: string): Promise<ApiRes<unknown>>;
    remove(req: WorkspaceRequest, id: string): Promise<ApiRes<unknown>>;
    listForConversation(req: WorkspaceRequest, conversationId: string): Promise<ApiRes<unknown>>;
}
