import { DocSearchService } from './doc-search.service';

jest.mock('@app/database', () => ({
  PrismaService: class PrismaService {},
}));

describe('DocSearchService', () => {
  let service: DocSearchService;
  let prisma: { $queryRawUnsafe: jest.Mock };
  let permissions: { resolveEffectiveRole: jest.Mock };

  beforeEach(() => {
    prisma = { $queryRawUnsafe: jest.fn() };
    permissions = { resolveEffectiveRole: jest.fn() };
    service = new DocSearchService(prisma as never, permissions as never);
  });

  it('returns only permission-viewable search rows', async () => {
    const rows = [
      rowFixture({ id: 'doc-1' }),
      rowFixture({ id: 'doc-2' }),
    ];
    prisma.$queryRawUnsafe.mockResolvedValue(rows);
    permissions.resolveEffectiveRole
      .mockResolvedValueOnce('VIEWER')
      .mockResolvedValueOnce(null);

    const results = await service.search({
      query: 'launch',
      workspaceId: 'workspace-1',
      userId: 'user-1',
    });

    expect(results).toEqual([rows[0]]);
  });

  it('returns no rows for blank search queries', async () => {
    const results = await service.search({
      query: '   ',
      workspaceId: 'workspace-1',
      userId: 'user-1',
    });

    expect(results).toEqual([]);
    expect(prisma.$queryRawUnsafe).not.toHaveBeenCalled();
  });
});

function rowFixture(overrides: Record<string, unknown>) {
  return {
    id: 'doc-1',
    title: 'Launch plan',
    scope: 'WORKSPACE',
    workspaceId: 'workspace-1',
    projectId: null,
    ownerId: 'owner-1',
    updatedAt: new Date('2026-04-28T00:00:00.000Z'),
    snippet: 'Launch plan',
    ...overrides,
  };
}
