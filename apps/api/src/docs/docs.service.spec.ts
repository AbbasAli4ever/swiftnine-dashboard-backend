import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { DocSaveConflictException, DocsService } from './docs.service';

jest.mock('@app/database', () => ({
  PrismaService: class PrismaService {},
}));

jest.mock('node:crypto', () => ({
  randomUUID: jest.fn(() => 'block-id'),
}));

describe('DocsService', () => {
  let service: DocsService;
  let prisma: {
    $transaction: jest.Mock;
    workspaceMember: { findFirst: jest.Mock };
    project: { findFirst: jest.Mock };
    docCommentThread: { updateMany: jest.Mock };
    doc: {
      create: jest.Mock;
      findMany: jest.Mock;
      findFirst: jest.Mock;
      update: jest.Mock;
    };
  };
  let permissions: {
    assertCanView: jest.Mock;
    assertCanEdit: jest.Mock;
    assertCanOwn: jest.Mock;
    resolveEffectiveRole: jest.Mock;
  };

  beforeEach(() => {
    prisma = {
      $transaction: jest.fn(async (callback: (tx: unknown) => unknown) => callback(prisma)),
      workspaceMember: { findFirst: jest.fn() },
      project: { findFirst: jest.fn() },
      docCommentThread: { updateMany: jest.fn().mockResolvedValue({ count: 0 }) },
      doc: {
        create: jest.fn(),
        findMany: jest.fn(),
        findFirst: jest.fn(),
        update: jest.fn(),
      },
    };
    permissions = {
      assertCanView: jest.fn(),
      assertCanEdit: jest.fn(),
      assertCanOwn: jest.fn(),
      resolveEffectiveRole: jest.fn(),
    };
    service = new DocsService(prisma as never, permissions as never);
  });

  it('creates a workspace doc with normalized content and plaintext', async () => {
    prisma.workspaceMember.findFirst.mockResolvedValue({ id: 'member-1' });
    prisma.doc.create.mockImplementation(async (args) => ({
      id: 'doc-1',
      deletedAt: null,
      createdAt: new Date('2026-04-28T00:00:00.000Z'),
      updatedAt: new Date('2026-04-28T00:00:00.000Z'),
      ...args.data,
    }));

    const result = await service.create('user-1', {
      title: '  Project brief  ',
      scope: 'WORKSPACE',
      workspaceId: 'workspace-1',
      contentJson: {
        type: 'doc',
        content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Hello docs' }] }],
      },
    });

    expect(prisma.doc.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        title: 'Project brief',
        scope: 'WORKSPACE',
        workspaceId: 'workspace-1',
        projectId: null,
        ownerId: 'user-1',
        plaintext: 'Hello docs',
        version: 1,
      }),
      select: expect.any(Object),
    });
    expect(result.title).toBe('Project brief');
  });

  it('requires a projectId for project docs and verifies the project belongs to the workspace', async () => {
    prisma.workspaceMember.findFirst.mockResolvedValue({ id: 'member-1' });

    await expect(
      service.create('user-1', {
        title: 'Project notes',
        scope: 'PROJECT',
        workspaceId: 'workspace-1',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);

    expect(prisma.project.findFirst).not.toHaveBeenCalled();
  });

  it('denies creation when the user is not a workspace member', async () => {
    prisma.workspaceMember.findFirst.mockResolvedValue(null);

    await expect(
      service.create('user-1', {
        title: 'Private notes',
        scope: 'PERSONAL',
        workspaceId: 'workspace-1',
      }),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('filters listing by effective view permission', async () => {
    prisma.workspaceMember.findFirst.mockResolvedValue({ id: 'member-1' });
    const docs = [
      docFixture({ id: 'doc-1', ownerId: 'owner-1' }),
      docFixture({ id: 'doc-2', ownerId: 'owner-2' }),
    ];
    prisma.doc.findMany.mockResolvedValue(docs);
    permissions.resolveEffectiveRole
      .mockResolvedValueOnce('VIEWER')
      .mockResolvedValueOnce(null);

    const result = await service.findAll('user-1', { workspaceId: 'workspace-1' });

    expect(result).toEqual([docs[0]]);
  });

  it('increments version when content changes', async () => {
    const doc = docFixture({ version: 3 });
    prisma.doc.findFirst.mockResolvedValue(doc);
    prisma.doc.update.mockResolvedValue({ ...doc, version: 4, plaintext: 'Updated' });
    permissions.assertCanEdit.mockResolvedValue('EDITOR');

    await service.update('user-1', 'doc-1', {
      contentJson: {
        type: 'doc',
        content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Updated' }] }],
      },
    });

    expect(prisma.doc.update).toHaveBeenCalledWith({
      where: { id: 'doc-1' },
      data: expect.objectContaining({
        plaintext: 'Updated',
        version: { increment: 1 },
      }),
      select: expect.any(Object),
    });
  });

  it('soft deletes owner-accessible docs', async () => {
    const doc = docFixture({});
    prisma.doc.findFirst.mockResolvedValue(doc);
    prisma.doc.update.mockResolvedValue(doc);
    permissions.assertCanOwn.mockResolvedValue('OWNER');

    await service.remove('user-1', 'doc-1');

    expect(prisma.doc.update).toHaveBeenCalledWith({
      where: { id: 'doc-1' },
      data: { deletedAt: expect.any(Date) },
      select: { id: true },
    });
  });

  it('autosaves a locked block', async () => {
    const doc = docFixture({ contentJson: docContent({ 'block-1': 'Old' }) });
    prisma.doc.findFirst.mockResolvedValue(doc);
    prisma.doc.update.mockResolvedValue({
      ...doc,
      version: 2,
      contentJson: docContent({ 'block-1': 'New' }),
      plaintext: 'New',
    });
    permissions.assertCanEdit.mockResolvedValue('EDITOR');

    const result = await service.autosave(
      'user-1',
      {
        docId: 'doc-1',
        baseVersion: 1,
        contentJson: docContent({ 'block-1': 'New' }),
        lockedBlockIds: ['block-1'],
      },
      10_000,
    );

    expect(prisma.doc.update).toHaveBeenCalledWith({
      where: { id: 'doc-1' },
      data: expect.objectContaining({
        plaintext: 'New',
        version: { increment: 1 },
      }),
      select: expect.any(Object),
    });
    expect(result.changedBlockIds).toEqual(['block-1']);
  });

  it('rejects autosave changes to unlocked existing blocks', async () => {
    const doc = docFixture({ contentJson: docContent({ 'block-1': 'Old' }) });
    prisma.doc.findFirst.mockResolvedValue(doc);
    permissions.assertCanEdit.mockResolvedValue('EDITOR');

    await expect(
      service.autosave(
        'user-1',
        {
          docId: 'doc-1',
          baseVersion: 1,
          contentJson: docContent({ 'block-1': 'New' }),
          lockedBlockIds: [],
        },
        10_000,
      ),
    ).rejects.toMatchObject({
      conflictBlockIds: ['block-1'],
      reason: 'Modified blocks must be locked by the saving user',
    });
  });

  it('accepts stale non-overlapping autosaves by merging changed blocks', async () => {
    const base = docContent({ 'block-1': 'A1', 'block-2': 'B1' });
    const afterUserOne = docContent({ 'block-1': 'A2', 'block-2': 'B1' });
    const afterUserTwo = docContent({ 'block-1': 'A1', 'block-2': 'B2' });
    prisma.doc.findFirst
      .mockResolvedValueOnce(docFixture({ version: 1, contentJson: base }))
      .mockResolvedValueOnce(docFixture({ version: 2, contentJson: afterUserOne }));
    prisma.doc.update
      .mockResolvedValueOnce(docFixture({ version: 2, contentJson: afterUserOne }))
      .mockResolvedValueOnce(docFixture({ version: 3 }));
    permissions.assertCanEdit.mockResolvedValue('EDITOR');

    await service.autosave(
      'user-1',
      {
        docId: 'doc-1',
        baseVersion: 1,
        contentJson: afterUserOne,
        lockedBlockIds: ['block-1'],
      },
      10_000,
    );
    await service.autosave(
      'user-2',
      {
        docId: 'doc-1',
        baseVersion: 1,
        contentJson: afterUserTwo,
        lockedBlockIds: ['block-2'],
      },
      11_000,
    );

    expect(prisma.doc.update).toHaveBeenLastCalledWith({
      where: { id: 'doc-1' },
      data: expect.objectContaining({
        contentJson: docContent({ 'block-1': 'A2', 'block-2': 'B2' }),
        plaintext: 'A2 B2',
      }),
      select: expect.any(Object),
    });
  });

  it('rejects stale overlapping autosaves', async () => {
    const base = docContent({ 'block-1': 'A1' });
    const afterUserOne = docContent({ 'block-1': 'A2' });
    const afterUserTwo = docContent({ 'block-1': 'A3' });
    prisma.doc.findFirst
      .mockResolvedValueOnce(docFixture({ version: 1, contentJson: base }))
      .mockResolvedValueOnce(docFixture({ version: 2, contentJson: afterUserOne }));
    prisma.doc.update.mockResolvedValueOnce(
      docFixture({ version: 2, contentJson: afterUserOne }),
    );
    permissions.assertCanEdit.mockResolvedValue('EDITOR');

    await service.autosave(
      'user-1',
      {
        docId: 'doc-1',
        baseVersion: 1,
        contentJson: afterUserOne,
        lockedBlockIds: ['block-1'],
      },
      10_000,
    );

    await expect(
      service.autosave(
        'user-2',
        {
          docId: 'doc-1',
          baseVersion: 1,
          contentJson: afterUserTwo,
          lockedBlockIds: ['block-1'],
        },
        11_000,
      ),
    ).rejects.toBeInstanceOf(DocSaveConflictException);
  });

  it('marks anchored comment threads orphaned when their block is deleted', async () => {
    const doc = docFixture({
      contentJson: docContent({ 'block-1': 'Gone', 'block-2': 'Kept' }),
    });
    prisma.doc.findFirst.mockResolvedValue(doc);
    prisma.doc.update.mockResolvedValue({
      ...doc,
      version: 2,
      contentJson: docContent({ 'block-2': 'Kept' }),
    });
    prisma.docCommentThread.updateMany.mockResolvedValue({ count: 1 });
    permissions.assertCanEdit.mockResolvedValue('EDITOR');

    const result = await service.autosave(
      'user-1',
      {
        docId: 'doc-1',
        baseVersion: 1,
        contentJson: docContent({ 'block-2': 'Kept' }),
        lockedBlockIds: ['block-1'],
      },
      10_000,
    );

    expect(prisma.docCommentThread.updateMany).toHaveBeenCalledWith({
      where: {
        docId: 'doc-1',
        isOrphan: false,
        anchorBlockId: { not: null, notIn: ['block-2'] },
      },
      data: { isOrphan: true },
    });
    expect(result.orphanedThreadCount).toBe(1);
  });
});

function docFixture(overrides: Record<string, unknown>) {
  return {
    id: 'doc-1',
    workspaceId: 'workspace-1',
    projectId: null,
    ownerId: 'owner-1',
    scope: 'WORKSPACE',
    title: 'Doc',
    contentJson: {},
    plaintext: '',
    version: 1,
    createdAt: new Date('2026-04-28T00:00:00.000Z'),
    updatedAt: new Date('2026-04-28T00:00:00.000Z'),
    deletedAt: null,
    ...overrides,
  };
}

function docContent(blocks: Record<string, string>) {
  return {
    type: 'doc',
    content: Object.entries(blocks).map(([id, text]) => ({
      type: 'paragraph',
      attrs: { id },
      content: [{ type: 'text', text }],
    })),
  };
}
