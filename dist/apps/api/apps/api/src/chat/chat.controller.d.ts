import { type ApiResponse as ApiRes } from "../../../../libs/common/src";
import type { WorkspaceRequest } from '../workspace/workspace.types';
import { AddReactionDto } from './dto/add-reaction.dto';
import { CreateDmDto } from './dto/create-dm.dto';
import { EditMessageDto } from './dto/edit-message.dto';
import { ListMessagesDto } from './dto/list-messages.dto';
import { MarkReadDto } from './dto/mark-read.dto';
import { SearchMessagesDto } from './dto/search-messages.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { ChatService } from './chat.service';
export declare class ChatController {
    private readonly chatService;
    constructor(chatService: ChatService);
    listMessages(req: WorkspaceRequest, channelId: string, query: ListMessagesDto): Promise<ApiRes<any>>;
    listPinnedMessages(req: WorkspaceRequest, channelId: string): Promise<ApiRes<any>>;
    sendMessage(req: WorkspaceRequest, channelId: string, dto: SendMessageDto): Promise<ApiRes<any>>;
    editMessage(req: WorkspaceRequest, messageId: string, dto: EditMessageDto): Promise<ApiRes<any>>;
    deleteMessage(req: WorkspaceRequest, messageId: string): Promise<ApiRes<any>>;
    toggleReaction(req: WorkspaceRequest, messageId: string, dto: AddReactionDto): Promise<ApiRes<any>>;
    pinMessage(req: WorkspaceRequest, messageId: string): Promise<ApiRes<any>>;
    unpinMessage(req: WorkspaceRequest, messageId: string): Promise<ApiRes<any>>;
    markRead(req: WorkspaceRequest, channelId: string, dto: MarkReadDto): Promise<ApiRes<any>>;
    mute(req: WorkspaceRequest, channelId: string): Promise<ApiRes<any>>;
    unmute(req: WorkspaceRequest, channelId: string): Promise<ApiRes<any>>;
    createDm(req: WorkspaceRequest, dto: CreateDmDto): Promise<ApiRes<any>>;
    listDms(req: WorkspaceRequest): Promise<ApiRes<any>>;
    search(req: WorkspaceRequest, query: SearchMessagesDto): Promise<ApiRes<any>>;
}
