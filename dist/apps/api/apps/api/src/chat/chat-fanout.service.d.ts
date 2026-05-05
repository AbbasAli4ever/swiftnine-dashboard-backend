import { PrismaService } from "../../../../libs/database/src";
import { NotificationsService } from '../notifications/notifications.service';
import type { Prisma } from "../../../../libs/database/src/generated/prisma/client";
type ChannelNotificationInput = {
    workspaceId: string;
    channelId: string;
    channelKind: 'CHANNEL' | 'DM';
    channelName: string | null;
    senderUserId: string;
    senderName: string;
    messageId: string;
    plaintext: string;
    mentionedUserIds: string[];
    recipients: Array<{
        userId: string;
        isMuted: boolean;
    }>;
};
export declare class ChatFanoutService {
    private readonly prisma;
    private readonly notifications;
    constructor(prisma: PrismaService, notifications: NotificationsService);
    incrementUnreadCounts(channelId: string, senderUserId: string, db?: PrismaService | Prisma.TransactionClient): Promise<void>;
    notifyMessageCreated(input: ChannelNotificationInput): Promise<void>;
}
export {};
