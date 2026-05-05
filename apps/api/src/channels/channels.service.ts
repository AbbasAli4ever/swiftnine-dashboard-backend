import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '@app/database';
import type { CreateChannelDto } from './dto/create-channel.dto';
import type { UpdateChannelDto } from './dto/update-channel.dto';
import { NotificationsService } from '../notifications/notifications.service';
import type { Role } from '@app/database/generated/prisma/client';
import { ChatSystemService } from '../chat/chat-system.service';

@Injectable()
export class ChannelsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
    private readonly chatSystem: ChatSystemService,
  ) {}

  private channelLabel(name: string | null | undefined) {
    return name?.trim() || 'this channel';
  }

  private channelInclude() {
    return {
      members: {
        include: {
          user: { select: { id: true, fullName: true, avatarUrl: true } },
        },
      },
      project: true,
    };
  }

  async listByWorkspace(workspaceId: string, userId: string) {
    return this.prisma.channel.findMany({
      where: {
        workspaceId,
        OR: [
          { privacy: 'PUBLIC' },
          { privacy: 'PRIVATE', members: { some: { userId } } },
        ],
      },
      include: this.channelInclude(),
      orderBy: { createdAt: 'asc' },
    });
  }

  async listByProject(workspaceId: string, projectId: string, userId: string) {
    const project = await this.prisma.project.findFirst({
      where: { id: projectId, workspaceId, deletedAt: null },
      select: { id: true },
    });
    if (!project) throw new NotFoundException('Project not found in workspace');

    return this.prisma.channel.findMany({
      where: {
        workspaceId,
        projectId,
        OR: [
          { privacy: 'PUBLIC' },
          { privacy: 'PRIVATE', members: { some: { userId } } },
        ],
      },
      include: this.channelInclude(),
      orderBy: { createdAt: 'asc' },
    });
  }

  async create(workspaceId: string, userId: string, dto: CreateChannelDto) {
    // validate optional project belongs to workspace
    if (dto.projectId) {
      const project = await this.prisma.project.findFirst({
        where: { id: dto.projectId, workspaceId, deletedAt: null },
        select: { id: true },
      });
      if (!project)
        throw new NotFoundException('Project not found in workspace');
    }

    return this.prisma.$transaction(async (tx) => {
      const channel = await tx.channel.create({
        data: {
          workspaceId,
          projectId: dto.projectId ?? null,
          name: dto.name.trim(),
          description: dto.description?.trim() ?? null,
          privacy: dto.privacy ?? 'PUBLIC',
          createdBy: userId,
        },
      });

      // add creator as channel member with OWNER role
      await tx.channelMember.create({
        data: { channelId: channel.id, userId, role: 'OWNER' },
      });

      await this.chatSystem.emit(
        channel.id,
        {
          event: 'channel_created',
          actorUserId: userId,
          channelName: channel.name,
          privacy: channel.privacy,
          projectId: channel.projectId,
        },
        tx,
      );

      // log activity
      await tx.activityLog.create({
        data: {
          workspaceId,
          entityType: 'channel',
          entityId: channel.id,
          action: 'created',
          metadata: { channelName: channel.name },
          performedBy: userId,
        },
      });

      return tx.channel.findFirst({
        where: { id: channel.id },
        include: this.channelInclude(),
      });
    });
  }

  async updateChannel(
    workspaceId: string,
    channelId: string,
    callerUserId: string,
    dto: UpdateChannelDto,
  ) {
    const channel = await this.prisma.channel.findFirst({
      where: { id: channelId, workspaceId },
      select: { id: true, name: true, privacy: true },
    });
    if (!channel) throw new NotFoundException('Channel not found in workspace');

    const callerMembership = await this.prisma.channelMember.findFirst({
      where: { channelId, userId: callerUserId },
      select: { role: true },
    });
    if (
      !callerMembership ||
      (callerMembership.role !== 'OWNER' && callerMembership.role !== 'ADMIN')
    ) {
      throw new ForbiddenException(
        'Only channel admins can update the channel',
      );
    }

    const updateData: {
      name?: string;
      description?: string | null;
      privacy?: 'PUBLIC' | 'PRIVATE';
    } = {};
    if (dto.name !== undefined) updateData.name = dto.name.trim();
    if (Object.prototype.hasOwnProperty.call(dto, 'description')) {
      updateData.description =
        dto.description === null
          ? null
          : (dto.description ?? '').trim() || null;
    }
    if (dto.privacy !== undefined) updateData.privacy = dto.privacy;

    if (Object.keys(updateData).length === 0) {
      throw new BadRequestException('At least one field must be provided');
    }

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.channel.update({
        where: { id: channelId },
        data: updateData,
        include: this.channelInclude(),
      });

      if (updateData.name !== undefined && updateData.name !== channel.name) {
        await this.chatSystem.emit(
          channelId,
          {
            event: 'channel_renamed',
            actorUserId: callerUserId,
            name: updateData.name,
          },
          tx,
        );
      }

      if (
        updateData.privacy !== undefined &&
        updateData.privacy !== channel.privacy
      ) {
        await this.chatSystem.emit(
          channelId,
          {
            event: 'channel_privacy_changed',
            actorUserId: callerUserId,
            privacy: updateData.privacy,
          },
          tx,
        );
      }

      return updated;
    });
  }

  private mapRoleInput(input: string): Role {
    const normalized = (input ?? '').toLowerCase();
    if (normalized === 'admin') return 'ADMIN';
    return 'MEMBER';
  }

  async addChannelMember(
    workspaceId: string,
    channelId: string,
    callerUserId: string,
    userId: string,
    roleInput: string,
  ) {
    const role = this.mapRoleInput(roleInput) as Role;

    const channel = await this.prisma.channel.findFirst({
      where: { id: channelId, workspaceId },
    });
    if (!channel) throw new NotFoundException('Channel not found in workspace');

    const callerMembership = await this.prisma.channelMember.findFirst({
      where: { channelId, userId: callerUserId },
    });
    if (
      !callerMembership ||
      (callerMembership.role !== 'OWNER' && callerMembership.role !== 'ADMIN')
    ) {
      throw new ForbiddenException('Only channel admins can add members');
    }

    const workspaceMember = await this.prisma.workspaceMember.findFirst({
      where: { workspaceId, userId },
    });
    if (!workspaceMember) {
      throw new NotFoundException('User is not a member of this workspace');
    }

    return this.prisma
      .$transaction(async (tx) => {
        const existing = await tx.channelMember.findFirst({
          where: { channelId, userId },
        });
        let result;
        let systemEvent: 'member_joined' | 'member_role_changed' | null = null;
        if (existing) {
          if (existing.role === role) {
            result = existing;
          } else {
            result = await tx.channelMember.update({
              where: { id: existing.id },
              data: { role },
            });
            systemEvent = 'member_role_changed';
          }
        } else {
          result = await tx.channelMember.create({
            data: { channelId, userId, role },
          });
          systemEvent = 'member_joined';
        }

        await tx.activityLog.create({
          data: {
            workspaceId,
            entityType: 'channel',
            entityId: channelId,
            action: existing ? 'member_role_changed' : 'member_added',
            metadata: { userId, role },
            performedBy: callerUserId,
          },
        });

        if (systemEvent) {
          await this.chatSystem.emit(
            channelId,
            {
              event: systemEvent,
              userId,
              role,
              actorUserId: callerUserId,
            },
            tx,
          );
        }

        return result;
      })
      .then(async (created) => {
        // send notification only if newly created (not role-only updates)
        // note: `created` will be the resulting record; check created.createdAt vs existing isn't trivial here
        // We'll notify in both create and role-change scenarios; caller expects notification on addition.
        const actor = await this.prisma.user.findUnique({
          where: { id: callerUserId },
          select: { fullName: true },
        });
        const _role = role as Role;
        const roleLabel =
          _role === 'OWNER' ? 'owner' : _role === 'ADMIN' ? 'admin' : 'member';
        const channelName = this.channelLabel(channel.name);
        const title = `Added to channel ${channelName}`;
        const message = `${actor?.fullName ?? 'A member'} added you to ${channelName} as ${roleLabel}`;
        try {
          await this.notifications.createNotification(
            workspaceId,
            userId,
            callerUserId,
            'channel:member_added',
            title,
            message,
            'channel',
            channelId,
            false,
          );
        } catch (err) {
          // swallow notification errors — core operation succeeded
        }
        return created;
      });
  }

  async addChannelMembersBulk(
    workspaceId: string,
    channelId: string,
    callerUserId: string,
    members: Array<{ userId: string; role: string }>,
  ) {
    if (!Array.isArray(members) || members.length === 0)
      throw new BadRequestException('members must be a non-empty array');

    const channel = await this.prisma.channel.findFirst({
      where: { id: channelId, workspaceId },
    });
    if (!channel) throw new NotFoundException('Channel not found in workspace');

    const callerMembership = await this.prisma.channelMember.findFirst({
      where: { channelId, userId: callerUserId },
    });
    if (
      !callerMembership ||
      (callerMembership.role !== 'OWNER' && callerMembership.role !== 'ADMIN')
    ) {
      throw new ForbiddenException('Only channel admins can add members');
    }

    const userIds = Array.from(new Set(members.map((m) => m.userId)));
    const workspaceMembers = await this.prisma.workspaceMember.findMany({
      where: { workspaceId, userId: { in: userIds } },
      select: { userId: true },
    });
    const existingUserIds = new Set(workspaceMembers.map((w) => w.userId));
    const missing = userIds.filter((id) => !existingUserIds.has(id));
    if (missing.length > 0) {
      throw new BadRequestException(
        `Some users are not members of the workspace: ${missing.join(',')}`,
      );
    }

    const results: Array<any> = [];
    const toNotify: Array<{ userId: string; role: Role }> = [];

    await this.prisma.$transaction(async (tx) => {
      for (const m of members) {
        const role = this.mapRoleInput(m.role) as Role;
        const existing = await tx.channelMember.findFirst({
          where: { channelId, userId: m.userId },
        });
        let res;
        if (existing) {
          if (existing.role === role) {
            res = existing;
          } else {
            res = await tx.channelMember.update({
              where: { id: existing.id },
              data: { role },
            });
            await this.chatSystem.emit(
              channelId,
              {
                event: 'member_role_changed',
                userId: m.userId,
                role,
                actorUserId: callerUserId,
              },
              tx,
            );
          }
        } else {
          res = await tx.channelMember.create({
            data: { channelId, userId: m.userId, role },
          });
          toNotify.push({ userId: m.userId, role });
          await this.chatSystem.emit(
            channelId,
            {
              event: 'member_joined',
              userId: m.userId,
              role,
              actorUserId: callerUserId,
            },
            tx,
          );
        }

        await tx.activityLog.create({
          data: {
            workspaceId,
            entityType: 'channel',
            entityId: channelId,
            action: existing ? 'member_role_changed' : 'member_added',
            metadata: { userId: m.userId, role },
            performedBy: callerUserId,
          },
        });

        results.push(res);
      }
    });

    // send notifications for newly added members
    const actor = await this.prisma.user.findUnique({
      where: { id: callerUserId },
      select: { fullName: true },
    });
    const channelName = this.channelLabel(channel.name);
    const title = `Added to channel ${channelName}`;
    for (const n of toNotify) {
      const _nRole = n.role as Role;
      const roleLabel =
        _nRole === 'OWNER' ? 'owner' : _nRole === 'ADMIN' ? 'admin' : 'member';
      const message = `${actor?.fullName ?? 'A member'} added you to ${channelName} as ${roleLabel}`;
      try {
        // don't await to speed up; but keep in try/catch
        // eslint-disable-next-line no-await-in-loop
        await this.notifications.createNotification(
          workspaceId,
          n.userId,
          callerUserId,
          'channel:member_added',
          title,
          message,
          'channel',
          channelId,
          false,
        );
      } catch (err) {
        // ignore
      }
    }

    return results;
  }

  async removeChannelMember(
    workspaceId: string,
    channelId: string,
    callerUserId: string,
    channelMemberId: string,
  ) {
    const cm = await this.prisma.channelMember.findUnique({
      where: { id: channelMemberId },
      include: { channel: true },
    });
    if (
      !cm ||
      cm.channel.id !== channelId ||
      cm.channel.workspaceId !== workspaceId
    ) {
      throw new NotFoundException('Channel member not found in workspace');
    }

    // caller must be an admin (OWNER) on the channel
    const caller = await this.prisma.channelMember.findFirst({
      where: { channelId, userId: callerUserId },
    });
    if (!caller || (caller.role !== 'OWNER' && caller.role !== 'ADMIN')) {
      throw new ForbiddenException('Only channel admins can remove members');
    }

    // cannot kick yourself
    if (cm.userId === callerUserId) {
      throw new ForbiddenException('Cannot remove yourself from the channel');
    }

    // Cannot remove channel owner at all
    if (cm.role === 'OWNER') {
      throw new ForbiddenException('Cannot remove channel owner');
    }

    // Admin can only be removed by owner
    if (cm.role === 'ADMIN' && caller.role !== 'OWNER') {
      throw new ForbiddenException('Only channel owner can remove an admin');
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.channelMember.delete({ where: { id: channelMemberId } });
      await this.chatSystem.emit(
        channelId,
        {
          event: 'member_removed',
          userId: cm.userId,
          role: cm.role,
          actorUserId: callerUserId,
        },
        tx,
      );
      await tx.activityLog.create({
        data: {
          workspaceId,
          entityType: 'channel',
          entityId: channelId,
          action: 'member_removed',
          metadata: { userId: cm.userId, role: cm.role },
          performedBy: callerUserId,
        },
      });
    });

    // notify removed user
    try {
      const actor = await this.prisma.user.findUnique({
        where: { id: callerUserId },
        select: { fullName: true },
      });
      const _cmRole = cm.role as Role;
      const roleLabel =
        _cmRole === 'OWNER'
          ? 'owner'
          : _cmRole === 'ADMIN'
            ? 'admin'
            : 'member';
      const channelName = this.channelLabel(cm.channel.name);
      const title = `Removed from channel ${channelName}`;
      const message = `${actor?.fullName ?? 'A member'} removed you from ${channelName} (was ${roleLabel})`;
      await this.notifications.createNotification(
        workspaceId,
        cm.userId,
        callerUserId,
        'channel:member_removed',
        title,
        message,
        'channel',
        channelId,
        false,
      );
    } catch (err) {
      // ignore notification failures
    }

    return true;
  }
}
