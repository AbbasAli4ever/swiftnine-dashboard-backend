import { ActivityService } from './activity.service';

jest.mock('@app/database', () => ({
  PrismaService: class PrismaService {},
  DatabaseModule: class DatabaseModule {},
}));

describe('ActivityService', () => {
  let prisma: {
    activityLog: {
      create: jest.Mock;
      createMany: jest.Mock;
    };
  };
  let service: ActivityService;

  beforeEach(() => {
    prisma = {
      activityLog: {
        create: jest.fn(),
        createMany: jest.fn(),
      },
    };

    service = new ActivityService(prisma as any);
  });

  it('normalizes scalar values when logging a single activity', async () => {
    await service.log({
      workspaceId: 'workspace-1',
      entityType: 'task',
      entityId: 'task-1',
      action: 'status_changed',
      fieldName: 'status',
      oldValue: 'To do',
      newValue: 'In progress',
      metadata: { taskTitle: 'Build activity feed' },
      performedBy: 'user-1',
    });

    expect(prisma.activityLog.create).toHaveBeenCalledWith({
      data: {
        workspaceId: 'workspace-1',
        entityType: 'task',
        entityId: 'task-1',
        action: 'status_changed',
        fieldName: 'status',
        oldValue: 'To do',
        newValue: 'In progress',
        metadata: { taskTitle: 'Build activity feed' },
        performedBy: 'user-1',
      },
    });
  });

  it('maps actions and fields into ClickUp-style categories', () => {
    expect(service.getCategory('status_changed', 'task', 'status')).toBe('status');
    expect(service.getCategory('file_uploaded', 'attachment')).toBe('attachments');
    expect(service.getCategory('assignee_added', 'task')).toBe('assignee');
    expect(service.getCategory('created', 'project')).toBe('project');
  });
});
