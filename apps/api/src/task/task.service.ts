import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@app/database';
import type { Prisma, Role } from '@app/database/generated/prisma/client';
import {
  FORBIDDEN_DELETE,
  INVALID_REORDER_PAYLOAD,
  PROJECT_NOT_FOUND,
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
import { ActivityService } from '../activity/activity.service';

// ─── Response types ───────────────────────────────────────────────────────────

type RawTaskDetail = Prisma.TaskGetPayload<{ select: typeof TASK_DETAIL_SELECT }>;
type RawTaskListItem = Prisma.TaskGetPayload<{ select: typeof TASK_LIST_ITEM_SELECT }>;

export type TaskDetailData = RawTaskDetail & { taskId: string; totalTimeLogged: number };
export type TaskListItemData = RawTaskListItem & { taskId: string };

// ─── Service ─────────────────────────────────────────────────────────────────

@Injectable()
export class TaskService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly activity: ActivityService,
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
          statusId: dto.statusId,
          priority: dto.priority ?? 'NONE',
          startDate: dto.startDate ?? null,
          dueDate: dto.dueDate ?? null,
          position,
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

    return this.toDetail(raw);
  }

  async findAllByList(
    workspaceId: string,
    projectId: string,
    listId: string,
  ): Promise<TaskListItemData[]> {
    await this.findListOrThrow(workspaceId, projectId, listId);

    const tasks = await this.prisma.task.findMany({
      where: { listId, depth: 0, deletedAt: null },
      select: TASK_LIST_ITEM_SELECT,
      orderBy: { position: 'asc' },
    });

    return tasks.map((t) => this.toListItem(t));
  }

  async findOne(workspaceId: string, taskId: string): Promise<TaskDetailData> {
    const raw = await this.prisma.task.findFirst({
      where: {
        id: taskId,
        deletedAt: null,
        list: { deletedAt: null, project: { workspaceId, deletedAt: null } },
      },
      select: TASK_DETAIL_SELECT,
    });
    if (!raw) throw new NotFoundException(TASK_NOT_FOUND);
    return this.toDetail(raw);
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

    if (Object.keys(updateData).length === 0) return this.findOne(workspaceId, taskId);

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
    }

    return this.findOne(workspaceId, taskId);
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

    return this.findOne(workspaceId, taskId);
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

    return this.findOne(workspaceId, taskId);
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

  async findSubtasks(workspaceId: string, parentTaskId: string): Promise<TaskListItemData[]> {
    await this.findTaskMinimalOrThrow(workspaceId, parentTaskId);

    const tasks = await this.prisma.task.findMany({
      where: { parentId: parentTaskId, deletedAt: null },
      select: TASK_LIST_ITEM_SELECT,
      orderBy: { position: 'asc' },
    });

    return tasks.map((t) => this.toListItem(t));
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
    }

    return this.findOne(workspaceId, taskId);
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

    return this.findOne(workspaceId, taskId);
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

    return this.findOne(workspaceId, taskId);
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

    return this.findOne(workspaceId, taskId);
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

    return this.findAllByList(workspaceId, projectId, listId);
  }

  // ─── Private helpers ───────────────────────────────────────────────────────

  private async findListOrThrow(workspaceId: string, projectId: string, listId: string) {
    const project = await this.prisma.project.findFirst({
      where: { id: projectId, workspaceId, deletedAt: null },
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
        list: { deletedAt: null, project: { workspaceId, deletedAt: null } },
      },
      select: {
        id: true,
        listId: true,
        parentId: true,
        depth: true,
        title: true,
        description: true,
        statusId: true,
        priority: true,
        startDate: true,
        dueDate: true,
        isCompleted: true,
        taskNumber: true,
        createdBy: true,
        status: { select: { id: true, name: true, color: true } },
        list: {
          select: {
            id: true,
            name: true,
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

  private async getNextSubtaskPosition(parentId: string): Promise<number> {
    const last = await this.prisma.task.findFirst({
      where: { parentId, deletedAt: null },
      orderBy: { position: 'desc' },
      select: { position: true },
    });
    return (last?.position ?? 0) + 1000;
  }

  private toDetail(raw: RawTaskDetail): TaskDetailData {
    return {
      ...raw,
      taskId: `${raw.list.project.taskIdPrefix}-${raw.taskNumber}`,
      totalTimeLogged: raw.timeEntries.reduce((sum, e) => sum + (e.duration ?? 0), 0),
    };
  }

  private toListItem(raw: RawTaskListItem): TaskListItemData {
    return {
      ...raw,
      taskId: `${raw.list.project.taskIdPrefix}-${raw.taskNumber}`,
    };
  }
}
