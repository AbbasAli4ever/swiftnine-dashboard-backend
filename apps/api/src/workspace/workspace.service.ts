import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@app/database';
import type { Prisma, Role } from '@app/database/generated/prisma/client';
import type { CreateWorkspaceDto } from './dto/create-workspace.dto';
import type { UpdateWorkspaceDto } from './dto/update-workspace.dto';

const WORKSPACE_NOT_FOUND = 'Workspace not found';
const OWNER_ONLY = 'Only the workspace owner can perform this action';

const WORKSPACE_SELECT = {
  id: true,
  name: true,
  logoUrl: true,
  createdBy: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.WorkspaceSelect;

export type WorkspaceData = Prisma.WorkspaceGetPayload<{
  select: typeof WORKSPACE_SELECT;
}>;

@Injectable()
export class WorkspaceService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateWorkspaceDto): Promise<WorkspaceData> {
    return this.prisma.$transaction(async (tx) => {
      const workspace = await tx.workspace.create({
        data: {
          name: dto.name.trim(),
          logoUrl: dto.logoUrl ?? null,
          createdBy: userId,
        },
        select: WORKSPACE_SELECT,
      });

      await tx.workspaceMember.create({
        data: {
          workspaceId: workspace.id,
          userId,
          role: 'OWNER',
        },
      });

      await tx.activityLog.create({
        data: {
          workspaceId: workspace.id,
          entityType: 'workspace',
          entityId: workspace.id,
          action: 'created',
          metadata: { workspaceName: workspace.name },
          performedBy: userId,
        },
      });

      return workspace;
    });
  }

  async findAllForUser(userId: string): Promise<WorkspaceData[]> {
    const memberships = await this.prisma.workspaceMember.findMany({
      where: {
        userId,
        deletedAt: null,
        workspace: { deletedAt: null },
      },
      select: {
        workspace: { select: WORKSPACE_SELECT },
      },
      orderBy: { createdAt: 'asc' },
    });

    return memberships.map((m) => m.workspace);
  }

  async findOne(workspaceId: string, userId: string): Promise<WorkspaceData & { memberCount: number }> {
    const [workspace, memberCount] = await Promise.all([
      this.prisma.workspace.findFirst({
        where: { id: workspaceId, deletedAt: null },
        select: WORKSPACE_SELECT,
      }),
      this.prisma.workspaceMember.count({
        where: { workspaceId, deletedAt: null },
      }),
    ]);

    if (!workspace) throw new NotFoundException(WORKSPACE_NOT_FOUND);

    return { ...workspace, memberCount };
  }

  async update(
    workspaceId: string,
    userId: string,
    role: Role,
    dto: UpdateWorkspaceDto,
  ): Promise<WorkspaceData> {
    if (role !== 'OWNER') throw new ForbiddenException(OWNER_ONLY);

    const workspace = await this.prisma.workspace.findFirst({
      where: { id: workspaceId, deletedAt: null },
      select: WORKSPACE_SELECT,
    });
    if (!workspace) throw new NotFoundException(WORKSPACE_NOT_FOUND);

    const updateData: Prisma.WorkspaceUpdateInput = {};
    const logEntries: Array<{ fieldName: string; oldValue: string | null; newValue: string | null }> = [];

    if (dto.name !== undefined && dto.name !== workspace.name) {
      updateData.name = dto.name.trim();
      logEntries.push({ fieldName: 'name', oldValue: workspace.name, newValue: dto.name.trim() });
    }

    if (dto.logoUrl !== undefined && dto.logoUrl !== workspace.logoUrl) {
      updateData.logoUrl = dto.logoUrl;
      logEntries.push({ fieldName: 'logoUrl', oldValue: workspace.logoUrl ?? null, newValue: dto.logoUrl ?? null });
    }

    if (Object.keys(updateData).length === 0) return workspace;

    const updated = await this.prisma.workspace.update({
      where: { id: workspaceId },
      data: updateData,
      select: WORKSPACE_SELECT,
    });

    if (logEntries.length > 0) {
      await this.prisma.activityLog.createMany({
        data: logEntries.map((entry) => ({
          workspaceId,
          entityType: 'workspace',
          entityId: workspaceId,
          action: 'updated',
          fieldName: entry.fieldName,
          oldValue: entry.oldValue,
          newValue: entry.newValue,
          metadata: { workspaceName: updated.name },
          performedBy: userId,
        })),
      });
    }

    return updated;
  }

  async remove(workspaceId: string, userId: string, role: Role): Promise<void> {
    if (role !== 'OWNER') throw new ForbiddenException(OWNER_ONLY);

    const workspace = await this.prisma.workspace.findFirst({
      where: { id: workspaceId, deletedAt: null },
      select: { id: true, name: true },
    });
    if (!workspace) throw new NotFoundException(WORKSPACE_NOT_FOUND);

    await this.prisma.$transaction([
      this.prisma.workspace.update({
        where: { id: workspaceId },
        data: { deletedAt: new Date() },
      }),
      this.prisma.activityLog.create({
        data: {
          workspaceId,
          entityType: 'workspace',
          entityId: workspaceId,
          action: 'deleted',
          metadata: { workspaceName: workspace.name },
          performedBy: userId,
        },
      }),
    ]);
  }
}
