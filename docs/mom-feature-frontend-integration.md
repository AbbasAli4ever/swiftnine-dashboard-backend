# Minutes of Meeting (MoM) — Frontend Integration Guide

Single source of truth for integrating the Minutes of Meeting feature. Reflects the actual backend implementation as it stands today — this feature has not been merged to `main` yet.

---

## 1. Conventions

### Base URL
- REST API: `/api/v1`

### Auth
- `Authorization: Bearer <accessToken>` on every route.
- `x-workspace-id: <workspaceId>` header required on every route — all `/meetings/*` routes are workspace-scoped.

### Standard response envelope
```json
{ "data": <payload>, "message": "<optional human string>" }
```
(Errors follow the standard Nest error shape: `{ statusCode, message }`.)

### Who can use this feature
**The entire feature is restricted to workspace OWNER or MANAGER.** A plain MEMBER gets 403 on every single endpoint below, including read (`GET`). There is currently no way for a MEMBER to view or participate in MoM through the API, even as a listed participant.

On top of that role gate, **update and delete are further restricted to the meeting's creator** — an OWNER/MANAGER who didn't create a given meeting can still create/read/list *other* meetings, but cannot edit or delete this one.

### Dates
ISO 8601 strings.

---

## 2. Domain model

### Meeting
```ts
type Meeting = {
  id: string;
  workspaceId: string;
  title: string;
  meetingDate: string;
  summary: string | null;
  decisions: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;

  creator: UserBrief;
  participants: Array<{ user: UserBrief }>;
  tasks: MeetingTask[];
  taskStats: MeetingTaskStats;
};

type UserBrief = {
  id: string;
  fullName: string;
  avatarUrl: string | null;
  avatarColor: string;
};

type MeetingTaskStats = {
  total: number;
  completed: number;
  pending: number;
};
```

### MeetingListItem — the row shape `GET /meetings` returns
```ts
type MeetingListItem = {
  id: string;
  title: string;
  meetingDate: string;
  createdAt: string;
  creator: UserBrief;
  participants: Array<{ user: UserBrief }>;
  taskStats: MeetingTaskStats;
};
```
Deliberately lighter than `Meeting` — no `summary`, `decisions`, `workspaceId`, `updatedAt`, or `tasks` array, just enough for a "Recent meetings" card. Fetch `GET /meetings/:meetingId` for the full detail of one meeting.

`taskStats` counts a task as `completed` once it's sitting in its project's terminal status column (`status.isClosed`) — everything else counts as `pending`, regardless of how many non-terminal columns (To Do, In Progress, Review, ...) a project defines. This is **not** the same as the task's separate "mark complete" checkbox (`Task.isCompleted` / `PATCH /tasks/:id/complete`) — that toggle is independent of which status column the task sits in and has **no effect** on these counts. Only actually moving the task to the closed column counts.

### MeetingTask
```ts
type MeetingTask = {
  id: string;
  taskNumber: number;
  title: string;
  createdAt: string;
  startDate: string | null;
  dueDate: string | null;
  status: {
    id: string;
    name: string;
    color: string;
    group: 'NOT_STARTED' | 'ACTIVE' | 'DONE' | 'CLOSED';
    isClosed: boolean;       // the actual "completed" flag — see taskStats note above
  };
  list: {
    project: { id: string; name: string; taskIdPrefix: string };
  };
  assignees: Array<{ user: UserBrief }>;
  children: Array<{ id: string; title: string; status: { isClosed: boolean } }>; // raw subtasks

  progress: number;          // 0-100, see §3
  isLate: boolean;           // see §3
  subtaskStats: { total: number; completed: number } | null;
};
```

`children` is the raw subtask list (from the normal task-subtask system, `POST /tasks/:taskId/subtasks`) — it's returned mainly so `progress`/`subtaskStats` are auditable, not because the frontend needs to re-derive anything from it. Use `progress` and `subtaskStats` directly.

---

## 3. Progress & lateness — how they're actually computed

This is the part most likely to surprise you, so read it before wiring up a progress bar.

**If the task has subtasks** (`children.length > 0`), progress is purely how many of them are done:
```
progress = round(completedSubtasks / totalSubtasks * 100)
```
2 of 4 subtasks completed → `50`. Due dates are **completely ignored** once a task has even one subtask — `subtaskStats` will be non-null (`{ total, completed }`) in this case.

**If the task has no subtasks**, progress falls back to a linear date-based measure from a start reference to `dueDate`:
```
referenceStart = startDate ?? createdAt
progress = clamp(0, 100, round((now - referenceStart) / (dueDate - referenceStart) * 100))
```
A task due in 4 days, checked today, reads `0`. Checked after exactly 1 of those 4 days, reads `25`. `subtaskStats` is `null` in this case. A task with **no `dueDate` at all** can't be measured this way and always reads `progress: 0`.

**Either way**, once the task itself is completed (`status.isClosed`), `progress` is always `100` and `isLate` is always `false` — regardless of subtask counts or date math. A task that finished "early" relative to its date window still shows 100%, not some lower number.

**`isLate`** is independent of which progress method applies: `true` whenever `dueDate` has passed and the task itself is not yet completed. A task with no `dueDate` can never be late.

Because `progress` is a snapshot computed fresh on every response (not a stored column), it updates automatically the instant the underlying task's status or subtasks change — there's nothing to invalidate or refetch specially, just re-fetch the meeting.

---

## 4. REST endpoints

All under `/api/v1/meetings`.

| Method | Path | Body / Query | Returns |
|---|---|---|---|
| GET | `/meetings` | `?page=&limit=` (page default 1; limit default 20, max 100) | `{ items: MeetingListItem[], meta: {...} }` (200), sorted `meetingDate` desc — see below |
| POST | `/meetings` | see §5 | `Meeting` (201) |
| GET | `/meetings/:meetingId` | — | `Meeting` (200) |
| PATCH | `/meetings/:meetingId` | see §5 | `Meeting` (200) — **creator only** |
| DELETE | `/meetings/:meetingId` | — | `null` (200) — **creator only** |

`GET /meetings` uses this app's standard paginated envelope:
```json
{
  "data": [ /* MeetingListItem[] */ ],
  "meta": { "page": 1, "limit": 20, "total": 9, "total_pages": 1, "has_next": false, "has_prev": false },
  "message": null
}
```

### 5. Create — `POST /meetings`
```ts
{
  title: string;                // 1-300 chars, required
  meetingDate: string;          // ISO datetime, required
  participantIds: string[];     // >= 1 required, must all be workspace members
  summary?: string;             // up to 20000 chars
  decisions?: string[];         // each 1-1000 chars
  tasks?: Array<{
    title: string;              // 1-500 chars, required
    projectId: string;          // required — dropdown from GET /projects
    assigneeId: string;         // required — dropdown from GET /workspaces/:workspaceId/members;
                                 // must be able to access the selected project
    dueDate?: string;           // ISO datetime — needed for §3's progress calc if the task
                                 // won't have subtasks
  }>;
}
```
Each follow-up task lands in its project's **first task list** and its **first NOT_STARTED status** ("To Do") automatically — there's no list/status picker in this flow, by design. `taskNumber`/`taskIdPrefix` are assigned the same way any other task in that project gets them.

The assignee (if not the caller) gets a `task:assigned` notification, same shape as any other task assignment.

### Update — `PATCH /meetings/:meetingId`
All fields optional, but **at least one is required** (422 otherwise):
```ts
{
  title?: string;
  meetingDate?: string;
  summary?: string | null;      // null explicitly clears it
  decisions?: string[];         // replaces the whole array, not a merge
  participantIds?: string[];    // replaces the whole participant list, not a merge — >= 1 if provided
}
```
**Follow-up tasks are not editable through this endpoint.** Once created, a task is a normal task — manage its title/status/assignee/dueDate/subtasks through the regular `/tasks/:taskId` endpoints, not through the meeting.

### Delete — `DELETE /meetings/:meetingId`
Soft-deletes the meeting — **nothing about its linked tasks is touched except the link itself**. Every task keeps its title, status, assignee, subtasks, and progress exactly as it was; only `Task.meetingId` is cleared. The meeting itself becomes unreachable (404 on subsequent `GET`), and calling delete again on it also 404s rather than erroring.

---

## 6. Error handling cheatsheet

| Scenario | Code |
|---|---|
| Missing/invalid JWT | 401 |
| Caller is a MEMBER (not OWNER/MANAGER) | 403 — "Only the workspace owner can perform this action" (see note below) |
| Caller is OWNER/MANAGER but not this meeting's creator, on update/delete | 403 |
| Meeting not found / already deleted | 404 |
| A selected project doesn't exist, or caller can't access it | 404 |
| A participant/assignee id isn't a workspace member | 400 |
| An assignee can't access a PRIVATE project | 400 |
| A selected project has no task list or no "To Do" status | 400 |
| `PATCH` with an empty body | 422 |

**Known rough edge:** the 403 message for the role check always says *"Only the workspace owner can perform this action"*, even though MANAGER is equally allowed — it's a generic message shared by every role-gated endpoint in this app, not specific to MoM. Don't parse it for "which role is required"; just treat any 403 here as "not OWNER/MANAGER" (or, on update/delete, possibly "not the creator" instead — the message doesn't currently distinguish the two cases).

---

## 7. Minimal end-to-end example

```ts
// 0. Render the "Recent meetings" list
const { data: meetings, meta } = await api.get('/meetings?limit=20');

// 1. Create a meeting with two follow-up tasks
const created = await api.post('/meetings', {
  title: 'Q3 Sprint Planning',
  meetingDate: new Date().toISOString(),
  participantIds: [ownerId, aliceId, bobId],
  summary: 'Discussed Q3 roadmap priorities.',
  decisions: ['Ship MoM feature by Friday'],
  tasks: [
    { title: 'Write API docs', projectId, assigneeId: aliceId, dueDate: fourDaysFromNow },
    { title: 'Wire up frontend form', projectId, assigneeId: bobId },
  ],
});
const meetingId = created.data.id;

// 2. Render the card
// created.data.taskStats -> { total: 2, completed: 0, pending: 2 }
// created.data.tasks[0].progress -> 0 (4 days out, no subtasks yet)

// 3. Re-fetch any time to get live progress (e.g. after someone moves a task's
//    status, or adds/completes subtasks on it) — nothing to invalidate manually
const refreshed = await api.get(`/meetings/${meetingId}`);

// 4. Edit meeting-level fields (creator only)
await api.patch(`/meetings/${meetingId}`, { summary: 'Updated summary' });

// 5. Delete when done (creator only) — linked tasks survive, just unlinked
await api.delete(`/meetings/${meetingId}`);
```

---

## 8. Out of scope (do not build against)

- Filtering/searching the list endpoint (by date range, participant, creator, etc.) — `GET /meetings` only supports `page`/`limit` today, no filters.
- Editing follow-up tasks through the meeting endpoint — not supported; use the normal task endpoints.
- Any MEMBER-level access — the whole feature is OWNER/MANAGER only today, participants included.
- Restoring a deleted meeting ("undelete") — no such endpoint.
- Meeting-level attachments, comments, or its own chat/notification stream.

---

## 9. Versioning

This document tracks the actual implementation as of today. If you find a divergence between this doc and the API behavior, the API behavior is the bug — flag it and reference the affected section.
