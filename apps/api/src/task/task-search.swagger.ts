import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import {
  TASK_DUE_DATE_PRESETS,
  TASK_PRIORITY_VALUES,
  TASK_SORT_FIELDS,
  TASK_STATUS_GROUP_VALUES,
} from './dto/list-tasks-query.dto';

export const TaskSearchSwaggerQueries = () =>
  applyDecorators(
    ApiQuery({
      name: 'q',
      required: false,
      description:
        'Instant search keyword. Searches task title, description, status name, tag name, assignee name, and task key number (for example CU-104). Alias: `search`.',
      example: 'login bug',
    }),
    ApiQuery({
      name: 'search',
      required: false,
      description: 'Alias for `q`, kept for clients that use the older standard API contract.',
      example: 'login bug',
    }),
    ApiQuery({
      name: 'page',
      required: false,
      description: '1-based page number.',
      example: 1,
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      description: 'Items per page. Defaults to 20, maximum 100.',
      example: 20,
    }),
    ApiQuery({
      name: 'sort_by',
      required: false,
      enum: TASK_SORT_FIELDS,
      description:
        'Sort field. List-scoped endpoints default to `position`; project/workspace search defaults to `updated_at`.',
      example: 'due_date',
    }),
    ApiQuery({
      name: 'sort_order',
      required: false,
      enum: ['asc', 'desc'],
      description: 'Sort direction. Defaults to `asc` when `sort_by` is provided.',
      example: 'asc',
    }),
    ApiQuery({
      name: 'status_ids',
      required: false,
      description: 'Comma-separated or repeated status IDs. Alias: `status`.',
      example: '9fa46c52-c13a-4088-89f8-1c321016862f,4cb36d56-3c98-4b8e-8fd2-7a5162a5b482',
    }),
    ApiQuery({
      name: 'status',
      required: false,
      description: 'Alias for `status_ids`.',
      example: '9fa46c52-c13a-4088-89f8-1c321016862f',
    }),
    ApiQuery({
      name: 'status_groups',
      required: false,
      enum: TASK_STATUS_GROUP_VALUES,
      isArray: true,
      description:
        'Comma-separated ClickUp-style status groups: NOT_STARTED, ACTIVE, DONE, CLOSED.',
      example: 'ACTIVE,DONE',
    }),
    ApiQuery({
      name: 'priority',
      required: false,
      enum: TASK_PRIORITY_VALUES,
      isArray: true,
      description: 'Comma-separated priorities. Alias: `priorities`.',
      example: 'HIGH,URGENT',
    }),
    ApiQuery({
      name: 'priorities',
      required: false,
      enum: TASK_PRIORITY_VALUES,
      isArray: true,
      description: 'Alias for `priority`.',
      example: 'LOW,NORMAL',
    }),
    ApiQuery({
      name: 'due_date',
      required: false,
      enum: TASK_DUE_DATE_PRESETS,
      description:
        'Due date preset: overdue, today, today_or_earlier, tomorrow, this_week, next_week, or no_due_date.',
      example: 'today_or_earlier',
    }),
    ApiQuery({
      name: 'due_date_from',
      required: false,
      description: 'Due date range start. Accepts ISO date or date-time.',
      example: '2026-04-01',
    }),
    ApiQuery({
      name: 'due_date_to',
      required: false,
      description: 'Due date range end. Date-only values include the full UTC day.',
      example: '2026-04-30',
    }),
    ApiQuery({
      name: 'assignee_ids',
      required: false,
      description:
        'Comma-separated or repeated assignee user IDs. Use `unassigned` to include unassigned tasks. Alias: `assignee`.',
      example: 'f3387da6-3af5-4d9e-a004-6cc67b586b8a,unassigned',
    }),
    ApiQuery({
      name: 'assignee',
      required: false,
      description: 'Alias for `assignee_ids`.',
      example: 'f3387da6-3af5-4d9e-a004-6cc67b586b8a',
    }),
    ApiQuery({
      name: 'assignee_match',
      required: false,
      enum: ['any', 'all'],
      description:
        '`any` returns tasks assigned to at least one selected user. `all` requires every selected user.',
      example: 'any',
    }),
    ApiQuery({
      name: 'me',
      required: false,
      description: 'ClickUp-style Me Mode. When true, returns tasks assigned to the current user.',
      example: true,
    }),
    ApiQuery({
      name: 'tag_ids',
      required: false,
      description: 'Comma-separated or repeated tag IDs. Alias: `tag`.',
      example: 'e0aa9215-1d22-4724-9ef2-c69fa92698f6',
    }),
    ApiQuery({
      name: 'tag_match',
      required: false,
      enum: ['any', 'all'],
      description: '`any` matches any selected tag. `all` requires every selected tag.',
      example: 'any',
    }),
    ApiQuery({
      name: 'created_by',
      required: false,
      description: 'Comma-separated creator user IDs.',
      example: '6c186a98-9ce2-4ddf-91ec-1184139a0f44',
    }),
    ApiQuery({
      name: 'created_from',
      required: false,
      description: 'Created-at range start.',
      example: '2026-04-01',
    }),
    ApiQuery({
      name: 'created_to',
      required: false,
      description: 'Created-at range end.',
      example: '2026-04-30',
    }),
    ApiQuery({
      name: 'updated_from',
      required: false,
      description: 'Updated-at range start.',
      example: '2026-04-01T00:00:00.000Z',
    }),
    ApiQuery({
      name: 'updated_to',
      required: false,
      description: 'Updated-at range end.',
      example: '2026-04-30T23:59:59.999Z',
    }),
    ApiQuery({
      name: 'completed_from',
      required: false,
      description: 'Completed-at range start.',
      example: '2026-04-01',
    }),
    ApiQuery({
      name: 'completed_to',
      required: false,
      description: 'Completed-at range end.',
      example: '2026-04-30',
    }),
    ApiQuery({
      name: 'include_subtasks',
      required: false,
      description: 'When true, returns subtasks as separate rows like ClickUp Show Subtasks.',
      example: false,
    }),
    ApiQuery({
      name: 'include_closed',
      required: false,
      description:
        'When false, excludes tasks whose status group is CLOSED. Defaults to true for backwards compatibility.',
      example: true,
    }),
    ApiQuery({
      name: 'include_archived',
      required: false,
      description:
        'When true, includes tasks inside archived lists/projects for workspace and project searches.',
      example: false,
    }),
    ApiQuery({
      name: 'has_assignees',
      required: false,
      description: 'true for assigned tasks only, false for unassigned tasks only.',
      example: true,
    }),
    ApiQuery({
      name: 'has_due_date',
      required: false,
      description: 'true for tasks with due dates only, false for tasks without due dates only.',
      example: true,
    }),
    ApiQuery({
      name: 'completed',
      required: false,
      description: 'Filter by task completion flag.',
      example: false,
    }),
  );
