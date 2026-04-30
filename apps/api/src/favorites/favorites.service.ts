import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@app/database';
import {
  PROJECT_NOT_FOUND,
  PROJECT_WITH_STATUSES_SELECT,
} from '../project/project.constants';
import {
  TASK_LIST_ITEM_SELECT,
  TASK_NOT_FOUND,
} from '../task/task.constants';
import type { Prisma } from '@app/database/generated/prisma/client';

type RawTaskListItem = Prisma.TaskGetPayload<{ select: typeof TASK_LIST_ITEM_SELECT }>;
@Injectable()
export class FavoritesService {
  constructor(private readonly prisma: PrismaService) {}

  async favoriteProject(workspaceId: string, userId: string, projectId: string) {
    await this.findActiveProjectOrThrow(workspaceId, projectId);

    await this.prisma.projectFavorite.upsert({
      where: { userId_projectId: { userId, projectId } },
      update: {},
      create: { workspaceId, userId, projectId },
    });

    return { isFavorite: true };
  }

  async unfavoriteProject(workspaceId: string, userId: string, projectId: string) {
    await this.findProjectOrThrow(workspaceId, projectId);
    await this.prisma.projectFavorite.deleteMany({ where: { userId, projectId } });
    return { isFavorite: false };
  }

  async favoriteTask(workspaceId: string, userId: string, taskId: string) {
    await this.findActiveTaskOrThrow(workspaceId, taskId);

    await this.prisma.taskFavorite.upsert({
      where: { userId_taskId: { userId, taskId } },
      update: {},
      create: { workspaceId, userId, taskId },
    });

    return { isFavorite: true };
  }

  async unfavoriteTask(workspaceId: string, userId: string, taskId: string) {
    await this.findTaskOrThrow(workspaceId, taskId);
    await this.prisma.taskFavorite.deleteMany({ where: { userId, taskId } });
    return { isFavorite: false };
  }

  async listProjectFavorites(
    workspaceId: string,
    userId: string,
    includeArchived = false,
  ) {
    const rows = await this.prisma.projectFavorite.findMany({
      where: {
        workspaceId,
        userId,
        project: {
          deletedAt: null,
          ...(includeArchived ? {} : { isArchived: false }),
        },
      },
      select: {
        createdAt: true,
        project: { select: PROJECT_WITH_STATUSES_SELECT },
      },
      orderBy: { createdAt: 'desc' },
    });

    return rows.map((row) => ({
      ...row.project,
      isFavorite: true,
      favoritedAt: row.createdAt,
    }));
  }

  async listTaskFavorites(
    workspaceId: string,
    userId: string,
    includeArchived = false,
  ) {
    const rows = await this.prisma.taskFavorite.findMany({
      where: {
        workspaceId,
        userId,
        task: {
          deletedAt: null,
          list: {
            deletedAt: null,
            ...(includeArchived ? {} : { isArchived: false }),
            project: {
              workspaceId,
              deletedAt: null,
              ...(includeArchived ? {} : { isArchived: false }),
            },
          },
        },
      },
      select: {
        createdAt: true,
        task: { select: TASK_LIST_ITEM_SELECT },
      },
      orderBy: { createdAt: 'desc' },
    });

    return rows.map((row) => ({
      ...this.toTaskListItem(row.task),
      isFavorite: true,
      favoritedAt: row.createdAt,
    }));
  }

  async projectFavoriteIds(userId: string, projectIds: string[]) {
    if (projectIds.length === 0) return new Set<string>();
    const favorites = await this.prisma.projectFavorite.findMany({
      where: { userId, projectId: { in: projectIds } },
      select: { projectId: true },
    });
    return new Set(favorites.map((favorite) => favorite.projectId));
  }

  async taskFavoriteIds(userId: string, taskIds: string[]) {
    if (taskIds.length === 0) return new Set<string>();
    const favorites = await this.prisma.taskFavorite.findMany({
      where: { userId, taskId: { in: taskIds } },
      select: { taskId: true },
    });
    return new Set(favorites.map((favorite) => favorite.taskId));
  }

  private async findProjectOrThrow(workspaceId: string, projectId: string) {
    const project = await this.prisma.project.findFirst({
      where: { id: projectId, workspaceId, deletedAt: null },
      select: { id: true },
    });
    if (!project) throw new NotFoundException(PROJECT_NOT_FOUND);
    return project;
  }

  private async findActiveProjectOrThrow(workspaceId: string, projectId: string) {
    const project = await this.prisma.project.findFirst({
      where: { id: projectId, workspaceId, deletedAt: null, isArchived: false },
      select: { id: true },
    });
    if (!project) throw new NotFoundException(PROJECT_NOT_FOUND);
    return project;
  }

  private async findTaskOrThrow(workspaceId: string, taskId: string) {
    const task = await this.prisma.task.findFirst({
      where: {
        id: taskId,
        deletedAt: null,
        list: { deletedAt: null, project: { workspaceId, deletedAt: null } },
      },
      select: { id: true },
    });
    if (!task) throw new NotFoundException(TASK_NOT_FOUND);
    return task;
  }

  private async findActiveTaskOrThrow(workspaceId: string, taskId: string) {
    const task = await this.prisma.task.findFirst({
      where: {
        id: taskId,
        deletedAt: null,
        list: {
          deletedAt: null,
          isArchived: false,
          project: { workspaceId, deletedAt: null, isArchived: false },
        },
      },
      select: { id: true },
    });
    if (!task) throw new NotFoundException(TASK_NOT_FOUND);
    return task;
  }

  private toTaskListItem(raw: RawTaskListItem) {
    return {
      ...raw,
      taskId: `${raw.list.project.taskIdPrefix}-${raw.taskNumber}`,
    };
  }
}
