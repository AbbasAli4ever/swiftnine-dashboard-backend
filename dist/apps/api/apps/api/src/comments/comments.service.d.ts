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
                id: string;
                fullName: string;
                email: string;
                avatarUrl: string | null;
            };
        }[];
        reactions: {
            id: string;
            createdAt: Date;
            reactFace: string;
            member: {
                id: string;
                userId: string;
                role: import("@app/database/generated/prisma/enums").Role;
                user: {
                    id: string;
                    fullName: string;
                    avatarUrl: string | null;
                };
            };
        }[];
        author: {
            id: string;
            fullName: string;
            avatarUrl: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        userId: string;
        parentId: string | null;
        taskId: string;
        content: string;
        isEdited: boolean;
    })[]>;
    createComment(workspaceId: string, userId: string, taskId: string, content: string, parentId?: string, mentionedUserIds?: string[]): Promise<{
        mentions: {
            id: string;
            mentionedUserId: string;
            mentionedUser: {
                id: string;
                fullName: string;
                email: string;
                avatarUrl: string | null;
            };
        }[];
        reactions: {
            id: string;
            createdAt: Date;
            reactFace: string;
            member: {
                id: string;
                userId: string;
                role: import("@app/database/generated/prisma/enums").Role;
                user: {
                    id: string;
                    fullName: string;
                    avatarUrl: string | null;
                };
            };
        }[];
        author: {
            id: string;
            fullName: string;
            avatarUrl: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        userId: string;
        parentId: string | null;
        taskId: string;
        content: string;
        isEdited: boolean;
    }>;
    updateComment(workspaceId: string, userId: string, commentId: string, content: string, mentionedUserIds?: string[]): Promise<{
        mentions: {
            id: string;
            mentionedUserId: string;
            mentionedUser: {
                id: string;
                fullName: string;
                email: string;
                avatarUrl: string | null;
            };
        }[];
        reactions: {
            id: string;
            createdAt: Date;
            reactFace: string;
            member: {
                id: string;
                userId: string;
                role: import("@app/database/generated/prisma/enums").Role;
                user: {
                    id: string;
                    fullName: string;
                    avatarUrl: string | null;
                };
            };
        }[];
        author: {
            id: string;
            fullName: string;
            avatarUrl: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        userId: string;
        parentId: string | null;
        taskId: string;
        content: string;
        isEdited: boolean;
    }>;
    deleteComment(workspaceId: string, userId: string, commentId: string, requesterRole?: string): Promise<void>;
    addReaction(workspaceId: string, userId: string, commentId: string, reactFace: string): Promise<{
        member: {
            id: string;
            userId: string;
            role: import("@app/database/generated/prisma/enums").Role;
            user: {
                id: string;
                fullName: string;
                avatarUrl: string | null;
            };
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
            workspaceId: string;
            role: import("@app/database/generated/prisma/enums").Role;
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
