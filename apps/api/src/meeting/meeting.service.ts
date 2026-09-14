import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@app/database';
import { Prisma } from '@app/database/generated/prisma/client';
import {
  MEETING_DELETE_FORBIDDEN,
  MEETING_DETAIL_SELECT,
  MEETING_LIST_ITEM_SELECT,
  MEETING_NOT_FOUND,
  MEETING_TASK_ADD_FORBIDDEN,
  MEETING_UPDATE_FORBIDDEN,
  PROJECT_HAS_NO_LIST,
  PROJECT_HAS_NO_TODO_STATUS,
  USER_NOT_MEMBER,
} from './meeting.constants';
import type { CreateMeetingDto, CreateMeetingTaskDto } from './dto/create-meeting.dto';
import type { UpdateMeetingDto } from './dto/update-meeting.dto';
import type { ListMeetingsQuery } from './dto/list-meetings.dto';
import { ActivityService } from '../activity/activity.service';
import { NotificationsService } from '../notifications/notifications.service';
import { ProjectSecurityService } from '../project-security/project-security.service';

type RawMeetingDetail = Prisma.MeetingMinutesGetPayload<{ select: typeof MEETING_DETAIL_SELECT }>;
type RawMeetingTask = RawMeetingDetail['tasks'][number];
type RawMeetingListItem = Prisma.MeetingMinutesGetPayload<{ select: typeof MEETING_LIST_ITEM_SELECT }>;

export type MeetingTaskStats = {
  total: number;
  completed: number;
  pending: number;
};

export type MeetingListItemData = Omit<RawMeetingListItem, 'tasks'> & {
  taskStats: MeetingTaskStats;
};

export type MeetingListData = {
  items: MeetingListItemData[];
  total: number;
  page: number;
  limit: number;
};

// progress: 0-100. If the task has subtasks, it's purely how many of them
// are done (2 of 4 complete -> 50%) — the date math below never applies
// once there's at least one subtask. Otherwise it's linear from the task's
// start reference (startDate, or createdAt if none was set) to its
// dueDate — day N of an N-day window reads 100%, halfway reads 50%, etc.
// Always 100 once the task itself is completed (status.isClosed),
// regardless of subtasks or dates.
// isLate: dueDate has passed and the task itself still isn't completed —
// independent of the progress method, subtask or date-based alike. Tasks
// with no dueDate can't be measured this way — they report progress 0,
// isLate false, same as a task that hasn't started yet.
export type MeetingTaskData = RawMeetingTask & {
  progress: number;
  isLate: boolean;
  subtaskStats: { total: number; completed: number } | null;
};

export type MeetingDetailData = Omit<RawMeetingDetail, 'tasks'> & {
  tasks: MeetingTaskData[];
  taskStats: MeetingTaskStats;
};

// Everything needed to create one follow-up task, resolved and validated
// up front so the transaction below does no further access-control work.
type ResolvedMeetingTask = {
  title: string;
  projectId: string;
  assigneeId: string;
  listId: string;
  statusId: string;
  dueDate: Date | null;
};

type CreatedMeetingTask = ResolvedMeetingTask & { taskId: string };

@Injectable()
export class MeetingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly activity: ActivityService,
    private readonly notifications: NotificationsService,
    private readonly projectSecurity: ProjectSecurityService,
  ) {}

  async create(
    workspaceId: string,
    userId: string,
    dto: CreateMeetingDto,
  ): Promise<MeetingDetailData> {
    await this.assertUsersAreMembers(workspaceId, dto.participantIds);

    const resolvedTasks = await this.resolveTasks(workspaceId, userId, dto.tasks ?? []);

    const createdTasks: CreatedMeetingTask[] = [];

    const raw = await this.prisma.$transaction(async (tx) => {
      const meeting = await tx.meetingMinutes.create({
        data: {
          workspaceId,
          title: dto.title.trim(),
          meetingDate: new Date(dto.meetingDate),
          summary: dto.summary?.trim() ?? null,
          decisions: dto.decisions ?? [],
          createdBy: userId,
          participants: {
            createMany: {
              data: dto.participantIds.map((uid) => ({ userId: uid })),
              skipDuplicates: true,
            },
          },
        },
        select: { id: true },
      });

      await this.activity.log(
        {
          workspaceId,
          entityType: 'meeting',
          entityId: meeting.id,
          action: 'created',
          metadata: { title: dto.title.trim(), participantCount: dto.participantIds.length },
          performedBy: userId,
        },
        tx,
      );

      for (const task of resolvedTasks) {
        const taskId = await this.createMeetingTask(tx, workspaceId, userId, meeting.id, task);
        createdTasks.push({ ...task, taskId });
      }

      return tx.meetingMinutes.findFirstOrThrow({
        where: { id: meeting.id },
        select: MEETING_DETAIL_SELECT,
      });
    });

    for (const task of createdTasks) {
      if (task.assigneeId === userId) continue;
      try {
        await this.notifications.createNotification(
          workspaceId,
          task.assigneeId,
          userId,
          'task:assigned',
          'You were assigned to a task',
          `Assigned to task ${task.title} (from meeting "${dto.title.trim()}")`,
          'task',
          task.taskId,
        );
      } catch {}
    }

    return this.toDetail(raw);
  }

  async findAll(workspaceId: string, query: ListMeetingsQuery): Promise<MeetingListData> {
    const where: Prisma.MeetingMinutesWhereInput = { workspaceId, deletedAt: null };
    const skip = (query.page - 1) * query.limit;

    const [total, meetings] = await Promise.all([
      this.prisma.meetingMinutes.count({ where }),
      this.prisma.meetingMinutes.findMany({
        where,
        select: MEETING_LIST_ITEM_SELECT,
        orderBy: { meetingDate: 'desc' },
        skip,
        take: query.limit,
      }),
    ]);

    const items = meetings.map(({ tasks, ...meeting }) => ({
      ...meeting,
      taskStats: this.computeTaskStats(tasks),
    }));

    return { items, total, page: query.page, limit: query.limit };
  }

  async findOne(workspaceId: string, meetingId: string): Promise<MeetingDetailData> {
    const meeting = await this.prisma.meetingMinutes.findFirst({
      where: { id: meetingId, workspaceId, deletedAt: null },
      select: MEETING_DETAIL_SELECT,
    });
    if (!meeting) throw new NotFoundException(MEETING_NOT_FOUND);
    return this.toDetail(meeting);
  }

  // Creator-only, same as the other editable-content actions in this app
  // (comment/task edit windows). Follow-up tasks themselves aren't editable
  // through this endpoint — they're managed through the normal task
  // endpoints once created, same as any other task.
  async update(
    workspaceId: string,
    userId: string,
    meetingId: string,
    dto: UpdateMeetingDto,
  ): Promise<MeetingDetailData> {
    const meeting = await this.prisma.meetingMinutes.findFirst({
      where: { id: meetingId, workspaceId, deletedAt: null },
      select: { id: true, createdBy: true },
    });
    if (!meeting) throw new NotFoundException(MEETING_NOT_FOUND);
    if (meeting.createdBy !== userId) {
      throw new ForbiddenException(MEETING_UPDATE_FORBIDDEN);
    }

    if (dto.participantIds !== undefined) {
      await this.assertUsersAreMembers(workspaceId, dto.participantIds);
    }

    const updateData: Prisma.MeetingMinutesUpdateInput = {};
    if (dto.title !== undefined) updateData.title = dto.title.trim();
    if (dto.meetingDate !== undefined) updateData.meetingDate = new Date(dto.meetingDate);
    if (dto.summary !== undefined) updateData.summary = dto.summary?.trim() ?? null;
    if (dto.decisions !== undefined) updateData.decisions = dto.decisions;

    await this.prisma.$transaction(async (tx) => {
      if (Object.keys(updateData).length > 0) {
        await tx.meetingMinutes.update({ where: { id: meetingId }, data: updateData });
      }

      if (dto.participantIds !== undefined) {
        await tx.meetingParticipant.deleteMany({ where: { meetingId } });
        await tx.meetingParticipant.createMany({
          data: dto.participantIds.map((uid) => ({ meetingId, userId: uid })),
          skipDuplicates: true,
        });
      }

      await this.activity.log(
        {
          workspaceId,
          entityType: 'meeting',
          entityId: meetingId,
          action: 'updated',
          metadata: { fields: Object.keys(dto) },
          performedBy: userId,
        },
        tx,
      );
    });

    return this.findOne(workspaceId, meetingId);
  }

  // Adds one more follow-up task to an existing meeting — the one thing
  // POST /meetings itself can't do after the fact, since Task.meetingId is
  // otherwise write-once (set only inside create()'s own transaction).
  // Reuses the exact same resolution/creation path as create() so a task
  // added here is indistinguishable from one added at meeting-creation time:
  // same project/list/status resolution, same assignee-membership and
  // project-access checks, same activity log entry, same
  // "you were assigned" notification. Creator-only, matching update/remove.
  async addTask(
    workspaceId: string,
    userId: string,
    meetingId: string,
    dto: CreateMeetingTaskDto,
  ): Promise<MeetingDetailData> {
    const meeting = await this.prisma.meetingMinutes.findFirst({
      where: { id: meetingId, workspaceId, deletedAt: null },
      select: { id: true, title: true, createdBy: true },
    });
    if (!meeting) throw new NotFoundException(MEETING_NOT_FOUND);
    if (meeting.createdBy !== userId) {
      throw new ForbiddenException(MEETING_TASK_ADD_FORBIDDEN);
    }

    const [resolvedTask] = await this.resolveTasks(workspaceId, userId, [dto]);

    const createdTaskId = await this.prisma.$transaction((tx) =>
      this.createMeetingTask(tx, workspaceId, userId, meetingId, resolvedTask),
    );

    if (resolvedTask.assigneeId !== userId) {
      try {
        await this.notifications.createNotification(
          workspaceId,
          resolvedTask.assigneeId,
          userId,
          'task:assigned',
          'You were assigned to a task',
          `Assigned to task ${resolvedTask.title} (from meeting "${meeting.title}")`,
          'task',
          createdTaskId,
        );
      } catch {}
    }

    return this.findOne(workspaceId, meetingId);
  }

  // Soft-deletes the meeting (deletedAt), and explicitly unlinks every task
  // still pointing at it — Task.meetingId's onDelete: SetNull only fires on
  // an actual DB-level DELETE, which never happens here, so the unlink has
  // to be done by hand in the same transaction. The tasks themselves are
  // never touched otherwise: same title, status, assignee, history — they
  // just stop being associated with this meeting. Creator-only, same as
  // update.
  async remove(workspaceId: string, userId: string, meetingId: string): Promise<void> {
    const meeting = await this.prisma.meetingMinutes.findFirst({
      where: { id: meetingId, workspaceId, deletedAt: null },
      select: { id: true, createdBy: true },
    });
    if (!meeting) throw new NotFoundException(MEETING_NOT_FOUND);
    if (meeting.createdBy !== userId) {
      throw new ForbiddenException(MEETING_DELETE_FORBIDDEN);
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.task.updateMany({
        where: { meetingId },
        data: { meetingId: null },
      });

      await tx.meetingMinutes.update({
        where: { id: meetingId },
        data: { deletedAt: new Date() },
      });

      await this.activity.log(
        {
          workspaceId,
          entityType: 'meeting',
          entityId: meetingId,
          action: 'deleted',
          performedBy: userId,
        },
        tx,
      );
    });
  }

  // ─── Private helpers ───────────────────────────────────────────────────────

  private toDetail(raw: RawMeetingDetail): MeetingDetailData {
    const tasks = raw.tasks.map((task) => ({
      ...task,
      ...this.computeTaskProgress(task),
    }));
    return { ...raw, tasks, taskStats: this.computeTaskStats(raw.tasks) };
  }

  // A task counts as completed once it's sitting in its project's terminal
  // status (isClosed) — everything else (To Do, In Progress, Review, ...)
  // counts as pending, regardless of how many non-terminal columns a
  // project defines.
  private computeTaskStats(tasks: Array<{ status: { isClosed: boolean } }>): MeetingTaskStats {
    const total = tasks.length;
    const completed = tasks.filter((task) => task.status.isClosed).length;
    return { total, completed, pending: total - completed };
  }

  // progress is never date-derived: a task nobody has touched yet must never
  // read as partially (or fully) done just because its due date passed.
  // - Closed task -> 100%, regardless of subtasks.
  // - Open task with subtasks -> real completion ratio of those subtasks.
  // - Open task with no subtasks -> 0%; there is nothing else to measure.
  // isLate is a separate flag, not folded into the number: overdue-but-open
  // is communicated by the "Delayed" label/colour, never by inflating
  // progress.
  private computeTaskProgress(
    task: RawMeetingTask,
  ): { progress: number; isLate: boolean; subtaskStats: { total: number; completed: number } | null } {
    const isLate = !task.status.isClosed && !!task.dueDate && Date.now() > task.dueDate.getTime();

    if (task.status.isClosed) {
      const subtaskStats = task.children.length
        ? { total: task.children.length, completed: task.children.filter((c) => c.status.isClosed).length }
        : null;
      return { progress: 100, isLate: false, subtaskStats };
    }

    if (task.children.length > 0) {
      const total = task.children.length;
      const completed = task.children.filter((child) => child.status.isClosed).length;
      return { progress: Math.round((completed / total) * 100), isLate, subtaskStats: { total, completed } };
    }

    return { progress: 0, isLate, subtaskStats: null };
  }

  private async resolveTasks(
    workspaceId: string,
    userId: string,
    tasks: NonNullable<CreateMeetingDto['tasks']>,
  ): Promise<ResolvedMeetingTask[]> {
    if (!tasks.length) return [];

    const resolved: ResolvedMeetingTask[] = [];
    const listAndStatusByProject = new Map<string, { listId: string; statusId: string }>();

    for (const task of tasks) {
      const project = await this.projectSecurity.findProjectOrThrow(
        workspaceId,
        task.projectId,
        userId,
      );
      await this.assertUsersAreMembers(workspaceId, [task.assigneeId]);
      await this.projectSecurity.assertUsersCanAccessProject(task.projectId, project.visibility, [
        task.assigneeId,
      ]);

      let listAndStatus = listAndStatusByProject.get(task.projectId);
      if (!listAndStatus) {
        listAndStatus = await this.findDefaultListAndStatus(task.projectId, project.name);
        listAndStatusByProject.set(task.projectId, listAndStatus);
      }

      resolved.push({
        title: task.title.trim(),
        projectId: task.projectId,
        assigneeId: task.assigneeId,
        listId: listAndStatus.listId,
        statusId: listAndStatus.statusId,
        dueDate: task.dueDate ? new Date(task.dueDate) : null,
      });
    }

    return resolved;
  }

  private async findDefaultListAndStatus(
    projectId: string,
    projectName: string,
  ): Promise<{ listId: string; statusId: string }> {
    const [list, status] = await Promise.all([
      this.prisma.taskList.findFirst({
        where: { projectId, deletedAt: null, isArchived: false },
        orderBy: { position: 'asc' },
        select: { id: true },
      }),
      this.prisma.status.findFirst({
        where: { projectId, deletedAt: null, group: 'NOT_STARTED' },
        orderBy: { position: 'asc' },
        select: { id: true },
      }),
    ]);
    if (!list) throw new BadRequestException(`${PROJECT_HAS_NO_LIST}: "${projectName}"`);
    if (!status) throw new BadRequestException(`${PROJECT_HAS_NO_TODO_STATUS}: "${projectName}"`);

    return { listId: list.id, statusId: status.id };
  }

  private async createMeetingTask(
    tx: Prisma.TransactionClient,
    workspaceId: string,
    userId: string,
    meetingId: string,
    task: ResolvedMeetingTask,
  ): Promise<string> {
    const project = await tx.project.update({
      where: { id: task.projectId },
      data: { taskCounter: { increment: 1 } },
      select: { taskCounter: true },
    });

    const [position, boardPosition] = await Promise.all([
      this.getNextPosition(tx, task.listId),
      this.getNextBoardPosition(tx, task.projectId, task.statusId),
    ]);

    const created = await tx.task.create({
      data: {
        listId: task.listId,
        title: task.title,
        statusId: task.statusId,
        dueDate: task.dueDate,
        taskNumber: project.taskCounter,
        position,
        boardPosition,
        createdBy: userId,
        meetingId,
        assignees: { create: { userId: task.assigneeId, assignedBy: userId } },
      },
      select: { id: true },
    });

    await this.activity.log(
      {
        workspaceId,
        entityType: 'task',
        entityId: created.id,
        action: 'created',
        metadata: {
          taskTitle: task.title,
          projectId: task.projectId,
          listId: task.listId,
          statusId: task.statusId,
          meetingId,
        },
        performedBy: userId,
      },
      tx,
    );

    return created.id;
  }

  private async getNextPosition(tx: Prisma.TransactionClient, listId: string): Promise<number> {
    const last = await tx.task.findFirst({
      where: { listId, depth: 0, deletedAt: null },
      orderBy: { position: 'desc' },
      select: { position: true },
    });
    return (last?.position ?? 0) + 1000;
  }

  private async getNextBoardPosition(
    tx: Prisma.TransactionClient,
    projectId: string,
    statusId: string,
  ): Promise<number> {
    const last = await tx.task.findFirst({
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

  private async assertUsersAreMembers(workspaceId: string, userIds: string[]): Promise<void> {
    const members = await this.prisma.workspaceMember.findMany({
      where: { workspaceId, userId: { in: userIds }, deletedAt: null },
      select: { userId: true },
    });
    if (members.length !== new Set(userIds).size) {
      throw new BadRequestException(USER_NOT_MEMBER);
    }
  }
}
