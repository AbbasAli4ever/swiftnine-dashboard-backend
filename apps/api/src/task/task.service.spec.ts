import { TaskService } from './task.service';
import type { ListTasksQuery } from './dto/list-tasks-query.dto';

jest.mock('@app/database', () => ({
  PrismaService: class PrismaService {},
}));

describe('TaskService search and filter', () => {
  let prisma: {
    project: { findFirst: jest.Mock };
    taskList: { findFirst: jest.Mock };
    task: { count: jest.Mock; findMany: jest.Mock };
  };
  let service: TaskService;

  const baseQuery = (overrides: Partial<ListTasksQuery> = {}): ListTasksQuery =>
    ({
      page: 1,
      limit: 20,
      sortOrder: 'asc',
      assigneeMatch: 'any',
      tagMatch: 'any',
      includeSubtasks: false,
      includeClosed: true,
      includeArchived: false,
      me: false,
      ...overrides,
    }) as ListTasksQuery;

  beforeEach(() => {
    prisma = {
      project: { findFirst: jest.fn().mockResolvedValue({ id: 'project-1' }) },
      taskList: { findFirst: jest.fn().mockResolvedValue({ id: 'list-1' }) },
      task: {
        count: jest.fn().mockResolvedValue(0),
        findMany: jest.fn().mockResolvedValue([]),
      },
    };

    service = new TaskService(prisma as never, {} as never);
  });

  it('builds a paginated list query with stacked search filters', async () => {
    await service.findTasksByList(
      'workspace-1',
      'actor-1',
      'project-1',
      'list-1',
      baseQuery({
        q: 'CU-104',
        page: 2,
        limit: 10,
        sortBy: 'due_date',
        sortOrder: 'desc',
        statusIds: ['status-1'],
        priorities: ['HIGH', 'URGENT'],
        dueDateFrom: '2026-04-01',
        dueDateTo: '2026-04-30',
        assigneeIds: ['user-2'],
        tagIds: ['tag-1'],
      }),
    );

    expect(prisma.project.findFirst).toHaveBeenCalledWith({
      where: { id: 'project-1', workspaceId: 'workspace-1', deletedAt: null },
      select: { id: true },
    });
    expect(prisma.taskList.findFirst).toHaveBeenCalledWith({
      where: { id: 'list-1', projectId: 'project-1', deletedAt: null, isArchived: false },
      select: { id: true },
    });

    const countArgs = prisma.task.count.mock.calls[0][0];
    expect(countArgs.where).toMatchObject({
      deletedAt: null,
      listId: 'list-1',
      depth: 0,
      list: {
        deletedAt: null,
        isArchived: false,
        project: {
          workspaceId: 'workspace-1',
          id: 'project-1',
          deletedAt: null,
          isArchived: false,
        },
      },
    });
    expect(countArgs.where.AND).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          OR: expect.arrayContaining([
            { title: { contains: 'CU-104', mode: 'insensitive' } },
            { description: { contains: 'CU-104', mode: 'insensitive' } },
            { taskNumber: 104 },
          ]),
        }),
        { statusId: { in: ['status-1'] } },
        { priority: { in: ['HIGH', 'URGENT'] } },
        { assignees: { some: { userId: { in: ['user-2'] } } } },
        { tags: { some: { tagId: { in: ['tag-1'] } } } },
      ]),
    );

    const dueDateFilter = countArgs.where.AND.find(
      (filter: Record<string, unknown>) => filter.dueDate,
    ) as { dueDate: { gte: Date; lte: Date } };
    expect(dueDateFilter.dueDate.gte.toISOString()).toBe('2026-04-01T00:00:00.000Z');
    expect(dueDateFilter.dueDate.lte.toISOString()).toBe('2026-04-30T23:59:59.999Z');

    expect(prisma.task.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: countArgs.where,
        orderBy: [{ dueDate: 'desc' }, { id: 'asc' }],
        skip: 10,
        take: 10,
      }),
    );
  });

  it('supports Me Mode, closed filtering, and subtasks-as-separate-results', async () => {
    await service.findTasksByWorkspace(
      'workspace-1',
      'actor-1',
      baseQuery({
        me: true,
        includeSubtasks: true,
        includeClosed: false,
      }),
    );

    const where = prisma.task.count.mock.calls[0][0].where;
    expect(where.depth).toBeUndefined();
    expect(where.AND).toEqual(
      expect.arrayContaining([
        { status: { group: { not: 'CLOSED' } } },
        { assignees: { some: { userId: { in: ['actor-1'] } } } },
      ]),
    );
  });

  it('defaults project search sorting to recently updated tasks', async () => {
    await service.findTasksByProject('workspace-1', 'actor-1', 'project-1', baseQuery());

    expect(prisma.project.findFirst).toHaveBeenCalledWith({
      where: {
        id: 'project-1',
        workspaceId: 'workspace-1',
        deletedAt: null,
        isArchived: false,
      },
      select: { id: true },
    });
    expect(prisma.task.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        orderBy: [{ updatedAt: 'desc' }, { listId: 'asc' }, { position: 'asc' }, { id: 'asc' }],
      }),
    );
  });
});
