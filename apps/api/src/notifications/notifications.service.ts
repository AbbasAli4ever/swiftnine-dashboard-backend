import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { PrismaService } from '@app/database';
import { NotificationsSseService } from './sse.service';

@Injectable()
export class NotificationsService implements OnModuleDestroy {
  private readonly logger = new Logger(NotificationsService.name);
  private snoozeWatcher?: NodeJS.Timeout;

  constructor(private readonly prisma: PrismaService, private readonly sse: NotificationsSseService) {
    this.startSnoozeWatcher();
  }

  onModuleDestroy() {
    if (this.snoozeWatcher) clearInterval(this.snoozeWatcher);
  }

  private startSnoozeWatcher() {
    // unsnooze expired notifications every minute
    this.snoozeWatcher = setInterval(() => {
      this.processExpiredSnoozes().catch((err) => this.logger.debug('Snooze watcher error', err as any));
    }, 60_000);
  }

  private async processExpiredSnoozes() {
    const now = new Date();
    const expired = await this.prisma.notification.findMany({
      where: { isSnoozed: true, snoozedAt: { lte: now }, isCleared: false },
    });
    if (!expired || expired.length === 0) return;

    for (const notif of expired) {
      const updated = await this.prisma.notification.update({
        where: { id: notif.id },
        data: { isSnoozed: false, snoozedAt: null },
      });

      // broadcast to any connected workspace member streams for this user
      const members = await this.prisma.workspaceMember.findMany({
        where: { userId: updated.userId, deletedAt: null },
        select: { id: true },
      });

      const payload = {
        id: updated.id,
        type: updated.type,
        title: updated.title,
        message: updated.message,
        referenceType: updated.referenceType,
        referenceId: updated.referenceId,
        actorId: updated.actorId,
        isRead: updated.isRead,
        isCleared: updated.isCleared,
        isSnoozed: updated.isSnoozed,
        snoozedAt: updated.snoozedAt,
        createdAt: updated.createdAt,
      };

      for (const m of members) {
        try {
          this.sse.broadcastToMember(m.id, 'notification:created', payload);
        } catch (err) {
          this.logger.debug('Failed broadcasting unsnoozed notification', err as any);
        }
      }
    }
  }

  private async resolveWorkspaceMember(workspaceId: string, memberIdOrUserId: string) {
    let member = await this.prisma.workspaceMember.findFirst({
      where: { id: memberIdOrUserId, workspaceId, deletedAt: null },
      select: { id: true, userId: true },
    });

    if (!member) {
      member = await this.prisma.workspaceMember.findFirst({
        where: { userId: memberIdOrUserId, workspaceId, deletedAt: null },
        select: { id: true, userId: true },
      });
    }

    return member;
  }

  async createNotification(
    workspaceId: string,
    targetMemberIdOrUserId: string,
    actorUserId: string | null,
    type: string,
    title: string,
    message?: string,
    referenceType?: string,
    referenceId?: string,
  ) {
    const member = await this.resolveWorkspaceMember(workspaceId, targetMemberIdOrUserId);
    if (!member) {
      this.logger.debug(`Notification: no member found for target ${targetMemberIdOrUserId} workspace=${workspaceId}`);
      return null;
    }

    if (member.userId === actorUserId) return null; // do not notify actor

    const notif = await this.prisma.notification.create({
      data: {
        userId: member.userId,
        type,
        title,
        message: message ?? undefined,
        referenceType: referenceType ?? '',
        referenceId: referenceId ?? '',
        actorId: actorUserId ?? undefined,
        isCleared: false,
        isSnoozed: false,
        snoozedAt: null,
      },
    });
    try {
      if (!notif.isCleared && !notif.isSnoozed) {
        this.sse.broadcastToMember(member.id, 'notification:created', {
          id: notif.id,
          type: notif.type,
          title: notif.title,
          message: notif.message,
          referenceType: notif.referenceType,
          referenceId: notif.referenceId,
          actorId: notif.actorId,
          isRead: notif.isRead,
          isCleared: notif.isCleared,
          isSnoozed: notif.isSnoozed,
          snoozedAt: notif.snoozedAt,
          createdAt: notif.createdAt,
        });
      } else {
        this.logger.debug('Notification created but not broadcast (cleared or snoozed)');
      }
    } catch (err) {
      this.logger.debug('Failed to broadcast notification SSE', err as any);
    }
    return notif;
  }

  async notifyTaskAssignees(
    workspaceId: string,
    taskId: string,
    actorUserId: string,
    opts?: { type?: string; title?: string; message?: string; excludeUserIds?: string[] },
  ) {
    const assignees = await this.prisma.taskAssignee.findMany({ where: { taskId }, select: { userId: true } });
    const exclude = new Set(opts?.excludeUserIds ?? []);
    for (const a of assignees) {
      if (a.userId === actorUserId) continue;
      if (exclude.has(a.userId)) continue;
      await this.createNotification(
        workspaceId,
        a.userId,
        actorUserId,
        opts?.type ?? 'task:updated',
        opts?.title ?? 'Task updated',
        opts?.message ?? undefined,
        'task',
        taskId,
      );
    }
  }
}
