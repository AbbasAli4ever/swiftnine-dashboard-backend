# Notifications — SSE stream & payloads (Frontend integration)

Purpose: describe how the backend delivers notifications to the frontend, the SSE events to listen for, payload shapes, and example client code to integrate reliably.

---

## Overview

- The backend delivers in-app notifications via Server-Sent Events (SSE).
- Endpoint: `GET /notifications/members/:memberId/stream` (protected by JWT and workspace guard).
- This doc explains required headers, event names, payload shapes, example messages, and recommended client approaches.


## Connection details

- URL: `/notifications/members/:memberId/stream`
- Required headers:
  - `Authorization: Bearer <ACCESS_TOKEN>` (JWT). The server uses `ExtractJwt.fromAuthHeaderAsBearerToken()`.
  - `x-workspace-id: <WORKSPACE_ID>` — the workspace context header.
- Notes about browser auth: `EventSource` in the browser cannot set custom headers like `Authorization`.
  - If your app uses cookie-based auth (server sets auth cookie), `EventSource` with credentials works.
  - If you must send an Authorization header from the browser, use `fetch()` and parse the SSE stream manually (example below), or use a server-side proxy that injects the header.

cURL example (testing from terminal):

```bash
curl -N \
  -H "Authorization: Bearer <TOKEN>" \
  -H "x-workspace-id: <WORKSPACE_ID>" \
  "https://api.example.com/notifications/members/<MEMBER_ID>/stream"
```


## Events emitted

The server sends the following SSE events to a connected member (SSE `event:` fields):

1. `notifications:init`
   - Sent immediately after opening the stream.
   - Payload: an array of notification objects (recent notifications, ordered by `createdAt` descending, up to 200 items).
   - These objects are the DB Notification records (see model fields below).

2. `notification:created`
   - Sent whenever a new notification is created by the server.
   - Payload: a single notification object (a compact representation — see below).

3. `notification:updated`
  - Sent when a notification's flags change (for example: cleared, snoozed, read/unread).
  - Payload: the updated notification object; clients should update or remove UI items accordingly.

4. Heartbeat comments
   - The server writes SSE comment lines `:heartbeat` every 15s to keep the connection alive. These are SSE comments and should be ignored by clients.

> Implementation notes (backend):
> - `notifications:init` is sent from `NotificationsController.stream` using a `prisma.notification.findMany(...)` result.
> - `notification:created` is broadcast from `NotificationsService.createNotification` via `sse.broadcastToMember(member.id, 'notification:created', {...})`.


## Notification object (fields)

A notification object contains the following fields (DB model: `Notification` in Prisma):

- `id` (string) — notification id (UUID)
- `userId` (string) — recipient user id (present in `notifications:init` list)
- `type` (string) — logical notification type (e.g. `task:assigned`, `comment:created`, `mentioned`, ...)
- `title` (string) — short title for the UI
- `message` (string | null) — optional longer text (comment content, short description)
- `referenceType` (string | null) — related entity kind (eg. `task`, `comment`)
- `referenceId` (string | null) — id of the related entity
- `actorId` (string | null) — user id who triggered the notification (may be `null` for system messages)
- `isRead` (boolean) — read state
- `readAt` (string | null) — ISO timestamp when read (only present in DB records)
 - `isCleared` (boolean) — cleared/archived state; cleared notifications are hidden from the main SSE stream
 - `isSnoozed` (boolean) — whether the notification is currently snoozed
 - `snoozedAt` (string | null) — ISO timestamp when snooze expires (if set)
 - `createdAt` (string) — ISO timestamp when created

Important: The `notification:created` event payload is a compact object produced by the notifications service and may omit some DB-only fields (for example `userId` or `readAt`). The `notifications:init` array contains the full DB objects returned by Prisma.


## Example payloads

### `notifications:init` (array)

```json
[
  {
    "id": "7a8dbf8a-1cfe-4d9f-8a2b-1234567890ab",
    "userId": "user-111",
    "type": "task:assigned",
    "title": "You were assigned to a task",
    "message": "Assigned to task Build landing page",
    "referenceType": "task",
    "referenceId": "task-42",
    "actorId": "user-222",
    "isRead": false,
    "readAt": null,
    "createdAt": "2026-04-27T12:00:00.000Z"
  }
]
```

### `notification:created` (single object)

```json
{
  "id": "8b2c4f5e-aaa1-4cde-9a33-abcdef123456",
  "type": "comment:created",
  "title": "New comment on assigned task",
  "message": "Looks good to me!",
  "referenceType": "comment",
  "referenceId": "comment-77",
  "actorId": "user-333",
  "isRead": false,
  "isCleared": false,
  "isSnoozed": false,
  "snoozedAt": null,
  "createdAt": "2026-04-27T12:10:00.000Z"
}
```

Note: the `notification:created` payload is intentionally compact; if you need full DB fields (eg. `readAt` or `userId`) use `notifications:init` or request a dedicated API (coordinate with backend).

The SSE payloads now include `isCleared`, `isSnoozed`, and `snoozedAt`. The stream only emits notifications that are not cleared and not currently snoozed; `isRead` may be true or false and is included in all SSE payloads.


## Common `type` values (examples found in backend code)

- `task:assigned` — user was assigned to a task (`referenceType`: `task`)
- `task:updated` — assigned task updated (message contains changed fields)
- `comment:created` — new comment written on a task assigned to the recipient
- `comment_added` — new comment notification for the task creator (string-style type used in a few places)
- `mentioned` — user was mentioned in a comment (`referenceType`: `comment`)
- `reaction:created` — new reaction on a comment/task (message contains reaction face)
- `reaction:updated`, `reaction:deleted` — reaction updates

These are not enforced enums — the backend uses arbitrary strings. Always treat `type` as opaque keys and rely on `referenceType`/`referenceId` to route the user.


## Client integration examples

### 1) Browser: `EventSource` (cookie-based auth)

Use this if your authentication is cookie-based (the cookie is sent automatically):

```js
const memberId = '<WORKSPACE_MEMBER_ID_OR_USER_ID>';
const es = new EventSource(`/notifications/members/${memberId}/stream`, { withCredentials: true });

es.addEventListener('notifications:init', (e) => {
  const notifs = JSON.parse(e.data);
  // render initial notifications list
});

es.addEventListener('notification:created', (e) => {
  const notif = JSON.parse(e.data);
  // append to UI list, show toast, etc.
});

es.addEventListener('error', (err) => {
  console.error('SSE error', err);
});
```

> Important: `EventSource` does not allow setting `Authorization` headers. If your app uses Bearer tokens in headers, use the fetch-based approach below.


### 2) Browser: `fetch` + manual SSE parsing (supports `Authorization` header)

This example shows how to open the SSE stream using `fetch()` so you can set headers (including `Authorization`) and parse events in JavaScript.

```js
async function connectSseWithAuth(memberId, token, workspaceId) {
  const res = await fetch(`/notifications/members/${memberId}/stream`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'x-workspace-id': workspaceId,
    },
  });

  if (!res.ok) throw new Error('Failed to open notification stream');

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  function parseSseEvent(raw) {
    // raw contains lines separated by `\n`
    if (!raw.trim()) return null;
    if (raw.startsWith(':')) return null; // comment (heartbeat)

    let event = 'message';
    let data = '';

    for (const line of raw.split(/\n/)) {
      if (line.startsWith('event:')) event = line.slice(6).trim();
      else if (line.startsWith('data:')) data += line.slice(5);
    }

    if (!data) return null;
    try {
      return { event, data: JSON.parse(data) };
    } catch (err) {
      console.error('Failed to parse SSE JSON', err);
      return null;
    }
  }

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    let idx;
    while ((idx = buffer.indexOf('\n\n')) !== -1) {
      const raw = buffer.slice(0, idx);
      buffer = buffer.slice(idx + 2);
      const ev = parseSseEvent(raw);
      if (!ev) continue;

      if (ev.event === 'notifications:init') {
        // ev.data is an array
        handleInit(ev.data);
      } else if (ev.event === 'notification:created') {
        handleCreated(ev.data);
      }
    }
  }
}
```

### 3) Server-side proxy

If you cannot change auth to cookies and prefer `EventSource` on the client, you can implement a small proxy endpoint on your frontend server that attaches the `Authorization` header and forwards the SSE response to the browser (same-origin). That lets the browser use `EventSource` against the proxy without direct header manipulation.


## UI guidance / routing

- Use `referenceType` + `referenceId` to route users on click (e.g., `task` -> open task details, `comment` -> open comment thread anchored to comment id).
- Use `actorId` to fetch minimal actor info (name/avatar) when you want to show "X commented" style messages. The stream includes `actorId` (may be `null` for system messages).
- Prefer `notifications:init` as the canonical source for the initial list (it contains DB fields like `readAt`). Treat `notification:created` as a delta/append event for new items.


## State update APIs (split into 3 endpoints)

The backend exposes dedicated REST endpoints (protected by JWT + workspace header) for each state. Users can also send `false` to revert a state manually, including snooze.

- PATCH `/notifications/:id/clear`
  - Body fields:
    - `isCleared` (boolean)
  - Behavior:
    - `isCleared=true`: clears the notification and resets other active states (`isSnoozed=false`, `snoozedAt=null`, `isRead=false`, `readAt=null`).
    - `isCleared=false`: un-clears the notification.
  - Example request:

```json
PATCH /notifications/8b2c4f5e-aaa1-4cde-9a33-abcdef123456/clear
{
  "isCleared": true
}
```

- PATCH `/notifications/:id/snooze`
  - Body fields:
    - `isSnoozed` (boolean)
    - `snoozeUntil` (ISO datetime string, optional)
  - Behavior:
    - `isSnoozed=true` with `snoozeUntil`: snoozed until that datetime, then auto-unsnoozed.
    - `isSnoozed=true` without `snoozeUntil`: stays snoozed until user sends `isSnoozed=false`.
    - `isSnoozed=false`: unsnoozes immediately and sets `snoozedAt=null`.
    - `snoozeUntil` is allowed only when `isSnoozed=true`.
    - `isSnoozed=true` resets other active states (`isCleared=false`, `isRead=false`, `readAt=null`).
  - Example request:

```json
PATCH /notifications/8b2c4f5e-aaa1-4cde-9a33-abcdef123456/snooze
{
  "isSnoozed": true,
  "snoozeUntil": "2026-04-27T13:10:00.000Z"
}
```

- PATCH `/notifications/:id/read`
  - Body fields:
    - `isRead` (boolean)
  - Behavior:
    - `isRead=true`: marks read and sets `readAt`.
    - `isRead=false`: marks unread and clears `readAt`.
    - `isRead=true` resets other active states (`isCleared=false`, `isSnoozed=false`, `snoozedAt=null`).
  - Example request:

```json
PATCH /notifications/8b2c4f5e-aaa1-4cde-9a33-abcdef123456/read
{
  "isRead": false
}
```

- Any of these updates emits a `notification:updated` SSE event to connected member streams in the same workspace.

Example response (updated notification object):

```json
{
  "id": "8b2c4f5e-aaa1-4cde-9a33-abcdef123456",
  "type": "comment:created",
  "title": "New comment on assigned task",
  "message": "Looks good to me!",
  "referenceType": "comment",
  "referenceId": "comment-77",
  "actorId": "user-333",
  "isRead": false,
  "isCleared": false,
  "isSnoozed": true,
  "snoozedAt": "2026-04-27T13:10:00.000Z",
  "createdAt": "2026-04-27T12:10:00.000Z"
}
```

- GET `/notifications/cleared`
  - Returns the notifications for the current member where `isCleared = true` (most recent first).

- GET `/notifications/snoozed`
  - Returns the notifications for the current member where `isSnoozed = true` (ordered by `snoozedAt`).
  - The server will automatically unsnooze any notifications whose `snoozedAt` time has passed before returning results.

All REST endpoints are protected by the same `JwtAuthGuard` + `WorkspaceGuard` and require the `x-workspace-id` header.


## Troubleshooting & tips

- If you see the connection drop frequently, verify your frontend and any proxies (nginx) allow `text/event-stream` and disable buffering. The backend sets `X-Accel-Buffering: no`.
- Heartbeat lines begin with `:` — don't try to JSON.parse them.
- `notifications:init` returns up to 200 most recent notifications ordered by `createdAt` desc.


## Backend code pointers (for reference)

- SSE service and broadcast: [apps/api/src/notifications/sse.service.ts](apps/api/src/notifications/sse.service.ts#L1-L200)
- Notifications service (create + broadcast): [apps/api/src/notifications/notifications.service.ts](apps/api/src/notifications/notifications.service.ts#L1-L200)
- Notifications controller (stream endpoint): [apps/api/src/notifications/notifications.controller.ts](apps/api/src/notifications/notifications.controller.ts#L1-L200)
- Notification response DTO: [apps/api/src/notifications/dto/notification-response.dto.ts](apps/api/src/notifications/dto/notification-response.dto.ts#L1-L120)


---

If you want, I can:
- Add a small React hook example using the `fetch` parser.
- Add a `PATCH /notifications/:id/read` endpoint implementation and tests in the backend.

