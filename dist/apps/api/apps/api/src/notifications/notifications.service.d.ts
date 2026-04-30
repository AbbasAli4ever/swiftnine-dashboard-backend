import { OnModuleDestroy } from '@nestjs/common';
import { PrismaService } from "../../../../libs/database/src";
import { NotificationsSseService } from './sse.service';
type NotificationLike = {
    referenceType?: string | null;
    referenceId?: string | null;
    [key: string]: any;
};
type EnrichedNotification<T extends NotificationLike> = T & {
    taskId: string | null;
    taskName: string | null;
    commentId: string | null;
    commentName: string | null;
};
export declare class NotificationsService implements OnModuleDestroy {
    private readonly prisma;
    private readonly sse;
    private readonly logger;
    private snoozeWatcher?;
    constructor(prisma: PrismaService, sse: NotificationsSseService);
    onModuleDestroy(): void;
    private startSnoozeWatcher;
    private processExpiredSnoozes;
    private resolveWorkspaceMember;
    private getTaskId;
    addTaskIds<T extends NotificationLike>(notifications: T[]): Promise<Array<EnrichedNotification<T>>>;
    addTaskId<T extends NotificationLike>(notification: T): Promise<EnrichedNotification<T>>;
    toNotificationPayload(notification: NotificationLike): Promise<{
        id: any;
        type: any;
        title: any;
        message: any;
        referenceType: string | null | undefined;
        referenceId: string | null | undefined;
        taskId: string | null;
        taskName: string | null;
        commentId: string | null;
        commentName: string | null;
        actorId: any;
        isRead: any;
        isCleared: any;
        isSnoozed: any;
        snoozedAt: any;
        createdAt: any;
    }>;
    createNotification(workspaceId: string, targetMemberIdOrUserId: string, actorUserId: string | null, type: string, title: string, message?: string, referenceType?: string, referenceId?: string): Promise<{
        type: string;
        title: string;
        id: string;
        createdAt: Date;
        message: string | null;
        actorId: string | null;
        isRead: boolean;
        isCleared: boolean;
        isSnoozed: boolean;
        snoozedAt: Date | null;
        referenceType: string;
        referenceId: string;
        readAt: Date | null;
        isCommented: boolean;
        userId: string;
    } | null>;
    notifyTaskAssignees(workspaceId: string, taskId: string, actorUserId: string, opts?: {
        type?: string;
        title?: string;
        message?: string;
        excludeUserIds?: string[];
    }): Promise<void>;
}
export {};
