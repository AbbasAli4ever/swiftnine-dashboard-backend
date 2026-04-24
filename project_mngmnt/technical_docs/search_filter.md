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
| `GET /api/v1/projects/:projectId/board/tasks` | One project board | Project board columns grouped by status, using tasks from all lists |
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

## Project Board View

The board view is different from list view:

- List view uses `Task.position`, which is local to a single list.
- Board view uses `Task.boardPosition`, which is local to a status column across the whole project board.

Inside a status column, tasks are ordered by:

```ts
orderBy: [
  { boardPosition: 'asc' },
  { listId: 'asc' },
  { id: 'asc' }
]
```

This means board drag/drop is free to mix tasks from different lists inside the same status column. List membership does not change unless `toListId` is explicitly sent during a move.

### Get Board Tasks

```http
GET /api/v1/projects/:projectId/board/tasks
```

The response includes every active status in the project as a column:

```json
{
  "success": true,
  "data": {
    "groupBy": "status",
    "projectId": "uuid",
    "columns": [
      {
        "status": {
          "id": "uuid",
          "name": "In Progress",
          "color": "#3b82f6",
          "group": "ACTIVE",
          "position": 2000,
          "isDefault": true,
          "isProtected": false,
          "isClosed": false
        },
        "tasks": [],
        "total": 0
      }
    ],
    "total": 0
  },
  "message": null
}
```

The board endpoint supports the same search and filter params as task search:

- `q` / `search`
- `status_ids`
- `status_groups`
- `priority`
- `due_date`
- `due_date_from`
- `due_date_to`
- `assignee_ids`
- `me`
- `tag_ids`
- `created_by`

### Board Reorder Behavior

```http
PUT /api/v1/projects/:projectId/board/tasks/reorder
```

Rules:

- `orderedTaskIds` must contain every active top-level task in the destination status column exactly once.
- Board reorder updates `Task.boardPosition` for that status column.
- If `toStatusId` changes, the task status changes too.
- If `toListId` is provided, the task moves to another list.
- After board order is saved, the backend syncs `Task.position` inside every affected list using the board-relative order for tasks in that list.

Example:

- List 1 tasks: `1, 2, 3`
- List 2 tasks: `4, 5`
- Board column becomes: `5, 1, 2, 3, 4`

Result:

- Board order is saved exactly as `5, 1, 2, 3, 4`
- List 1 stays `1, 2, 3`
- List 2 becomes `5, 4`

This gives the board its own flexible order while still keeping list view aligned inside each list.
- date range filters
- `include_subtasks`
- `include_closed`
- `include_archived`

Example:

```http
GET /api/v1/projects/:projectId/board/tasks?me=true&priority=HIGH,URGENT&include_closed=false
```

### Reorder Board Tasks

```http
PUT /api/v1/projects/:projectId/board/tasks/reorder
```

Payload:

```json
{
  "mode": "manual",
  "taskId": "uuid",
  "toStatusId": "uuid",
  "toListId": "uuid-optional",
  "orderedTaskIds": ["uuid-1", "uuid-2", "uuid-3"]
}
```

Rules:

- `orderedTaskIds` must contain every active top-level task in the destination status column after the move, exactly once.
- `mode` must be `manual`.
- Subtasks cannot be reordered directly on the board.
- If `toStatusId` is different from the task's current status, the task status changes.
- If `toListId` is provided and differs from the current list, the task list changes.
- Board reorder writes canonical `Task.position` in affected lists.
- A task cannot appear above tasks from an earlier list unless it moves into that earlier list or the lists are reordered first.
- Reordering a filtered/partial board column is rejected to avoid corrupting the full column order.

Example:

```json
{
  "mode": "manual",
  "taskId": "a843cde2-f8c4-49a1-916b-308941b56f34",
  "toStatusId": "9fa46c52-c13a-4088-89f8-1c321016862f",
  "orderedTaskIds": [
    "11111111-1111-4111-8111-111111111111",
    "a843cde2-f8c4-49a1-916b-308941b56f34",
    "22222222-2222-4222-8222-222222222222"
  ]
}
```

Impossible order example:

```text
List 1: 1, 2, 3
List 2: 4, 5
```

If the payload asks for a status column order of `5, 1, 2, 3, 4` while task `5` stays in List 2, the API rejects it because List 2 is below List 1. To make `5` appear before `1`, either move task `5` to List 1 using `toListId`, or reorder List 2 above List 1.

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
