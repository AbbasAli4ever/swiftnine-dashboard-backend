# Search and Filter Module

## Purpose

This module standardizes ClickUp-style task search and filtering across the backend. It supports instant task search, stacked filters, assignee-focused views, Me Mode, subtasks-as-separate-results, sorting, and pagination.

The current implementation focuses on task search/filter because tasks are the main searchable work item in this ClickUp clone.

## Implemented Endpoints

All endpoints require:

```http
Authorization: Bearer <access_token>
x-workspace-id: <workspace_uuid>
```

| Endpoint | Scope | Use case |
| --- | --- | --- |
| `GET /api/v1/tasks` | Active workspace | Global task search, My Tasks, dashboards, assignee task views |
| `GET /api/v1/projects/:projectId/tasks` | One project | Project-wide task search across all lists |
| `GET /api/v1/projects/:projectId/lists/:listId/tasks` | One list | ClickUp List view search/filter |

All three endpoints return the standard paginated API response:

```json
{
  "success": true,
  "data": [],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 0,
    "total_pages": 0,
    "has_next": false,
    "has_prev": false
  },
  "message": null
}
```

## Search

### Query Params

| Param | Type | Description |
| --- | --- | --- |
| `q` | string | Preferred instant-search keyword |
| `search` | string | Alias for `q` |

### Search Fields

`q` searches:

- task title
- task description
- status name
- tag name
- assignee full name
- task key number, for example `CU-104` or `104`

### Frontend Behavior

- Update results as the user types by sending `q`.
- Debounce requests on the frontend, typically 250-400 ms.
- Clear search by removing `q` and `search` from the query string.
- When search changes, reset `page` to `1`.

Example:

```http
GET /api/v1/tasks?q=login&page=1&limit=20
```

## Filters

Multiple filters can be applied at the same time. Filters are combined with `AND` across different filter types.

Example:

```http
GET /api/v1/projects/:projectId/tasks?q=api&status_groups=ACTIVE,DONE&priority=HIGH,URGENT&assignee_ids=<user_id>&due_date=today_or_earlier
```

### Status

| Param | Type | Description |
| --- | --- | --- |
| `status_ids` | UUID csv/repeated | Filter by selected status IDs |
| `status` | UUID csv/repeated | Alias for `status_ids` |
| `status_groups` | enum csv/repeated | Filter by `NOT_STARTED`, `ACTIVE`, `DONE`, `CLOSED` |
| `include_closed` | boolean | Defaults to `true`; set `false` to exclude `CLOSED` status group |

Status filtering matches ClickUp's selected-status behavior. `status_ids` is precise, while `status_groups` is useful for broader To Do / In Progress / Done style UI groupings.

Examples:

```http
GET /api/v1/tasks?status_ids=<todo_status_id>,<progress_status_id>
GET /api/v1/tasks?status_groups=ACTIVE,DONE
GET /api/v1/tasks?include_closed=false
```

### Priority

| Param | Type | Description |
| --- | --- | --- |
| `priority` | enum csv/repeated | Filter by selected priorities |
| `priorities` | enum csv/repeated | Alias for `priority` |

Allowed values:

- `URGENT`
- `HIGH`
- `NORMAL`
- `LOW`
- `NONE`

Example:

```http
GET /api/v1/tasks?priority=HIGH,URGENT
```

### Due Date

| Param | Type | Description |
| --- | --- | --- |
| `due_date` | enum | Preset due date filter |
| `due_date_from` | ISO date/date-time | Due date range start |
| `due_date_to` | ISO date/date-time | Due date range end |
| `has_due_date` | boolean | `true` for tasks with due dates, `false` for no due date |

Allowed presets:

- `overdue`
- `today`
- `today_or_earlier`
- `tomorrow`
- `this_week`
- `next_week`
- `no_due_date`

Date-only values include the full UTC day. For example, `due_date_to=2026-04-30` includes tasks due until `2026-04-30T23:59:59.999Z`.

Examples:

```http
GET /api/v1/tasks?due_date=today_or_earlier
GET /api/v1/tasks?due_date_from=2026-04-01&due_date_to=2026-04-30
GET /api/v1/tasks?has_due_date=false
```

### Assignee

| Param | Type | Description |
| --- | --- | --- |
| `assignee_ids` | UUID csv/repeated | Filter by assigned users |
| `assignee` | UUID csv/repeated | Alias for `assignee_ids` |
| `assignee_match` | `any` or `all` | Defaults to `any`; `all` requires every selected user |
| `me` | boolean | ClickUp-style Me Mode; filters tasks assigned to the current user |
| `has_assignees` | boolean | `true` for assigned tasks, `false` for unassigned tasks |

Special value:

- `unassigned` can be passed inside `assignee_ids` to include tasks with no assignees.

Examples:

```http
GET /api/v1/tasks?me=true
GET /api/v1/tasks?assignee_ids=<user_1>,<user_2>&assignee_match=any
GET /api/v1/tasks?assignee_ids=<user_1>,<user_2>&assignee_match=all
GET /api/v1/tasks?assignee_ids=unassigned
```

Task responses always include assignee display data:

```json
{
  "assignees": [
    {
      "user": {
        "id": "uuid",
        "fullName": "Ayesha Khan",
        "avatarUrl": null,
        "avatarColor": "#6366f1"
      },
      "assignedBy": "uuid"
    }
  ]
}
```

### Tags

| Param | Type | Description |
| --- | --- | --- |
| `tag_ids` | UUID csv/repeated | Filter by selected tags |
| `tag` | UUID csv/repeated | Alias for `tag_ids` |
| `tag_match` | `any` or `all` | Defaults to `any`; `all` requires every selected tag |

Example:

```http
GET /api/v1/tasks?tag_ids=<tag_1>,<tag_2>&tag_match=all
```

### Creator

| Param | Type | Description |
| --- | --- | --- |
| `created_by` | UUID csv/repeated | Filter by task creator IDs |

Example:

```http
GET /api/v1/tasks?created_by=<user_id>
```

### Created, Updated, and Completed Date Ranges

| Param | Type | Description |
| --- | --- | --- |
| `created_from` | ISO date/date-time | Created-at range start |
| `created_to` | ISO date/date-time | Created-at range end |
| `updated_from` | ISO date/date-time | Updated-at range start |
| `updated_to` | ISO date/date-time | Updated-at range end |
| `completed_from` | ISO date/date-time | Completed-at range start |
| `completed_to` | ISO date/date-time | Completed-at range end |
| `completed` | boolean | Filter by completion flag |

Examples:

```http
GET /api/v1/tasks?updated_from=2026-04-01T00:00:00.000Z
GET /api/v1/tasks?completed=true&completed_from=2026-04-01&completed_to=2026-04-30
```

### Subtasks

| Param | Type | Description |
| --- | --- | --- |
| `include_subtasks` | boolean | Defaults to `false`; when `true`, subtasks are returned as separate rows |

This mirrors ClickUp's "Show Subtasks as separate tasks" behavior.

Example:

```http
GET /api/v1/projects/:projectId/tasks?include_subtasks=true
```

### Archived Content

| Param | Type | Description |
| --- | --- | --- |
| `include_archived` | boolean | Defaults to `false`; includes tasks inside archived projects/lists for workspace and project searches |

The list-scoped endpoint still validates the target list as an active list.

## Sorting

| Param | Type | Description |
| --- | --- | --- |
| `sort_by` | enum | Sort field |
| `sort_order` | `asc` or `desc` | Sort direction |

Allowed `sort_by` values:

- `position`
- `created_at`
- `updated_at`
- `due_date`
- `priority`
- `status`
- `title`

Defaults:

- List-scoped endpoint defaults to `position asc`.
- Project/workspace endpoints default to `updated_at desc`.
- When `sort_by` is provided, `sort_order` defaults to `asc`.

Examples:

```http
GET /api/v1/tasks?sort_by=due_date&sort_order=asc
GET /api/v1/projects/:projectId/lists/:listId/tasks?sort_by=position
```

## Pagination

| Param | Type | Default | Max | Description |
| --- | --- | --- | --- | --- |
| `page` | number | `1` | n/a | 1-based page number |
| `limit` | number | `20` | `100` | Items per page |

Frontend should reset `page` to `1` whenever search, filters, or sorting changes.

## Clear and Reset Behavior

To clear search only:

- remove `q`
- remove `search`
- reset `page=1`

To clear all filters:

- remove all filter params
- keep or reset `sort_by` and `sort_order` depending on current view preference
- reset `page=1`

Minimum clear-all params to remove:

- `q`
- `search`
- `status_ids`
- `status`
- `status_groups`
- `priority`
- `priorities`
- `due_date`
- `due_date_from`
- `due_date_to`
- `has_due_date`
- `assignee_ids`
- `assignee`
- `assignee_match`
- `me`
- `has_assignees`
- `tag_ids`
- `tag`
- `tag_match`
- `created_by`
- `created_from`
- `created_to`
- `updated_from`
- `updated_to`
- `completed_from`
- `completed_to`
- `completed`
- `include_subtasks`
- `include_closed`
- `include_archived`

## Common UI Recipes

### Instant Search in List View

```http
GET /api/v1/projects/:projectId/lists/:listId/tasks?q=auth&page=1&limit=20
```

### My Tasks

```http
GET /api/v1/tasks?me=true&include_subtasks=true&include_closed=false&sort_by=due_date&sort_order=asc
```

### Tasks Assigned to a Member

```http
GET /api/v1/tasks?assignee_ids=<member_user_id>&include_subtasks=true
```

### High Priority Work Due Soon

```http
GET /api/v1/projects/:projectId/tasks?priority=HIGH,URGENT&due_date=today_or_earlier&status_groups=ACTIVE
```

### Unassigned Backlog

```http
GET /api/v1/projects/:projectId/tasks?assignee_ids=unassigned&status_groups=NOT_STARTED,ACTIVE
```

## Swagger Coverage

Swagger docs are added to all three endpoints with detailed query descriptions and the paginated task response DTO:

- `GET /api/v1/tasks`
- `GET /api/v1/projects/:projectId/tasks`
- `GET /api/v1/projects/:projectId/lists/:listId/tasks`

The Swagger response documents assignee name/avatar fields so frontend teams can rely on them for cards, list rows, and assignee sidebar views.

## Implementation Notes

- Query parsing lives in `apps/api/src/common/query/query.schemas.ts`.
- Task-specific query contract lives in `apps/api/src/task/dto/list-tasks-query.dto.ts`.
- Swagger query decorators live in `apps/api/src/task/task-search.swagger.ts`.
- Search/filter execution lives in `TaskService`.
- Results reuse `TASK_LIST_ITEM_SELECT`, so list, project, and workspace search return the same task card/list-row shape.
