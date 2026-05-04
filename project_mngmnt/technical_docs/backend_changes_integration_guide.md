# Backend Changes — Frontend Integration Guide

**Date:** 2026-04-30  
**Areas:** Task Description & Attachments · Favorites · Archive · Logout All · Workspace Fixes

---

## Required Headers (all endpoints)

| Header | Value |
|---|---|
| `Authorization` | `Bearer <jwt_token>` |
| `x-workspace-id` | Active workspace UUID |

---

## 1. Task Description & Attachments

### 1.1 Rich Text Description on Tasks

Tasks now support a structured JSON description (for rich text editors like TipTap/ProseMirror) alongside a plaintext fallback for search.

**New fields on Task:**

| Field | Type | Notes |
|---|---|---|
| `descriptionJson` | `object \| null` | Rich text AST (TipTap/ProseMirror JSON format) |
| `description` | `string \| null` | Plain string description (kept for backwards compat) |
| `descriptionPlaintext` | `string` | Auto-extracted plaintext from `descriptionJson` — read-only, used for search |

#### Create Task — POST `/api/v1/projects/:projectId/lists/:listId/tasks`

```json
{
  "title": "Implement login page",
  "statusId": "uuid",
  "priority": "HIGH",
  "description": "Plain text fallback",
  "descriptionJson": {
    "type": "doc",
    "content": [
      {
        "type": "paragraph",
        "content": [{ "type": "text", "text": "Rich text content here" }]
      }
    ]
  },
  "startDate": "2026-05-01T00:00:00.000Z",
  "dueDate": "2026-05-10T00:00:00.000Z",
  "assigneeIds": ["user-uuid-1"],
  "tagIds": ["tag-uuid-1"]
}
```

| Field | Type | Required | Notes |
|---|---|---|---|
| `title` | string | Yes | 1–500 chars |
| `statusId` | UUID | Yes | Must belong to this project |
| `priority` | enum | No | `URGENT \| HIGH \| NORMAL \| LOW \| NONE` — default `NONE` |
| `description` | string | No | Plain text |
| `descriptionJson` | object | No | Rich text JSON (TipTap/ProseMirror format) |
| `startDate` | ISO datetime | No | |
| `dueDate` | ISO datetime | No | |
| `assigneeIds` | UUID[] | No | User IDs |
| `tagIds` | UUID[] | No | Tag IDs scoped to project |

#### Update Task — PATCH `/api/v1/tasks/:taskId`

All fields optional. To clear `descriptionJson`, pass `null` explicitly.

```json
{
  "title": "Updated title",
  "descriptionJson": {
    "type": "doc",
    "content": [...]
  },
  "priority": "URGENT",
  "dueDate": "2026-05-15T00:00:00.000Z"
}
```

> **Tip:** When the user types in a rich text editor, save `descriptionJson`. When they type in a plain textarea, save `description`. Never send both — pick one per interaction.

#### Task Response Shape (relevant new fields)

```json
{
  "id": "task-uuid",
  "title": "Implement login page",
  "description": "Plain text fallback",
  "descriptionJson": { "type": "doc", "content": [...] },
  "descriptionPlaintext": "Rich text content here",
  "priority": "HIGH",
  "isFavorite": false,
  ...
}
```

---

### 1.2 Attachments

Attachments use a **presign → upload → register** flow. Files go directly to S3 from the browser; the backend only stores metadata.

#### Step 1 — Get a presigned upload URL

**POST `/api/v1/attachments/presign`**

```json
{
  "fileName": "design-mockup.png",
  "mimeType": "image/png",
  "fileSize": 204800
}
```

| Field | Type | Required |
|---|---|---|
| `fileName` | string | Yes |
| `mimeType` | string | Yes |
| `fileSize` | number (bytes) | Yes |

**Response:**

```json
{
  "success": true,
  "data": {
    "uploadUrl": "https://s3.amazonaws.com/bucket/key?X-Amz-Signature=...",
    "key": "uploads/workspace-id/uuid-design-mockup.png",
    "expiresIn": 900
  }
}
```

> `uploadUrl` expires in **15 minutes**. `PUT` the file directly to this URL from the browser.

#### Step 2 — Upload directly to S3

```ts
await fetch(uploadUrl, {
  method: 'PUT',
  headers: { 'Content-Type': mimeType },
  body: file,
});
```

#### Step 3 — Register the attachment

**POST `/api/v1/attachments`**

```json
{
  "taskId": "task-uuid",
  "key": "uploads/workspace-id/uuid-design-mockup.png",
  "fileName": "design-mockup.png",
  "mimeType": "image/png",
  "fileSize": 204800
}
```

**Response:** `201` — attachment object.

---

#### Get Attachment URLs for a Task

**POST `/api/v1/attachments/view`**

```json
{
  "taskId": "task-uuid"
}
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "attachment-uuid",
      "fileName": "design-mockup.png",
      "mimeType": "image/png",
      "fileSize": 204800,
      "url": "https://s3.amazonaws.com/bucket/key?X-Amz-...",
      "createdAt": "2026-04-30T10:00:00.000Z",
      "uploadedBy": {
        "id": "user-uuid",
        "fullName": "Ayesha Khan",
        "avatarUrl": null
      }
    }
  ]
}
```

> The `url` is a **presigned read URL** — valid for a limited time. Do not store it; always fetch fresh via this endpoint.

---

#### Delete an Attachment

**DELETE `/api/v1/attachments`**

```json
{
  "attachmentId": "attachment-uuid"
}
```

**Response:** `200 — { success: true, data: null }`

---

#### Doc Attachments (same flow, different endpoints)

| Action | Endpoint |
|---|---|
| Presign | `POST /api/v1/attachments/presign` (same) |
| Register | `POST /api/v1/attachments/docs` — body: `{ docId, key, fileName, mimeType, fileSize }` |
| View | `POST /api/v1/attachments/docs/view` — body: `{ docId }` |
| Delete | `DELETE /api/v1/attachments/docs` — body: `{ attachmentId }` |

---

## 2. Favorites (Starred) System

Users can star/unstar projects and tasks. Favorites are per-user and per-workspace.

### 2.1 Projects

#### Star a project
**PUT `/api/v1/projects/:projectId/favorite`**  
No body. Idempotent — safe to call multiple times.

**Response:** `200 — { success: true, data: null }`

#### Unstar a project
**DELETE `/api/v1/projects/:projectId/favorite`**  
No body.

**Response:** `200 — { success: true, data: null }`

#### List favorite projects
**GET `/api/v1/favorites/projects`**

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "project-uuid",
      "name": "Backend",
      "color": "#6366f1",
      "emoji": "🚀",
      "isArchived": false,
      "favoritedAt": "2026-04-30T09:00:00.000Z"
    }
  ]
}
```

Results are sorted **newest favorited first**.

---

### 2.2 Tasks

#### Star a task
**PUT `/api/v1/tasks/:taskId/favorite`**  
No body. Idempotent.

#### Unstar a task
**DELETE `/api/v1/tasks/:taskId/favorite`**  
No body.

#### List favorite tasks
**GET `/api/v1/favorites/tasks`**

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "task-uuid",
      "title": "Build login page",
      "priority": "HIGH",
      "status": { "id": "uuid", "name": "In Progress", "color": "#f59e0b" },
      "dueDate": "2026-05-10T00:00:00.000Z",
      "isFavorite": true,
      "favoritedAt": "2026-04-30T09:00:00.000Z"
    }
  ]
}
```

---

### 2.3 `isFavorite` on Task Responses

All task list/detail responses now include `isFavorite: boolean`. Use this to render the star icon state without a separate API call.

```json
{
  "id": "task-uuid",
  "title": "Build login page",
  "isFavorite": true,
  ...
}
```

---

## 3. Archive Functionality

### 3.1 Projects

#### Archive a project
**PATCH `/api/v1/projects/:projectId/archive`**  
No body. Only `OWNER` or `ADMIN` can archive.

**Response:** `200 — { success: true, data: null, message: "Project archived" }`

#### Restore a project
**PATCH `/api/v1/projects/:projectId/restore`**  
No body. Only `OWNER` or `ADMIN` can restore.

**Response:** `200 — { success: true, data: null, message: "Project restored" }`

#### List archived projects
**GET `/api/v1/projects/archived`**

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "project-uuid",
      "name": "Old Project",
      "isArchived": true,
      "archivedAt": "2026-04-20T00:00:00.000Z"
    }
  ]
}
```

#### Include archived in regular project list

Add `?includeArchived=true` to the standard projects list endpoint to get both active and archived together.

---

### 3.2 Lists (Task Lists)

#### Archive a list
**PATCH `/api/v1/projects/:projectId/lists/:listId/archive`**  
No body. Only `OWNER` or `ADMIN` can archive.

#### Restore a list
**PATCH `/api/v1/projects/:projectId/lists/:listId/restore`**  
No body.

**Response for both:** `200 — { success: true, data: null }`

---

### 3.3 Behavior Notes

- Archived projects/lists are **excluded by default** from all list endpoints.
- Tasks inside archived lists/projects are **still accessible** by direct ID but won't appear in list views.
- Archive is a **soft operation** — no data is deleted.
- Activity is logged on archive and restore.

---

## 4. Logout All Sessions

### Logout current session
**POST `/api/v1/auth/logout`**

```json
{
  "refreshToken": "your-refresh-token"
}
```

**Response:** `200 — { success: true, data: null }`

---

### Logout all sessions (new)
**POST `/api/v1/auth/logout-all`**

No body. Requires a valid `Authorization: Bearer <accessToken>` header.

Deletes **all refresh tokens** for the authenticated user — logs out every device/tab simultaneously.

**Response:** `200 — { success: true, data: null, message: "All sessions terminated" }`

> **When to use:** Expose this as "Sign out of all devices" in account/security settings.

---

### Password Reset also logs out all sessions

When a user resets their password via `POST /auth/reset-password`, all existing refresh tokens are automatically revoked. The user will need to log in again on all devices.

---

## 5. Workspace Fixes

### 5.1 Member List Response — Fixed Fields

`GET /api/v1/workspaces/:workspaceId/members` response now includes correct and complete data:

```json
{
  "success": true,
  "data": [
    {
      "id": "member-uuid",
      "fullName": "Ayesha Khan",
      "email": "ayesha@example.com",
      "role": "MEMBER",
      "lastActive": "2026-04-29T08:00:00.000Z",
      "invitedBy": "Abbas Ali",
      "invitedOn": "2026-04-01T00:00:00.000Z",
      "inviteStatus": "ACCEPTED"
    }
  ]
}
```

### 5.2 Member Detail Response — Fixed Fields

`GET /api/v1/workspaces/:workspaceId/members/:memberId` now returns full profile:

```json
{
  "success": true,
  "data": {
    "id": "member-uuid",
    "fullName": "Ayesha Khan",
    "email": "ayesha@example.com",
    "avatarUrl": "https://cdn.example.com/avatar.png",
    "avatarColor": "#6366f1",
    "role": "MEMBER",
    "designation": "Frontend Engineer",
    "bio": "I build UIs",
    "isOnline": true,
    "timezone": "Asia/Karachi",
    "lastActive": "2026-04-29T08:00:00.000Z",
    "invitedBy": "Abbas Ali",
    "invitedOn": "2026-04-01T00:00:00.000Z",
    "inviteStatus": "ACCEPTED",
    "createdAt": "2026-04-01T00:00:00.000Z",
    "updatedAt": "2026-04-29T08:00:00.000Z"
  }
}
```

---

## 6. Notification — New `isCommented` Field

Notification objects now include `isCommented: boolean`. Use this to show a "comment" badge or indicator in the notification feed.

```json
{
  "id": "notif-uuid",
  "type": "comment:created",
  "isRead": false,
  "isCommented": true,
  ...
}
```

---

## Quick Reference — New & Changed Endpoints

| Method | Endpoint | What's New |
|---|---|---|
| `POST` | `/attachments/presign` | Get S3 presigned upload URL |
| `POST` | `/attachments` | Register task attachment after upload |
| `POST` | `/attachments/view` | Get presigned read URLs for task attachments |
| `DELETE` | `/attachments` | Delete task attachment |
| `POST` | `/attachments/docs` | Register doc attachment |
| `POST` | `/attachments/docs/view` | Get presigned read URLs for doc attachments |
| `DELETE` | `/attachments/docs` | Delete doc attachment |
| `PUT` | `/projects/:projectId/favorite` | Star a project |
| `DELETE` | `/projects/:projectId/favorite` | Unstar a project |
| `GET` | `/favorites/projects` | List starred projects |
| `PUT` | `/tasks/:taskId/favorite` | Star a task |
| `DELETE` | `/tasks/:taskId/favorite` | Unstar a task |
| `GET` | `/favorites/tasks` | List starred tasks |
| `PATCH` | `/projects/:projectId/archive` | Archive project |
| `PATCH` | `/projects/:projectId/restore` | Restore project |
| `GET` | `/projects/archived` | List archived projects |
| `PATCH` | `/projects/:projectId/lists/:listId/archive` | Archive list |
| `PATCH` | `/projects/:projectId/lists/:listId/restore` | Restore list |
| `POST` | `/auth/logout-all` | Logout all devices |
| `POST` | `/projects/:projectId/lists/:listId/tasks` | **Updated** — now accepts `descriptionJson` |
| `PATCH` | `/tasks/:taskId` | **Updated** — now accepts `descriptionJson` |
