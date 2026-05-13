import { GUARDS_METADATA } from '@nestjs/common/constants';
import { ok } from '@app/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ProjectUnlockedGuard } from '../project-security/guards/project-unlocked.guard';
import { WorkspaceGuard } from '../workspace/workspace.guard';
import { ProjectAttachmentsController } from './project-attachments.controller';

jest.mock('@app/common', () => ({
  ok: jest.fn((data, message) => ({ data, message, success: true })),
}));

describe('ProjectAttachmentsController', () => {
  let controller: ProjectAttachmentsController;
  let attachmentsService: {
    presignProjectUpload: jest.Mock;
    confirmProjectUpload: jest.Mock;
    createProjectLink: jest.Mock;
    listProjectAttachments: jest.Mock;
    getProjectAttachment: jest.Mock;
    updateProjectAttachment: jest.Mock;
    deleteProjectAttachment: jest.Mock;
  };

  const req = {
    user: { id: 'user-1' },
    workspaceContext: {
      workspaceId: 'workspace-1',
      role: 'ADMIN',
    },
  } as never;

  beforeEach(() => {
    attachmentsService = {
      presignProjectUpload: jest.fn().mockResolvedValue({ uploadUrl: 'url' }),
      confirmProjectUpload: jest.fn().mockResolvedValue(projectAttachment()),
      createProjectLink: jest.fn().mockResolvedValue(projectAttachment()),
      listProjectAttachments: jest.fn().mockResolvedValue({
        items: [projectAttachment()],
        nextCursor: null,
        limit: 50,
      }),
      getProjectAttachment: jest.fn().mockResolvedValue(projectAttachment()),
      updateProjectAttachment: jest.fn().mockResolvedValue(projectAttachment()),
      deleteProjectAttachment: jest.fn().mockResolvedValue({
        id: 'attachment-1',
        s3Key: null,
      }),
    };
    controller = new ProjectAttachmentsController(attachmentsService as never);
    jest.clearAllMocks();
  });

  it('uses JWT, workspace, and project unlock guards', () => {
    const guards = Reflect.getMetadata(
      GUARDS_METADATA,
      ProjectAttachmentsController,
    );

    expect(guards).toEqual([
      JwtAuthGuard,
      WorkspaceGuard,
      ProjectUnlockedGuard,
    ]);
  });

  it('passes identity and project scope when presigning', async () => {
    const dto = {
      fileName: 'brief.pdf',
      mimeType: 'application/pdf',
      fileSize: 100,
    };

    await controller.presignProjectAttachment(req, 'project-1', dto);

    expect(attachmentsService.presignProjectUpload).toHaveBeenCalledWith(
      'user-1',
      'workspace-1',
      'project-1',
      dto,
    );
    expect(ok).toHaveBeenCalledWith(
      { uploadUrl: 'url' },
      'Presigned URL generated',
    );
  });

  it('passes identity and project scope when confirming uploads', async () => {
    const dto = {
      s3Key: 'swiftnine/docs/app/attachments/project-project-1/file.pdf',
    };

    await controller.confirmProjectAttachment(req, 'project-1', dto);

    expect(attachmentsService.confirmProjectUpload).toHaveBeenCalledWith(
      'user-1',
      'workspace-1',
      'project-1',
      dto,
    );
  });

  it('passes identity and project scope when creating links', async () => {
    const dto = {
      linkUrl: 'https://example.com/reference',
      title: 'Reference',
    };

    await controller.createProjectLink(req, 'project-1', dto);

    expect(attachmentsService.createProjectLink).toHaveBeenCalledWith(
      'user-1',
      'workspace-1',
      'project-1',
      dto,
    );
  });

  it('passes list filters to the service', async () => {
    const query = {
      kind: 'LINK' as const,
      q: 'reference',
      limit: 25,
    };

    await controller.listProjectAttachments(req, 'project-1', query);

    expect(attachmentsService.listProjectAttachments).toHaveBeenCalledWith(
      'user-1',
      'workspace-1',
      'project-1',
      query,
    );
  });

  it('passes attachment ids for get routes', async () => {
    await controller.getProjectAttachment(req, 'project-1', 'attachment-1');

    expect(attachmentsService.getProjectAttachment).toHaveBeenCalledWith(
      'user-1',
      'workspace-1',
      'project-1',
      'attachment-1',
    );
  });

  it('passes workspace role for metadata updates', async () => {
    const dto = { title: 'Updated title' };

    await controller.updateProjectAttachment(
      req,
      'project-1',
      'attachment-1',
      dto,
    );

    expect(attachmentsService.updateProjectAttachment).toHaveBeenCalledWith(
      'user-1',
      'workspace-1',
      'ADMIN',
      'project-1',
      'attachment-1',
      dto,
    );
  });

  it('passes workspace role for deletes', async () => {
    await controller.deleteProjectAttachment(req, 'project-1', 'attachment-1');

    expect(attachmentsService.deleteProjectAttachment).toHaveBeenCalledWith(
      'user-1',
      'workspace-1',
      'ADMIN',
      'project-1',
      'attachment-1',
    );
  });
});

function projectAttachment() {
  return {
    id: 'attachment-1',
    kind: 'LINK',
    title: 'Reference',
    description: null,
    uploadedBy: {
      id: 'user-1',
      name: 'User One',
      avatarUrl: null,
    },
    createdAt: new Date('2026-05-13T10:30:00.000Z'),
    linkUrl: 'https://example.com/reference',
  };
}
