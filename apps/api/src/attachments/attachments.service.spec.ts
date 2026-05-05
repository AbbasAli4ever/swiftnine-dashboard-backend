import { BadRequestException } from '@nestjs/common';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { AttachmentsService } from './attachments.service';

jest.mock('@app/database', () => ({
  PrismaService: class PrismaService {},
}));

jest.mock('@aws-sdk/s3-request-presigner', () => ({
  getSignedUrl: jest
    .fn()
    .mockResolvedValue('https://signed.example.com/object'),
}));

describe('AttachmentsService doc attachments', () => {
  let service: AttachmentsService;
  let prisma: {
    doc: { findFirst: jest.Mock };
    attachment: {
      create: jest.Mock;
      findMany: jest.Mock;
      findFirst: jest.Mock;
      update: jest.Mock;
    };
    task: { findFirst: jest.Mock };
    workspaceMember: { findFirst: jest.Mock };
    channelMember: { findFirst: jest.Mock };
  };
  let activity: { log: jest.Mock };
  let docPermissions: {
    assertCanEdit: jest.Mock;
    assertCanView: jest.Mock;
  };

  beforeEach(() => {
    process.env.AWS_S3_BUCKET = 'bucket';
    prisma = {
      doc: { findFirst: jest.fn() },
      attachment: {
        create: jest.fn(),
        findMany: jest.fn(),
        findFirst: jest.fn(),
        update: jest.fn(),
      },
      task: { findFirst: jest.fn() },
      workspaceMember: { findFirst: jest.fn() },
      channelMember: { findFirst: jest.fn() },
    };
    activity = { log: jest.fn().mockResolvedValue(undefined) };
    docPermissions = {
      assertCanEdit: jest.fn().mockResolvedValue('EDITOR'),
      assertCanView: jest.fn().mockResolvedValue('VIEWER'),
    };
    service = new AttachmentsService(
      prisma as never,
      activity as never,
      docPermissions as never,
    );
  });

  it('uses a doc S3 prefix and requires edit access when presigning doc uploads', async () => {
    prisma.doc.findFirst.mockResolvedValue(docFixture());

    const result = await service.presignUpload('user-1', {
      docId: 'doc-1',
      fileName: 'hello world.png',
      mimeType: 'image/png',
    });

    expect(docPermissions.assertCanEdit).toHaveBeenCalledWith(
      'user-1',
      docFixture(),
    );
    expect(result.s3Key).toContain('attachments/doc-doc-1/');
    expect(result.s3Key).toContain('hello_world.png');
  });

  it('rejects presign requests with multiple upload scopes', async () => {
    await expect(
      service.presignUpload('user-1', {
        taskId: 'task-1',
        docId: 'doc-1',
        mimeType: 'image/png',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('creates doc attachments with doc ownership only', async () => {
    prisma.doc.findFirst.mockResolvedValue(docFixture());
    prisma.attachment.create.mockResolvedValue({
      id: 'attachment-1',
      s3Key: 'swiftnine/docs/app/attachments/doc-doc-1/file.png',
      fileName: 'file.png',
      mimeType: 'image/png',
      fileSize: BigInt(123),
      createdAt: new Date('2026-04-28T00:00:00.000Z'),
    });

    const result = await service.createAttachmentForDoc(
      'user-1',
      'doc-1',
      'swiftnine/docs/app/attachments/doc-doc-1/file.png',
      'file.png',
      'image/png',
      123,
    );

    expect(prisma.attachment.create).toHaveBeenCalledWith({
      data: {
        docId: 'doc-1',
        uploadedBy: 'user-1',
        fileName: 'file.png',
        s3Key: 'swiftnine/docs/app/attachments/doc-doc-1/file.png',
        mimeType: 'image/png',
        fileSize: BigInt(123),
      },
      select: expect.any(Object),
    });
    expect(result.fileSize).toBe(123);
  });

  it('rejects doc attachment records for keys outside the doc prefix', async () => {
    prisma.doc.findFirst.mockResolvedValue(docFixture());

    await expect(
      service.createAttachmentForDoc(
        'user-1',
        'doc-1',
        'swiftnine/docs/app/attachments/doc-other/file.png',
        'file.png',
        'image/png',
        123,
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(prisma.attachment.create).not.toHaveBeenCalled();
  });

  it('lists doc attachments only after view access is confirmed', async () => {
    prisma.doc.findFirst.mockResolvedValue(docFixture());
    prisma.attachment.findMany.mockResolvedValue([
      {
        id: 'attachment-1',
        fileName: 'file.png',
        mimeType: 'image/png',
        s3Key: 'swiftnine/docs/app/attachments/doc-doc-1/file.png',
        fileSize: BigInt(123),
      },
    ]);

    const result = await service.listAttachmentsForDoc('user-1', 'doc-1');

    expect(docPermissions.assertCanView).toHaveBeenCalledWith(
      'user-1',
      docFixture(),
    );
    expect(prisma.attachment.findMany).toHaveBeenCalledWith({
      where: { docId: 'doc-1', deletedAt: null },
      select: {
        id: true,
        fileName: true,
        mimeType: true,
        s3Key: true,
        fileSize: true,
      },
      orderBy: { createdAt: 'asc' },
    });
    expect(getSignedUrl).toHaveBeenCalled();
    expect(result[0]).toMatchObject({
      id: 'attachment-1',
      fileSize: 123,
      url: 'https://signed.example.com/object',
    });
  });

  it('soft deletes doc attachments with edit access', async () => {
    prisma.doc.findFirst.mockResolvedValue(docFixture());
    prisma.attachment.findFirst.mockResolvedValue({
      id: 'attachment-1',
      s3Key: 'swiftnine/docs/app/attachments/doc-doc-1/file.png',
      fileName: 'file.png',
      mimeType: 'image/png',
      fileSize: BigInt(123),
    });
    prisma.attachment.update.mockResolvedValue({ id: 'attachment-1' });

    await service.deleteAttachmentForDoc(
      'user-1',
      'doc-1',
      'swiftnine/docs/app/attachments/doc-doc-1/file.png',
    );

    expect(prisma.attachment.update).toHaveBeenCalledWith({
      where: { id: 'attachment-1' },
      data: { deletedAt: expect.any(Date) },
    });
  });

  it('creates a staged attachment row for channel-message presign requests', async () => {
    prisma.channelMember.findFirst.mockResolvedValue({
      id: 'channel-member-1',
      channel: { id: 'channel-1', workspaceId: 'workspace-1' },
    });
    prisma.attachment.create.mockResolvedValue({ id: 'attachment-99' });

    const result = await service.presignUpload('user-1', {
      scope: 'channel-message',
      channelId: 'channel-1',
      fileName: 'board shot.png',
      mimeType: 'image/png',
      fileSize: 2048,
    });

    expect(prisma.attachment.create).toHaveBeenCalledWith({
      data: {
        channelMessageId: null,
        uploadedBy: 'user-1',
        fileName: 'board shot.png',
        s3Key: expect.stringContaining('attachments/channel-channel-1/'),
        mimeType: 'image/png',
        fileSize: BigInt(2048),
      },
      select: { id: true },
    });
    expect(result.attachmentId).toBe('attachment-99');
  });
});

function docFixture() {
  return {
    id: 'doc-1',
    workspaceId: 'workspace-1',
    projectId: null,
    ownerId: 'owner-1',
    scope: 'WORKSPACE',
    title: 'Launch notes',
  };
}
