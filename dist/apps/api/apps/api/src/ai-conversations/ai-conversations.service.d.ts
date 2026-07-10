import { PrismaService } from "../../../../libs/database/src";
import type { CreateConversationDto } from './dto/create-conversation.dto';
import type { UpdateConversationDto } from './dto/update-conversation.dto';
import type { CreateMessageDto } from './dto/create-message.dto';
export declare class AiConversationsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(workspaceId: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string | null;
    }[]>;
    create(workspaceId: string, userId: string, dto: CreateConversationDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string | null;
    }>;
    private findOwnedOrThrow;
    findOne(workspaceId: string, userId: string, conversationId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string | null;
        messages: {
            id: string;
            createdAt: Date;
            role: import("@app/database/generated/prisma/enums").AiMessageRole;
            status: import("@app/database/generated/prisma/enums").AiMessageStatus;
            content: string;
        }[];
    }>;
    rename(workspaceId: string, userId: string, conversationId: string, dto: UpdateConversationDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string | null;
    }>;
    remove(workspaceId: string, userId: string, conversationId: string): Promise<void>;
    addMessage(workspaceId: string, userId: string, conversationId: string, dto: CreateMessageDto): Promise<{
        id: string;
        createdAt: Date;
        role: import("@app/database/generated/prisma/enums").AiMessageRole;
        status: import("@app/database/generated/prisma/enums").AiMessageStatus;
        content: string;
    }>;
    removeMessage(workspaceId: string, userId: string, conversationId: string, messageId: string): Promise<void>;
}
