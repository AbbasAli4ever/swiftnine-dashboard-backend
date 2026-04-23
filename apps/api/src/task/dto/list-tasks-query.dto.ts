import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import {
  csvOrArray,
  enumCsvOrArray,
  optionalBoolean,
  optionalDate,
  optionalLimit,
  optionalPage,
} from '../../common/query/query.schemas';

export const TASK_PRIORITY_VALUES = ['URGENT', 'HIGH', 'NORMAL', 'LOW', 'NONE'] as const;
export const TASK_STATUS_GROUP_VALUES = ['NOT_STARTED', 'ACTIVE', 'DONE', 'CLOSED'] as const;
export const TASK_SORT_FIELDS = [
  'position',
  'created_at',
  'updated_at',
  'due_date',
  'priority',
  'status',
  'title',
] as const;
export const TASK_DUE_DATE_PRESETS = [
  'overdue',
  'today',
  'today_or_earlier',
  'tomorrow',
  'this_week',
  'next_week',
  'no_due_date',
] as const;

const uuidOrUnassignedCsv = csvOrArray.transform((values, ctx) => {
  if (!values) return undefined;
  const invalid = values.find(
    (value) =>
      value !== 'unassigned' &&
      !z.string().uuid().safeParse(value).success,
  );
  if (invalid) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Invalid assignee id',
    });
    return z.NEVER;
  }
  return values;
});

export const ListTasksQuerySchema = z
  .object({
    q: z.string().trim().min(1).max(200).optional(),
    search: z.string().trim().min(1).max(200).optional(),
    page: optionalPage,
    limit: optionalLimit,
    sort_by: z.enum(TASK_SORT_FIELDS).optional(),
    sort_order: z.enum(['asc', 'desc']).default('asc'),
    status: csvOrArray,
    status_ids: csvOrArray,
    status_groups: enumCsvOrArray(TASK_STATUS_GROUP_VALUES, 'Invalid status group'),
    priority: enumCsvOrArray(TASK_PRIORITY_VALUES, 'Invalid priority'),
    priorities: enumCsvOrArray(TASK_PRIORITY_VALUES, 'Invalid priority'),
    due_date_from: optionalDate,
    due_date_to: optionalDate,
    due_date: z.enum(TASK_DUE_DATE_PRESETS).optional(),
    assignee: uuidOrUnassignedCsv,
    assignee_ids: uuidOrUnassignedCsv,
    assignee_match: z.enum(['any', 'all']).default('any'),
    tag: csvOrArray,
    tag_ids: csvOrArray,
    tag_match: z.enum(['any', 'all']).default('any'),
    created_by: csvOrArray,
    created_from: optionalDate,
    created_to: optionalDate,
    updated_from: optionalDate,
    updated_to: optionalDate,
    completed_from: optionalDate,
    completed_to: optionalDate,
    include_subtasks: optionalBoolean,
    include_closed: optionalBoolean,
    include_archived: optionalBoolean,
    me: optionalBoolean,
    has_assignees: optionalBoolean,
    has_due_date: optionalBoolean,
    completed: optionalBoolean,
  })
  .transform((raw, ctx) => {
    const statusIds = raw.status_ids ?? raw.status;
    const tagIds = raw.tag_ids ?? raw.tag;
    const assigneeIds = raw.assignee_ids ?? raw.assignee;
    const priorities = raw.priorities ?? raw.priority;

    for (const [field, values] of [
      ['status_ids', statusIds],
      ['tag_ids', tagIds],
      ['created_by', raw.created_by],
    ] as const) {
      const invalid = values?.find((value) => !z.string().uuid().safeParse(value).success);
      if (invalid) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Invalid ${field} value: ${invalid}`,
        });
        return z.NEVER;
      }
    }

    return {
      q: raw.q ?? raw.search,
      page: raw.page,
      limit: raw.limit,
      sortBy: raw.sort_by,
      sortOrder: raw.sort_order,
      statusIds,
      statusGroups: raw.status_groups,
      priorities,
      dueDateFrom: raw.due_date_from,
      dueDateTo: raw.due_date_to,
      dueDate: raw.due_date,
      assigneeIds,
      assigneeMatch: raw.assignee_match,
      tagIds,
      tagMatch: raw.tag_match,
      createdBy: raw.created_by,
      createdFrom: raw.created_from,
      createdTo: raw.created_to,
      updatedFrom: raw.updated_from,
      updatedTo: raw.updated_to,
      completedFrom: raw.completed_from,
      completedTo: raw.completed_to,
      includeSubtasks: raw.include_subtasks ?? false,
      includeClosed: raw.include_closed ?? true,
      includeArchived: raw.include_archived ?? false,
      me: raw.me ?? false,
      hasAssignees: raw.has_assignees,
      hasDueDate: raw.has_due_date,
      completed: raw.completed,
    };
  });

export class ListTasksQueryDto extends createZodDto(ListTasksQuerySchema) {}

export type ListTasksQuery = z.output<typeof ListTasksQuerySchema>;
