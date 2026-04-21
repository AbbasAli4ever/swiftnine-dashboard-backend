import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@app/database';
import type { Prisma } from '@app/database/generated/prisma/client';
import { TAG_NAME_TAKEN, TAG_NOT_FOUND, TAG_SELECT } from './tag.constants';
import type { CreateTagDto } from './dto/create-tag.dto';
import type { UpdateTagDto } from './dto/update-tag.dto';

export type TagData = Prisma.TagGetPayload<{ select: typeof TAG_SELECT }>;

@Injectable()
export class TagService {
  constructor(private readonly prisma: PrismaService) {}

  async create(workspaceId: string, userId: string, dto: CreateTagDto): Promise<TagData> {
    const name = dto.name.trim();

    const exists = await this.prisma.tag.findFirst({
      where: { workspaceId, name, deletedAt: null },
      select: { id: true },
    });
    if (exists) throw new ConflictException(TAG_NAME_TAKEN);

    const tag = await this.prisma.tag.create({
      data: { workspaceId, name, color: dto.color },
      select: TAG_SELECT,
    });

    await this.prisma.activityLog.create({
      data: {
        workspaceId,
        entityType: 'tag',
        entityId: tag.id,
        action: 'created',
        metadata: { tagName: tag.name },
        performedBy: userId,
      },
    });

    return tag;
  }

  async findAll(workspaceId: string): Promise<TagData[]> {
    return this.prisma.tag.findMany({
      where: { workspaceId, deletedAt: null },
      select: TAG_SELECT,
      orderBy: { name: 'asc' },
    });
  }

  async update(workspaceId: string, userId: string, tagId: string, dto: UpdateTagDto): Promise<TagData> {
    const tag = await this.findTagOrThrow(workspaceId, tagId);
    const updateData: Prisma.TagUpdateInput = {};

    if (dto.name !== undefined) {
      const trimmed = dto.name.trim();
      if (trimmed !== tag.name) {
        const conflict = await this.prisma.tag.findFirst({
          where: { workspaceId, name: trimmed, deletedAt: null, id: { not: tagId } },
          select: { id: true },
        });
        if (conflict) throw new ConflictException(TAG_NAME_TAKEN);
        updateData.name = trimmed;
      }
    }

    if (dto.color !== undefined) updateData.color = dto.color;

    if (Object.keys(updateData).length === 0) return tag;

    const updated = await this.prisma.tag.update({
      where: { id: tagId },
      data: updateData,
      select: TAG_SELECT,
    });

    await this.prisma.activityLog.create({
      data: {
        workspaceId,
        entityType: 'tag',
        entityId: tagId,
        action: 'updated',
        metadata: {},
        performedBy: userId,
      },
    });

    return updated;
  }

  async remove(workspaceId: string, userId: string, tagId: string): Promise<void> {
    const tag = await this.findTagOrThrow(workspaceId, tagId);

    await this.prisma.$transaction(async (tx) => {
      await tx.tag.update({ where: { id: tagId }, data: { deletedAt: new Date() } });
      await tx.activityLog.create({
        data: {
          workspaceId,
          entityType: 'tag',
          entityId: tagId,
          action: 'deleted',
          metadata: { tagName: tag.name },
          performedBy: userId,
        },
      });
    });
  }

  // --- Private helpers ---

  private async findTagOrThrow(workspaceId: string, tagId: string): Promise<TagData> {
    const tag = await this.prisma.tag.findFirst({
      where: { id: tagId, workspaceId, deletedAt: null },
      select: TAG_SELECT,
    });
    if (!tag) throw new NotFoundException(TAG_NOT_FOUND);
    return tag;
  }
}
