import { PrismaService } from "../../../../libs/database/src";
import { SseService } from './sse.service';
export declare class CommentsService {
    private readonly prisma;
    private readonly sse;
    private readonly logger;
    constructor(prisma: PrismaService, sse: SseService);
    getCommentsForTask(workspaceId: string, taskId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        userId: string;
        content: string;
        taskId: string;
        parentId: string | null;
        isEdited: boolean;
    }[]>;
    createComment(workspaceId: string, userId: string, taskId: string, content: string, parentId?: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        userId: string;
        content: string;
        taskId: string;
        parentId: string | null;
        isEdited: boolean;
    }>;
    updateComment(workspaceId: string, userId: string, commentId: string, content: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        userId: string;
        content: string;
        taskId: string;
        parentId: string | null;
        isEdited: boolean;
    }>;
    deleteComment(workspaceId: string, userId: string, commentId: string, requesterRole?: string): Promise<void>;
    addReaction(workspaceId: string, userId: string, commentId: string, reactFace: string): Promise<any>;
    deleteReaction(workspaceId: string, userId: string, reactionId: string): Promise<void>;
    private assertTaskInWorkspaceOrThrow;
}
