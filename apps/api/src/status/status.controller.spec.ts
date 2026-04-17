import { StatusController } from './status.controller';
import { StatusService } from './status.service';
import type { WorkspaceRequest } from '../workspace/workspace.types';

jest.mock('@app/database', () => ({
  PrismaService: class PrismaService {},
  DatabaseModule: class DatabaseModule {},
}));

describe('StatusController', () => {
  let controller: StatusController;
  let statusService: {
    reorder: jest.Mock;
  };

  beforeEach(() => {
    statusService = {
      reorder: jest.fn(),
    };

    controller = new StatusController(statusService as unknown as StatusService);
  });

  it('returns reordered grouped statuses from the controller', async () => {
    statusService.reorder.mockResolvedValue({
      projectId: 'project-1',
      groups: {
        notStarted: [],
        active: [],
        done: [],
        closed: [],
      },
    });

    const request = {
      user: { id: 'user-1' },
      workspaceContext: {
        workspaceId: 'workspace-1',
        role: 'OWNER',
      },
    } as unknown as WorkspaceRequest;

    const result = await controller.reorder(request, {
      projectId: 'project-1',
      groups: {
        notStarted: [],
        active: [],
        done: [],
        closed: [],
      },
    });

    expect(statusService.reorder).toHaveBeenCalledWith(
      'workspace-1',
      'user-1',
      'OWNER',
      {
        projectId: 'project-1',
        groups: {
          notStarted: [],
          active: [],
          done: [],
          closed: [],
        },
      },
    );
    expect(result).toEqual({
      success: true,
      data: {
        projectId: 'project-1',
        groups: {
          notStarted: [],
          active: [],
          done: [],
          closed: [],
        },
      },
      message: 'Statuses reordered successfully',
    });
  });
});
