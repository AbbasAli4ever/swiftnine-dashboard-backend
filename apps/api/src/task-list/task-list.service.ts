import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@app/database';
import type { Prisma } from '@app/database/generated/prisma/client';
import {
  INVALID_REORDER_PAYLOAD,
  PROJECT_NOT_FOUND,
  TASK_LIST_ALREADY_ARCHIVED,
  TASK_LIST_INVALID_DATE_RANGE,
  TASK_LIST_NAME_TAKEN,
  TASK_LIST_NOT_ARCHIVED,
  TASK_LIST_NOT_FOUND,
  TASK_LIST_OWNER_NOT_IN_WORKSPACE,
  TASK_LIST_SELECT,
} from './task-list.constants';
import type { CreateTaskListDto } from './dto/create-task-list.dto';
import type { UpdateTaskListDto } from './dto/update-task-list.dto';
import type { ReorderTaskListsDto } from './dto/reorder-task-lists.dto';

type TaskListRecord = Prisma.TaskListGetPayload<{ select: typeof TASK_LIST_SELECT }>;

export type TaskListData = Omit<TaskListRecord, 'startDate' | 'endDate'> & {
  startDate: string | null;
  endDate: string | null;
};

@Injectable()
export class TaskListService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    workspaceId: string,
    userId: string,
    projectId: string,
    dto: CreateTaskListDto,
  ): Promise<TaskListData> {
    await this.findProjectOrThrow(workspaceId, projectId);
    const name = dto.name.trim();
    await this.assertUniqueName(projectId, name);

    const position = await this.getNextPosition(projectId);

    const list = await this.prisma.taskList.create({
      data: {
        projectId,
        name,
        position,
        createdBy: userId,
      },
      select: TASK_LIST_SELECT,
    });

    await this.prisma.activityLog.create({
      data: {
        workspaceId,
        entityType: 'task_list',
        entityId: list.id,
        action: 'created',
        metadata: { listName: list.name },
        performedBy: userId,
      },
    });

    return this.toTaskListData(list);
  }

  async findAll(
    workspaceId: string,
    projectId: string,
    includeArchived: boolean,
  ): Promise<TaskListData[]> {
    await this.findProjectOrThrow(workspaceId, projectId);

    const lists = await this.prisma.taskList.findMany({
      where: {
        projectId,
        deletedAt: null,
        ...(includeArchived ? {} : { isArchived: false }),
      },
      select: TASK_LIST_SELECT,
      orderBy: { position: 'asc' },
    });

    return lists.map((list) => this.toTaskListData(list));
  }

  async update(
    workspaceId: string,
    userId: string,
    projectId: string,
    listId: string,
    dto: UpdateTaskListDto,
  ): Promise<TaskListData> {
    await this.findProjectOrThrow(workspaceId, projectId);
    const list = await this.findListOrThrow(projectId, listId);
    const updateData: Prisma.TaskListUpdateInput = {};
    const logs: Array<{
      fieldName: string;
      oldValue: string | null;
      newValue: string | null;
    }> = [];

    if (dto.name !== undefined) {
      const name = dto.name.trim();
      if (name !== list.name) {
        await this.assertUniqueName(projectId, name, listId);
        updateData.name = name;
        logs.push({ fieldName: 'name', oldValue: list.name, newValue: name });
      }
    }

    const nextStartDate =
      dto.startDate === undefined ? list.startDate : this.parseDateOnly(dto.startDate);
    const nextEndDate =
      dto.endDate === undefined ? list.endDate : this.parseDateOnly(dto.endDate);

    if (nextStartDate && nextEndDate && nextStartDate.getTime() > nextEndDate.getTime()) {
      throw new BadRequestException(TASK_LIST_INVALID_DATE_RANGE);
    }

    if (dto.startDate !== undefined) {
      updateData.startDate = nextStartDate;
      logs.push({
        fieldName: 'startDate',
        oldValue: this.formatDateOnly(list.startDate),
        newValue: this.formatDateOnly(nextStartDate),
      });
    }

    if (dto.endDate !== undefined) {
      updateData.endDate = nextEndDate;
      logs.push({
        fieldName: 'endDate',
        oldValue: this.formatDateOnly(list.endDate),
        newValue: this.formatDateOnly(nextEndDate),
      });
    }

    if (dto.priority !== undefined) {
      updateData.priority = dto.priority;
      logs.push({
        fieldName: 'priority',
        oldValue: list.priority,
        newValue: dto.priority,
      });
    }

    if (dto.ownerId !== undefined) {
      if (dto.ownerId === null) {
        if (list.ownerUserId !== null) {
          updateData.owner = { disconnect: true };
          logs.push({
            fieldName: 'ownerUserId',
            oldValue: list.owner?.fullName ?? null,
            newValue: null,
          });
        }
      } else {
        const owner = await this.resolveOwnerOrThrow(workspaceId, dto.ownerId);
        if (owner.userId !== list.ownerUserId) {
          updateData.owner = { connect: { id: owner.userId } };
          logs.push({
            fieldName: 'ownerUserId',
            oldValue: list.owner?.fullName ?? null,
            newValue: owner.fullName,
          });
        }
      }
    }

    if (Object.keys(updateData).length === 0) {
      return this.toTaskListData(list);
    }

    const updated = await this.prisma.taskList.update({
      where: { id: listId },
      data: updateData,
      select: TASK_LIST_SELECT,
    });

    if (logs.length > 0) {
      await this.prisma.activityLog.createMany({
        data: logs.map((log) => ({
          workspaceId,
          entityType: 'task_list',
          entityId: listId,
          action: 'updated',
          fieldName: log.fieldName,
          oldValue: log.oldValue,
          newValue: log.newValue,
          metadata: {},
          performedBy: userId,
        })),
      });
    }

    return this.toTaskListData(updated);
  }

  async remove(
    workspaceId: string,
    userId: string,
    projectId: string,
    listId: string,
  ): Promise<void> {
    await this.findProjectOrThrow(workspaceId, projectId);
    const list = await this.findListOrThrow(projectId, listId);

    await this.prisma.$transaction(async (tx) => {
      await tx.taskList.update({
        where: { id: listId },
        data: { deletedAt: new Date() },
      });

      await tx.activityLog.create({
        data: {
          workspaceId,
          entityType: 'task_list',
          entityId: listId,
          action: 'deleted',
          metadata: { listName: list.name },
          performedBy: userId,
        },
      });
    });
  }

  async reorder(
    workspaceId: string,
    userId: string,
    projectId: string,
    dto: ReorderTaskListsDto,
  ): Promise<TaskListData[]> {
    await this.findProjectOrThrow(workspaceId, projectId);

    const activeLists = await this.prisma.taskList.findMany({
      where: { projectId, deletedAt: null, isArchived: false },
      select: { id: true, position: true },
      orderBy: { position: 'asc' },
    });

    const activeIds = activeLists.map((l) => l.id);

    if (
      dto.listIds.length !== activeIds.length ||
      new Set(dto.listIds).size !== dto.listIds.length ||
      activeIds.some((id) => !dto.listIds.includes(id))
    ) {
      throw new BadRequestException(INVALID_REORDER_PAYLOAD);
    }

    const positionById = new Map(activeLists.map((l) => [l.id, l.position]));
    const updates = dto.listIds
      .map((id, index) => ({ id, position: (index + 1) * 1000 }))
      .filter((entry) => positionById.get(entry.id) !== entry.position);

    if (updates.length > 0) {
      await this.prisma.$transaction(
        updates.map((entry) =>
          this.prisma.taskList.update({
            where: { id: entry.id },
            data: { position: entry.position },
          }),
        ),
      );

      await this.prisma.activityLog.create({
        data: {
          workspaceId,
          entityType: 'task_list',
          entityId: projectId,
          action: 'reordered',
          metadata: { listIds: dto.listIds },
          performedBy: userId,
        },
      });
    }

    return this.findAll(workspaceId, projectId, false);
  }

  async archive(
    workspaceId: string,
    userId: string,
    projectId: string,
    listId: string,
  ): Promise<TaskListData> {
    await this.findProjectOrThrow(workspaceId, projectId);
    const list = await this.findListOrThrow(projectId, listId);

    if (list.isArchived) {
      throw new BadRequestException(TASK_LIST_ALREADY_ARCHIVED);
    }

    const updated = await this.prisma.taskList.update({
      where: { id: listId },
      data: { isArchived: true },
      select: TASK_LIST_SELECT,
    });

    await this.prisma.activityLog.create({
      data: {
        workspaceId,
        entityType: 'task_list',
        entityId: listId,
        action: 'archived',
        metadata: { listName: list.name },
        performedBy: userId,
      },
    });

    return this.toTaskListData(updated);
  }

  async restore(
    workspaceId: string,
    userId: string,
    projectId: string,
    listId: string,
  ): Promise<TaskListData> {
    await this.findProjectOrThrow(workspaceId, projectId);
    const list = await this.findListOrThrow(projectId, listId, true);

    if (!list.isArchived) {
      throw new BadRequestException(TASK_LIST_NOT_ARCHIVED);
    }

    const position = await this.getNextPosition(projectId);

    const updated = await this.prisma.taskList.update({
      where: { id: listId },
      data: { isArchived: false, position },
      select: TASK_LIST_SELECT,
    });

    await this.prisma.activityLog.create({
      data: {
        workspaceId,
        entityType: 'task_list',
        entityId: listId,
        action: 'restored',
        metadata: { listName: list.name },
        performedBy: userId,
      },
    });

    return this.toTaskListData(updated);
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

  private async findListOrThrow(
    projectId: string,
    listId: string,
    includeArchived = false,
  ): Promise<TaskListRecord> {
    const list = await this.prisma.taskList.findFirst({
      where: {
        id: listId,
        projectId,
        deletedAt: null,
        ...(includeArchived ? {} : {}),
      },
      select: TASK_LIST_SELECT,
    });

    if (!list) {
      throw new NotFoundException(TASK_LIST_NOT_FOUND);
    }

    return list;
  }

  private async resolveOwnerOrThrow(
    workspaceId: string,
    ownerId: string,
  ): Promise<{
    userId: string;
    fullName: string;
    avatarUrl: string | null;
    avatarColor: string;
  }> {
    let member = await this.prisma.workspaceMember.findFirst({
      where: { id: ownerId, workspaceId, deletedAt: null },
      select: {
        userId: true,
        user: {
          select: {
            id: true,
            fullName: true,
            avatarUrl: true,
            avatarColor: true,
          },
        },
      },
    });

    if (!member) {
      member = await this.prisma.workspaceMember.findFirst({
        where: { userId: ownerId, workspaceId, deletedAt: null },
        select: {
          userId: true,
          user: {
            select: {
              id: true,
              fullName: true,
              avatarUrl: true,
              avatarColor: true,
            },
          },
        },
      });
    }

    if (!member) {
      throw new BadRequestException(TASK_LIST_OWNER_NOT_IN_WORKSPACE);
    }

    return {
      userId: member.userId,
      fullName: member.user.fullName,
      avatarUrl: member.user.avatarUrl,
      avatarColor: member.user.avatarColor,
    };
  }

  private async assertUniqueName(
    projectId: string,
    name: string,
    ignoreListId?: string,
  ): Promise<void> {
    const existing = await this.prisma.taskList.findFirst({
      where: {
        projectId,
        name,
        deletedAt: null,
        ...(ignoreListId ? { id: { not: ignoreListId } } : {}),
      },
      select: { id: true },
    });

    if (existing) {
      throw new ConflictException(TASK_LIST_NAME_TAKEN);
    }
  }

  private async getNextPosition(projectId: string): Promise<number> {
    const last = await this.prisma.taskList.findFirst({
      where: { projectId, deletedAt: null },
      orderBy: { position: 'desc' },
      select: { position: true },
    });

    return (last?.position ?? 0) + 1000;
  }

  private parseDateOnly(value: string | null): Date | null {
    return value ? new Date(`${value}T00:00:00.000Z`) : null;
  }

  private formatDateOnly(value: Date | null): string | null {
    return value ? value.toISOString().slice(0, 10) : null;
  }

  private toTaskListData(list: TaskListRecord): TaskListData {
    return {
      ...list,
      startDate: this.formatDateOnly(list.startDate),
      endDate: this.formatDateOnly(list.endDate),
    };
  }
}
