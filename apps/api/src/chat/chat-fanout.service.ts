import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/database';
import { NotificationsService } from '../notifications/notifications.service';
import type { Prisma } from '@app/database/generated/prisma/client';

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

@Injectable()
export class ChatFanoutService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
  ) {}

  async incrementUnreadCounts(
    channelId: string,
    senderUserId: string,
    db: PrismaService | Prisma.TransactionClient = this.prisma,
  ) {
    await db.$executeRaw`
      UPDATE "channel_members"
      SET "unread_count" = "unread_count" + 1
      WHERE "channel_id" = ${channelId}
        AND "user_id" <> ${senderUserId}
    `;
  }

  async notifyMessageCreated(input: ChannelNotificationInput) {
    const preview = input.plaintext || 'Sent an attachment';
    const channelLabel =
      input.channelKind === 'DM'
        ? 'direct message'
        : input.channelName?.trim() || 'this channel';
    const mentioned = new Set(input.mentionedUserIds);

    for (const recipient of input.recipients) {
      if (recipient.userId === input.senderUserId) continue;

      const isMentioned = mentioned.has(recipient.userId);
      const isDm = input.channelKind === 'DM';

      if (recipient.isMuted && !isMentioned && !isDm) continue;

      const type = isMentioned || isDm ? 'chat:mention' : 'chat:message';
      const title = isDm
        ? `New direct message from ${input.senderName}`
        : isMentioned
          ? `You were mentioned in ${channelLabel}`
          : `New message in ${channelLabel}`;

      await this.notifications.createNotification(
        input.workspaceId,
        recipient.userId,
        input.senderUserId,
        type,
        title,
        preview,
        'channel_message',
        input.messageId,
        false,
      );
    }
  }
}
