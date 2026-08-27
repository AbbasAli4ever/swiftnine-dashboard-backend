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

  it('soft deletes project attachments when a workspace OWNER removes a project', async () => {
    projectSecurity.assertUnlocked.mockResolvedValue({
      id: 'project-1',
      name: 'Launch',
      createdBy: 'someone-else',
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

  it('lets a non-OWNER creator remove their own project', async () => {
    projectSecurity.assertUnlocked.mockResolvedValue({
      id: 'project-1',
      name: 'Launch',
      createdBy: 'member-1',
    });
    prisma.taskList.findMany.mockResolvedValue([]);

    await service.remove('workspace-1', 'project-1', 'member-1', 'MEMBER');

    expect(prisma.project.update).toHaveBeenCalledWith({
      where: { id: 'project-1' },
      data: { deletedAt: expect.any(Date) },
    });
  });

  it('rejects deletion by a non-OWNER who is not the creator', async () => {
    projectSecurity.assertUnlocked.mockResolvedValue({
      id: 'project-1',
      name: 'Launch',
      createdBy: 'someone-else',
    });

    await expect(
      service.remove('workspace-1', 'project-1', 'admin-1', 'ADMIN'),
    ).rejects.toBeInstanceOf(ForbiddenException);

    expect(projectSecurity.assertUnlocked).toHaveBeenCalledWith(
      'workspace-1',
      'project-1',
      'admin-1',
    );
    expect(prisma.project.update).not.toHaveBeenCalled();
  });
});
