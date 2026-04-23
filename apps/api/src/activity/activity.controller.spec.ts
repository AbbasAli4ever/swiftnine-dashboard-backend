import { ActivityController } from './activity.controller';
import { ActivityService } from './activity.service';
import type { WorkspaceRequest } from '../workspace/workspace.types';

jest.mock('@app/database', () => ({
  PrismaService: class PrismaService {},
  DatabaseModule: class DatabaseModule {},
}));

describe('ActivityController', () => {
  let controller: ActivityController;
  let activityService: {
    listWorkspaceActivity: jest.Mock;
    listTaskActivity: jest.Mock;
  };

  beforeEach(() => {
    activityService = {
      listWorkspaceActivity: jest.fn(),
      listTaskActivity: jest.fn(),
    };

    controller = new ActivityController(activityService as unknown as ActivityService);
  });

  it('returns workspace activity from the service', async () => {
    activityService.listWorkspaceActivity.mockResolvedValue({
      items: [],
      nextCursor: null,
    });

    const request = {
      user: { id: 'user-1' },
      workspaceContext: { workspaceId: 'workspace-1', role: 'MEMBER' },
    } as unknown as WorkspaceRequest;

    const result = await controller.listWorkspaceActivity(request, {
      limit: 25,
      categories: ['status'],
    } as any);

    expect(activityService.listWorkspaceActivity).toHaveBeenCalledWith(
      'workspace-1',
      'user-1',
      { limit: 25, categories: ['status'] },
    );
    expect(result).toEqual({
      success: true,
      data: { items: [], nextCursor: null },
      message: null,
    });
  });

  it('returns task activity from the service', async () => {
    activityService.listTaskActivity.mockResolvedValue({
      items: [],
      nextCursor: null,
    });

    const request = {
      user: { id: 'user-1' },
      workspaceContext: { workspaceId: 'workspace-1', role: 'MEMBER' },
    } as unknown as WorkspaceRequest;

    await controller.listTaskActivity(request, 'task-1', { limit: 10 } as any);

    expect(activityService.listTaskActivity).toHaveBeenCalledWith(
      'workspace-1',
      'task-1',
      'user-1',
      { limit: 10 },
    );
  });
});
