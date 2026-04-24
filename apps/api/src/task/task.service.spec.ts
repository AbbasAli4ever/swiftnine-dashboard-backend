import { TaskService } from './task.service';
import type { ListTasksQuery } from './dto/list-tasks-query.dto';

jest.mock('@app/database', () => ({
  PrismaService: class PrismaService {},
}));

describe('TaskService search and filter', () => {
  let prisma: {
    project: { findFirst: jest.Mock };
    status: { findMany: jest.Mock; findFirst: jest.Mock };
    taskList: { findFirst: jest.Mock };
    task: { count: jest.Mock; findMany: jest.Mock; findFirst: jest.Mock; update: jest.Mock };
    $transaction: jest.Mock;
  };
  let activity: { logMany: jest.Mock };
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
      status: {
        findMany: jest.fn().mockResolvedValue([]),
        findFirst: jest.fn().mockResolvedValue({ id: 'status-2', name: 'In Progress' }),
      },
      taskList: {
        findFirst: jest.fn().mockResolvedValue({ id: 'list-1', name: 'Sprint', position: 1000 }),
      },
      task: {
        count: jest.fn().mockResolvedValue(0),
        findMany: jest.fn().mockResolvedValue([]),
        findFirst: jest.fn(),
        update: jest.fn().mockResolvedValue(undefined),
      },
      $transaction: jest.fn(),
    };
    prisma.$transaction.mockImplementation(async (callback: (tx: typeof prisma) => unknown) =>
      callback(prisma),
    );

    activity = { logMany: jest.fn().mockResolvedValue(undefined) };
    service = new TaskService(prisma as never, activity as never);
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

  it('returns project board columns grouped by status with board ordering', async () => {
    prisma.status.findMany.mockResolvedValue([
      {
        id: 'status-1',
        name: 'To Do',
        color: '#94a3b8',
        group: 'NOT_STARTED',
        position: 1000,
        isDefault: true,
        isProtected: false,
        isClosed: false,
      },
      {
        id: 'status-2',
        name: 'In Progress',
        color: '#3b82f6',
        group: 'ACTIVE',
        position: 2000,
        isDefault: true,
        isProtected: false,
        isClosed: false,
      },
    ]);
    prisma.task.findMany.mockResolvedValue([
      rawTask({ id: 'task-2', statusId: 'status-2', statusName: 'In Progress', boardPosition: 1000 }),
      rawTask({ id: 'task-1', statusId: 'status-2', statusName: 'In Progress', boardPosition: 2000 }),
    ]);

    const result = await service.getProjectBoard(
      'workspace-1',
      'actor-1',
      'project-1',
      baseQuery({ q: 'api' }),
    );

    expect(prisma.task.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        orderBy: [
          { boardPosition: 'asc' },
          { listId: 'asc' },
          { id: 'asc' },
        ],
      }),
    );
    expect(result.columns).toHaveLength(2);
    expect(result.columns[0].tasks).toHaveLength(0);
    expect(result.columns[1].tasks.map((task) => task.id)).toEqual(['task-2', 'task-1']);
    expect(result.total).toBe(2);
  });

  it('reorders board cards independently and syncs list-relative positions', async () => {
    prisma.task.findFirst.mockResolvedValue(
      minimalTask({ id: 'task-5', listId: 'list-2', listPosition: 2000, statusId: 'status-2', statusName: 'In Progress' }),
    );
    prisma.task.findMany
      .mockResolvedValueOnce([
        {
          id: 'task-1',
          listId: 'list-1',
          boardPosition: 1000,
        },
        {
          id: 'task-2',
          listId: 'list-1',
          boardPosition: 2000,
        },
        {
          id: 'task-3',
          listId: 'list-1',
          boardPosition: 3000,
        },
        {
          id: 'task-4',
          listId: 'list-2',
          boardPosition: 4000,
        },
        {
          id: 'task-5',
          listId: 'list-2',
          statusId: 'status-2',
          position: 2000,
          boardPosition: 5000,
          list: { id: 'list-2', name: 'List 2', position: 2000 },
        },
      ])
      .mockResolvedValueOnce([
        {
          id: 'task-1',
          listId: 'list-1',
          position: 1000,
          boardPosition: 2000,
          status: { id: 'status-2', group: 'ACTIVE', position: 2000 },
        },
        {
          id: 'task-2',
          listId: 'list-1',
          position: 2000,
          boardPosition: 3000,
          status: { id: 'status-2', group: 'ACTIVE', position: 2000 },
        },
        {
          id: 'task-3',
          listId: 'list-1',
          position: 3000,
          boardPosition: 4000,
          status: { id: 'status-2', group: 'ACTIVE', position: 2000 },
        },
        {
          id: 'task-4',
          listId: 'list-2',
          position: 1000,
          boardPosition: 5000,
          status: { id: 'status-2', group: 'ACTIVE', position: 2000 },
        },
        {
          id: 'task-5',
          listId: 'list-2',
          position: 2000,
          boardPosition: 1000,
          status: { id: 'status-2', group: 'ACTIVE', position: 2000 },
        },
      ])
      .mockResolvedValueOnce([]);
    prisma.status.findMany.mockResolvedValue([]);

    await service.reorderProjectBoard('workspace-1', 'actor-1', 'project-1', {
      mode: 'manual',
      taskId: 'task-5',
      toStatusId: 'status-2',
      orderedTaskIds: ['task-5', 'task-1', 'task-2', 'task-3', 'task-4'],
    });

    expect(prisma.task.update.mock.calls).toEqual(
      expect.arrayContaining([
        [{ where: { id: 'task-5' }, data: { boardPosition: 1000 } }],
        [{ where: { id: 'task-1' }, data: { boardPosition: 2000 } }],
        [{ where: { id: 'task-2' }, data: { boardPosition: 3000 } }],
        [{ where: { id: 'task-3' }, data: { boardPosition: 4000 } }],
        [{ where: { id: 'task-4' }, data: { boardPosition: 5000 } }],
        [{ where: { id: 'task-5' }, data: { position: 1000 } }],
        [{ where: { id: 'task-4' }, data: { position: 2000 } }],
      ]),
    );
    expect(activity.logMany).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          action: 'reordered',
          metadata: expect.objectContaining({ view: 'board' }),
        }),
      ]),
      prisma,
    );
  });

  it('rejects partial board reorder payloads', async () => {
    prisma.task.findFirst.mockResolvedValue(
      minimalTask({ id: 'task-4', listId: 'list-2', listPosition: 2000, statusId: 'status-2', statusName: 'In Progress' }),
    );
    prisma.task.findMany.mockResolvedValue([
      {
        id: 'task-1',
        listId: 'list-1',
        boardPosition: 1000,
      },
      {
        id: 'task-4',
        listId: 'list-2',
        boardPosition: 2000,
      },
      {
        id: 'task-5',
        listId: 'list-2',
        boardPosition: 3000,
      },
    ]);

    await expect(
      service.reorderProjectBoard('workspace-1', 'actor-1', 'project-1', {
        mode: 'manual',
        taskId: 'task-4',
        toStatusId: 'status-2',
        orderedTaskIds: ['task-1', 'task-4'],
      }),
    ).rejects.toThrow('Board reorder payload must include every active top-level task');
  });
});

function rawTask(overrides: {
  id: string;
  statusId: string;
  statusName: string;
  boardPosition?: number;
}) {
  return {
    id: overrides.id,
    taskNumber: 101,
    title: 'Build board',
    priority: 'HIGH',
    startDate: null,
    dueDate: null,
    position: 1000,
    boardPosition: overrides.boardPosition ?? 1000,
    depth: 0,
    isCompleted: false,
    completedAt: null,
    createdAt: new Date('2026-04-23T10:00:00.000Z'),
    updatedAt: new Date('2026-04-23T10:00:00.000Z'),
    status: {
      id: overrides.statusId,
      name: overrides.statusName,
      color: '#3b82f6',
      group: 'ACTIVE',
    },
    assignees: [],
    tags: [],
    list: {
      id: 'list-1',
      name: 'Sprint',
      project: {
        id: 'project-1',
        name: 'ClickUp Clone',
        taskIdPrefix: 'CU',
      },
    },
    _count: { children: 0 },
  };
}

function minimalTask(overrides: {
  id: string;
  listId: string;
  listPosition: number;
  statusId: string;
  statusName: string;
}) {
  return {
    id: overrides.id,
    listId: overrides.listId,
    parentId: null,
    depth: 0,
    title: 'Build board',
    description: null,
    statusId: overrides.statusId,
    priority: 'HIGH',
    startDate: null,
    dueDate: null,
    position: 1000,
    isCompleted: false,
    taskNumber: 101,
    createdBy: 'actor-1',
    status: { id: overrides.statusId, name: overrides.statusName, color: '#94a3b8' },
    list: {
      id: overrides.listId,
      name: overrides.listId === 'list-1' ? 'List 1' : 'List 2',
      position: overrides.listPosition,
      projectId: 'project-1',
      project: {
        id: 'project-1',
        workspaceId: 'workspace-1',
        taskIdPrefix: 'CU',
        name: 'ClickUp Clone',
      },
    },
  };
}
