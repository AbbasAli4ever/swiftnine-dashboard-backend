import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@app/database';
import { NotificationsSseService } from './sse.service';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(private readonly prisma: PrismaService, private readonly sse: NotificationsSseService) {}

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
      },
    });

    // Broadcast to connected SSE clients for this member (keyed by workspaceMember.id)
    try {
      this.sse.broadcastToMember(member.id, 'notification:created', {
        id: notif.id,
        type: notif.type,
        title: notif.title,
        message: notif.message,
        referenceType: notif.referenceType,
        referenceId: notif.referenceId,
        actorId: notif.actorId,
        isRead: notif.isRead,
        createdAt: notif.createdAt,
      });
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
