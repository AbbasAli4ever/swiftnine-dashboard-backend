import { ForbiddenException } from '@nestjs/common';
import { RolesGuard } from './roles.guard';

jest.mock('@app/database', () => ({
  PrismaService: class PrismaService {},
  DatabaseModule: class DatabaseModule {},
}));

const createContext = (request: any) =>
  ({
    getHandler: jest.fn(),
    getClass: jest.fn(),
    switchToHttp: () => ({
      getRequest: () => request,
    }),
  }) as any;

describe('RolesGuard', () => {
  let reflector: { getAllAndOverride: jest.Mock };
  let prisma: {
    workspaceMember: {
      findFirst: jest.Mock;
    };
  };
  let guard: RolesGuard;

  beforeEach(() => {
    reflector = {
      getAllAndOverride: jest.fn().mockReturnValue(['OWNER']),
    };
    prisma = {
      workspaceMember: {
        findFirst: jest.fn(),
      },
    };
    guard = new RolesGuard(reflector as any, prisma as any);
  });

  it('allows a request when WorkspaceGuard already resolved an owner role', async () => {
    const request = {
      user: { id: 'user-1' },
      workspaceContext: { workspaceId: 'workspace-1', role: 'OWNER' },
    };

    await expect(guard.canActivate(createContext(request))).resolves.toBe(true);
    expect(prisma.workspaceMember.findFirst).not.toHaveBeenCalled();
  });

  it('rejects a resolved member role for an owner-only endpoint', async () => {
    const request = {
      user: { id: 'user-1' },
      workspaceContext: { workspaceId: 'workspace-1', role: 'MEMBER' },
    };
    prisma.workspaceMember.findFirst.mockResolvedValue({
      workspaceId: 'workspace-1',
      role: 'MEMBER',
    });

    await expect(guard.canActivate(createContext(request))).rejects.toBeInstanceOf(
      ForbiddenException,
    );
  });

  it('can resolve the workspace from the request body for legacy member-management routes', async () => {
    const request = {
      user: { id: 'owner-1' },
      headers: {},
      body: { workspaceId: 'workspace-1' },
    };
    prisma.workspaceMember.findFirst.mockResolvedValue({
      workspaceId: 'workspace-1',
      role: 'OWNER',
    });

    await expect(guard.canActivate(createContext(request))).resolves.toBe(true);
    expect(request.workspaceContext).toEqual({
      workspaceId: 'workspace-1',
      role: 'OWNER',
    });
  });
});
