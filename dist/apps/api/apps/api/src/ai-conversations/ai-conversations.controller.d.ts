import type { WorkspaceRequest } from '../workspace/workspace.types';
import { type ApiResponse as ApiRes } from "../../../../libs/common/src";
import { AiConversationsService } from './ai-conversations.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { CreateMessageDto } from './dto/create-message.dto';
export declare class AiConversationsController {
    private readonly service;
    constructor(service: AiConversationsService);
    findAll(req: WorkspaceRequest): Promise<ApiRes<unknown>>;
    create(req: WorkspaceRequest, dto: CreateConversationDto): Promise<ApiRes<unknown>>;
    findOne(req: WorkspaceRequest, conversationId: string): Promise<ApiRes<unknown>>;
    rename(req: WorkspaceRequest, conversationId: string, dto: UpdateConversationDto): Promise<ApiRes<unknown>>;
    remove(req: WorkspaceRequest, conversationId: string): Promise<ApiRes<null>>;
    addMessage(req: WorkspaceRequest, conversationId: string, dto: CreateMessageDto): Promise<ApiRes<unknown>>;
    removeMessage(req: WorkspaceRequest, conversationId: string, messageId: string): Promise<ApiRes<null>>;
}
