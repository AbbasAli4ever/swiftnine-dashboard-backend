import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@app/database';
import type { Prisma } from '@app/database/generated/prisma/client';
import {
  FORBIDDEN_TIME_ENTRY,
  NO_ACTIVE_TIMER,
  TASK_NOT_FOUND,
  TIME_ENTRY_NOT_FOUND,
  TIME_ENTRY_SELECT,
} from './time-entry.constants';
import type { ManualTimeEntryDto } from './dto/manual-time-entry.dto';
import type { UpdateTimeEntryDto } from './dto/update-time-entry.dto';
import { ProjectSecurityService } from '../project-security/project-security.service';

export type TimeEntryData = Prisma.TimeEntryGetPayload<{ select: typeof TIME_ENTRY_SELECT }>;

export type StartTimerResult = {
  stoppedEntry: TimeEntryData | null;
  activeEntry: TimeEntryData;
};

@Injectable()
export class TimeEntryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly projectSecurity: ProjectSecurityService,
  ) {}

  async addManual(
    workspaceId: string,
    userId: string,
    taskId: string,
    dto: ManualTimeEntryDto,
  ): Promise<TimeEntryData> {
    await this.assertTaskUnlocked(workspaceId, userId, taskId);
    await this.findTaskOrThrow(workspaceId, taskId);

    let startTime: Date;
    let endTime: Date;
    let duration: number;

    if (dto.startTime && dto.endTime) {
      startTime = new Date(dto.startTime);
      endTime = new Date(dto.endTime);
      duration = Math.round((endTime.getTime() - startTime.getTime()) / 1000);
    } else {
      // durationMinutes provided — anchor end to now
      const minutes = dto.durationMinutes!;
      endTime = new Date();
      startTime = new Date(endTime.getTime() - minutes * 60 * 1000);
      duration = minutes * 60;
    }

    const entry = await this.prisma.timeEntry.create({
      data: {
        taskId,
        userId,
        description: dto.description ?? null,
        startTime,
        endTime,
        duration,
        isManual: true,
      },
      select: TIME_ENTRY_SELECT,
    });

    await this.prisma.activityLog.create({
      data: {
        workspaceId,
        entityType: 'time_entry',
        entityId: entry.id,
        action: 'manual_logged',
        metadata: { taskId, duration },
        performedBy: userId,
      },
    });

    return entry;
  }

  async startTimer(
    workspaceId: string,
    userId: string,
    taskId: string,
  ): Promise<StartTimerResult> {
    await this.assertTaskUnlocked(workspaceId, userId, taskId);
    await this.findTaskOrThrow(workspaceId, taskId);

    // Auto-stop any existing active timer for this user in the workspace
    const existingActive = await this.findActiveTimerForUser(workspaceId, userId);
    let stoppedEntry: TimeEntryData | null = null;

    if (existingActive) {
      stoppedEntry = await this.stopActiveEntry(workspaceId, userId, existingActive.id);
    }

    const now = new Date();
    const activeEntry = await this.prisma.timeEntry.create({
      data: {
        taskId,
        userId,
        startTime: now,
        isManual: false,
      },
      select: TIME_ENTRY_SELECT,
    });

    await this.prisma.activityLog.create({
      data: {
        workspaceId,
        entityType: 'time_entry',
        entityId: activeEntry.id,
        action: 'timer_started',
        metadata: { taskId },
        performedBy: userId,
      },
    });

    return { stoppedEntry, activeEntry };
  }

  async stopTimer(workspaceId: string, userId: string, taskId: string): Promise<TimeEntryData> {
    await this.assertTaskUnlocked(workspaceId, userId, taskId);
    await this.findTaskOrThrow(workspaceId, taskId);

    const active = await this.prisma.timeEntry.findFirst({
      where: {
        userId,
        taskId,
        endTime: null,
        deletedAt: null,
      },
      select: { id: true },
    });

    if (!active) throw new NotFoundException(NO_ACTIVE_TIMER);

    return this.stopActiveEntry(workspaceId, userId, active.id);
  }

  async findAllByTask(workspaceId: string, userId: string, taskId: string): Promise<TimeEntryData[]> {
    const task = await this.findTaskOrThrow(workspaceId, taskId);
    await this.projectSecurity.assertUnlocked(workspaceId, task.projectId, userId);

    return this.prisma.timeEntry.findMany({
      where: { taskId, deletedAt: null },
      select: TIME_ENTRY_SELECT,
      orderBy: { startTime: 'desc' },
    });
  }

  async findActiveTimer(workspaceId: string, userId: string): Promise<TimeEntryData | null> {
    return this.findActiveTimerForUser(workspaceId, userId);
  }

  async update(
    workspaceId: string,
    userId: string,
    entryId: string,
    dto: UpdateTimeEntryDto,
  ): Promise<TimeEntryData> {
    const entry = await this.findEntryOrThrow(workspaceId, entryId);
    await this.assertTaskUnlocked(workspaceId, userId, entry.taskId);

    if (entry.userId !== userId) throw new ForbiddenException(FORBIDDEN_TIME_ENTRY);

    const updateData: Prisma.TimeEntryUpdateInput = {};

    if (dto.description !== undefined) updateData.description = dto.description;

    if (dto.startTime !== undefined || dto.endTime !== undefined) {
      const newStart = dto.startTime ? new Date(dto.startTime) : entry.startTime;
      const newEnd = dto.endTime ? new Date(dto.endTime) : entry.endTime;

      updateData.startTime = newStart;
      if (newEnd) {
        updateData.endTime = newEnd;
        updateData.duration = Math.round((newEnd.getTime() - newStart.getTime()) / 1000);
      }
    }

    if (Object.keys(updateData).length === 0) return entry;

    const updated = await this.prisma.timeEntry.update({
      where: { id: entryId },
      data: updateData,
      select: TIME_ENTRY_SELECT,
    });

    await this.prisma.activityLog.create({
      data: {
        workspaceId,
        entityType: 'time_entry',
        entityId: entryId,
        action: 'updated',
        metadata: {},
        performedBy: userId,
      },
    });

    return updated;
  }

  async remove(workspaceId: string, userId: string, entryId: string): Promise<void> {
    const entry = await this.findEntryOrThrow(workspaceId, entryId);
    await this.assertTaskUnlocked(workspaceId, userId, entry.taskId);

    if (entry.userId !== userId) throw new ForbiddenException(FORBIDDEN_TIME_ENTRY);

    await this.prisma.$transaction(async (tx) => {
      await tx.timeEntry.update({ where: { id: entryId }, data: { deletedAt: new Date() } });
      await tx.activityLog.create({
        data: {
          workspaceId,
          entityType: 'time_entry',
          entityId: entryId,
          action: 'deleted',
          metadata: {},
          performedBy: userId,
        },
      });
    });
  }

  // ─── Private helpers ───────────────────────────────────────────────────────

  private async findTaskOrThrow(
    workspaceId: string,
    taskId: string,
  ): Promise<{ id: string; projectId: string; userId: string }> {
    const task = await this.prisma.task.findFirst({
      where: {
        id: taskId,
        deletedAt: null,
        list: { deletedAt: null, project: { workspaceId, deletedAt: null } },
      },
      select: {
        id: true,
        createdBy: true,
        list: { select: { projectId: true } },
      },
    });
    if (!task) throw new NotFoundException(TASK_NOT_FOUND);
    return { id: task.id, projectId: task.list.projectId, userId: task.createdBy };
  }

  private async findEntryOrThrow(workspaceId: string, entryId: string): Promise<TimeEntryData> {
    const entry = await this.prisma.timeEntry.findFirst({
      where: {
        id: entryId,
        deletedAt: null,
        task: { deletedAt: null, list: { deletedAt: null, project: { workspaceId, deletedAt: null } } },
      },
      select: TIME_ENTRY_SELECT,
    });
    if (!entry) throw new NotFoundException(TIME_ENTRY_NOT_FOUND);
    return entry;
  }

  private async findActiveTimerForUser(
    workspaceId: string,
    userId: string,
  ): Promise<TimeEntryData | null> {
    const unlockedProjectIds = await this.projectSecurity.activeUnlockedWorkspaceProjectIds(
      workspaceId,
      userId,
    );

    return this.prisma.timeEntry.findFirst({
      where: {
        userId,
        endTime: null,
        deletedAt: null,
        task: {
          deletedAt: null,
          list: {
            deletedAt: null,
            project: {
              workspaceId,
              deletedAt: null,
              OR: [{ passwordHash: null }, { id: { in: Array.from(unlockedProjectIds) } }],
            },
          },
        },
      },
      select: TIME_ENTRY_SELECT,
    });
  }

  private async assertTaskUnlocked(
    workspaceId: string,
    userId: string,
    taskId: string,
  ): Promise<void> {
    const task = await this.findTaskOrThrow(workspaceId, taskId);
    await this.projectSecurity.assertUnlocked(workspaceId, task.projectId, userId);
  }

  private async stopActiveEntry(
    workspaceId: string,
    userId: string,
    entryId: string,
  ): Promise<TimeEntryData> {
    const entry = await this.prisma.timeEntry.findFirstOrThrow({
      where: { id: entryId },
      select: { startTime: true },
    });

    const now = new Date();
    const duration = Math.round((now.getTime() - entry.startTime.getTime()) / 1000);

    const stopped = await this.prisma.timeEntry.update({
      where: { id: entryId },
      data: { endTime: now, duration },
      select: TIME_ENTRY_SELECT,
    });

    await this.prisma.activityLog.create({
      data: {
        workspaceId,
        entityType: 'time_entry',
        entityId: entryId,
        action: 'timer_stopped',
        metadata: { duration },
        performedBy: userId,
      },
    });

    return stopped;
  }
}
