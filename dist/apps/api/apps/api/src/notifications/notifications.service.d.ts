import { OnModuleDestroy } from '@nestjs/common';
import { PrismaService } from "../../../../libs/database/src";
import { NotificationsSseService } from './sse.service';
type NotificationLike = {
    referenceType?: string | null;
    referenceId?: string | null;
    [key: string]: any;
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
    addTaskIds<T extends NotificationLike>(notifications: T[]): Promise<Array<T & {
        taskId: string | null;
    }>>;
    addTaskId<T extends NotificationLike>(notification: T): Promise<T & {
        taskId: string | null;
    }>;
    toNotificationPayload(notification: NotificationLike): Promise<{
        id: any;
        type: any;
        title: any;
        message: any;
        referenceType: string | null | undefined;
        referenceId: string | null | undefined;
        taskId: string | null;
        actorId: any;
        isRead: any;
        isCleared: any;
        isSnoozed: any;
        snoozedAt: any;
        createdAt: any;
    }>;
    createNotification(workspaceId: string, targetMemberIdOrUserId: string, actorUserId: string | null, type: string, title: string, message?: string, referenceType?: string, referenceId?: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        title: string;
        type: string;
        message: string | null;
        referenceType: string;
        referenceId: string;
        actorId: string | null;
        isRead: boolean;
        readAt: Date | null;
        isCleared: boolean;
        isSnoozed: boolean;
        snoozedAt: Date | null;
    } | null>;
    notifyTaskAssignees(workspaceId: string, taskId: string, actorUserId: string, opts?: {
        type?: string;
        title?: string;
        message?: string;
        excludeUserIds?: string[];
    }): Promise<void>;
}
export {};
