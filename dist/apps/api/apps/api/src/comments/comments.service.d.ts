import { PrismaService } from '@app/database';
import type { Prisma } from '@app/database/generated/prisma/client';
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
    getCommentsForTask(workspaceId: string, taskId: string): Promise<runtime.Types.Public.PrismaPromise<T>>;
    createComment(workspaceId: string, userId: string, taskId: string, content: string, parentId?: string, mentionedUserIds?: string[]): Promise<runtime.Types.Utils.JsPromise<R>>;
    updateComment(workspaceId: string, userId: string, commentId: string, content: string, mentionedUserIds?: string[]): Promise<runtime.Types.Utils.JsPromise<R>>;
    deleteComment(workspaceId: string, userId: string, commentId: string, requesterRole?: string): Promise<void>;
    addReaction(workspaceId: string, userId: string, commentId: string, reactFace: string): Promise<any>;
    deleteReaction(workspaceId: string, userId: string, reactionId: string): Promise<void>;
    updateReaction(workspaceId: string, userId: string, reactionId: string, reactFace: string): Promise<runtime.Types.Result.GetResult<Prisma.$ReactionPayload<ExtArgs>, T, "update", GlobalOmitOptions>>;
    private findTaskInWorkspaceOrThrow;
    private resolveMentionedUsers;
    private notifyOnCommentCreated;
    private notifyMentionedUsers;
    private buildActivityMetadata;
}
