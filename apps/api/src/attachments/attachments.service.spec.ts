import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { AttachmentsService } from './attachments.service';
import { CreateProjectLinkSchema } from './dto/create-project-link.dto';

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
    project: { findFirst: jest.Mock };
    workspaceMember: { findFirst: jest.Mock };
    channelMember: { findFirst: jest.Mock };
  };
  let activity: { log: jest.Mock };
  let docPermissions: {
    assertCanEdit: jest.Mock;
    assertCanView: jest.Mock;
  };
  let projectSecurity: {
    assertUnlocked: jest.Mock;
    activeUnlockedWorkspaceProjectIds: jest.Mock;
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
      project: { findFirst: jest.fn() },
      workspaceMember: { findFirst: jest.fn() },
      channelMember: { findFirst: jest.fn() },
    };
    activity = { log: jest.fn().mockResolvedValue(undefined) };
    docPermissions = {
      assertCanEdit: jest.fn().mockResolvedValue('EDITOR'),
      assertCanView: jest.fn().mockResolvedValue('VIEWER'),
    };
    projectSecurity = {
      assertUnlocked: jest.fn().mockResolvedValue(undefined),
      activeUnlockedWorkspaceProjectIds: jest
        .fn()
        .mockResolvedValue(new Set<string>()),
    };
    service = new AttachmentsService(
      prisma as never,
      activity as never,
      docPermissions as never,
      projectSecurity as never,
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

  it('presigns project uploads under the project attachment prefix', async () => {
    prisma.project.findFirst.mockResolvedValue(projectFixture());

    const result = await service.presignProjectUpload('user-1', 'workspace-1', 'project-1', {
      fileName: 'project brief.pdf',
      mimeType: 'application/pdf',
      fileSize: 2048,
    });

    expect(prisma.project.findFirst).toHaveBeenCalledWith({
      where: { id: 'project-1', workspaceId: 'workspace-1', deletedAt: null },
      select: { id: true, name: true, workspaceId: true },
    });
    expect(result.s3Key).toContain('attachments/project-project-1/');
    expect(result.s3Key).toContain('project_brief.pdf');
    expect(result.attachmentId).toBeNull();
  });

  it('confirms project file uploads as FILE attachments', async () => {
    prisma.project.findFirst.mockResolvedValue(projectFixture());
    prisma.attachment.create.mockResolvedValue(projectFileAttachmentFixture());

    const result = await service.confirmProjectUpload(
      'user-1',
      'workspace-1',
      'project-1',
      {
        s3Key: 'swiftnine/docs/app/attachments/project-project-1/file.pdf',
        fileName: 'file.pdf',
        mimeType: 'application/pdf',
        fileSize: 123,
        title: 'File title',
      },
    );

    expect(prisma.attachment.create).toHaveBeenCalledWith({
      data: {
        projectId: 'project-1',
        uploadedBy: 'user-1',
        kind: 'FILE',
        fileName: 'file.pdf',
        s3Key: 'swiftnine/docs/app/attachments/project-project-1/file.pdf',
        mimeType: 'application/pdf',
        fileSize: BigInt(123),
        linkUrl: null,
        title: 'File title',
        description: null,
      },
      select: expect.any(Object),
    });
    expect(activity.log).toHaveBeenCalledWith({
      workspaceId: 'workspace-1',
      entityType: 'attachment',
      entityId: 'attachment-file-1',
      action: 'attachment_uploaded',
      metadata: {
        projectId: 'project-1',
        projectName: 'Launch',
        kind: 'FILE',
        fileName: 'file.pdf',
        mimeType: 'application/pdf',
        fileSize: 123,
      },
      performedBy: 'user-1',
    });
    expect(result).toMatchObject({
      id: 'attachment-file-1',
      kind: 'FILE',
      fileName: 'file.pdf',
      mimeType: 'application/pdf',
      fileSize: 123,
      viewUrl: 'https://signed.example.com/object',
    });
  });

  it('rejects project file confirmations for keys outside the project prefix', async () => {
    prisma.project.findFirst.mockResolvedValue(projectFixture());

    await expect(
      service.confirmProjectUpload('user-1', 'workspace-1', 'project-1', {
        s3Key: 'swiftnine/docs/app/attachments/project-other/file.pdf',
        fileName: 'file.pdf',
        mimeType: 'application/pdf',
        fileSize: 123,
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(prisma.attachment.create).not.toHaveBeenCalled();
  });

  it('creates project link attachments without S3 metadata', async () => {
    prisma.project.findFirst.mockResolvedValue(projectFixture());
    prisma.attachment.create.mockResolvedValue(projectLinkAttachmentFixture());

    const result = await service.createProjectLink('user-1', 'workspace-1', 'project-1', {
      linkUrl: 'https://example.com/reference',
      title: 'Reference link',
      description: 'Useful reference',
    });

    expect(prisma.attachment.create).toHaveBeenCalledWith({
      data: {
        projectId: 'project-1',
        uploadedBy: 'user-1',
        kind: 'LINK',
        fileName: 'Reference link',
        s3Key: null,
        mimeType: null,
        fileSize: null,
        linkUrl: 'https://example.com/reference',
        title: 'Reference link',
        description: 'Useful reference',
      },
      select: expect.any(Object),
    });
    expect(activity.log).toHaveBeenCalledWith({
      workspaceId: 'workspace-1',
      entityType: 'attachment',
      entityId: 'attachment-link-1',
      action: 'attachment_linked',
      metadata: {
        projectId: 'project-1',
        projectName: 'Launch',
        kind: 'LINK',
        linkUrl: 'https://example.com/reference',
        title: 'Reference link',
      },
      performedBy: 'user-1',
    });
    expect(result).toMatchObject({
      id: 'attachment-link-1',
      kind: 'LINK',
      linkUrl: 'https://example.com/reference',
    });
  });

  it('rejects project link URLs with unsupported schemes', () => {
    expect(() =>
      CreateProjectLinkSchema.parse({
        linkUrl: 'ftp://example.com/reference',
        title: 'Reference link',
      }),
    ).toThrow('linkUrl must start with http:// or https://');
  });

  it('lists project attachments with filters and cursor pagination', async () => {
    prisma.project.findFirst.mockResolvedValue(projectFixture());
    prisma.attachment.findMany.mockResolvedValue([
      projectLinkAttachmentFixture('attachment-link-2'),
      projectLinkAttachmentFixture('attachment-link-1'),
    ]);

    const result = await service.listProjectAttachments(
      'user-1',
      'workspace-1',
      'project-1',
      {
        kind: 'LINK',
        uploadedBy: 'user-1',
        q: 'reference',
        limit: 1,
      },
    );

    expect(prisma.attachment.findMany).toHaveBeenCalledWith({
      where: expect.objectContaining({
        projectId: 'project-1',
        deletedAt: null,
        kind: 'LINK',
        uploadedBy: 'user-1',
        OR: expect.any(Array),
      }),
      select: expect.any(Object),
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      take: 2,
    });
    expect(result.items).toHaveLength(1);
    expect(result.nextCursor).toContain('attachment-link-2');
  });

  it('lists FILE project attachments with signed view URLs', async () => {
    prisma.project.findFirst.mockResolvedValue(projectFixture());
    prisma.attachment.findMany.mockResolvedValue([
      projectFileAttachmentFixture('attachment-file-1'),
    ]);

    const result = await service.listProjectAttachments(
      'user-1',
      'workspace-1',
      'project-1',
      { kind: 'FILE', limit: 50 },
    );

    expect(prisma.attachment.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          projectId: 'project-1',
          deletedAt: null,
          kind: 'FILE',
        }),
      }),
    );
    expect(result.items[0]).toMatchObject({
      kind: 'FILE',
      viewUrl: 'https://signed.example.com/object',
    });
  });

  it('returns single file attachments with view URLs', async () => {
    prisma.project.findFirst.mockResolvedValue(projectFixture());
    prisma.attachment.findFirst.mockResolvedValue(projectFileAttachmentFixture());

    const result = await service.getProjectAttachment(
      'user-1',
      'workspace-1',
      'project-1',
      'attachment-file-1',
    );

    expect(result).toMatchObject({
      id: 'attachment-file-1',
      kind: 'FILE',
      viewUrl: 'https://signed.example.com/object',
    });
  });

  it('returns single link attachments without view URLs', async () => {
    prisma.project.findFirst.mockResolvedValue(projectFixture());
    prisma.attachment.findFirst.mockResolvedValue(projectLinkAttachmentFixture());

    const result = await service.getProjectAttachment(
      'user-1',
      'workspace-1',
      'project-1',
      'attachment-link-1',
    );

    expect(result).toMatchObject({
      id: 'attachment-link-1',
      kind: 'LINK',
      linkUrl: 'https://example.com/reference',
    });
    expect(result).not.toHaveProperty('viewUrl');
  });

  it('searches project attachments without leaking locked projects', async () => {
    projectSecurity.activeUnlockedWorkspaceProjectIds.mockResolvedValue(
      new Set(['project-unlocked']),
    );
    prisma.attachment.findMany.mockResolvedValue([
      projectAttachmentSearchFixture(),
    ]);

    const result = await service.searchProjectAttachments(
      'user-1',
      'workspace-1',
      { q: 'reference', limit: 10 },
    );

    expect(projectSecurity.activeUnlockedWorkspaceProjectIds).toHaveBeenCalledWith(
      'workspace-1',
      'user-1',
    );
    expect(prisma.attachment.findMany).toHaveBeenCalledWith({
      where: {
        projectId: { not: null },
        deletedAt: null,
        project: {
          workspaceId: 'workspace-1',
          deletedAt: null,
          OR: [
            { passwordHash: null },
            { id: { in: ['project-unlocked'] } },
          ],
        },
        OR: [
          { fileName: { contains: 'reference', mode: 'insensitive' } },
          { title: { contains: 'reference', mode: 'insensitive' } },
          { description: { contains: 'reference', mode: 'insensitive' } },
          { linkUrl: { contains: 'reference', mode: 'insensitive' } },
        ],
      },
      select: expect.any(Object),
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      take: 10,
    });
    expect(result).toEqual([
      {
        id: 'attachment-link-1',
        entityType: 'project_attachment',
        projectId: 'project-1',
        kind: 'LINK',
        title: 'Reference link',
        fileName: 'Reference link',
        description: 'Useful reference',
        linkUrl: 'https://example.com/reference',
        createdAt: new Date('2026-05-13T10:30:00.000Z'),
        uploadedBy: {
          id: 'user-1',
          name: 'User One',
          avatarUrl: null,
        },
      },
    ]);
  });

  it('searches a specific project only after the project is unlocked', async () => {
    prisma.attachment.findMany.mockResolvedValue([
      projectAttachmentSearchFixture(),
    ]);

    await service.searchProjectAttachments('user-1', 'workspace-1', {
      q: 'reference',
      projectId: 'project-1',
    });

    expect(projectSecurity.assertUnlocked).toHaveBeenCalledWith(
      'workspace-1',
      'project-1',
      'user-1',
    );
    expect(
      projectSecurity.activeUnlockedWorkspaceProjectIds,
    ).not.toHaveBeenCalled();
    expect(prisma.attachment.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          projectId: 'project-1',
          project: {
            workspaceId: 'workspace-1',
            deletedAt: null,
          },
        }),
      }),
    );
  });

  it('updates project attachment metadata for uploader or admins only', async () => {
    prisma.project.findFirst.mockResolvedValue(projectFixture());
    prisma.attachment.findFirst.mockResolvedValue({
      id: 'attachment-link-1',
      uploadedBy: 'user-1',
      kind: 'LINK',
      title: 'Reference link',
      description: 'Useful reference',
    });
    prisma.attachment.update.mockResolvedValue(
      projectLinkAttachmentFixture('attachment-link-1', 'Updated link'),
    );

    const result = await service.updateProjectAttachment(
      'user-1',
      'workspace-1',
      'MEMBER',
      'project-1',
      'attachment-link-1',
      { title: 'Updated link' },
    );

    expect(prisma.attachment.update).toHaveBeenCalledWith({
      where: { id: 'attachment-link-1' },
      data: { title: 'Updated link', fileName: 'Updated link' },
      select: expect.any(Object),
    });
    expect(activity.log).toHaveBeenCalledWith({
      workspaceId: 'workspace-1',
      entityType: 'attachment',
      entityId: 'attachment-link-1',
      action: 'attachment_updated',
      metadata: {
        projectId: 'project-1',
        projectName: 'Launch',
        kind: 'LINK',
        changedFields: ['title'],
        old: {
          title: 'Reference link',
          description: 'Useful reference',
        },
        new: {
          title: 'Updated link',
          description: 'Useful reference',
        },
      },
      performedBy: 'user-1',
    });
    expect(result.title).toBe('Updated link');
  });

  it('blocks project attachment metadata updates by other members', async () => {
    prisma.project.findFirst.mockResolvedValue(projectFixture());
    prisma.attachment.findFirst.mockResolvedValue({
      id: 'attachment-link-1',
      uploadedBy: 'user-1',
      kind: 'LINK',
    });

    await expect(
      service.updateProjectAttachment(
        'user-2',
        'workspace-1',
        'MEMBER',
        'project-1',
        'attachment-link-1',
        { title: 'Nope' },
      ),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('updates project attachment metadata for workspace admins', async () => {
    prisma.project.findFirst.mockResolvedValue(projectFixture());
    prisma.attachment.findFirst.mockResolvedValue({
      id: 'attachment-link-1',
      uploadedBy: 'user-1',
      kind: 'LINK',
      title: 'Reference link',
      description: 'Useful reference',
    });
    prisma.attachment.update.mockResolvedValue(
      projectLinkAttachmentFixture('attachment-link-1', 'Admin updated link'),
    );

    await service.updateProjectAttachment(
      'admin-1',
      'workspace-1',
      'ADMIN',
      'project-1',
      'attachment-link-1',
      { title: 'Admin updated link' },
    );

    expect(prisma.attachment.update).toHaveBeenCalledWith({
      where: { id: 'attachment-link-1' },
      data: { title: 'Admin updated link', fileName: 'Admin updated link' },
      select: expect.any(Object),
    });
  });

  it('soft deletes project attachments for admins', async () => {
    prisma.project.findFirst.mockResolvedValue(projectFixture());
    prisma.attachment.findFirst.mockResolvedValue({
      id: 'attachment-file-1',
      uploadedBy: 'user-1',
      kind: 'FILE',
      fileName: 'file.pdf',
      mimeType: 'application/pdf',
      fileSize: BigInt(123),
      s3Key: 'swiftnine/docs/app/attachments/project-project-1/file.pdf',
      linkUrl: null,
    });
    prisma.attachment.update.mockResolvedValue({ id: 'attachment-file-1' });

    const result = await service.deleteProjectAttachment(
      'admin-1',
      'workspace-1',
      'ADMIN',
      'project-1',
      'attachment-file-1',
    );

    expect(prisma.attachment.update).toHaveBeenCalledWith({
      where: { id: 'attachment-file-1' },
      data: { deletedAt: expect.any(Date) },
    });
    expect(activity.log).toHaveBeenCalledWith({
      workspaceId: 'workspace-1',
      entityType: 'attachment',
      entityId: 'attachment-file-1',
      action: 'attachment_deleted',
      metadata: {
        projectId: 'project-1',
        projectName: 'Launch',
        kind: 'FILE',
        fileName: 'file.pdf',
        mimeType: 'application/pdf',
        fileSize: 123,
        linkUrl: null,
      },
      performedBy: 'admin-1',
    });
    expect(result).toEqual({
      id: 'attachment-file-1',
      s3Key: 'swiftnine/docs/app/attachments/project-project-1/file.pdf',
    });
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

function projectFixture() {
  return {
    id: 'project-1',
    name: 'Launch',
    workspaceId: 'workspace-1',
  };
}

function projectFileAttachmentFixture(id = 'attachment-file-1') {
  return {
    id,
    kind: 'FILE',
    title: 'File title',
    description: null,
    fileName: 'file.pdf',
    mimeType: 'application/pdf',
    fileSize: BigInt(123),
    s3Key: 'swiftnine/docs/app/attachments/project-project-1/file.pdf',
    linkUrl: null,
    uploadedBy: 'user-1',
    createdAt: new Date('2026-05-13T10:30:00.000Z'),
    uploader: {
      id: 'user-1',
      fullName: 'User One',
      avatarUrl: null,
    },
  };
}

function projectLinkAttachmentFixture(
  id = 'attachment-link-1',
  title = 'Reference link',
) {
  return {
    id,
    kind: 'LINK',
    title,
    description: 'Useful reference',
    fileName: title,
    mimeType: null,
    fileSize: null,
    s3Key: null,
    linkUrl: 'https://example.com/reference',
    uploadedBy: 'user-1',
    createdAt: new Date('2026-05-13T10:30:00.000Z'),
    uploader: {
      id: 'user-1',
      fullName: 'User One',
      avatarUrl: null,
    },
  };
}

function projectAttachmentSearchFixture() {
  return {
    id: 'attachment-link-1',
    projectId: 'project-1',
    kind: 'LINK',
    title: 'Reference link',
    description: 'Useful reference',
    fileName: 'Reference link',
    linkUrl: 'https://example.com/reference',
    createdAt: new Date('2026-05-13T10:30:00.000Z'),
    uploader: {
      id: 'user-1',
      fullName: 'User One',
      avatarUrl: null,
    },
  };
}
