import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@app/database';
import type { ChannelJoinRequestStatus } from '@app/database/generated/prisma/client';
import { ChatSystemService } from '../../chat/chat-system.service';
import { NotificationsService } from '../../notifications/notifications.service';

const JOIN_REQUEST_STATUSES: ChannelJoinRequestStatus[] = [
  'PENDING',
  'APPROVED',
  'REJECTED',
];

@Injectable()
export class JoinRequestsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly chatSystem: ChatSystemService,
    private readonly notifications: NotificationsService,
  ) {}

  private channelLabel(name: string | null | undefined) {
    return name?.trim() || 'this channel';
  }

  private joinRequestInclude() {
    return {
      user: {
        select: { id: true, fullName: true, avatarUrl: true },
      },
      decidedBy: {
        select: { id: true, fullName: true, avatarUrl: true },
      },
    };
  }

  private async getChannelOrThrow(workspaceId: string, channelId: string) {
    const channel = await this.prisma.channel.findFirst({
      where: { id: channelId, workspaceId },
      select: {
        id: true,
        workspaceId: true,
        kind: true,
        name: true,
        privacy: true,
      },
    });
    if (!channel) {
      throw new NotFoundException('Channel not found in workspace');
    }
    return channel;
  }

  private async assertChannelAdmin(channelId: string, userId: string) {
    const membership = await this.prisma.channelMember.findFirst({
      where: { channelId, userId },
      select: { role: true },
    });
    if (
      !membership ||
      (membership.role !== 'OWNER' && membership.role !== 'ADMIN')
    ) {
      throw new ForbiddenException(
        'Only channel admins can manage join requests',
      );
    }
    return membership;
  }

  async createRequest(
    workspaceId: string,
    channelId: string,
    requesterUserId: string,
  ) {
    const channel = await this.getChannelOrThrow(workspaceId, channelId);

    if (channel.kind !== 'CHANNEL') {
      throw new BadRequestException(
        'Join requests are only supported for channels',
      );
    }
    if (channel.privacy !== 'PUBLIC') {
      throw new ForbiddenException('Private channels are invite-only');
    }

    const existingMember = await this.prisma.channelMember.findFirst({
      where: { channelId, userId: requesterUserId },
      select: { id: true },
    });
    if (existingMember) {
      throw new BadRequestException('You are already a member of this channel');
    }

    const existingPending = await this.prisma.channelJoinRequest.findFirst({
      where: {
        channelId,
        userId: requesterUserId,
        status: 'PENDING',
      },
      select: { id: true },
    });
    if (existingPending) {
      throw new BadRequestException(
        'A join request is already pending for this channel',
      );
    }

    return this.prisma.channelJoinRequest.create({
      data: {
        channelId,
        userId: requesterUserId,
      },
      include: this.joinRequestInclude(),
    });
  }

  async listRequests(
    workspaceId: string,
    channelId: string,
    callerUserId: string,
    status?: string,
  ) {
    await this.getChannelOrThrow(workspaceId, channelId);
    await this.assertChannelAdmin(channelId, callerUserId);

    const normalizedStatus = status?.toUpperCase();
    if (
      normalizedStatus &&
      !JOIN_REQUEST_STATUSES.includes(
        normalizedStatus as ChannelJoinRequestStatus,
      )
    ) {
      throw new BadRequestException('Invalid join request status');
    }

    return this.prisma.channelJoinRequest.findMany({
      where: {
        channelId,
        ...(normalizedStatus
          ? { status: normalizedStatus as ChannelJoinRequestStatus }
          : {}),
      },
      include: this.joinRequestInclude(),
      orderBy: [{ requestedAt: 'desc' }, { id: 'desc' }],
    });
  }

  async getMyRequestStatus(
    workspaceId: string,
    channelId: string,
    userId: string,
  ) {
    await this.getChannelOrThrow(workspaceId, channelId);

    return this.prisma.channelJoinRequest.findFirst({
      where: { channelId, userId },
      include: this.joinRequestInclude(),
      orderBy: [{ requestedAt: 'desc' }, { id: 'desc' }],
    });
  }

  async decideRequest(
    workspaceId: string,
    channelId: string,
    requestId: string,
    callerUserId: string,
    decision: 'approve' | 'reject',
  ) {
    const channel = await this.getChannelOrThrow(workspaceId, channelId);
    await this.assertChannelAdmin(channelId, callerUserId);

    const request = await this.prisma.channelJoinRequest.findUnique({
      where: { id: requestId },
      include: this.joinRequestInclude(),
    });
    if (!request || request.channelId !== channelId) {
      throw new NotFoundException('Join request not found for this channel');
    }
    if (request.status !== 'PENDING') {
      throw new BadRequestException(
        'Only pending join requests can be decided',
      );
    }

    const decisionStatus: ChannelJoinRequestStatus =
      decision === 'approve' ? 'APPROVED' : 'REJECTED';

    const updated = await this.prisma.$transaction(async (tx) => {
      const updatedRequest = await tx.channelJoinRequest.update({
        where: { id: requestId },
        data: {
          status: decisionStatus,
          decidedById: callerUserId,
          decidedAt: new Date(),
        },
        include: this.joinRequestInclude(),
      });

      if (decisionStatus === 'APPROVED') {
        const workspaceMember = await tx.workspaceMember.findFirst({
          where: { workspaceId, userId: request.userId, deletedAt: null },
          select: { id: true },
        });
        if (!workspaceMember) {
          throw new BadRequestException(
            'Requester is no longer a member of this workspace',
          );
        }

        const existingMember = await tx.channelMember.findFirst({
          where: { channelId, userId: request.userId },
          select: { id: true },
        });

        if (!existingMember) {
          await tx.channelMember.create({
            data: {
              channelId,
              userId: request.userId,
              role: 'MEMBER',
            },
          });

          await this.chatSystem.emit(
            channelId,
            {
              event: 'member_joined',
              userId: request.userId,
              actorUserId: callerUserId,
              source: 'join_request',
            },
            tx,
          );
        }

        await tx.activityLog.create({
          data: {
            workspaceId,
            entityType: 'channel',
            entityId: channelId,
            action: 'join_request_approved',
            metadata: { requestId, userId: request.userId },
            performedBy: callerUserId,
          },
        });
      } else {
        await tx.activityLog.create({
          data: {
            workspaceId,
            entityType: 'channel',
            entityId: channelId,
            action: 'join_request_rejected',
            metadata: { requestId, userId: request.userId },
            performedBy: callerUserId,
          },
        });
      }

      return updatedRequest;
    });

    if (decisionStatus === 'APPROVED') {
      try {
        const actor = await this.prisma.user.findUnique({
          where: { id: callerUserId },
          select: { fullName: true },
        });
        const channelName = this.channelLabel(channel.name);
        await this.notifications.createNotification(
          workspaceId,
          request.userId,
          callerUserId,
          'channel:member_added',
          `Added to channel ${channelName}`,
          `${actor?.fullName ?? 'A member'} approved your request to join ${channelName} as member`,
          'channel',
          channelId,
          false,
        );
      } catch {}
    }

    return updated;
  }
}
