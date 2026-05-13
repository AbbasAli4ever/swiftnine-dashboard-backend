import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { PrismaService } from '@app/database';
import { ProjectSecurityService } from '../project-security/project-security.service';
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
  private retentionWatcher?: NodeJS.Timeout;

  constructor(
    private readonly prisma: PrismaService,
    private readonly projectSecurity: ProjectSecurityService,
    private readonly sse: NotificationsSseService,
  ) {
    this.startSnoozeWatcher();
    this.startRetentionWatcher();
  }

  onModuleDestroy() {
    if (this.snoozeWatcher) clearInterval(this.snoozeWatcher);
    if (this.retentionWatcher) clearInterval(this.retentionWatcher);
  }

  private startSnoozeWatcher() {
    // unsnooze expired notifications every minute
    this.snoozeWatcher = setInterval(() => {
      this.processExpiredSnoozes().catch((err) =>
        this.logger.debug('Snooze watcher error', err as any),
      );
    }, 60_000);
  }

  private startRetentionWatcher() {
    this.retentionWatcher = setInterval(() => {
      this.deleteExpiredNotifications().catch((err) =>
        this.logger.debug('Retention watcher error', err as any),
      );
    }, this.retentionCleanupIntervalMs());
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

      if (!(await this.isNotificationVisibleToUser(updated.userId, updated))) {
        continue;
      }

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

  async deleteExpiredNotifications(now = new Date()) {
    const retentionDays = this.notificationRetentionDays();
    const cutoff = new Date(now.getTime() - retentionDays * 24 * 60 * 60 * 1000);

    const result = await this.prisma.notification.deleteMany({
      where: { createdAt: { lt: cutoff } },
    });

    if (result.count > 0) {
      this.logger.log(
        `Deleted ${result.count} notifications older than ${retentionDays} days`,
      );
    }

    return result.count;
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

  private notificationRetentionDays() {
    const raw = Number.parseInt(
      process.env['NOTIFICATIONS_RETENTION_DAYS'] ?? '90',
      10,
    );
    return Number.isNaN(raw) || raw < 1 ? 90 : raw;
  }

  private retentionCleanupIntervalMs() {
    const raw = Number.parseInt(
      process.env['NOTIFICATIONS_RETENTION_CLEANUP_INTERVAL_MS'] ??
        `${24 * 60 * 60 * 1000}`,
      10,
    );
    return Number.isNaN(raw) || raw < 60_000 ? 24 * 60 * 60 * 1000 : raw;
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

  private notificationReferenceKey(notification: NotificationLike) {
    if (!notification.referenceType || !notification.referenceId) return null;
    return `${notification.referenceType}:${notification.referenceId}`;
  }

  private async resolveNotificationProjectIds(
    notifications: NotificationLike[],
  ): Promise<Map<string, string | null>> {
    const result = new Map<string, string | null>();
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
    const channelMessageIds = Array.from(
      new Set(
        notifications
          .filter((n) => n.referenceType === 'channel_message' && n.referenceId)
          .map((n) => n.referenceId as string),
      ),
    );

    if (taskIds.length > 0) {
      const tasks = await this.prisma.task.findMany({
        where: { id: { in: taskIds }, deletedAt: null },
        select: { id: true, list: { select: { projectId: true } } },
      });
      tasks.forEach((task) => {
        result.set(`task:${task.id}`, task.list?.projectId ?? null);
      });
    }

    if (commentIds.length > 0) {
      const comments = await this.prisma.comment.findMany({
        where: { id: { in: commentIds }, deletedAt: null },
        select: {
          id: true,
          task: { select: { list: { select: { projectId: true } } } },
        },
      });
      comments.forEach((comment) => {
        result.set(
          `comment:${comment.id}`,
          comment.task?.list?.projectId ?? null,
        );
      });
    }

    if (channelMessageIds.length > 0) {
      const messages = await this.prisma.channelMessage.findMany({
        where: { id: { in: channelMessageIds }, deletedAt: null },
        select: {
          id: true,
          channel: { select: { projectId: true } },
        },
      });
      messages.forEach((message) => {
        result.set(
          `channel_message:${message.id}`,
          message.channel?.projectId ?? null,
        );
      });
    }

    return result;
  }

  private isProjectBoundReference(notification: NotificationLike) {
    return ['task', 'comment', 'channel_message'].includes(
      notification.referenceType ?? '',
    );
  }

  async filterVisibleNotificationsForUser<T extends NotificationLike>(
    userId: string,
    notifications: T[],
  ): Promise<T[]> {
    if (notifications.length === 0) return notifications;

    const projectIdsByReference =
      await this.resolveNotificationProjectIds(notifications);
    const referencedProjectIds = Array.from(
      new Set(
        Array.from(projectIdsByReference.values()).filter(Boolean) as string[],
      ),
    );

    const projects =
      referencedProjectIds.length === 0
        ? []
        : await this.prisma.project.findMany({
            where: { id: { in: referencedProjectIds }, deletedAt: null },
            select: { id: true, passwordHash: true },
          });

    const projectLockState = new Map(
      projects.map((project) => [project.id, Boolean(project.passwordHash)]),
    );
    const lockedProjectIds = projects
      .filter((project) => Boolean(project.passwordHash))
      .map((project) => project.id);
    const unlockedProjectIds =
      lockedProjectIds.length === 0
        ? new Set<string>()
        : await this.projectSecurity.activeUnlockedProjectIds(
            lockedProjectIds,
            userId,
          );

    return notifications.filter((notification) => {
      const key = this.notificationReferenceKey(notification);
      if (!key) return true;

      const hasResolvedReference = projectIdsByReference.has(key);
      const projectId = projectIdsByReference.get(key);
      if (!projectId) {
        return hasResolvedReference || !this.isProjectBoundReference(notification);
      }

      const isLocked = projectLockState.get(projectId);
      if (isLocked === undefined) return false;
      return !isLocked || unlockedProjectIds.has(projectId);
    });
  }

  async isNotificationVisibleToUser(
    userId: string,
    notification: NotificationLike,
  ) {
    const visible = await this.filterVisibleNotificationsForUser(userId, [
      notification,
    ]);
    return visible.length > 0;
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
      workspaceId: enriched.workspaceId,
      referenceType: enriched.referenceType,
      referenceId: enriched.referenceId,
      taskId: enriched.taskId,
      taskName: enriched.taskName,
      commentId: enriched.commentId,
      commentName: enriched.commentName,
      // explicit reply/parent ids for comment replies (may be provided via meta)
      replyCommentId: enriched.referenceType === 'comment' ? (enriched.referenceId ?? null) : null,
      repliedToCommentId: (enriched as any).parentCommentId ?? null,
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
    meta?: Record<string, any>,
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

    if (
      !(await this.isNotificationVisibleToUser(member.userId, {
        referenceType,
        referenceId,
      }))
    ) {
      return null;
    }

    const notif = await this.prisma.notification.create({
      data: {
        userId: member.userId,
        workspaceId,
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
        const payloadSource = meta ? { ...notif, ...meta } : notif;
        this.sse.broadcastToMember(
          member.id,
          'notification:created',
          await this.toNotificationPayload(payloadSource as NotificationLike),
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
