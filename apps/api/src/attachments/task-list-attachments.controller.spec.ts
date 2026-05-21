import { GUARDS_METADATA } from '@nestjs/common/constants';
import { ok } from '@app/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WorkspaceGuard } from '../workspace/workspace.guard';
import { TaskListAttachmentsController } from './task-list-attachments.controller';

jest.mock('@app/common', () => ({
  ok: jest.fn((data, message) => ({ data, message, success: true })),
}));

describe('TaskListAttachmentsController', () => {
  let controller: TaskListAttachmentsController;
  let attachmentsService: {
    presignTaskListUpload: jest.Mock;
    confirmTaskListUpload: jest.Mock;
    createTaskListLink: jest.Mock;
    listTaskListAttachments: jest.Mock;
    getTaskListAttachment: jest.Mock;
    updateTaskListAttachment: jest.Mock;
    deleteTaskListAttachment: jest.Mock;
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
      presignTaskListUpload: jest.fn().mockResolvedValue({ uploadUrl: 'url' }),
      confirmTaskListUpload: jest.fn().mockResolvedValue(taskListAttachment()),
      createTaskListLink: jest.fn().mockResolvedValue(taskListAttachment()),
      listTaskListAttachments: jest.fn().mockResolvedValue({
        items: [taskListAttachment()],
        nextCursor: null,
        limit: 50,
      }),
      getTaskListAttachment: jest.fn().mockResolvedValue(taskListAttachment()),
      updateTaskListAttachment: jest.fn().mockResolvedValue(taskListAttachment()),
      deleteTaskListAttachment: jest.fn().mockResolvedValue({
        id: 'attachment-1',
        s3Key: null,
      }),
    };
    controller = new TaskListAttachmentsController(
      attachmentsService as never,
    );
    jest.clearAllMocks();
  });

  it('uses JWT and workspace guards', () => {
    const guards = Reflect.getMetadata(
      GUARDS_METADATA,
      TaskListAttachmentsController,
    );

    expect(guards).toEqual([JwtAuthGuard, WorkspaceGuard]);
  });

  it('passes identity and list scope when presigning', async () => {
    const dto = {
      fileName: 'brief.pdf',
      mimeType: 'application/pdf',
      fileSize: 100,
    };

    await controller.presignTaskListAttachment(req, 'list-1', dto);

    expect(attachmentsService.presignTaskListUpload).toHaveBeenCalledWith(
      'user-1',
      'workspace-1',
      'list-1',
      dto,
    );
    expect(ok).toHaveBeenCalledWith(
      { uploadUrl: 'url' },
      'Presigned URL generated',
    );
  });

  it('passes identity and list scope when confirming uploads', async () => {
    const dto = {
      s3Key: 'swiftnine/docs/app/attachments/list-list-1/file.pdf',
    };

    await controller.confirmTaskListAttachment(req, 'list-1', dto);

    expect(attachmentsService.confirmTaskListUpload).toHaveBeenCalledWith(
      'user-1',
      'workspace-1',
      'list-1',
      dto,
    );
  });

  it('passes identity and list scope when creating links', async () => {
    const dto = {
      linkUrl: 'https://example.com/reference',
      title: 'Reference',
    };

    await controller.createTaskListLink(req, 'list-1', dto);

    expect(attachmentsService.createTaskListLink).toHaveBeenCalledWith(
      'user-1',
      'workspace-1',
      'list-1',
      dto,
    );
  });

  it('passes list filters to the service', async () => {
    const query = {
      kind: 'LINK' as const,
      q: 'reference',
      limit: 25,
    };

    await controller.listTaskListAttachments(req, 'list-1', query);

    expect(attachmentsService.listTaskListAttachments).toHaveBeenCalledWith(
      'user-1',
      'workspace-1',
      'list-1',
      query,
    );
  });

  it('passes attachment ids for get routes', async () => {
    await controller.getTaskListAttachment(req, 'list-1', 'attachment-1');

    expect(attachmentsService.getTaskListAttachment).toHaveBeenCalledWith(
      'user-1',
      'workspace-1',
      'list-1',
      'attachment-1',
    );
  });

  it('passes workspace role for metadata updates', async () => {
    const dto = { title: 'Updated title' };

    await controller.updateTaskListAttachment(
      req,
      'list-1',
      'attachment-1',
      dto,
    );

    expect(attachmentsService.updateTaskListAttachment).toHaveBeenCalledWith(
      'user-1',
      'workspace-1',
      'ADMIN',
      'list-1',
      'attachment-1',
      dto,
    );
  });

  it('passes workspace role for deletes', async () => {
    await controller.deleteTaskListAttachment(req, 'list-1', 'attachment-1');

    expect(attachmentsService.deleteTaskListAttachment).toHaveBeenCalledWith(
      'user-1',
      'workspace-1',
      'ADMIN',
      'list-1',
      'attachment-1',
    );
  });
});

function taskListAttachment() {
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
    createdAt: new Date('2026-05-21T10:30:00.000Z'),
    linkUrl: 'https://example.com/reference',
  };
}
