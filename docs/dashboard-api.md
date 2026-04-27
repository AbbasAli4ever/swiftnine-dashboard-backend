# Dashboard API

Summary
- This backend has one dedicated project overview endpoint under `dashboard`, plus a few task/activity endpoints that the frontend will likely use for the rest of the dashboard experience.
- Most dashboard-facing routes are workspace-scoped. They require:
  - `Authorization: Bearer <token>`
  - `x-workspace-id: <workspace-uuid>`
- Successful non-paginated responses use the envelope:
```json
{ "success": true, "data": {}, "message": null }
```
- Paginated task search uses:
```json
{ "success": true, "data": [], "meta": {}, "message": null }
```

## Common Rules

Authentication and workspace scoping
- `GET /projects/:projectId/dashboard`
- `GET /projects/:projectId/board/tasks`
- `PUT /projects/:projectId/board/tasks/reorder`
- `GET /projects/:projectId/tasks`
- `GET /tasks`
- `GET /activity`
- `GET /tasks/:taskId/activity`

All of the routes above use JWT auth plus `WorkspaceGuard`.

What `WorkspaceGuard` does
- Requires `x-workspace-id`.
- Confirms the authenticated user is an active member of that workspace.
- Adds `workspaceContext = { workspaceId, role }` to the request.

Important data-scoping behavior
- Soft-deleted rows are excluded.
- Archived projects/lists are excluded by default unless an endpoint explicitly supports `include_archived=true`.
- Dashboard overview counts only top-level tasks (`depth = 0`), not subtasks.

## 1. Project Overview Endpoint

Route
- `GET /projects/:projectId/dashboard`

Purpose
- This is the dedicated Overview tab endpoint for a single project.
- It returns a compact aggregate payload for:
  - project identity
  - task counts by status
  - task counts by list
  - attachment metadata across the project
  - a placeholder `docs` array

What it returns
- `project`
  - `id`
  - `name`
  - `color`
  - `icon`
- `statusSummary[]`
  - one row per active project status
  - includes statuses even when `count = 0`
- `lists[]`
  - one row per active, non-archived task list
  - each row includes `taskCount`, `completedCount`, `openCount`
- `attachments[]`
  - newest first
  - includes task context and uploader info
- `docs`
  - currently always `[]`

Important implementation details
- Status rows are ordered by `group`, then `position`.
- Lists are ordered by `position`.
- Attachment rows are ordered by `createdAt desc`, then `id desc`.
- `taskKey` is generated server-side as `project.taskIdPrefix + "-" + task.taskNumber`.
- `fileSize` is converted from Prisma `BigInt` to a normal number before returning.

What it does not return
- It does not return signed attachment URLs.
- It does not return comments, activity, board columns, or task detail.
- It does not include archived lists.
- It does not include subtasks in list/status counts.

Response shape
```json
{
  "success": true,
  "data": {
    "project": {
      "id": "project-1",
      "name": "Backend API",
      "color": "#2563eb",
      "icon": "rocket"
    },
    "statusSummary": [
      {
        "statusId": "status-1",
        "name": "To Do",
        "color": "#94a3b8",
        "group": "NOT_STARTED",
        "position": 1000,
        "count": 1
      },
      {
        "statusId": "status-2",
        "name": "In Progress",
        "color": "#3b82f6",
        "group": "ACTIVE",
        "position": 1000,
        "count": 2
      }
    ],
    "lists": [
      {
        "id": "list-1",
        "name": "Backlog",
        "position": 1000,
        "taskCount": 2,
        "completedCount": 0,
        "openCount": 2
      }
    ],
    "attachments": [
      {
        "id": "attachment-1",
        "taskId": "task-1",
        "taskKey": "API-104",
        "taskTitle": "Implement filters",
        "listId": "list-2",
        "listName": "Current Sprint",
        "fileName": "api-contract.pdf",
        "mimeType": "application/pdf",
        "fileSize": 245760,
        "createdAt": "2026-04-24T09:30:00.000Z",
        "uploadedBy": {
          "id": "user-1",
          "fullName": "Ayesha Khan",
          "avatarUrl": null,
          "avatarColor": "#6366f1"
        }
      }
    ],
    "docs": []
  },
  "message": null
}
```

Frontend notes
- Treat `docs` as a placeholder for now.
- `attachments[]` is good for a recent-files widget, but not enough to preview/download files directly.
- Zero-count statuses are intentionally included, so the frontend should render them instead of filtering them out.

## 2. Project Board Endpoints

### Get board

Route
- `GET /projects/:projectId/board/tasks`

Purpose
- Returns the project board grouped by status.
- This is the board/tab endpoint, not the overview endpoint.

Behavior
- Every active project status is returned as a board column, even if it has zero tasks.
- Tasks are ordered inside each column by `boardPosition`.
- It accepts the same task search/filter query params as the general task search endpoints.

Useful filters
- `q`
- `status_ids`
- `status_groups`
- `priority` / `priorities`
- `assignee_ids` or `assignee`
- `me`
- `tag_ids`
- `due_date`
- `include_closed`
- `include_subtasks`
- `completed`

Defaults worth knowing
- `include_subtasks = false`
- `include_closed = true`
- `include_archived = false`
- `me = false`

Response shape
- `data.groupBy` is always `"status"`
- `data.columns[]` contains:
  - `status`
  - `tasks`
  - `total`

### Reorder board

Route
- `PUT /projects/:projectId/board/tasks/reorder`

Purpose
- Use this for board drag/drop.

Behavior the frontend must respect
- `orderedTaskIds` must contain the full final order of all active top-level tasks in the destination status column.
- It is not enough to send only the moved card plus neighbors.
- Subtasks cannot be dragged on the board.
- If `toStatusId` changes, the task status changes too.
- If `toListId` is sent, the task can also move to another list.
- After board reorder, the backend also rewrites list `position` values to keep list view aligned with board ordering.

Very important response note
- The reorder endpoint returns a fresh board snapshot using the backend default board query.
- It does not preserve whatever filters the frontend used on the original board request.
- That returned snapshot effectively uses:
  - `include_subtasks = false`
  - `include_closed = true`
  - `include_archived = false`
  - no search/filter params

Frontend recommendation
- If the UI supports filtered board views, treat the reorder response as a success confirmation only, then refetch the board with the user’s active filters.

## 3. Task Search Endpoints Used by Dashboard Widgets

### Workspace-wide task search

Route
- `GET /tasks`

Purpose
- Use this for global task widgets, My Tasks, home/dashboard cards, and assignee-focused views.

### Project-scoped task search

Route
- `GET /projects/:projectId/tasks`

Purpose
- Same search model as `GET /tasks`, but limited to one project.

Returned task shape
- Each item includes:
  - `id`
  - `taskId` like `CU-104`
  - `taskNumber`
  - `title`
  - `priority`
  - `startDate`
  - `dueDate`
  - `position`
  - `boardPosition`
  - `depth`
  - `isCompleted`
  - `completedAt`
  - `createdAt`
  - `updatedAt`
  - `status`
  - `assignees`
  - `tags`
  - `list`
  - `_count.children`

Search/filter details that matter
- `q` searches:
  - title
  - description
  - status name
  - tag name
  - assignee full name
  - task number if the search text looks like a task key/number
- `me=true` adds the current user to the assignee filter.
- `assignee=unassigned` is supported.
- `assignee_match=all` requires all selected assignees.
- `tag_match=all` requires all selected tags.
- If `status_groups` is not provided and `include_closed=false`, closed statuses are filtered out.

Frontend recommendation
- Use `GET /tasks` for cross-project widgets.
- Use `GET /projects/:projectId/tasks` for project-specific tables/cards.
- Use `GET /projects/:projectId/board/tasks` only for board UI, not for a generic task list.

## 4. Activity Endpoints for Dashboard Cards

### Workspace/project activity

Route
- `GET /activity`

Purpose
- Use this for recent activity cards.
- You can scope it to a project with `projectId`.

Useful query params
- `projectId`
- `listId`
- `taskId`
- `q`
- `actorIds`
- `actions`
- `categories`
- `me`
- `from`
- `to`
- `cursor`
- `limit`

Response shape
```json
{
  "success": true,
  "data": {
    "items": [],
    "nextCursor": null
  },
  "message": null
}
```

Useful item fields
- `category`
- `entityType`
- `entityId`
- `action`
- `fieldName`
- `oldValue`
- `newValue`
- `metadata`
- `actor`
- `displayText`
- `createdAt`

### Task side-panel activity

Route
- `GET /tasks/:taskId/activity`

Purpose
- Use this for a task detail side panel or activity drawer.

## 5. Attachment Follow-up Endpoint

Dashboard overview only returns attachment metadata. To actually open files, use:

Route
- `POST /attachments/view`

Request body
```json
{
  "taskId": "task-uuid",
  "memberId": "current-user-id-or-workspace-member-id"
}
```

Important note
- `memberId` can be either the workspace member ID or the user ID. The backend resolves both.
- This route is JWT-protected, but it does not use `x-workspace-id`.

Frontend recommendation
- Do not expect signed URLs in the dashboard overview response.
- Fetch signed URLs lazily when the user opens a file preview or attachment list.

## 6. Known Gaps / Current Limitations

- `docs` in the dashboard overview is reserved for future work and currently returns `[]`.
- Dashboard overview attachments do not include signed URLs.
- Board reorder returns a default board snapshot, not a filter-preserving snapshot.
- Overview counts ignore subtasks because only top-level tasks are aggregated.

## 7. Suggested Frontend Data Flow

Overview page
1. Call `GET /projects/:projectId/dashboard`.
2. Render project header, status summary, per-list stats, and recent attachments.
3. If the user clicks an attachment, call `POST /attachments/view` for that task.
4. If the page has an activity card, call `GET /activity?projectId=<projectId>&limit=<n>`.

Board page
1. Call `GET /projects/:projectId/board/tasks` with the active board filters.
2. Render columns from `data.columns`.
3. On drag/drop, call `PUT /projects/:projectId/board/tasks/reorder`.
4. After success, refetch `GET /projects/:projectId/board/tasks` with the same filters if the board was filtered.

Task widgets
1. Use `GET /tasks` for global widgets.
2. Use `GET /projects/:projectId/tasks` for project-level widgets.
3. Use the shared task query params for tabs like My Tasks, Unassigned, Overdue, Done, etc.
