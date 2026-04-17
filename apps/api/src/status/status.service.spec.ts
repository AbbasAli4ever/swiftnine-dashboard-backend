import { BadRequestException } from '@nestjs/common';
import { StatusService } from './status.service';

jest.mock('@app/database', () => ({
  PrismaService: class PrismaService {},
}));

describe('StatusService', () => {
  let service: StatusService;
  let prisma: {
    project: {
      findFirst: jest.Mock;
    };
    status: {
      create: jest.Mock;
      findFirst: jest.Mock;
      findMany: jest.Mock;
      update: jest.Mock;
    };
    task: {
      count: jest.Mock;
      updateMany: jest.Mock;
    };
    activityLog: {
      create: jest.Mock;
      createMany: jest.Mock;
    };
    $transaction: jest.Mock;
  };

  beforeEach(() => {
    prisma = {
      project: {
        findFirst: jest.fn(),
      },
      status: {
        create: jest.fn(),
        findFirst: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
      },
      task: {
        count: jest.fn(),
        updateMany: jest.fn(),
      },
      activityLog: {
        create: jest.fn().mockResolvedValue(undefined),
        createMany: jest.fn().mockResolvedValue({ count: 0 }),
      },
      $transaction: jest.fn(),
    };

    prisma.$transaction.mockImplementation(async (callback: (tx: typeof prisma) => unknown) =>
      callback(prisma),
    );

    service = new StatusService(prisma as never);
  });

  it('creates a custom status at the next position within its group', async () => {
    prisma.project.findFirst.mockResolvedValue({
      id: 'project-1',
      name: 'Backend API',
    });
    prisma.status.findFirst
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ position: 2000 });
    prisma.status.create.mockResolvedValue({
      id: 'status-1',
      projectId: 'project-1',
      name: 'QA Ready',
      color: '#f59e0b',
      group: 'DONE',
      position: 3000,
      isDefault: false,
      isProtected: false,
      isClosed: false,
      createdAt: new Date('2026-04-16T12:00:00.000Z'),
      updatedAt: new Date('2026-04-16T12:00:00.000Z'),
    });

    const result = await service.create('workspace-1', 'user-1', 'OWNER', {
      projectId: 'project-1',
      name: '  QA Ready  ',
      color: '#f59e0b',
      group: 'DONE',
    });

    expect(prisma.status.create).toHaveBeenCalledWith({
      data: {
        projectId: 'project-1',
        name: 'QA Ready',
        color: '#f59e0b',
        group: 'DONE',
        position: 3000,
        isDefault: false,
        isProtected: false,
        isClosed: false,
      },
      select: expect.any(Object),
    });
    expect(result.position).toBe(3000);
  });

  it('rejects color updates on the protected closed status', async () => {
    prisma.status.findFirst.mockResolvedValue({
      id: 'status-1',
      projectId: 'project-1',
      name: 'Complete',
      color: '#22c55e',
      group: 'CLOSED',
      position: 1000,
      isDefault: true,
      isProtected: true,
      isClosed: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      project: { name: 'Backend API' },
    });

    await expect(
      service.update('workspace-1', 'status-1', 'user-1', 'OWNER', {
        color: '#000000',
      }),
    ).rejects.toThrow(
      new BadRequestException('The protected closed status can only be renamed'),
    );
  });

  it('deletes a mutable status and reassigns its tasks when a replacement is provided', async () => {
    prisma.status.findFirst
      .mockResolvedValueOnce({
        id: 'status-1',
        projectId: 'project-1',
        name: 'Blocked',
        color: '#ef4444',
        group: 'ACTIVE',
        position: 2000,
        isDefault: false,
        isProtected: false,
        isClosed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        project: { name: 'Backend API' },
      })
      .mockResolvedValueOnce({ id: 'status-2' });
    prisma.task.count.mockResolvedValue(3);
    prisma.task.updateMany.mockResolvedValue({ count: 3 });
    prisma.status.update.mockResolvedValue(undefined);

    await service.remove('workspace-1', 'status-1', 'user-1', 'OWNER', {
      replacementStatusId: 'status-2',
    });

    expect(prisma.task.updateMany).toHaveBeenCalledWith({
      where: { statusId: 'status-1', deletedAt: null },
      data: { statusId: 'status-2' },
    });
    expect(prisma.status.update).toHaveBeenCalledWith({
      where: { id: 'status-1' },
      data: { deletedAt: expect.any(Date) },
    });
  });

  it('rejects reorder payloads that do not preserve exactly one protected closed status', async () => {
    prisma.project.findFirst.mockResolvedValue({
      id: 'project-1',
      name: 'Backend API',
    });
    prisma.status.findMany.mockResolvedValue([
      {
        id: 'status-1',
        projectId: 'project-1',
        name: 'To Do',
        color: '#94a3b8',
        group: 'NOT_STARTED',
        position: 1000,
        isDefault: true,
        isProtected: false,
        isClosed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'status-2',
        projectId: 'project-1',
        name: 'In Progress',
        color: '#3b82f6',
        group: 'ACTIVE',
        position: 1000,
        isDefault: true,
        isProtected: false,
        isClosed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'status-3',
        projectId: 'project-1',
        name: 'Complete',
        color: '#22c55e',
        group: 'CLOSED',
        position: 1000,
        isDefault: true,
        isProtected: true,
        isClosed: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    await expect(
      service.reorder('workspace-1', 'user-1', 'OWNER', {
        projectId: 'project-1',
        groups: {
          notStarted: ['status-1'],
          active: ['status-2', 'status-3'],
          done: [],
          closed: [],
        },
      }),
    ).rejects.toThrow(
      new BadRequestException(
        'Closed group must contain exactly one protected closed status',
      ),
    );
  });
});
