import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@app/database';
import { Prisma, type Role } from '@app/database/generated/prisma/client';
import {
  FORBIDDEN_DELETE,
  INVALID_REORDER_PAYLOAD,
  INVALID_BOARD_REORDER_PAYLOAD,
  PROJECT_NOT_FOUND,
  BOARD_REORDER_SUBTASK_FORBIDDEN,
  STATUS_NOT_FOUND,
  SUBTASK_DEPTH_LIMIT,
  TAG_ALREADY_ON_TASK,
  TAG_NOT_IN_WORKSPACE,
  TAG_NOT_ON_TASK,
  TASK_DETAIL_SELECT,
  TASK_LIST_ITEM_SELECT,
  TASK_LIST_NOT_FOUND,
  TASK_NOT_FOUND,
  USER_NOT_MEMBER,
} from './task.constants';
import type { CreateTaskDto } from './dto/create-task.dto';
import type { UpdateTaskDto } from './dto/update-task.dto';
import type { CreateSubtaskDto } from './dto/create-subtask.dto';
import type { AddAssigneesDto } from './dto/add-assignees.dto';
import type { AddTagToTaskDto } from './dto/add-tag-to-task.dto';
import type { ReorderTasksDto } from './dto/reorder-tasks.dto';
import type { ListTasksQuery } from './dto/list-tasks-query.dto';
import type { ReorderBoardTasksDto } from './dto/reorder-board-tasks.dto';
import { ActivityService } from '../activity/activity.service';
import { NotificationsService } from '../notifications/notifications.service';
import { FavoritesService } from '../favorites/favorites.service';
import { assertContentSize, extractPlaintext } from '../docs/doc-content';

// ─── Response types ───────────────────────────────────────────────────────────

type RawTaskDetail = Prisma.TaskGetPayload<{ select: typeof TASK_DETAIL_SELECT }>;
type RawTaskListItem = Prisma.TaskGetPayload<{ select: typeof TASK_LIST_ITEM_SELECT }>;

export type TaskDetailData = RawTaskDetail & {
  taskId: string;
  totalTimeLogged: number;
  isFavorite: boolean;
};
export type TaskListItemData = RawTaskListItem & { taskId: string; isFavorite: boolean };
export type ProjectBoardColumnData = {
  status: {
    id: string;
    name: string;
    color: string;
    group: string;
    position: number;
    isDefault: boolean;
    isProtected: boolean;
    isClosed: boolean;
  };
  tasks: TaskListItemData[];
  total: number;
};
export type ProjectBoardData = {
  groupBy: 'status';
  projectId: string;
  columns: ProjectBoardColumnData[];
  total: number;
};
export type TaskSearchResult = {
  items: TaskListItemData[];
  total: number;
  page: number;
  limit: number;
};

type TaskSearchScope = {
  workspaceId: string;
  userId: string;
  projectId?: string;
  listId?: string;
};

// ─── Service ─────────────────────────────────────────────────────────────────

@Injectable()
export class TaskService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly activity: ActivityService,
    private readonly notifications: NotificationsService,
    private readonly favorites?: FavoritesService,
  ) {}

  async create(
    workspaceId: string,
    userId: string,
    projectId: string,
    listId: string,
    dto: CreateTaskDto,
  ): Promise<TaskDetailData> {
    await this.findListOrThrow(workspaceId, projectId, listId);
    await this.findStatusOrThrow(projectId, dto.statusId);
    if (dto.assigneeIds?.length) {
      await this.assertUsersAreMembers(workspaceId, dto.assigneeIds);
    }
    if (dto.tagIds?.length) {
      await this.assertTagsInWorkspace(workspaceId, dto.tagIds);
    }

    const position = await this.getNextPosition(listId);
    const boardPosition = await this.getNextBoardPosition(projectId, dto.statusId);

    let descriptionPlaintext: string | null = null;
    if (dto.descriptionJson) {
      assertContentSize(dto.descriptionJson);
      descriptionPlaintext = extractPlaintext(dto.descriptionJson);
    }

    const raw = await this.prisma.$transaction(async (tx) => {
      const project = await tx.project.update({
        where: { id: projectId },
        data: { taskCounter: { increment: 1 } },
        select: { taskCounter: true },
      });

      const task = await tx.task.create({
        data: {
          listId,
          title: dto.title.trim(),
          description: dto.description?.trim() ?? null,
          ...(dto.descriptionJson !== undefined
            ? { descriptionJson: dto.descriptionJson as Prisma.InputJsonValue, descriptionPlaintext }
            : {}),
          statusId: dto.statusId,
          priority: dto.priority ?? 'NONE',
          startDate: dto.startDate ?? null,
          dueDate: dto.dueDate ?? null,
          position,
          boardPosition,
          taskNumber: project.taskCounter,
          createdBy: userId,
          ...(dto.assigneeIds?.length
            ? {
                assignees: {
                  createMany: {
                    data: dto.assigneeIds.map((uid) => ({ userId: uid, assignedBy: userId })),
                  },
                },
              }
            : {}),
          ...(dto.tagIds?.length
            ? {
                tags: {
                  createMany: {
                    data: dto.tagIds.map((tid) => ({ tagId: tid })),
                  },
                },
              }
            : {}),
        },
        select: { id: true },
      });

      await this.activity.log(
        {
          workspaceId,
          entityType: 'task',
          entityId: task.id,
          action: 'created',
          metadata: { taskTitle: dto.title.trim(), projectId, listId, statusId: dto.statusId },
          performedBy: userId,
        },
        tx,
      );

      return tx.task.findFirstOrThrow({
        where: { id: task.id },
        select: TASK_DETAIL_SELECT,
      });
    });

    // Notify assignees created during task creation (if any)
    if (dto.assigneeIds && dto.assigneeIds.length) {
      for (const assigneeUserId of dto.assigneeIds) {
        if (assigneeUserId === userId) continue;
        try {
          await this.notifications.createNotification(
            (dto as any).workspaceId ?? workspaceId,
            assigneeUserId,
            userId,
            'task:assigned',
            'You were assigned to a task',
            `Assigned to task ${raw.title}`,
            'task',
            raw.id,
          );
        } catch {}
      }
    }

    return this.toDetail(raw);
  }

  async findAllByList(
    workspaceId: string,
    userId: string,
    projectId: string,
    listId: string,
  ): Promise<TaskListItemData[]> {
    await this.findListOrThrow(workspaceId, projectId, listId);

    const tasks = await this.prisma.task.findMany({
      where: { listId, depth: 0, deletedAt: null },
      select: TASK_LIST_ITEM_SELECT,
      orderBy: { position: 'asc' },
    });

    return this.toListItems(userId, tasks);
  }

  async findTasksByList(
    workspaceId: string,
    userId: string,
    projectId: string,
    listId: string,
    query: ListTasksQuery,
  ): Promise<TaskSearchResult> {
    await this.findListOrThrow(workspaceId, projectId, listId);
    return this.searchTasks({ workspaceId, userId, projectId, listId }, query);
  }

  async findTasksByProject(
    workspaceId: string,
    userId: string,
    projectId: string,
    query: ListTasksQuery,
  ): Promise<TaskSearchResult> {
    await this.findProjectOrThrow(workspaceId, projectId, query.includeArchived);
    return this.searchTasks({ workspaceId, userId, projectId }, query);
  }

  async findTasksByWorkspace(
    workspaceId: string,
    userId: string,
    query: ListTasksQuery,
  ): Promise<TaskSearchResult> {
    return this.searchTasks({ workspaceId, userId }, query);
  }

  async getProjectBoard(
    workspaceId: string,
    userId: string,
    projectId: string,
    query: ListTasksQuery,
  ): Promise<ProjectBoardData> {
    await this.findProjectOrThrow(workspaceId, projectId, query.includeArchived);

    const [statuses, tasks] = await Promise.all([
      this.prisma.status.findMany({
        where: { projectId, deletedAt: null },
        select: {
          id: true,
          name: true,
          color: true,
          group: true,
          position: true,
          isDefault: true,
          isProtected: true,
          isClosed: true,
        },
        orderBy: [{ group: 'asc' }, { position: 'asc' }],
      }),
      this.prisma.task.findMany({
        where: this.buildTaskSearchWhere({ workspaceId, userId, projectId }, query),
        select: TASK_LIST_ITEM_SELECT,
        orderBy: [
          { boardPosition: 'asc' },
          { listId: 'asc' },
          { id: 'asc' },
        ],
      }),
    ]);

    const favoriteIds = await this.taskFavoriteIds(
      userId,
      tasks.map((task) => task.id),
    );
    const tasksByStatus = new Map<string, TaskListItemData[]>();
    for (const task of tasks) {
      const mapped = this.toListItem(task, favoriteIds.has(task.id));
      const columnTasks = tasksByStatus.get(mapped.status.id) ?? [];
      columnTasks.push(mapped);
      tasksByStatus.set(mapped.status.id, columnTasks);
    }

    const columns = statuses.map((status) => {
      const columnTasks = tasksByStatus.get(status.id) ?? [];
      return {
        status,
        tasks: columnTasks,
        total: columnTasks.length,
      };
    });

    return {
      groupBy: 'status',
      projectId,
      columns,
      total: tasks.length,
    };
  }

  async findOne(workspaceId: string, userId: string, taskId: string): Promise<TaskDetailData> {
    const raw = await this.prisma.task.findFirst({
      where: {
        id: taskId,
        deletedAt: null,
        list: {
          deletedAt: null,
          isArchived: false,
          project: { workspaceId, deletedAt: null, isArchived: false },
        },
      },
      select: TASK_DETAIL_SELECT,
    });
    if (!raw) throw new NotFoundException(TASK_NOT_FOUND);
    return this.toDetail(raw, await this.isTaskFavorite(userId, raw.id));
  }

  async update(
    workspaceId: string,
    userId: string,
    taskId: string,
    dto: UpdateTaskDto,
  ): Promise<TaskDetailData> {
    const task = await this.findTaskMinimalOrThrow(workspaceId, taskId);
    const updateData: Prisma.TaskUpdateInput = {};
    const logEntries: Array<{
      fieldName: string;
      oldValue: unknown;
      newValue: unknown;
      action?: string;
      metadata?: Record<string, unknown>;
    }> = [];

    if (dto.title !== undefined) {
      const title = dto.title.trim();
      if (title !== task.title) {
        updateData.title = title;
        logEntries.push({ fieldName: 'title', oldValue: task.title, newValue: title });
      }
    }
    if (dto.description !== undefined && dto.description !== task.description) {
      updateData.description = dto.description;
      logEntries.push({ fieldName: 'description', oldValue: task.description, newValue: dto.description });
    }
    if (dto.descriptionJson !== undefined) {
      if (dto.descriptionJson === null) {
        updateData.descriptionJson = Prisma.JsonNull;
        updateData.descriptionPlaintext = null;
      } else {
        assertContentSize(dto.descriptionJson);
        updateData.descriptionJson = dto.descriptionJson as Prisma.InputJsonValue;
        updateData.descriptionPlaintext = extractPlaintext(dto.descriptionJson);
      }
      logEntries.push({
        fieldName: 'descriptionJson',
        oldValue: task.descriptionJson ? '[content]' : null,
        newValue: dto.descriptionJson ? '[content]' : null,
      });
    }
    if (dto.priority !== undefined && dto.priority !== task.priority) {
      updateData.priority = dto.priority;
      logEntries.push({ fieldName: 'priority', oldValue: task.priority, newValue: dto.priority });
    }
    if (dto.startDate !== undefined && this.dateString(task.startDate) !== dto.startDate) {
      updateData.startDate = dto.startDate;
      logEntries.push({ fieldName: 'startDate', oldValue: task.startDate, newValue: dto.startDate ?? null });
    }
    if (dto.dueDate !== undefined && this.dateString(task.dueDate) !== dto.dueDate) {
      updateData.dueDate = dto.dueDate;
      logEntries.push({ fieldName: 'dueDate', oldValue: task.dueDate, newValue: dto.dueDate ?? null });
    }

    if (dto.statusId !== undefined && dto.statusId !== task.statusId) {
      const newStatus = await this.findStatusOrThrow(task.list.project.id, dto.statusId);
      updateData.status = { connect: { id: dto.statusId } };
      updateData.boardPosition = await this.getNextBoardPosition(task.list.project.id, dto.statusId);
      logEntries.push({
        fieldName: 'status',
        oldValue: task.status.name,
        newValue: newStatus.name,
        action: 'status_changed',
        metadata: {
          oldStatusId: task.statusId,
          newStatusId: dto.statusId,
          oldStatusName: task.status.name,
          newStatusName: newStatus.name,
        },
      });
    }

    if (dto.listId !== undefined && dto.listId !== task.listId) {
      // validate new list belongs to the same project
      const newList = await this.prisma.taskList.findFirst({
        where: { id: dto.listId, projectId: task.list.project.id, deletedAt: null, isArchived: false },
        select: { id: true, name: true },
      });
      if (!newList) throw new NotFoundException(TASK_LIST_NOT_FOUND);
      const newPosition = await this.getNextPosition(dto.listId);
      updateData.list = { connect: { id: dto.listId } };
      updateData.position = newPosition;
      logEntries.push({
        fieldName: 'listId',
        oldValue: task.list.name,
        newValue: newList.name,
        action: 'moved',
        metadata: { oldListId: task.listId, newListId: dto.listId },
      });
    }

    if (Object.keys(updateData).length === 0) return this.findOne(workspaceId, userId, taskId);

    await this.prisma.task.update({ where: { id: taskId }, data: updateData });

    if (logEntries.length > 0) {
      await this.activity.logMany(
        logEntries.map((entry) => ({
          workspaceId,
          entityType: 'task',
          entityId: taskId,
          action: entry.action ?? 'updated',
          fieldName: entry.fieldName,
          oldValue: entry.oldValue,
          newValue: entry.newValue,
          metadata: {
            taskTitle: (updateData.title as string | undefined) ?? task.title,
            taskNumber: task.taskNumber,
            projectId: task.list.project.id,
            projectName: task.list.project.name,
            listId: dto.listId ?? task.listId,
            ...(entry.metadata ?? {}),
          },
          performedBy: userId,
        })),
      );
      // notify assignees about updates
      const changedFields = logEntries.map((e) => e.fieldName).join(', ');
      await this.notifications.notifyTaskAssignees(workspaceId, taskId, userId, {
        type: 'task:updated',
        title: 'Assigned task updated',
        message: `Updated fields: ${changedFields}`,
      });
    }

    return this.findOne(workspaceId, userId, taskId);
  }

  async remove(workspaceId: string, userId: string, taskId: string, role: Role): Promise<void> {
    const task = await this.findTaskMinimalOrThrow(workspaceId, taskId);

    if (task.createdBy !== userId && role !== 'OWNER') {
      throw new ForbiddenException(FORBIDDEN_DELETE);
    }

    const now = new Date();

    await this.prisma.$transaction(async (tx) => {
      // cascade soft-delete subtasks
      await tx.task.updateMany({
        where: { parentId: taskId, deletedAt: null },
        data: { deletedAt: now },
      });
      await tx.task.update({ where: { id: taskId }, data: { deletedAt: now } });
      await this.activity.log(
        {
          workspaceId,
          entityType: 'task',
          entityId: taskId,
          action: 'deleted',
          metadata: { taskTitle: task.title, taskNumber: task.taskNumber, listId: task.listId },
          performedBy: userId,
        },
        tx,
      );
    });
  }

  async complete(workspaceId: string, userId: string, taskId: string): Promise<TaskDetailData> {
    const task = await this.findTaskMinimalOrThrow(workspaceId, taskId);

    await this.prisma.task.update({
      where: { id: taskId },
      data: { isCompleted: true, completedAt: new Date() },
    });

    await this.activity.log({
        workspaceId,
        entityType: 'task',
        entityId: taskId,
        action: 'completed',
        fieldName: 'isCompleted',
        oldValue: task.isCompleted,
        newValue: true,
        metadata: { taskTitle: task.title, taskNumber: task.taskNumber },
        performedBy: userId,
    });

    return this.findOne(workspaceId, userId, taskId);
  }

  async uncomplete(workspaceId: string, userId: string, taskId: string): Promise<TaskDetailData> {
    const task = await this.findTaskMinimalOrThrow(workspaceId, taskId);

    await this.prisma.task.update({
      where: { id: taskId },
      data: { isCompleted: false, completedAt: null },
    });

    await this.activity.log({
        workspaceId,
        entityType: 'task',
        entityId: taskId,
        action: 'uncompleted',
        fieldName: 'isCompleted',
        oldValue: task.isCompleted,
        newValue: false,
        metadata: { taskTitle: task.title, taskNumber: task.taskNumber },
        performedBy: userId,
    });

    return this.findOne(workspaceId, userId, taskId);
  }

  // ─── Subtasks ──────────────────────────────────────────────────────────────

  async createSubtask(
    workspaceId: string,
    userId: string,
    parentTaskId: string,
    dto: CreateSubtaskDto,
  ): Promise<TaskDetailData> {
    const parent = await this.findTaskMinimalOrThrow(workspaceId, parentTaskId);

    if (parent.depth >= 2) throw new BadRequestException(SUBTASK_DEPTH_LIMIT);

    await this.findStatusOrThrow(parent.list.project.id, dto.statusId);

    const position = await this.getNextSubtaskPosition(parentTaskId);
    const boardPosition = await this.getNextBoardPosition(parent.list.project.id, dto.statusId);

    const raw = await this.prisma.$transaction(async (tx) => {
      const project = await tx.project.update({
        where: { id: parent.list.project.id },
        data: { taskCounter: { increment: 1 } },
        select: { taskCounter: true },
      });

      const subtask = await tx.task.create({
        data: {
          listId: parent.listId,
          parentId: parentTaskId,
          depth: parent.depth + 1,
          title: dto.title.trim(),
          description: dto.description?.trim() ?? null,
          statusId: dto.statusId,
          priority: dto.priority ?? 'NONE',
          startDate: dto.startDate ?? null,
          dueDate: dto.dueDate ?? null,
          position,
          boardPosition,
          taskNumber: project.taskCounter,
          createdBy: userId,
        },
        select: { id: true },
      });

      await this.activity.log(
        {
          workspaceId,
          entityType: 'task',
          entityId: subtask.id,
          action: 'subtask_created',
          metadata: {
            taskTitle: dto.title.trim(),
            parentId: parentTaskId,
            parentTitle: parent.title,
          },
          performedBy: userId,
        },
        tx,
      );

      return tx.task.findFirstOrThrow({
        where: { id: subtask.id },
        select: TASK_DETAIL_SELECT,
      });
    });

    return this.toDetail(raw);
  }

  async findSubtasks(
    workspaceId: string,
    userId: string,
    parentTaskId: string,
  ): Promise<TaskListItemData[]> {
    await this.findTaskMinimalOrThrow(workspaceId, parentTaskId);

    const tasks = await this.prisma.task.findMany({
      where: { parentId: parentTaskId, deletedAt: null },
      select: TASK_LIST_ITEM_SELECT,
      orderBy: { position: 'asc' },
    });

    return this.toListItems(userId, tasks);
  }

  // ─── Assignees ─────────────────────────────────────────────────────────────

  async addAssignees(
    workspaceId: string,
    userId: string,
    taskId: string,
    dto: AddAssigneesDto,
  ): Promise<TaskDetailData> {
    const task = await this.findTaskMinimalOrThrow(workspaceId, taskId);
    await this.assertUsersAreMembers(workspaceId, dto.userIds);

    const existing = await this.prisma.taskAssignee.findMany({
      where: { taskId, userId: { in: dto.userIds } },
      select: { userId: true },
    });
    const existingUserIds = new Set(existing.map((assignee) => assignee.userId));
    const newUserIds = dto.userIds.filter((uid) => !existingUserIds.has(uid));

    await this.prisma.taskAssignee.createMany({
      data: dto.userIds.map((uid) => ({ taskId, userId: uid, assignedBy: userId })),
      skipDuplicates: true,
    });

    if (newUserIds.length > 0) {
      await this.activity.log({
        workspaceId,
        entityType: 'task',
        entityId: taskId,
        action: 'assignee_added',
        metadata: { userIds: newUserIds, taskTitle: task.title, taskNumber: task.taskNumber },
        performedBy: userId,
      });
      // notify newly added assignees
      for (const uid of newUserIds) {
        if (uid === userId) continue;
        try {
          await this.notifications.createNotification(
            workspaceId,
            uid,
            userId,
            'task:assigned',
            'You were assigned to a task',
            `You were added to task ${task.title}`,
            'task',
            taskId,
          );
        } catch {}
      }
    }

    return this.findOne(workspaceId, userId, taskId);
  }

  async removeAssignee(
    workspaceId: string,
    userId: string,
    taskId: string,
    targetUserId: string,
  ): Promise<TaskDetailData> {
    const task = await this.findTaskMinimalOrThrow(workspaceId, taskId);

    await this.prisma.taskAssignee.deleteMany({
      where: { taskId, userId: targetUserId },
    });

    await this.activity.log({
        workspaceId,
        entityType: 'task',
        entityId: taskId,
        action: 'assignee_removed',
        metadata: { removedUserId: targetUserId, taskTitle: task.title, taskNumber: task.taskNumber },
        performedBy: userId,
    });

    return this.findOne(workspaceId, userId, taskId);
  }

  // ─── Tags on task ──────────────────────────────────────────────────────────

  async addTag(
    workspaceId: string,
    userId: string,
    taskId: string,
    dto: AddTagToTaskDto,
  ): Promise<TaskDetailData> {
    const task = await this.findTaskMinimalOrThrow(workspaceId, taskId);
    await this.assertTagsInWorkspace(workspaceId, [dto.tagId]);
    const tag = await this.prisma.tag.findFirst({
      where: { id: dto.tagId, workspaceId, deletedAt: null },
      select: { id: true, name: true, color: true },
    });

    const existing = await this.prisma.taskTag.findFirst({
      where: { taskId, tagId: dto.tagId },
      select: { id: true },
    });
    if (existing) throw new ConflictException(TAG_ALREADY_ON_TASK);

    await this.prisma.taskTag.create({ data: { taskId, tagId: dto.tagId } });

    await this.activity.log({
        workspaceId,
        entityType: 'task',
        entityId: taskId,
        action: 'tag_added',
        metadata: {
          tagId: dto.tagId,
          tagName: tag?.name ?? null,
          taskTitle: task.title,
          taskNumber: task.taskNumber,
        },
        performedBy: userId,
    });

    return this.findOne(workspaceId, userId, taskId);
  }

  async removeTag(
    workspaceId: string,
    userId: string,
    taskId: string,
    tagId: string,
  ): Promise<TaskDetailData> {
    const task = await this.findTaskMinimalOrThrow(workspaceId, taskId);

    const existing = await this.prisma.taskTag.findFirst({
      where: { taskId, tagId },
      select: { id: true, tag: { select: { name: true, color: true } } },
    });
    if (!existing) throw new NotFoundException(TAG_NOT_ON_TASK);

    await this.prisma.taskTag.delete({ where: { id: existing.id } });

    await this.activity.log({
        workspaceId,
        entityType: 'task',
        entityId: taskId,
        action: 'tag_removed',
        metadata: {
          tagId,
          tagName: existing.tag.name,
          taskTitle: task.title,
          taskNumber: task.taskNumber,
        },
        performedBy: userId,
    });

    return this.findOne(workspaceId, userId, taskId);
  }

  // ─── Reorder ───────────────────────────────────────────────────────────────

  async reorder(
    workspaceId: string,
    userId: string,
    projectId: string,
    listId: string,
    dto: ReorderTasksDto,
  ): Promise<TaskListItemData[]> {
    await this.findListOrThrow(workspaceId, projectId, listId);

    const activeTasks = await this.prisma.task.findMany({
      where: { listId, depth: 0, deletedAt: null },
      select: { id: true, position: true },
      orderBy: { position: 'asc' },
    });

    const activeIds = activeTasks.map((t) => t.id);

    if (
      dto.taskIds.length !== activeIds.length ||
      new Set(dto.taskIds).size !== dto.taskIds.length ||
      activeIds.some((id) => !dto.taskIds.includes(id))
    ) {
      throw new BadRequestException(INVALID_REORDER_PAYLOAD);
    }

    const positionById = new Map(activeTasks.map((t) => [t.id, t.position]));
    const updates = dto.taskIds
      .map((id, index) => ({ id, position: (index + 1) * 1000 }))
      .filter((entry) => positionById.get(entry.id) !== entry.position);

    if (updates.length > 0) {
      await this.prisma.$transaction(
        updates.map((entry) =>
          this.prisma.task.update({
            where: { id: entry.id },
            data: { position: entry.position },
          }),
        ),
      );

      await this.activity.log({
          workspaceId,
          entityType: 'task',
          entityId: listId,
          action: 'reordered',
          metadata: { taskIds: dto.taskIds },
          performedBy: userId,
      });
    }

    return this.findAllByList(workspaceId, userId, projectId, listId);
  }

  async reorderProjectBoard(
    workspaceId: string,
    userId: string,
    projectId: string,
    dto: ReorderBoardTasksDto,
  ): Promise<ProjectBoardData> {
    await this.findProjectOrThrow(workspaceId, projectId);

    const task = await this.findTaskMinimalOrThrow(workspaceId, dto.taskId);
    if (task.list.project.id !== projectId) throw new NotFoundException(TASK_NOT_FOUND);
    if (task.depth !== 0) throw new BadRequestException(BOARD_REORDER_SUBTASK_FORBIDDEN);

    const newStatus = await this.findStatusOrThrow(projectId, dto.toStatusId);
    const targetList = dto.toListId
      ? await this.findListForProjectOrThrow(projectId, dto.toListId)
      : null;
    const finalListId = targetList?.id ?? task.listId;

    const activeTargetTasks = await this.prisma.task.findMany({
      where: {
        statusId: dto.toStatusId,
        depth: 0,
        deletedAt: null,
        list: { projectId, deletedAt: null, isArchived: false },
      },
      select: { id: true, listId: true, boardPosition: true },
      orderBy: [{ boardPosition: 'asc' }, { id: 'asc' }],
    });

    const expectedIds = new Set(activeTargetTasks.map((item) => item.id));
    expectedIds.add(dto.taskId);

    if (
      dto.orderedTaskIds.length !== expectedIds.size ||
      new Set(dto.orderedTaskIds).size !== dto.orderedTaskIds.length ||
      dto.orderedTaskIds.some((id) => !expectedIds.has(id))
    ) {
      throw new BadRequestException(INVALID_BOARD_REORDER_PAYLOAD);
    }

    const oldStatusId = task.statusId;
    const oldStatusName = task.status.name;
    const oldListId = task.listId;
    const oldListName = task.list.name;
    const listChanged = finalListId !== task.listId;
    const statusChanged = dto.toStatusId !== task.statusId;
    const finalListName = targetList?.name ?? task.list.name;
    const finalListIdByTaskId = new Map(activeTargetTasks.map((item) => [item.id, item.listId]));
    finalListIdByTaskId.set(dto.taskId, finalListId);
    const affectedListIds = Array.from(
      new Set([oldListId, finalListId, ...Array.from(finalListIdByTaskId.values())]),
    );

    await this.prisma.$transaction(async (tx) => {
      for (const [index, id] of dto.orderedTaskIds.entries()) {
        const isMovedTask = id === dto.taskId;
        await tx.task.update({
          where: { id },
          data: {
            boardPosition: (index + 1) * 1000,
            ...(isMovedTask && statusChanged ? { statusId: dto.toStatusId } : {}),
            ...(isMovedTask && listChanged ? { listId: finalListId } : {}),
          },
        });
      }

      await this.syncListsFromBoardOrder(tx, projectId, affectedListIds);

      const logs = [
        ...(statusChanged
          ? [
              {
                workspaceId,
                entityType: 'task',
                entityId: dto.taskId,
                action: 'status_changed',
                fieldName: 'status',
                oldValue: oldStatusName,
                newValue: newStatus.name,
                metadata: {
                  taskTitle: task.title,
                  taskNumber: task.taskNumber,
                  projectId,
                  oldStatusId,
                  newStatusId: dto.toStatusId,
                  oldStatusName,
                  newStatusName: newStatus.name,
                },
                performedBy: userId,
              },
            ]
          : []),
        ...(listChanged
          ? [
              {
                workspaceId,
                entityType: 'task',
                entityId: dto.taskId,
                action: 'moved',
                fieldName: 'listId',
                oldValue: oldListName,
                newValue: finalListName,
                metadata: {
                  taskTitle: task.title,
                  taskNumber: task.taskNumber,
                  projectId,
                  oldListId,
                  newListId: finalListId,
                },
                performedBy: userId,
              },
            ]
          : []),
        {
          workspaceId,
          entityType: 'task',
          entityId: dto.taskId,
          action: 'reordered',
          metadata: {
            taskTitle: task.title,
            taskNumber: task.taskNumber,
            projectId,
            statusId: dto.toStatusId,
            listIds: affectedListIds,
            taskIds: dto.orderedTaskIds,
            view: 'board',
          },
          performedBy: userId,
        },
      ];

      await this.activity.logMany(logs, tx);
    });

    return this.getProjectBoard(
      workspaceId,
      userId,
      projectId,
      this.defaultBoardQuery(),
    );
  }

  // ─── Private helpers ───────────────────────────────────────────────────────

  private async searchTasks(
    scope: TaskSearchScope,
    query: ListTasksQuery,
  ): Promise<TaskSearchResult> {
    const where = this.buildTaskSearchWhere(scope, query);
    const orderBy = this.buildTaskSearchOrderBy(scope, query);
    const skip = (query.page - 1) * query.limit;

    const [total, tasks] = await Promise.all([
      this.prisma.task.count({ where }),
      this.prisma.task.findMany({
        where,
        select: TASK_LIST_ITEM_SELECT,
        orderBy,
        skip,
        take: query.limit,
      }),
    ]);

    return {
      items: await this.toListItems(scope.userId, tasks),
      total,
      page: query.page,
      limit: query.limit,
    };
  }

  private buildTaskSearchWhere(
    scope: TaskSearchScope,
    query: ListTasksQuery,
  ): Prisma.TaskWhereInput {
    const and: Prisma.TaskWhereInput[] = [];
    const where: Prisma.TaskWhereInput = {
      deletedAt: null,
      list: {
        deletedAt: null,
        ...(query.includeArchived ? {} : { isArchived: false }),
        project: {
          workspaceId: scope.workspaceId,
          deletedAt: null,
          ...(scope.projectId ? { id: scope.projectId } : {}),
          ...(query.includeArchived ? {} : { isArchived: false }),
        },
      },
      ...(scope.listId ? { listId: scope.listId } : {}),
    };

    if (!query.includeSubtasks) {
      where.depth = 0;
    }

    if (query.q) {
      const parsedTaskNumber = this.extractTaskNumber(query.q);
      and.push({
        OR: [
          { title: { contains: query.q, mode: 'insensitive' } },
          { description: { contains: query.q, mode: 'insensitive' } },
          { status: { name: { contains: query.q, mode: 'insensitive' } } },
          { tags: { some: { tag: { name: { contains: query.q, mode: 'insensitive' } } } } },
          { assignees: { some: { user: { fullName: { contains: query.q, mode: 'insensitive' } } } } },
          ...(parsedTaskNumber ? [{ taskNumber: parsedTaskNumber }] : []),
        ],
      });
    }

    if (query.statusIds?.length) {
      and.push({ statusId: { in: query.statusIds } });
    }

    if (query.statusGroups?.length) {
      and.push({ status: { group: { in: query.statusGroups } } });
    } else if (!query.includeClosed) {
      and.push({ status: { group: { not: 'CLOSED' } } });
    }

    if (query.priorities?.length) {
      and.push({ priority: { in: query.priorities } });
    }

    const dueDateFilter = this.buildDueDateFilter(query);
    if (dueDateFilter) {
      and.push(dueDateFilter);
    }

    const assigneeFilter = this.buildAssigneeFilter(scope.userId, query);
    if (assigneeFilter) {
      and.push(assigneeFilter);
    }

    const tagFilter = this.buildTagFilter(query);
    if (tagFilter) {
      and.push(tagFilter);
    }

    if (query.createdBy?.length) {
      and.push({ createdBy: { in: query.createdBy } });
    }

    this.pushDateRangeFilter(and, 'createdAt', query.createdFrom, query.createdTo);
    this.pushDateRangeFilter(and, 'updatedAt', query.updatedFrom, query.updatedTo);
    this.pushDateRangeFilter(and, 'completedAt', query.completedFrom, query.completedTo);

    if (query.completed !== undefined) {
      and.push({ isCompleted: query.completed });
    }

    if (and.length > 0) {
      where.AND = and;
    }

    return where;
  }

  private buildTaskSearchOrderBy(
    scope: TaskSearchScope,
    query: ListTasksQuery,
  ): Prisma.TaskOrderByWithRelationInput[] {
    const sortBy = query.sortBy ?? (scope.listId ? 'position' : 'updated_at');
    const order = query.sortBy ? query.sortOrder : scope.listId ? 'asc' : 'desc';

    const primary: Prisma.TaskOrderByWithRelationInput =
      sortBy === 'created_at'
        ? { createdAt: order }
        : sortBy === 'updated_at'
          ? { updatedAt: order }
          : sortBy === 'due_date'
            ? { dueDate: order }
            : sortBy === 'priority'
              ? { priority: order }
              : sortBy === 'status'
                ? { status: { name: order } }
                : sortBy === 'title'
                  ? { title: order }
                  : { position: order };

    return scope.listId
      ? [primary, { id: 'asc' }]
      : [primary, { listId: 'asc' }, { position: 'asc' }, { id: 'asc' }];
  }

  private buildDueDateFilter(query: ListTasksQuery): Prisma.TaskWhereInput | null {
    if (query.dueDate === 'no_due_date') {
      return { dueDate: null };
    }

    if (query.hasDueDate === true) {
      return { dueDate: { not: null } };
    }

    if (query.hasDueDate === false) {
      return { dueDate: null };
    }

    const presetRange = query.dueDate ? this.getDueDatePresetRange(query.dueDate) : null;
    if (presetRange) {
      return { dueDate: presetRange };
    }

    if (!query.dueDateFrom && !query.dueDateTo) return null;
    return {
      dueDate: {
        ...(query.dueDateFrom ? { gte: this.parseDateBoundary(query.dueDateFrom, 'start') } : {}),
        ...(query.dueDateTo ? { lte: this.parseDateBoundary(query.dueDateTo, 'end') } : {}),
      },
    };
  }

  private buildAssigneeFilter(userId: string, query: ListTasksQuery): Prisma.TaskWhereInput | null {
    const rawAssigneeIds = query.assigneeIds ?? [];
    const wantsUnassigned = rawAssigneeIds.includes('unassigned') || query.hasAssignees === false;
    const selectedUserIds = Array.from(
      new Set([
        ...rawAssigneeIds.filter((id) => id !== 'unassigned'),
        ...(query.me ? [userId] : []),
      ]),
    );

    if (query.hasAssignees === true && selectedUserIds.length === 0) {
      return { assignees: { some: {} } };
    }

    if (selectedUserIds.length === 0) {
      return wantsUnassigned ? { assignees: { none: {} } } : null;
    }

    const assignedFilter =
      query.assigneeMatch === 'all'
        ? {
            AND: selectedUserIds.map((id) => ({
              assignees: { some: { userId: id } },
            })),
          }
        : { assignees: { some: { userId: { in: selectedUserIds } } } };

    return wantsUnassigned
      ? { OR: [assignedFilter, { assignees: { none: {} } }] }
      : assignedFilter;
  }

  private buildTagFilter(query: ListTasksQuery): Prisma.TaskWhereInput | null {
    if (!query.tagIds?.length) return null;

    if (query.tagMatch === 'all') {
      return {
        AND: query.tagIds.map((id) => ({
          tags: { some: { tagId: id } },
        })),
      };
    }

    return { tags: { some: { tagId: { in: query.tagIds } } } };
  }

  private pushDateRangeFilter(
    filters: Prisma.TaskWhereInput[],
    field: 'createdAt' | 'updatedAt' | 'completedAt',
    from?: string,
    to?: string,
  ): void {
    if (!from && !to) return;
    filters.push({
      [field]: {
        ...(from ? { gte: this.parseDateBoundary(from, 'start') } : {}),
        ...(to ? { lte: this.parseDateBoundary(to, 'end') } : {}),
      },
    });
  }

  private getDueDatePresetRange(
    preset: Exclude<ListTasksQuery['dueDate'], undefined | 'no_due_date'>,
  ): Prisma.DateTimeNullableFilter<'Task'> {
    const todayStart = this.startOfUtcDay(new Date());
    const tomorrowStart = this.addUtcDays(todayStart, 1);

    if (preset === 'overdue') return { lt: todayStart };
    if (preset === 'today') return { gte: todayStart, lt: tomorrowStart };
    if (preset === 'today_or_earlier') return { lt: tomorrowStart };
    if (preset === 'tomorrow') return { gte: tomorrowStart, lt: this.addUtcDays(tomorrowStart, 1) };

    const weekStart = this.startOfUtcWeek(todayStart);
    const nextWeekStart = this.addUtcDays(weekStart, 7);
    const followingWeekStart = this.addUtcDays(nextWeekStart, 7);

    if (preset === 'this_week') return { gte: weekStart, lt: nextWeekStart };
    return { gte: nextWeekStart, lt: followingWeekStart };
  }

  private parseDateBoundary(value: string, boundary: 'start' | 'end'): Date {
    const parsed = new Date(value);
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      parsed.setUTCHours(
        boundary === 'start' ? 0 : 23,
        boundary === 'start' ? 0 : 59,
        boundary === 'start' ? 0 : 59,
        boundary === 'start' ? 0 : 999,
      );
    }
    return parsed;
  }

  private startOfUtcDay(value: Date): Date {
    return new Date(Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate()));
  }

  private startOfUtcWeek(value: Date): Date {
    const day = value.getUTCDay() || 7;
    return this.addUtcDays(value, 1 - day);
  }

  private addUtcDays(value: Date, days: number): Date {
    const next = new Date(value);
    next.setUTCDate(next.getUTCDate() + days);
    return next;
  }

  private extractTaskNumber(value: string): number | null {
    const match = value.trim().match(/(?:^|[-#\s])(\d+)$/);
    if (!match) return null;
    const parsed = Number.parseInt(match[1], 10);
    return Number.isNaN(parsed) ? null : parsed;
  }

  private async findListOrThrow(workspaceId: string, projectId: string, listId: string) {
    const project = await this.prisma.project.findFirst({
      where: { id: projectId, workspaceId, deletedAt: null, isArchived: false },
      select: { id: true },
    });
    if (!project) throw new NotFoundException(PROJECT_NOT_FOUND);

    const list = await this.prisma.taskList.findFirst({
      where: { id: listId, projectId, deletedAt: null, isArchived: false },
      select: { id: true },
    });
    if (!list) throw new NotFoundException(TASK_LIST_NOT_FOUND);

    return list;
  }

  private async findListForProjectOrThrow(projectId: string, listId: string) {
    const list = await this.prisma.taskList.findFirst({
      where: { id: listId, projectId, deletedAt: null, isArchived: false },
      select: { id: true, name: true, position: true },
    });
    if (!list) throw new NotFoundException(TASK_LIST_NOT_FOUND);
    return list;
  }

  private async findProjectOrThrow(
    workspaceId: string,
    projectId: string,
    includeArchived = false,
  ): Promise<void> {
    const project = await this.prisma.project.findFirst({
      where: {
        id: projectId,
        workspaceId,
        deletedAt: null,
        ...(includeArchived ? {} : { isArchived: false }),
      },
      select: { id: true },
    });
    if (!project) throw new NotFoundException(PROJECT_NOT_FOUND);
  }

  private async findStatusOrThrow(projectId: string, statusId: string): Promise<{ id: string; name: string }> {
    const status = await this.prisma.status.findFirst({
      where: { id: statusId, projectId, deletedAt: null },
      select: { id: true, name: true },
    });
    if (!status) throw new NotFoundException(STATUS_NOT_FOUND);
    return status;
  }

  private async findTaskMinimalOrThrow(workspaceId: string, taskId: string) {
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
      select: {
        id: true,
        listId: true,
        parentId: true,
        depth: true,
        title: true,
        description: true,
        descriptionJson: true,
        statusId: true,
        priority: true,
        startDate: true,
        dueDate: true,
        position: true,
        isCompleted: true,
        taskNumber: true,
        createdBy: true,
        status: { select: { id: true, name: true, color: true } },
        list: {
          select: {
            id: true,
            name: true,
            position: true,
            projectId: true,
            project: { select: { id: true, workspaceId: true, taskIdPrefix: true, name: true } },
          },
        },
      },
    });
    if (!task) throw new NotFoundException(TASK_NOT_FOUND);
    return task;
  }

  private dateString(value: Date | null): string | null {
    return value ? value.toISOString() : null;
  }

  private async assertUsersAreMembers(workspaceId: string, userIds: string[]): Promise<void> {
    const members = await this.prisma.workspaceMember.findMany({
      where: { workspaceId, userId: { in: userIds }, deletedAt: null },
      select: { userId: true },
    });
    if (members.length !== userIds.length) {
      throw new BadRequestException(USER_NOT_MEMBER);
    }
  }

  private async assertTagsInWorkspace(workspaceId: string, tagIds: string[]): Promise<void> {
    const tags = await this.prisma.tag.findMany({
      where: { id: { in: tagIds }, workspaceId, deletedAt: null },
      select: { id: true },
    });
    if (tags.length !== tagIds.length) {
      throw new BadRequestException(TAG_NOT_IN_WORKSPACE);
    }
  }

  private async getNextPosition(listId: string): Promise<number> {
    const last = await this.prisma.task.findFirst({
      where: { listId, depth: 0, deletedAt: null },
      orderBy: { position: 'desc' },
      select: { position: true },
    });
    return (last?.position ?? 0) + 1000;
  }

  private async getNextBoardPosition(projectId: string, statusId: string): Promise<number> {
    const last = await this.prisma.task.findFirst({
      where: {
        statusId,
        depth: 0,
        deletedAt: null,
        list: { projectId, deletedAt: null, isArchived: false },
      },
      orderBy: { boardPosition: 'desc' },
      select: { boardPosition: true },
    });
    return (last?.boardPosition ?? 0) + 1000;
  }

  private async getNextSubtaskPosition(parentId: string): Promise<number> {
    const last = await this.prisma.task.findFirst({
      where: { parentId, deletedAt: null },
      orderBy: { position: 'desc' },
      select: { position: true },
    });
    return (last?.position ?? 0) + 1000;
  }

  private toDetail(raw: RawTaskDetail, isFavorite = false): TaskDetailData {
    return {
      ...raw,
      taskId: `${raw.list.project.taskIdPrefix}-${raw.taskNumber}`,
      totalTimeLogged: raw.timeEntries.reduce((sum, e) => sum + (e.duration ?? 0), 0),
      isFavorite,
    };
  }

  private toListItem(raw: RawTaskListItem, isFavorite = false): TaskListItemData {
    return {
      ...raw,
      taskId: `${raw.list.project.taskIdPrefix}-${raw.taskNumber}`,
      isFavorite,
    };
  }

  private async toListItems(
    userId: string,
    rawTasks: RawTaskListItem[],
  ): Promise<TaskListItemData[]> {
    const favoriteIds = await this.taskFavoriteIds(
      userId,
      rawTasks.map((task) => task.id),
    );
    return rawTasks.map((task) => this.toListItem(task, favoriteIds.has(task.id)));
  }

  private async isTaskFavorite(userId: string, taskId: string): Promise<boolean> {
    const ids = await this.taskFavoriteIds(userId, [taskId]);
    return ids.has(taskId);
  }

  private async taskFavoriteIds(userId: string, taskIds: string[]): Promise<Set<string>> {
    if (!this.favorites) return new Set();
    return this.favorites.taskFavoriteIds(userId, taskIds);
  }

  private defaultBoardQuery(): ListTasksQuery {
    return {
      q: undefined,
      page: 1,
      limit: 100,
      sortBy: undefined,
      sortOrder: 'asc',
      statusIds: undefined,
      statusGroups: undefined,
      priorities: undefined,
      dueDateFrom: undefined,
      dueDateTo: undefined,
      dueDate: undefined,
      assigneeIds: undefined,
      assigneeMatch: 'any',
      tagIds: undefined,
      tagMatch: 'any',
      createdBy: undefined,
      createdFrom: undefined,
      createdTo: undefined,
      updatedFrom: undefined,
      updatedTo: undefined,
      completedFrom: undefined,
      completedTo: undefined,
      includeSubtasks: false,
      includeClosed: true,
      includeArchived: false,
      me: false,
      hasAssignees: undefined,
      hasDueDate: undefined,
      completed: undefined,
    };
  }

  private async syncListsFromBoardOrder(
    tx: Prisma.TransactionClient,
    projectId: string,
    affectedListIds: string[],
  ): Promise<void> {
    if (affectedListIds.length === 0) return;

    const tasks = await tx.task.findMany({
      where: {
        listId: { in: affectedListIds },
        depth: 0,
        deletedAt: null,
        list: { projectId, deletedAt: null, isArchived: false },
      },
      select: {
        id: true,
        listId: true,
        position: true,
        boardPosition: true,
        status: {
          select: {
            id: true,
            group: true,
            position: true,
          },
        },
      },
    });

    const statusGroupRank: Record<string, number> = {
      NOT_STARTED: 0,
      ACTIVE: 1,
      DONE: 2,
      CLOSED: 3,
    };

    const tasksByList = new Map<string, typeof tasks>();
    for (const task of tasks) {
      const listTasks = tasksByList.get(task.listId) ?? [];
      listTasks.push(task);
      tasksByList.set(task.listId, listTasks);
    }

    for (const listTasks of tasksByList.values()) {
      const sortedTasks = [...listTasks].sort((left, right) => {
        const leftGroupRank = statusGroupRank[left.status.group] ?? Number.MAX_SAFE_INTEGER;
        const rightGroupRank = statusGroupRank[right.status.group] ?? Number.MAX_SAFE_INTEGER;
        if (leftGroupRank !== rightGroupRank) return leftGroupRank - rightGroupRank;
        if (left.status.position !== right.status.position) {
          return left.status.position - right.status.position;
        }
        if (left.boardPosition !== right.boardPosition) {
          return left.boardPosition - right.boardPosition;
        }
        return left.id.localeCompare(right.id);
      });

      await Promise.all(
        sortedTasks.map((task, index) => {
          const nextPosition = (index + 1) * 1000;
          if (task.position === nextPosition) return Promise.resolve();
          return tx.task.update({
            where: { id: task.id },
            data: { position: nextPosition },
          });
        }),
      );
    }
  }
}
