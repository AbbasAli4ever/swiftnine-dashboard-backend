import { ForbiddenException } from '@nestjs/common';
import { DocPermissionsService } from './doc-permissions.service';

jest.mock('@app/database', () => ({
  PrismaService: class PrismaService {},
}));

describe('DocPermissionsService', () => {
  let service: DocPermissionsService;
  let prisma: {
    workspaceMember: { findFirst: jest.Mock };
    docPermission: { findUnique: jest.Mock };
  };

  beforeEach(() => {
    prisma = {
      workspaceMember: { findFirst: jest.fn() },
      docPermission: { findUnique: jest.fn() },
    };
    service = new DocPermissionsService(prisma as never);
  });

  it('resolves personal doc ownership', async () => {
    prisma.docPermission.findUnique.mockResolvedValue(null);

    const role = await service.resolveEffectiveRole('user-1', {
      id: 'doc-1',
      scope: 'PERSONAL',
      workspaceId: 'workspace-1',
      projectId: null,
      ownerId: 'user-1',
    });

    expect(role).toBe('OWNER');
    expect(prisma.workspaceMember.findFirst).not.toHaveBeenCalled();
  });

  it('inherits workspace access for members', async () => {
    prisma.workspaceMember.findFirst.mockResolvedValue({ role: 'MEMBER' });
    prisma.docPermission.findUnique.mockResolvedValue(null);

    await expect(
      service.resolveEffectiveRole('user-1', {
        id: 'doc-1',
        scope: 'WORKSPACE',
        workspaceId: 'workspace-1',
        projectId: null,
        ownerId: 'owner-1',
      }),
    ).resolves.toBe('EDITOR');
  });

  it('inherits project access through the parent workspace membership', async () => {
    prisma.workspaceMember.findFirst.mockResolvedValue({ role: 'OWNER' });
    prisma.docPermission.findUnique.mockResolvedValue(null);

    await expect(
      service.resolveEffectiveRole('user-1', {
        id: 'doc-1',
        scope: 'PROJECT',
        workspaceId: 'workspace-1',
        projectId: 'project-1',
        ownerId: 'owner-1',
      }),
    ).resolves.toBe('OWNER');
  });

  it('uses a higher per-doc override role', async () => {
    prisma.workspaceMember.findFirst.mockResolvedValue({ role: 'MEMBER' });
    prisma.docPermission.findUnique.mockResolvedValue({ role: 'OWNER' });

    await expect(
      service.resolveEffectiveRole('user-1', {
        id: 'doc-1',
        scope: 'WORKSPACE',
        workspaceId: 'workspace-1',
        projectId: null,
        ownerId: 'owner-1',
      }),
    ).resolves.toBe('OWNER');
  });

  it('denies users without membership or override', async () => {
    prisma.workspaceMember.findFirst.mockResolvedValue(null);
    prisma.docPermission.findUnique.mockResolvedValue(null);

    await expect(
      service.assertCanView('user-1', {
        id: 'doc-1',
        scope: 'WORKSPACE',
        workspaceId: 'workspace-1',
        projectId: null,
        ownerId: 'owner-1',
      }),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('denies workspace docs when only a stale override remains', async () => {
    prisma.workspaceMember.findFirst.mockResolvedValue(null);
    prisma.docPermission.findUnique.mockResolvedValue({ role: 'OWNER' });

    await expect(
      service.resolveEffectiveRole('user-1', {
        id: 'doc-1',
        scope: 'WORKSPACE',
        workspaceId: 'workspace-1',
        projectId: null,
        ownerId: 'owner-1',
      }),
    ).resolves.toBeNull();
  });

  it('allows explicit overrides on personal docs', async () => {
    prisma.docPermission.findUnique.mockResolvedValue({ role: 'VIEWER' });

    await expect(
      service.resolveEffectiveRole('user-1', {
        id: 'doc-1',
        scope: 'PERSONAL',
        workspaceId: 'workspace-1',
        projectId: null,
        ownerId: 'owner-1',
      }),
    ).resolves.toBe('VIEWER');
    expect(prisma.workspaceMember.findFirst).not.toHaveBeenCalled();
  });
});
