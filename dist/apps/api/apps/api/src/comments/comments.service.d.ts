import { PrismaService } from "../../../../libs/database/src";
import { ActivityService } from '../activity/activity.service';
import { NotificationsService } from '../notifications/notifications.service';
import { SseService } from './sse.service';
export declare class CommentsService {
    private readonly prisma;
    private readonly sse;
    private readonly activity;
    private readonly notifications;
    private readonly logger;
    constructor(prisma: PrismaService, sse: SseService, activity: ActivityService, notifications: NotificationsService);
    getCommentsForTask(workspaceId: string, taskId: string): Promise<({
        mentions: {
            id: string;
            mentionedUserId: string;
            mentionedUser: {
                fullName: string;
                email: string;
                id: string;
                avatarUrl: string | null;
            };
        }[];
        reactions: {
            id: string;
            createdAt: Date;
            member: {
                user: {
                    fullName: string;
                    id: string;
                    avatarUrl: string | null;
                };
                id: string;
                userId: string;
                role: import("@app/database/generated/prisma/enums").Role;
            };
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
        taskId: string;
        isEdited: boolean;
        parentId: string | null;
    })[]>;
    createComment(workspaceId: string, userId: string, taskId: string, content: string, parentId?: string, mentionedUserIds?: string[]): Promise<{
        mentions: {
            id: string;
            mentionedUserId: string;
            mentionedUser: {
                fullName: string;
                email: string;
                id: string;
                avatarUrl: string | null;
            };
        }[];
        reactions: {
            id: string;
            createdAt: Date;
            member: {
                user: {
                    fullName: string;
                    id: string;
                    avatarUrl: string | null;
                };
                id: string;
                userId: string;
                role: import("@app/database/generated/prisma/enums").Role;
            };
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
        taskId: string;
        isEdited: boolean;
        parentId: string | null;
    }>;
    updateComment(workspaceId: string, userId: string, commentId: string, content: string, mentionedUserIds?: string[]): Promise<{
        mentions: {
            id: string;
            mentionedUserId: string;
            mentionedUser: {
                fullName: string;
                email: string;
                id: string;
                avatarUrl: string | null;
            };
        }[];
        reactions: {
            id: string;
            createdAt: Date;
            member: {
                user: {
                    fullName: string;
                    id: string;
                    avatarUrl: string | null;
                };
                id: string;
                userId: string;
                role: import("@app/database/generated/prisma/enums").Role;
            };
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
        taskId: string;
        isEdited: boolean;
        parentId: string | null;
    }>;
    deleteComment(workspaceId: string, userId: string, commentId: string, requesterRole?: string): Promise<void>;
    addReaction(workspaceId: string, userId: string, commentId: string, reactFace: string): Promise<{
        member: {
            user: {
                fullName: string;
                id: string;
                avatarUrl: string | null;
            };
            id: string;
            userId: string;
            role: import("@app/database/generated/prisma/enums").Role;
        };
    } & {
        id: string;
        createdAt: Date;
        commentId: string;
        memberId: string;
        reactFace: string;
    }>;
    deleteReaction(workspaceId: string, userId: string, reactionId: string): Promise<void>;
    updateReaction(workspaceId: string, userId: string, reactionId: string, reactFace: string): Promise<{
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
    private findTaskInWorkspaceOrThrow;
    private resolveMentionedUsers;
    private notifyOnCommentCreated;
    private notifyMentionedUsers;
    private buildActivityMetadata;
}
