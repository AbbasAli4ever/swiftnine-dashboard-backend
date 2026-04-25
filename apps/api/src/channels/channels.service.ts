import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@app/database';
import type { CreateChannelDto } from './dto/create-channel.dto';

@Injectable()
export class ChannelsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(workspaceId: string, userId: string, dto: CreateChannelDto) {
    // validate optional project belongs to workspace
    if (dto.projectId) {
      const project = await this.prisma.project.findFirst({
        where: { id: dto.projectId, workspaceId, deletedAt: null },
        select: { id: true },
      });
      if (!project) throw new NotFoundException('Project not found in workspace');
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
      await tx.channelMember.create({ data: { channelId: channel.id, userId, role: 'OWNER' } });

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
        include: { members: { include: { user: { select: { id: true, fullName: true, avatarUrl: true } } } }, project: true },
      });
    });
  }
}
