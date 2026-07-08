import { PrismaService } from "../../../../libs/database/src";
import type { CreateConversationDto } from './dto/create-conversation.dto';
import type { UpdateConversationDto } from './dto/update-conversation.dto';
import type { CreateMessageDto } from './dto/create-message.dto';
export declare class AiConversationsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(workspaceId: string, userId: string): Promise<{
        title: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    create(workspaceId: string, userId: string, dto: CreateConversationDto): Promise<{
        title: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    private findOwnedOrThrow;
    findOne(workspaceId: string, userId: string, conversationId: string): Promise<{
        title: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        messages: {
            status: import("@app/database/generated/prisma/enums").AiMessageStatus;
            content: string;
            id: string;
            createdAt: Date;
            role: import("@app/database/generated/prisma/enums").AiMessageRole;
        }[];
    }>;
    rename(workspaceId: string, userId: string, conversationId: string, dto: UpdateConversationDto): Promise<{
        title: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(workspaceId: string, userId: string, conversationId: string): Promise<void>;
    addMessage(workspaceId: string, userId: string, conversationId: string, dto: CreateMessageDto): Promise<{
        status: import("@app/database/generated/prisma/enums").AiMessageStatus;
        content: string;
        id: string;
        createdAt: Date;
        role: import("@app/database/generated/prisma/enums").AiMessageRole;
    }>;
    removeMessage(workspaceId: string, userId: string, conversationId: string, messageId: string): Promise<void>;
}
