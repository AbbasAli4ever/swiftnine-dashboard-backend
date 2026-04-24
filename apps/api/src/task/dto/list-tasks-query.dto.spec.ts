import { ListTasksQuerySchema } from './list-tasks-query.dto';

describe('ListTasksQuerySchema', () => {
  it('normalizes aliases, csv values, booleans, and pagination defaults', () => {
    const parsed = ListTasksQuerySchema.parse({
      search: '  login  ',
      status: '11111111-1111-4111-8111-111111111111,22222222-2222-4222-8222-222222222222',
      priority: 'HIGH,URGENT',
      assignee: '33333333-3333-4333-8333-333333333333,unassigned',
      tag: '44444444-4444-4444-8444-444444444444',
      me: 'true',
      include_subtasks: '1',
      include_closed: 'false',
      has_due_date: 'yes',
      page: '2',
      limit: '250',
    });

    expect(parsed).toMatchObject({
      q: 'login',
      statusIds: [
        '11111111-1111-4111-8111-111111111111',
        '22222222-2222-4222-8222-222222222222',
      ],
      priorities: ['HIGH', 'URGENT'],
      assigneeIds: ['33333333-3333-4333-8333-333333333333', 'unassigned'],
      tagIds: ['44444444-4444-4444-8444-444444444444'],
      me: true,
      includeSubtasks: true,
      includeClosed: false,
      hasDueDate: true,
      page: 2,
      limit: 100,
    });
  });

  it('rejects invalid IDs and enum values', () => {
    expect(() =>
      ListTasksQuerySchema.parse({
        status_ids: 'not-a-uuid',
      }),
    ).toThrow('Invalid status_ids value');

    expect(() =>
      ListTasksQuerySchema.parse({
        priority: 'BLOCKER',
      }),
    ).toThrow('Invalid priority');
  });
});
