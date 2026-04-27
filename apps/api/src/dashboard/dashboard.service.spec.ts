import { NotFoundException } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

jest.mock('@app/database', () => ({
  PrismaService: class PrismaService {},
}));

describe('DashboardService', () => {
  let service: DashboardService;
  let prisma: {
    project: {
      findFirst: jest.Mock;
    };
    status: {
      findMany: jest.Mock;
    };
    taskList: {
      findMany: jest.Mock;
    };
    task: {
      findMany: jest.Mock;
    };
    attachment: {
      findMany: jest.Mock;
    };
  };

  beforeEach(() => {
    prisma = {
      project: {
        findFirst: jest.fn(),
      },
      status: {
        findMany: jest.fn(),
      },
      taskList: {
        findMany: jest.fn(),
      },
      task: {
        findMany: jest.fn(),
      },
      attachment: {
        findMany: jest.fn(),
      },
    };

    service = new DashboardService(prisma as never);
  });

  it('returns project dashboard aggregates and keeps zero-count statuses', async () => {
    prisma.project.findFirst.mockResolvedValue({
      id: 'project-1',
      name: 'Backend API',
      color: '#2563eb',
      icon: 'rocket',
      taskIdPrefix: 'API',
    });
    prisma.status.findMany.mockResolvedValue([
      {
        id: 'status-1',
        name: 'To Do',
        color: '#94a3b8',
        group: 'NOT_STARTED',
        position: 1000,
      },
      {
        id: 'status-2',
        name: 'In Progress',
        color: '#3b82f6',
        group: 'ACTIVE',
        position: 1000,
      },
      {
        id: 'status-3',
        name: 'Done',
        color: '#22c55e',
        group: 'DONE',
        position: 1000,
      },
    ]);
    prisma.taskList.findMany.mockResolvedValue([
      {
        id: 'list-1',
        name: 'Backlog',
        position: 1000,
        startDate: new Date('2026-04-24T00:00:00.000Z'),
        endDate: null,
        ownerUserId: 'user-1',
        priority: 'HIGH',
        owner: {
          id: 'user-1',
          fullName: 'Ayesha Khan',
          avatarUrl: null,
          avatarColor: '#6366f1',
        },
      },
      {
        id: 'list-2',
        name: 'Current Sprint',
        position: 2000,
        startDate: null,
        endDate: new Date('2026-04-30T00:00:00.000Z'),
        ownerUserId: null,
        priority: null,
        owner: null,
      },
    ]);
    prisma.task.findMany.mockResolvedValue([
      { statusId: 'status-1', listId: 'list-1', isCompleted: false },
      { statusId: 'status-2', listId: 'list-1', isCompleted: false },
      { statusId: 'status-2', listId: 'list-2', isCompleted: true },
    ]);
    prisma.attachment.findMany.mockResolvedValue([
      {
        id: 'attachment-1',
        fileName: 'api-contract.pdf',
        mimeType: 'application/pdf',
        fileSize: BigInt(245760),
        createdAt: new Date('2026-04-24T09:30:00.000Z'),
        uploader: {
          id: 'user-1',
          fullName: 'Ayesha Khan',
          avatarUrl: null,
          avatarColor: '#6366f1',
        },
        task: {
          id: 'task-1',
          title: 'Implement filters',
          taskNumber: 104,
          list: {
            id: 'list-2',
            name: 'Current Sprint',
          },
        },
      },
    ]);

    const result = await service.getProjectDashboard('workspace-1', 'project-1');

    expect(result.project).toEqual({
      id: 'project-1',
      name: 'Backend API',
      color: '#2563eb',
      icon: 'rocket',
    });
    expect(result.statusSummary).toEqual([
      {
        statusId: 'status-1',
        name: 'To Do',
        color: '#94a3b8',
        group: 'NOT_STARTED',
        position: 1000,
        count: 1,
      },
      {
        statusId: 'status-2',
        name: 'In Progress',
        color: '#3b82f6',
        group: 'ACTIVE',
        position: 1000,
        count: 2,
      },
      {
        statusId: 'status-3',
        name: 'Done',
        color: '#22c55e',
        group: 'DONE',
        position: 1000,
        count: 0,
      },
    ]);
    expect(result.lists).toEqual([
      {
        id: 'list-1',
        name: 'Backlog',
        position: 1000,
        startDate: '2026-04-24',
        endDate: null,
        ownerUserId: 'user-1',
        priority: 'HIGH',
        owner: {
          id: 'user-1',
          fullName: 'Ayesha Khan',
          avatarUrl: null,
          avatarColor: '#6366f1',
        },
        taskCount: 2,
        completedCount: 0,
        openCount: 2,
      },
      {
        id: 'list-2',
        name: 'Current Sprint',
        position: 2000,
        startDate: null,
        endDate: '2026-04-30',
        ownerUserId: null,
        priority: null,
        owner: null,
        taskCount: 1,
        completedCount: 1,
        openCount: 0,
      },
    ]);
    expect(result.attachments).toEqual([
      {
        id: 'attachment-1',
        taskId: 'task-1',
        taskKey: 'API-104',
        taskTitle: 'Implement filters',
        listId: 'list-2',
        listName: 'Current Sprint',
        fileName: 'api-contract.pdf',
        mimeType: 'application/pdf',
        fileSize: 245760,
        createdAt: new Date('2026-04-24T09:30:00.000Z'),
        uploadedBy: {
          id: 'user-1',
          fullName: 'Ayesha Khan',
          avatarUrl: null,
          avatarColor: '#6366f1',
        },
      },
    ]);
    expect(result.docs).toEqual([]);
  });

  it('queries only active project data for list stats and attachments', async () => {
    prisma.project.findFirst.mockResolvedValue({
      id: 'project-1',
      name: 'Backend API',
      color: '#2563eb',
      icon: null,
      taskIdPrefix: 'API',
    });
    prisma.status.findMany.mockResolvedValue([]);
    prisma.taskList.findMany.mockResolvedValue([]);
    prisma.task.findMany.mockResolvedValue([]);
    prisma.attachment.findMany.mockResolvedValue([]);

    await service.getProjectDashboard('workspace-1', 'project-1');

    expect(prisma.task.findMany).toHaveBeenCalledWith({
      where: {
        deletedAt: null,
        depth: 0,
        list: {
          deletedAt: null,
          isArchived: false,
          project: {
            id: 'project-1',
            workspaceId: 'workspace-1',
            deletedAt: null,
            isArchived: false,
          },
        },
      },
      select: {
        statusId: true,
        listId: true,
        isCompleted: true,
      },
    });
    expect(prisma.attachment.findMany).toHaveBeenCalledWith({
      where: {
        deletedAt: null,
        task: {
          deletedAt: null,
          list: {
            deletedAt: null,
            isArchived: false,
            project: {
              id: 'project-1',
              workspaceId: 'workspace-1',
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
    });
  });

  it('returns empty list stats when a project has lists but no top-level tasks', async () => {
    prisma.project.findFirst.mockResolvedValue({
      id: 'project-1',
      name: 'Backend API',
      color: '#2563eb',
      icon: null,
      taskIdPrefix: 'API',
    });
    prisma.status.findMany.mockResolvedValue([
      {
        id: 'status-1',
        name: 'To Do',
        color: '#94a3b8',
        group: 'NOT_STARTED',
        position: 1000,
      },
    ]);
    prisma.taskList.findMany.mockResolvedValue([
      {
        id: 'list-1',
        name: 'Backlog',
        position: 1000,
        startDate: null,
        endDate: null,
        ownerUserId: null,
        priority: null,
        owner: null,
      },
    ]);
    prisma.task.findMany.mockResolvedValue([]);
    prisma.attachment.findMany.mockResolvedValue([]);

    const result = await service.getProjectDashboard('workspace-1', 'project-1');

    expect(result.statusSummary[0]?.count).toBe(0);
    expect(result.lists).toEqual([
      {
        id: 'list-1',
        name: 'Backlog',
        position: 1000,
        startDate: null,
        endDate: null,
        ownerUserId: null,
        priority: null,
        owner: null,
        taskCount: 0,
        completedCount: 0,
        openCount: 0,
      },
    ]);
  });

  it('throws when the project does not exist in the workspace', async () => {
    prisma.project.findFirst.mockResolvedValue(null);

    await expect(
      service.getProjectDashboard('workspace-1', 'missing-project'),
    ).rejects.toThrow(new NotFoundException('Project not found'));
  });
});
