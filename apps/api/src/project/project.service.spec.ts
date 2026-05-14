import { ForbiddenException } from '@nestjs/common';
import { ProjectService } from './project.service';

jest.mock('@app/database', () => ({
  PrismaService: class PrismaService {},
}));

describe('ProjectService project deletion lifecycle', () => {
  let service: ProjectService;
  let prisma: {
    project: { findFirst: jest.Mock; update: jest.Mock };
    taskList: { findMany: jest.Mock; updateMany: jest.Mock };
    task: { updateMany: jest.Mock };
    status: { updateMany: jest.Mock };
    attachment: { updateMany: jest.Mock };
    activityLog: { create: jest.Mock };
    $transaction: jest.Mock;
  };
  let projectSecurity: { assertUnlocked: jest.Mock };

  beforeEach(() => {
    prisma = {
      project: {
        findFirst: jest.fn(),
        update: jest.fn(),
      },
      taskList: {
        findMany: jest.fn(),
        updateMany: jest.fn(),
      },
      task: { updateMany: jest.fn() },
      status: { updateMany: jest.fn() },
      attachment: { updateMany: jest.fn() },
      activityLog: { create: jest.fn() },
      $transaction: jest.fn((callback) => callback(prisma)),
    };
    projectSecurity = { assertUnlocked: jest.fn().mockResolvedValue(undefined) };
    service = new ProjectService(prisma as never, projectSecurity as never);
  });

  it('soft deletes project attachments when a project is removed', async () => {
    prisma.project.findFirst.mockResolvedValue({
      id: 'project-1',
      name: 'Launch',
    });
    prisma.taskList.findMany.mockResolvedValue([{ id: 'list-1' }]);

    await service.remove('workspace-1', 'project-1', 'owner-1', 'OWNER');

    expect(projectSecurity.assertUnlocked).toHaveBeenCalledWith(
      'workspace-1',
      'project-1',
      'owner-1',
    );
    expect(prisma.attachment.updateMany).toHaveBeenCalledWith({
      where: { projectId: 'project-1', deletedAt: null },
      data: { deletedAt: expect.any(Date) },
    });
    expect(prisma.project.update).toHaveBeenCalledWith({
      where: { id: 'project-1' },
      data: { deletedAt: expect.any(Date) },
    });
  });

  it('keeps project deletion owner-only', async () => {
    await expect(
      service.remove('workspace-1', 'project-1', 'admin-1', 'ADMIN'),
    ).rejects.toBeInstanceOf(ForbiddenException);

    expect(projectSecurity.assertUnlocked).not.toHaveBeenCalled();
    expect(prisma.project.findFirst).not.toHaveBeenCalled();
  });
});
