import { PrismaService } from "../../../../libs/database/src";
import { SseService } from './sse.service';
export declare class CommentsService {
    private readonly prisma;
    private readonly sse;
    private readonly logger;
    constructor(prisma: PrismaService, sse: SseService);
    getCommentsForTask(workspaceId: string, taskId: string): Promise<({
        reactions: {
            id: string;
            createdAt: Date;
            commentId: string;
            memberId: string;
            reactFace: string;
        }[];
        author: {
            fullName: string;
            id: string;
            avatarUrl: string | null;
        };
    } & {
        content: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        userId: string;
        parentId: string | null;
        taskId: string;
        isEdited: boolean;
    })[]>;
    createComment(workspaceId: string, userId: string, taskId: string, content: string, parentId?: string): Promise<{
        reactions: {
            id: string;
            createdAt: Date;
            commentId: string;
            memberId: string;
            reactFace: string;
        }[];
        author: {
            fullName: string;
            id: string;
            avatarUrl: string | null;
        };
    } & {
        content: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        userId: string;
        parentId: string | null;
        taskId: string;
        isEdited: boolean;
    }>;
    updateComment(workspaceId: string, userId: string, commentId: string, content: string): Promise<{
        reactions: {
            id: string;
            createdAt: Date;
            commentId: string;
            memberId: string;
            reactFace: string;
        }[];
        author: {
            fullName: string;
            id: string;
            avatarUrl: string | null;
        };
    } & {
        content: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        userId: string;
        parentId: string | null;
        taskId: string;
        isEdited: boolean;
    }>;
    deleteComment(workspaceId: string, userId: string, commentId: string, requesterRole?: string): Promise<void>;
    addReaction(workspaceId: string, userId: string, commentId: string, reactFace: string): Promise<{
        member: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            userId: string;
            role: import("@app/database/generated/prisma/enums").Role;
            workspaceId: string;
        };
    } & {
        id: string;
        createdAt: Date;
        commentId: string;
        memberId: string;
        reactFace: string;
    }>;
    deleteReaction(workspaceId: string, userId: string, reactionId: string): Promise<void>;
    private assertTaskInWorkspaceOrThrow;
}
