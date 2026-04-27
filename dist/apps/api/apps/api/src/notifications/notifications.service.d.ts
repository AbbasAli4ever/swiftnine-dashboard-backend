import { OnModuleDestroy } from '@nestjs/common';
import { PrismaService } from "../../../../libs/database/src";
import { NotificationsSseService } from './sse.service';
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
    createNotification(workspaceId: string, targetMemberIdOrUserId: string, actorUserId: string | null, type: string, title: string, message?: string, referenceType?: string, referenceId?: string): Promise<{
        message: string | null;
        type: string;
        title: string;
        id: string;
        createdAt: Date;
        userId: string;
        referenceType: string;
        referenceId: string;
        isRead: boolean;
        readAt: Date | null;
        isCleared: boolean;
        isSnoozed: boolean;
        snoozedAt: Date | null;
        actorId: string | null;
    } | null>;
    notifyTaskAssignees(workspaceId: string, taskId: string, actorUserId: string, opts?: {
        type?: string;
        title?: string;
        message?: string;
        excludeUserIds?: string[];
    }): Promise<void>;
}
