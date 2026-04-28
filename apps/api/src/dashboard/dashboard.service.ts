import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@app/database';
import type { Priority, StatusGroup } from '@app/database/generated/prisma/client';

type ProjectRecord = {
  id: string;
  name: string;
  color: string;
  icon: string | null;
  taskIdPrefix: string;
};

type StatusRecord = {
  id: string;
  name: string;
  color: string;
  group: StatusGroup;
  position: number;
};

type ListRecord = {
  id: string;
  name: string;
  position: number;
  startDate: Date | null;
  endDate: Date | null;
  ownerUserId: string | null;
  priority: Priority | null;
  owner: {
    id: string;
    fullName: string;
    avatarUrl: string | null;
    avatarColor: string;
  } | null;
};

type TaskStatsRecord = {
  statusId: string;
  listId: string;
};

type AttachmentRecord = {
  id: string;
  fileName: string;
  mimeType: string;
  fileSize: bigint;
  createdAt: Date;
  uploader: {
    id: string;
    fullName: string;
    avatarUrl: string | null;
    avatarColor: string;
  };
  task: {
    id: string;
    title: string;
    taskNumber: number;
    list: {
      id: string;
      name: string;
    };
  } | null;
};

export type ProjectDashboardData = {
  project: {
    id: string;
    name: string;
    color: string;
    icon: string | null;
  };
  statusSummary: Array<{
    statusId: string;
    name: string;
    color: string;
    group: StatusGroup;
    position: number;
    count: number;
  }>;
  lists: Array<{
    id: string;
    name: string;
    position: number;
    startDate: string | null;
    endDate: string | null;
    ownerUserId: string | null;
    priority: Priority | null;
    owner: {
      id: string;
      fullName: string;
      avatarUrl: string | null;
      avatarColor: string;
    } | null;
    taskCount: number;
    completedCount: number;
    openCount: number;
  }>;
  attachments: Array<{
    id: string;
    taskId: string;
    taskKey: string;
    taskTitle: string;
    listId: string;
    listName: string;
    fileName: string;
    mimeType: string;
    fileSize: number;
    createdAt: Date;
    uploadedBy: {
      id: string;
      fullName: string;
      avatarUrl: string | null;
      avatarColor: string;
    };
  }>;
  docs: Record<string, never>[];
};

const PROJECT_NOT_FOUND = 'Project not found';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getProjectDashboard(
    workspaceId: string,
    projectId: string,
  ): Promise<ProjectDashboardData> {
    const project = await this.findProjectOrThrow(workspaceId, projectId);

    const [statuses, lists, tasks, attachments] = await Promise.all([
      this.prisma.status.findMany({
        where: { projectId, deletedAt: null },
        select: {
          id: true,
          name: true,
          color: true,
          group: true,
          position: true,
        },
        orderBy: [{ group: 'asc' }, { position: 'asc' }],
      }),
      this.prisma.taskList.findMany({
        where: {
          projectId,
          deletedAt: null,
          isArchived: false,
        },
        select: {
          id: true,
          name: true,
          position: true,
          startDate: true,
          endDate: true,
          ownerUserId: true,
          priority: true,
          owner: {
            select: {
              id: true,
              fullName: true,
              avatarUrl: true,
              avatarColor: true,
            },
          },
        },
        orderBy: { position: 'asc' },
      }),
      this.prisma.task.findMany({
        where: {
          deletedAt: null,
          depth: 0,
          list: {
            deletedAt: null,
            isArchived: false,
            project: {
              id: projectId,
              workspaceId,
              deletedAt: null,
              isArchived: false,
            },
          },
        },
        select: {
          statusId: true,
          listId: true,
        },
      }),
      this.prisma.attachment.findMany({
        where: {
          deletedAt: null,
          task: {
            deletedAt: null,
            list: {
              deletedAt: null,
              isArchived: false,
              project: {
                id: projectId,
                workspaceId,
                deletedAt: null,
                isArchived: false,
              },
            },
          },
        },
        select: {
          id: true,
          fileName: true,
          mimeType: true,
          fileSize: true,
          createdAt: true,
          uploader: {
            select: {
              id: true,
              fullName: true,
              avatarUrl: true,
              avatarColor: true,
            },
          },
          task: {
            select: {
              id: true,
              title: true,
              taskNumber: true,
              list: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      }),
    ]);

    return {
      project: {
        id: project.id,
        name: project.name,
        color: project.color,
        icon: project.icon,
      },
      statusSummary: this.buildStatusSummary(statuses, tasks),
      lists: this.buildListSummary(lists, tasks, statuses),
      attachments: this.buildAttachments(attachments, project.taskIdPrefix),
      docs: [],
    };
  }

  private buildStatusSummary(
    statuses: StatusRecord[],
    tasks: TaskStatsRecord[],
  ): ProjectDashboardData['statusSummary'] {
    const taskCountByStatus = new Map<string, number>();

    for (const task of tasks) {
      taskCountByStatus.set(task.statusId, (taskCountByStatus.get(task.statusId) ?? 0) + 1);
    }

    return statuses.map((status) => ({
      statusId: status.id,
      name: status.name,
      color: status.color,
      group: status.group,
      position: status.position,
      count: taskCountByStatus.get(status.id) ?? 0,
    }));
  }

  private buildListSummary(
    lists: ListRecord[],
    tasks: TaskStatsRecord[],
    statuses: StatusRecord[],
  ): ProjectDashboardData['lists'] {
    const closedStatusIds = new Set(
      statuses.filter((status) => status.group === 'CLOSED').map((status) => status.id),
    );
    const listStats = new Map<string, { taskCount: number; completedCount: number }>();

    for (const task of tasks) {
      const current = listStats.get(task.listId) ?? { taskCount: 0, completedCount: 0 };
      current.taskCount += 1;
      if (closedStatusIds.has(task.statusId)) {
        current.completedCount += 1;
      }
      listStats.set(task.listId, current);
    }

    return lists.map((list) => {
      const current = listStats.get(list.id) ?? { taskCount: 0, completedCount: 0 };
      return {
        id: list.id,
        name: list.name,
        position: list.position,
        startDate: this.formatDateOnly(list.startDate),
        endDate: this.formatDateOnly(list.endDate),
        ownerUserId: list.ownerUserId,
        priority: list.priority,
        owner: list.owner,
        taskCount: current.taskCount,
        completedCount: current.completedCount,
        openCount: current.taskCount - current.completedCount,
      };
    });
  }

  private buildAttachments(
    attachments: AttachmentRecord[],
    taskIdPrefix: string,
  ): ProjectDashboardData['attachments'] {
    return attachments.flatMap((attachment) => attachment.task ? [{
      id: attachment.id,
      taskId: attachment.task.id,
      taskKey: `${taskIdPrefix}-${attachment.task.taskNumber}`,
      taskTitle: attachment.task.title,
      listId: attachment.task.list.id,
      listName: attachment.task.list.name,
      fileName: attachment.fileName,
      mimeType: attachment.mimeType,
      fileSize: Number(attachment.fileSize),
      createdAt: attachment.createdAt,
      uploadedBy: attachment.uploader,
    }] : []);
  }

  private formatDateOnly(value: Date | null): string | null {
    return value ? value.toISOString().slice(0, 10) : null;
  }

  private async findProjectOrThrow(
    workspaceId: string,
    projectId: string,
  ): Promise<ProjectRecord> {
    const project = await this.prisma.project.findFirst({
      where: {
        id: projectId,
        workspaceId,
        deletedAt: null,
        isArchived: false,
      },
      select: {
        id: true,
        name: true,
        color: true,
        icon: true,
        taskIdPrefix: true,
      },
    });

    if (!project) {
      throw new NotFoundException(PROJECT_NOT_FOUND);
    }

    return project;
  }
}
