import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { PrismaService } from '@app/database';
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

@Injectable()
export class NotificationsService implements OnModuleDestroy {
  private readonly logger = new Logger(NotificationsService.name);
  private snoozeWatcher?: NodeJS.Timeout;

  constructor(
    private readonly prisma: PrismaService,
    private readonly sse: NotificationsSseService,
  ) {
    this.startSnoozeWatcher();
  }

  onModuleDestroy() {
    if (this.snoozeWatcher) clearInterval(this.snoozeWatcher);
  }

  private startSnoozeWatcher() {
    // unsnooze expired notifications every minute
    this.snoozeWatcher = setInterval(() => {
      this.processExpiredSnoozes().catch((err) =>
        this.logger.debug('Snooze watcher error', err as any),
      );
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

      const payload = await this.toNotificationPayload(updated);

      for (const m of members) {
        try {
          this.sse.broadcastToMember(m.id, 'notification:updated', payload);
        } catch (err) {
          this.logger.debug(
            'Failed broadcasting unsnoozed notification',
            err as any,
          );
        }
      }
    }
  }

  private async resolveWorkspaceMember(
    workspaceId: string,
    memberIdOrUserId: string,
  ) {
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

  private getTaskId(
    notification: NotificationLike,
    commentTaskIds: Map<string, string>,
  ) {
    if (notification.referenceType === 'task')
      return notification.referenceId ?? null;
    if (notification.referenceType === 'comment' && notification.referenceId) {
      return commentTaskIds.get(notification.referenceId) ?? null;
    }
    return null;
  }

  async addTaskIds<T extends NotificationLike>(
    notifications: T[],
  ): Promise<Array<EnrichedNotification<T>>> {
    // ── collect ids by reference type ───────────────────────────────────
    const taskIds = Array.from(
      new Set(
        notifications
          .filter((n) => n.referenceType === 'task' && n.referenceId)
          .map((n) => n.referenceId as string),
      ),
    );

    const commentIds = Array.from(
      new Set(
        notifications
          .filter((n) => n.referenceType === 'comment' && n.referenceId)
          .map((n) => n.referenceId as string),
      ),
    );

    // ── fetch tasks ──────────────────────────────────────────────────────
    const tasks =
      taskIds.length === 0
        ? []
        : await this.prisma.task.findMany({
            where: { id: { in: taskIds } },
            select: { id: true, title: true },
          });
    const taskMap = new Map(tasks.map((t) => [t.id, t.title]));

    // ── fetch comments (with their parent task) ──────────────────────────
    const comments =
      commentIds.length === 0
        ? []
        : await this.prisma.comment.findMany({
            where: { id: { in: commentIds } },
            select: { id: true, taskId: true, content: true },
          });
    const commentTaskIds = new Map(
      comments.map((c) => [c.id, c.taskId]),
    );
    const commentContentMap = new Map(
      comments.map((c) => [c.id, (c.content ?? '').toString().slice(0, 200)]),
    );

    // ── collect any task ids from comments so we can resolve their names ─
    const commentParentTaskIds = Array.from(
      new Set(comments.map((c) => c.taskId).filter(Boolean) as string[]),
    ).filter((id) => !taskMap.has(id));

    if (commentParentTaskIds.length > 0) {
      const parentTasks = await this.prisma.task.findMany({
        where: { id: { in: commentParentTaskIds } },
        select: { id: true, title: true },
      });
      parentTasks.forEach((t) => taskMap.set(t.id, t.title));
    }

    // ── enrich ───────────────────────────────────────────────────────────
    return notifications.map((notification) => {
      const resolvedTaskId = this.getTaskId(notification, commentTaskIds);
      const isComment = notification.referenceType === 'comment';

      return {
        ...notification,
        taskId: resolvedTaskId,
        taskName: resolvedTaskId ? (taskMap.get(resolvedTaskId) ?? null) : null,
        commentId: isComment ? (notification.referenceId ?? null) : null,
        commentName: isComment && notification.referenceId
          ? (commentContentMap.get(notification.referenceId) ?? null)
          : null,
      };
    });
  }

  async addTaskId<T extends NotificationLike>(
    notification: T,
  ): Promise<EnrichedNotification<T>> {
    const [enriched] = await this.addTaskIds([notification]);
    return enriched;
  }

  async toNotificationPayload(notification: NotificationLike) {
    const enriched = await this.addTaskId(notification);
    return {
      id: enriched.id,
      type: enriched.type,
      title: enriched.title,
      message: enriched.message,
      referenceType: enriched.referenceType,
      referenceId: enriched.referenceId,
      taskId: enriched.taskId,
      taskName: enriched.taskName,
      commentId: enriched.commentId,
      commentName: enriched.commentName,
      actorId: enriched.actorId,
      isRead: enriched.isRead,
      isCleared: enriched.isCleared,
      isSnoozed: enriched.isSnoozed,
      isCommented: enriched.isCommented,
      snoozedAt: enriched.snoozedAt,
      createdAt: enriched.createdAt,
    };
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
    isCommented?: boolean,
  ) {
    const member = await this.resolveWorkspaceMember(
      workspaceId,
      targetMemberIdOrUserId,
    );
    if (!member) {
      this.logger.debug(
        `Notification: no member found for target ${targetMemberIdOrUserId} workspace=${workspaceId}`,
      );
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
        isCommented: isCommented ?? false,
        isCleared: false,
        isSnoozed: false,
        snoozedAt: null,
      },
    });
    try {
      if (!notif.isCleared && !notif.isSnoozed) {
        this.sse.broadcastToMember(
          member.id,
          'notification:created',
          await this.toNotificationPayload(notif),
        );
      } else {
        this.logger.debug(
          'Notification created but not broadcast (cleared or snoozed)',
        );
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
    opts?: {
      type?: string;
      title?: string;
      message?: string;
      excludeUserIds?: string[];
    },
  ) {
    const assignees = await this.prisma.taskAssignee.findMany({
      where: { taskId },
      select: { userId: true },
    });
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
