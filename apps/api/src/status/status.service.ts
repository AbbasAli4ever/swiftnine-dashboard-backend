import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@app/database';
import type {
  Prisma,
  Role,
  StatusGroup,
} from '@app/database/generated/prisma/client';
import {
  CLOSED_GROUP_REORDER_FORBIDDEN,
  DEFAULT_STATUS_TEMPLATE,
  DELETE_REPLACEMENT_REQUIRED,
  INVALID_REORDER_PAYLOAD,
  INVALID_REPLACEMENT_STATUS,
  OWNER_ONLY,
  PROJECT_NOT_FOUND,
  PROTECTED_STATUS_DELETE_FORBIDDEN,
  PROTECTED_STATUS_UPDATE_FORBIDDEN,
  STATUS_NOT_FOUND,
  STATUS_SELECT,
} from './status.constants';
import type { CreateStatusDto } from './dto/create-status.dto';
import type { UpdateStatusDto } from './dto/update-status.dto';
import type { DeleteStatusDto } from './dto/delete-status.dto';
import type { ReorderStatusesDto } from './dto/reorder-statuses.dto';
import type { DefaultStatusesDto } from './dto/default-statuses.dto';

export type StatusData = Prisma.StatusGetPayload<{ select: typeof STATUS_SELECT }>;
export type GroupedStatuses = {
  projectId: string;
  groups: {
    notStarted: StatusData[];
    active: StatusData[];
    done: StatusData[];
    closed: StatusData[];
  };
};

const STATUS_NAME_TAKEN = 'A status with this name already exists in this project';

@Injectable()
export class StatusService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    workspaceId: string,
    userId: string,
    role: Role,
    dto: CreateStatusDto,
  ): Promise<StatusData> {
    this.assertOwner(role);
    const project = await this.findProjectOrThrow(workspaceId, dto.projectId);
    const name = dto.name.trim();

    await this.assertUniqueStatusName(project.id, name);

    const status = await this.prisma.status.create({
      data: {
        projectId: project.id,
        name,
        color: dto.color ?? '#94a3b8',
        group: dto.group,
        position: await this.getNextPosition(project.id, dto.group),
        isDefault: false,
        isProtected: false,
        isClosed: false,
      },
      select: STATUS_SELECT,
    });

    await this.prisma.activityLog.create({
      data: {
        workspaceId,
        entityType: 'status',
        entityId: status.id,
        action: 'created',
        metadata: {
          projectName: project.name,
          statusGroup: status.group,
        },
        performedBy: userId,
      },
    });

    return status;
  }

  async findAll(workspaceId: string, projectId: string): Promise<GroupedStatuses> {
    await this.findProjectOrThrow(workspaceId, projectId);
    const statuses = await this.listProjectStatuses(projectId);
    return this.groupStatuses(projectId, statuses);
  }

  async findOne(workspaceId: string, statusId: string): Promise<StatusData> {
    return this.findStatusOrThrow(workspaceId, statusId);
  }

  async update(
    workspaceId: string,
    statusId: string,
    userId: string,
    role: Role,
    dto: UpdateStatusDto,
  ): Promise<StatusData> {
    this.assertOwner(role);
    const status = await this.findStatusOrThrow(workspaceId, statusId, {
      project: { select: { name: true } },
    });

    if (status.isProtected && dto.color !== undefined) {
      throw new BadRequestException(PROTECTED_STATUS_UPDATE_FORBIDDEN);
    }

    const updateData: Prisma.StatusUpdateInput = {};
    const logEntries: Array<{ fieldName: string; oldValue: string | null; newValue: string | null }> = [];

    if (dto.name !== undefined) {
      const normalizedName = dto.name.trim();
      if (normalizedName !== status.name) {
        await this.assertUniqueStatusName(status.projectId, normalizedName, status.id);
        updateData.name = normalizedName;
        logEntries.push({
          fieldName: 'name',
          oldValue: status.name,
          newValue: normalizedName,
        });
      }
    }

    if (!status.isProtected && dto.color !== undefined && dto.color !== status.color) {
      updateData.color = dto.color;
      logEntries.push({
        fieldName: 'color',
        oldValue: status.color,
        newValue: dto.color,
      });
    }

    if (Object.keys(updateData).length === 0) {
      return this.findStatusOrThrow(workspaceId, statusId);
    }

    const updated = await this.prisma.status.update({
      where: { id: statusId },
      data: updateData,
      select: STATUS_SELECT,
    });

    if (logEntries.length > 0) {
      await this.prisma.activityLog.createMany({
        data: logEntries.map((entry) => ({
          workspaceId,
          entityType: 'status',
          entityId: statusId,
          action: 'updated',
          fieldName: entry.fieldName,
          oldValue: entry.oldValue,
          newValue: entry.newValue,
          metadata: { projectName: status.project.name },
          performedBy: userId,
        })),
      });
    }

    return updated;
  }

  async remove(
    workspaceId: string,
    statusId: string,
    userId: string,
    role: Role,
    dto: DeleteStatusDto,
  ): Promise<void> {
    this.assertOwner(role);
    const status = await this.findStatusOrThrow(workspaceId, statusId, {
      project: { select: { name: true } },
    });

    if (status.isProtected) {
      throw new BadRequestException(PROTECTED_STATUS_DELETE_FORBIDDEN);
    }

    const activeTaskCount = await this.prisma.task.count({
      where: { statusId, deletedAt: null },
    });

    let replacementStatusId: string | undefined;

    if (activeTaskCount > 0) {
      if (!dto.replacementStatusId) {
        throw new BadRequestException(DELETE_REPLACEMENT_REQUIRED);
      }

      const replacementStatus = await this.prisma.status.findFirst({
        where: {
          id: dto.replacementStatusId,
          projectId: status.projectId,
          deletedAt: null,
        },
        select: { id: true },
      });

      if (!replacementStatus || replacementStatus.id === status.id) {
        throw new BadRequestException(INVALID_REPLACEMENT_STATUS);
      }

      replacementStatusId = replacementStatus.id;
    }

    const deletedAt = new Date();

    await this.prisma.$transaction(async (tx) => {
      if (replacementStatusId) {
        await tx.task.updateMany({
          where: { statusId: status.id, deletedAt: null },
          data: { statusId: replacementStatusId },
        });
      }

      await tx.status.update({
        where: { id: status.id },
        data: { deletedAt },
      });

      await tx.activityLog.create({
        data: {
          workspaceId,
          entityType: 'status',
          entityId: status.id,
          action: 'deleted',
          metadata: {
            projectName: status.project.name,
            replacementStatusId: replacementStatusId ?? null,
          },
          performedBy: userId,
        },
      });
    });
  }

  async reorder(
    workspaceId: string,
    userId: string,
    role: Role,
    dto: ReorderStatusesDto,
  ): Promise<GroupedStatuses> {
    this.assertOwner(role);
    const project = await this.findProjectOrThrow(workspaceId, dto.projectId);
    const statuses = await this.listProjectStatuses(project.id);

    const allIds = statuses.map((status) => status.id);
    const reorderedIds = [
      ...dto.groups.notStarted,
      ...dto.groups.active,
      ...dto.groups.done,
      ...dto.groups.closed,
    ];

    if (
      reorderedIds.length !== allIds.length ||
      new Set(reorderedIds).size !== reorderedIds.length ||
      allIds.some((id) => !reorderedIds.includes(id))
    ) {
      throw new BadRequestException(INVALID_REORDER_PAYLOAD);
    }

    const closedStatuses = statuses.filter((status) => status.isProtected || status.group === 'CLOSED');
    if (
      dto.groups.closed.length !== 1 ||
      closedStatuses.length !== 1 ||
      dto.groups.closed[0] !== closedStatuses[0]?.id
    ) {
      throw new BadRequestException(CLOSED_GROUP_REORDER_FORBIDDEN);
    }

    const statusById = new Map(statuses.map((status) => [status.id, status]));
    const nextState = [
      ...dto.groups.notStarted.map((id, index) => ({ id, group: 'NOT_STARTED' as StatusGroup, position: (index + 1) * 1000 })),
      ...dto.groups.active.map((id, index) => ({ id, group: 'ACTIVE' as StatusGroup, position: (index + 1) * 1000 })),
      ...dto.groups.done.map((id, index) => ({ id, group: 'DONE' as StatusGroup, position: (index + 1) * 1000 })),
      ...dto.groups.closed.map((id, index) => ({ id, group: 'CLOSED' as StatusGroup, position: (index + 1) * 1000 })),
    ];

    const changedStates = nextState.filter((entry) => {
      const current = statusById.get(entry.id);
      return current && (current.group !== entry.group || current.position !== entry.position);
    });

    if (changedStates.length === 0) {
      return this.groupStatuses(project.id, statuses);
    }

    await this.prisma.$transaction(async (tx) => {
      for (const entry of changedStates) {
        await tx.status.update({
          where: { id: entry.id },
          data: {
            group: entry.group,
            position: entry.position,
            isClosed: entry.group === 'CLOSED',
          },
        });
      }

      await tx.activityLog.createMany({
        data: changedStates.map((entry) => {
          const current = statusById.get(entry.id)!;
          return {
            workspaceId,
            entityType: 'status',
            entityId: entry.id,
            action: 'updated',
            fieldName: current.group !== entry.group ? 'group' : 'position',
            oldValue:
              current.group !== entry.group
                ? current.group
                : String(current.position),
            newValue:
              current.group !== entry.group ? entry.group : String(entry.position),
            metadata: { projectName: project.name },
            performedBy: userId,
          };
        }),
      });
    });

    return this.findAll(workspaceId, project.id);
  }

  async applyDefaultTemplate(
    workspaceId: string,
    userId: string,
    role: Role,
    dto: DefaultStatusesDto,
  ): Promise<GroupedStatuses> {
    this.assertOwner(role);
    const project = await this.findProjectOrThrow(workspaceId, dto.projectId);
    const statuses = await this.listProjectStatuses(project.id);

    await this.prisma.$transaction(async (tx) => {
      for (const template of DEFAULT_STATUS_TEMPLATE) {
        const existing =
          template.group === 'CLOSED'
            ? statuses.find((status) => status.isProtected || status.group === 'CLOSED')
            : statuses.find((status) => status.name === template.name);

        if (existing) {
          await tx.status.update({
            where: { id: existing.id },
            data: {
              name: template.name,
              color: template.color,
              group: template.group,
              position: template.position,
              isDefault: true,
              isProtected: template.isProtected,
              isClosed: template.isClosed,
            },
          });
          continue;
        }

        await tx.status.create({
          data: {
            projectId: project.id,
            name: template.name,
            color: template.color,
            group: template.group,
            position: template.position,
            isDefault: true,
            isProtected: template.isProtected,
            isClosed: template.isClosed,
          },
        });
      }

      await tx.activityLog.create({
        data: {
          workspaceId,
          entityType: 'status',
          entityId: project.id,
          action: 'created',
          metadata: {
            projectName: project.name,
            template: 'default_statuses',
          },
          performedBy: userId,
        },
      });
    });

    return this.findAll(workspaceId, project.id);
  }

  private assertOwner(role: Role): void {
    if (role !== 'OWNER') {
      throw new ForbiddenException(OWNER_ONLY);
    }
  }

  private async findProjectOrThrow(
    workspaceId: string,
    projectId: string,
  ): Promise<{ id: string; name: string }> {
    const project = await this.prisma.project.findFirst({
      where: { id: projectId, workspaceId, deletedAt: null },
      select: { id: true, name: true },
    });

    if (!project) {
      throw new NotFoundException(PROJECT_NOT_FOUND);
    }

    return project;
  }

  private async findStatusOrThrow<
    TSelect extends Prisma.StatusSelect | undefined = undefined,
  >(
    workspaceId: string,
    statusId: string,
    extraSelect?: TSelect,
  ): Promise<
    TSelect extends Prisma.StatusSelect
      ? Prisma.StatusGetPayload<{ select: typeof STATUS_SELECT & TSelect }>
      : StatusData
  > {
    const status = await this.prisma.status.findFirst({
      where: {
        id: statusId,
        deletedAt: null,
        project: { workspaceId, deletedAt: null },
      },
      select: {
        ...STATUS_SELECT,
        ...(extraSelect ?? {}),
      },
    });

    if (!status) {
      throw new NotFoundException(STATUS_NOT_FOUND);
    }

    return status as never;
  }

  private async listProjectStatuses(projectId: string): Promise<StatusData[]> {
    return this.prisma.status.findMany({
      where: { projectId, deletedAt: null },
      select: STATUS_SELECT,
      orderBy: [{ group: 'asc' }, { position: 'asc' }],
    });
  }

  private groupStatuses(projectId: string, statuses: StatusData[]): GroupedStatuses {
    return {
      projectId,
      groups: {
        notStarted: statuses.filter((status) => status.group === 'NOT_STARTED'),
        active: statuses.filter((status) => status.group === 'ACTIVE'),
        done: statuses.filter((status) => status.group === 'DONE'),
        closed: statuses.filter((status) => status.group === 'CLOSED'),
      },
    };
  }

  private async getNextPosition(projectId: string, group: StatusGroup): Promise<number> {
    const lastStatus = await this.prisma.status.findFirst({
      where: { projectId, group, deletedAt: null },
      orderBy: { position: 'desc' },
      select: { position: true },
    });

    return (lastStatus?.position ?? 0) + 1000;
  }

  private async assertUniqueStatusName(
    projectId: string,
    name: string,
    ignoreStatusId?: string,
  ): Promise<void> {
    const existingStatus = await this.prisma.status.findFirst({
      where: {
        projectId,
        name,
        deletedAt: null,
        ...(ignoreStatusId ? { id: { not: ignoreStatusId } } : {}),
      },
      select: { id: true },
    });

    if (existingStatus) {
      throw new ConflictException(STATUS_NAME_TAKEN);
    }
  }
}
