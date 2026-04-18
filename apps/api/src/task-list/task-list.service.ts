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
  TASK_LIST_NAME_TAKEN,
  TASK_LIST_NOT_ARCHIVED,
  TASK_LIST_NOT_FOUND,
  TASK_LIST_SELECT,
} from './task-list.constants';
import type { CreateTaskListDto } from './dto/create-task-list.dto';
import type { UpdateTaskListDto } from './dto/update-task-list.dto';
import type { ReorderTaskListsDto } from './dto/reorder-task-lists.dto';

export type TaskListData = Prisma.TaskListGetPayload<{ select: typeof TASK_LIST_SELECT }>;

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

    return list;
  }

  async findAll(
    workspaceId: string,
    projectId: string,
    includeArchived: boolean,
  ): Promise<TaskListData[]> {
    await this.findProjectOrThrow(workspaceId, projectId);

    return this.prisma.taskList.findMany({
      where: {
        projectId,
        deletedAt: null,
        ...(includeArchived ? {} : { isArchived: false }),
      },
      select: TASK_LIST_SELECT,
      orderBy: { position: 'asc' },
    });
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
    const name = dto.name.trim();

    if (name === list.name) {
      return list;
    }

    await this.assertUniqueName(projectId, name, listId);

    const updated = await this.prisma.taskList.update({
      where: { id: listId },
      data: { name },
      select: TASK_LIST_SELECT,
    });

    await this.prisma.activityLog.create({
      data: {
        workspaceId,
        entityType: 'task_list',
        entityId: listId,
        action: 'updated',
        fieldName: 'name',
        oldValue: list.name,
        newValue: name,
        metadata: {},
        performedBy: userId,
      },
    });

    return updated;
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

    return updated;
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

    return updated;
  }

  // --- Private helpers ---

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
  ): Promise<TaskListData> {
    const list = await this.prisma.taskList.findFirst({
      where: {
        id: listId,
        projectId,
        deletedAt: null,
        ...(includeArchived ? {} : {}), // archived lists are still findable by id
      },
      select: TASK_LIST_SELECT,
    });

    if (!list) {
      throw new NotFoundException(TASK_LIST_NOT_FOUND);
    }

    return list;
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
}
