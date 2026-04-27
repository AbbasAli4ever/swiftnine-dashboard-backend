import { BadRequestException } from '@nestjs/common';
import { TaskListService } from './task-list.service';

jest.mock('@app/database', () => ({
  PrismaService: class PrismaService {},
}));

describe('TaskListService', () => {
  let service: TaskListService;
  let prisma: {
    project: {
      findFirst: jest.Mock;
    };
    taskList: {
      findFirst: jest.Mock;
      update: jest.Mock;
    };
    workspaceMember: {
      findFirst: jest.Mock;
    };
    activityLog: {
      createMany: jest.Mock;
    };
  };

  beforeEach(() => {
    prisma = {
      project: {
        findFirst: jest.fn(),
      },
      taskList: {
        findFirst: jest.fn(),
        update: jest.fn(),
      },
      workspaceMember: {
        findFirst: jest.fn(),
      },
      activityLog: {
        createMany: jest.fn(),
      },
    };

    service = new TaskListService(prisma as never);
  });

  it('updates optional dashboard metadata and resolves owner from workspace member id', async () => {
    prisma.project.findFirst.mockResolvedValue({ id: 'project-1', name: 'Backend API' });
    prisma.taskList.findFirst.mockResolvedValueOnce({
      id: 'list-1',
      projectId: 'project-1',
      name: 'Backlog',
      position: 1000,
      startDate: null,
      endDate: null,
      ownerUserId: null,
      priority: null,
      isArchived: false,
      createdBy: 'user-9',
      createdAt: new Date('2026-04-20T00:00:00.000Z'),
      updatedAt: new Date('2026-04-20T00:00:00.000Z'),
      owner: null,
    });
    prisma.workspaceMember.findFirst.mockResolvedValue({
      userId: 'user-1',
      user: {
        id: 'user-1',
        fullName: 'Ayesha Khan',
        avatarUrl: null,
        avatarColor: '#6366f1',
      },
    });
    prisma.taskList.update.mockResolvedValue({
      id: 'list-1',
      projectId: 'project-1',
      name: 'Backlog',
      position: 1000,
      startDate: new Date('2026-04-24T00:00:00.000Z'),
      endDate: new Date('2026-04-30T00:00:00.000Z'),
      ownerUserId: 'user-1',
      priority: 'HIGH',
      isArchived: false,
      createdBy: 'user-9',
      createdAt: new Date('2026-04-20T00:00:00.000Z'),
      updatedAt: new Date('2026-04-27T00:00:00.000Z'),
      owner: {
        id: 'user-1',
        fullName: 'Ayesha Khan',
        avatarUrl: null,
        avatarColor: '#6366f1',
      },
    });
    prisma.activityLog.createMany.mockResolvedValue({ count: 4 });

    const result = await service.update('workspace-1', 'actor-1', 'project-1', 'list-1', {
      startDate: '2026-04-24',
      endDate: '2026-04-30',
      ownerId: 'member-1',
      priority: 'HIGH',
    });

    expect(prisma.taskList.update).toHaveBeenCalledWith({
      where: { id: 'list-1' },
      data: {
        startDate: new Date('2026-04-24T00:00:00.000Z'),
        endDate: new Date('2026-04-30T00:00:00.000Z'),
        priority: 'HIGH',
        owner: { connect: { id: 'user-1' } },
      },
      select: expect.any(Object),
    });
    expect(result).toEqual({
      id: 'list-1',
      projectId: 'project-1',
      name: 'Backlog',
      position: 1000,
      startDate: '2026-04-24',
      endDate: '2026-04-30',
      ownerUserId: 'user-1',
      priority: 'HIGH',
      isArchived: false,
      createdBy: 'user-9',
      createdAt: new Date('2026-04-20T00:00:00.000Z'),
      updatedAt: new Date('2026-04-27T00:00:00.000Z'),
      owner: {
        id: 'user-1',
        fullName: 'Ayesha Khan',
        avatarUrl: null,
        avatarColor: '#6366f1',
      },
    });
  });

  it('rejects a date range where start is after end', async () => {
    prisma.project.findFirst.mockResolvedValue({ id: 'project-1', name: 'Backend API' });
    prisma.taskList.findFirst.mockResolvedValueOnce({
      id: 'list-1',
      projectId: 'project-1',
      name: 'Backlog',
      position: 1000,
      startDate: null,
      endDate: null,
      ownerUserId: null,
      priority: null,
      isArchived: false,
      createdBy: 'user-9',
      createdAt: new Date('2026-04-20T00:00:00.000Z'),
      updatedAt: new Date('2026-04-20T00:00:00.000Z'),
      owner: null,
    });

    await expect(
      service.update('workspace-1', 'actor-1', 'project-1', 'list-1', {
        startDate: '2026-05-10',
        endDate: '2026-05-01',
      }),
    ).rejects.toThrow(BadRequestException);
  });
});
