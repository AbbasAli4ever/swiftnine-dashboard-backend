import { PrismaService } from "../../../../libs/database/src";
import { NotificationsSseService } from './sse.service';
export declare class NotificationsService {
    private readonly prisma;
    private readonly sse;
    private readonly logger;
    constructor(prisma: PrismaService, sse: NotificationsSseService);
    private resolveWorkspaceMember;
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
    } | null>;
    notifyTaskAssignees(workspaceId: string, taskId: string, actorUserId: string, opts?: {
        type?: string;
        title?: string;
        message?: string;
        excludeUserIds?: string[];
    }): Promise<void>;
}
