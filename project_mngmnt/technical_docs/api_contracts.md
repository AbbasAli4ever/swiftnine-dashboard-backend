# FocusHub V1 - API Response Contracts & Standards

## Overview

This document defines the standard API response shapes, error handling, pagination, authentication headers, and naming conventions for the FocusHub backend. All API endpoints must follow these contracts for consistency.

---

## Base URL & Versioning

```
Base URL: /api/v1
Example:  /api/v1/workspaces
```

All endpoints are prefixed with `/api/v1`. This allows future breaking changes to live under `/api/v2` without affecting existing clients.

---

## Authentication Headers

### Protected Routes

```
Authorization: Bearer <access_token>
```

- Access token is a short-lived JWT (15 min) sent in the `Authorization` header.
- Refresh token is a long-lived token (7 days) stored in an **httpOnly, secure, sameSite** cookie named `refresh_token`.

### Public Routes (No Auth Required)

| Endpoint                     | Method | Purpose                            |
| ---------------------------- | ------ | ---------------------------------- |
| /api/v1/auth/signup          | POST   | Register                           |
| /api/v1/auth/login           | POST   | Login                              |
| /api/v1/auth/google          | GET    | Google OAuth redirect              |
| /api/v1/auth/google/callback | GET    | Google OAuth callback              |
| /api/v1/auth/forgot-password | POST   | Request password reset             |
| /api/v1/auth/reset-password  | POST   | Reset password with token          |
| /api/v1/auth/refresh         | POST   | Refresh access token (uses cookie) |

---

## Standard Response Shapes

### Success Response — Single Resource

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "My Workspace",
    "created_at": "2026-04-10T12:00:00.000Z"
  },
  "message": "Workspace created successfully"
}
```

### Success Response — List (Paginated)

```json
{
  "success": true,
  "data": [
    { "id": "uuid-1", "title": "Task 1" },
    { "id": "uuid-2", "title": "Task 2" }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "total_pages": 8,
    "has_next": true,
    "has_prev": false
  },
  "message": null
}
```

### Success Response — No Content

For delete operations or actions that don't return data:

```json
{
  "success": true,
  "data": null,
  "message": "Task deleted successfully"
}
```

### Success Response — Auth

Login/signup returns tokens differently:

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "full_name": "Shoaib",
      "email": "shoaib@example.com",
      "avatar_url": null,
      "avatar_color": "#6366f1"
    },
    "access_token": "eyJhbGciOi..."
  },
  "message": "Login successful"
}
```

> Refresh token is set as an httpOnly cookie — never in the response body.

---

## Error Response Shape

All errors follow one consistent shape:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      },
      {
        "field": "password",
        "message": "Password must be at least 8 characters"
      }
    ]
  }
}
```

### Error Codes

| Code                   | HTTP Status | When Used                                                            |
| ---------------------- | ----------- | -------------------------------------------------------------------- |
| `VALIDATION_ERROR`     | 400         | Request body/params fail validation                                  |
| `BAD_REQUEST`          | 400         | Malformed request (non-validation)                                   |
| `UNAUTHORIZED`         | 401         | Missing or invalid access token                                      |
| `TOKEN_EXPIRED`        | 401         | Access token expired (client should refresh)                         |
| `FORBIDDEN`            | 403         | User lacks permission for this action                                |
| `NOT_FOUND`            | 404         | Resource doesn't exist or is soft-deleted                            |
| `CONFLICT`             | 409         | Duplicate resource (e.g., email already exists, invite already sent) |
| `UNPROCESSABLE_ENTITY` | 422         | Business logic error (e.g., max subtask depth exceeded)              |
| `TOO_MANY_REQUESTS`    | 429         | Rate limit exceeded                                                  |
| `INTERNAL_ERROR`       | 500         | Unexpected server error                                              |

### Error Response — Simple (No Field Details)

```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Task not found",
    "details": null
  }
}
```

### Error Response — Business Logic

```json
{
  "success": false,
  "error": {
    "code": "UNPROCESSABLE_ENTITY",
    "message": "Maximum subtask depth of 3 levels exceeded",
    "details": null
  }
}
```

---

## Pagination

All list endpoints use **offset-based pagination** with consistent query params.

### Request Query Params

| Param        | Type   | Default      | Description              |
| ------------ | ------ | ------------ | ------------------------ |
| `page`       | number | 1            | Page number (1-based)    |
| `limit`      | number | 20           | Items per page (max 100) |
| `sort_by`    | string | `created_at` | Column to sort by        |
| `sort_order` | string | `desc`       | `asc` or `desc`          |

### Example

```
GET /api/v1/tasks?page=2&limit=20&sort_by=due_date&sort_order=asc
```

### Response Meta

```json
{
  "meta": {
    "page": 2,
    "limit": 20,
    "total": 150,
    "total_pages": 8,
    "has_next": true,
    "has_prev": true
  }
}
```

### Non-Paginated Lists

Some small lists don't need pagination (statuses, tags, workspace members). These return a plain array:

```json
{
  "success": true,
  "data": [ ... ],
  "message": null
}
```

---

## Filtering

Filter params are passed as query strings. Multiple values use comma separation.

Detailed ClickUp-style task search/filter behavior is documented in:

```
project_mngmnt/technical_docs/search_filter.md
```

### Standard Filter Params (on task list endpoints)

| Param           | Type               | Example                     | Description                           |
| --------------- | ------------------ | --------------------------- | ------------------------------------- |
| `status`        | UUID (comma-sep)   | `?status=uuid1,uuid2`       | Filter by status IDs                  |
| `assignee`      | UUID (comma-sep)   | `?assignee=uuid1,uuid2`     | Filter by assignee IDs                |
| `priority`      | string (comma-sep) | `?priority=high,urgent`     | Filter by priority                    |
| `tag`           | UUID (comma-sep)   | `?tag=uuid1`                | Filter by tag IDs                     |
| `due_date_from` | ISO date           | `?due_date_from=2026-04-01` | Due date range start                  |
| `due_date_to`   | ISO date           | `?due_date_to=2026-04-30`   | Due date range end                    |
| `search`        | string             | `?search=login bug`         | Full-text search on title/description |

---

## Search

Search endpoint uses query param:

```
GET /api/v1/search?q=login+bug&workspace_id=uuid&project_id=uuid
```

Response follows the standard paginated list shape.

---

## Naming Conventions

### URL Patterns

| Pattern             | Example                                 |
| ------------------- | --------------------------------------- |
| List resources      | `GET /api/v1/workspaces`                |
| Create resource     | `POST /api/v1/workspaces`               |
| Get single resource | `GET /api/v1/workspaces/:id`            |
| Update resource     | `PATCH /api/v1/workspaces/:id`          |
| Delete resource     | `DELETE /api/v1/workspaces/:id`         |
| Nested resources    | `GET /api/v1/projects/:projectId/tasks` |
| Actions             | `POST /api/v1/tasks/:id/assign`         |
| Board views         | `GET /api/v1/projects/:projectId/board/tasks` |
| Board actions       | `PUT /api/v1/projects/:projectId/board/tasks/reorder` |

### Rules

- **Plural nouns** for resource names: `/tasks`, not `/task`
- **kebab-case** for multi-word URLs: `/task-lists`, `/time-entries`
- **snake_case** for JSON response fields: `created_at`, `full_name`, `is_read`
- **snake_case** for query params: `sort_by`, `due_date_from`
- **camelCase** for route params only: `:projectId`, `:taskId` (NestJS convention)
- **PATCH** for partial updates (not PUT) — send only changed fields
- **POST** for actions that aren't CRUD: `/tasks/:id/assign`, `/auth/refresh`

---

## Workspace Scoping

Most endpoints operate within a workspace context. The active workspace is determined by:

```
x-workspace-id: <workspace_uuid>
```

This custom header is **required** on all workspace-scoped endpoints. This avoids deeply nested URLs while keeping context clear.

### Workspace-Scoped Endpoints

All endpoints except auth, user profile, and workspace listing itself require `x-workspace-id`.

### Example

```
GET /api/v1/projects
Headers:
  Authorization: Bearer <token>
  x-workspace-id: <workspace_uuid>
```

Returns projects only within that workspace.

---

## Rate Limiting

| Scope                          | Limit        | Window     |
| ------------------------------ | ------------ | ---------- |
| Auth endpoints (login, signup) | 10 requests  | per minute |
| General API                    | 100 requests | per minute |
| File upload                    | 20 requests  | per minute |
| Search                         | 30 requests  | per minute |

Rate limit info returned in headers:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1680000000
```

When exceeded:

```json
{
  "success": false,
  "error": {
    "code": "TOO_MANY_REQUESTS",
    "message": "Rate limit exceeded. Try again in 45 seconds.",
    "details": null
  }
}
```

---

## WebSocket Events

WebSocket connection is authenticated via the access token passed as a query param on connection:

```
ws://localhost:3000/ws?token=<access_token>
```

### Event Format

All WebSocket messages follow this shape:

```json
{
  "event": "comment:created",
  "data": {
    "comment": { ... },
    "task_id": "uuid",
    "project_id": "uuid"
  }
}
```

### Events

| Event              | Direction        | Description                     |
| ------------------ | ---------------- | ------------------------------- |
| `comment:created`  | Server -> Client | New comment on a task           |
| `comment:updated`  | Server -> Client | Comment edited                  |
| `comment:deleted`  | Server -> Client | Comment deleted                 |
| `mention:received` | Server -> Client | User was @mentioned             |
| `user:online`      | Server -> Client | A workspace member came online  |
| `user:offline`     | Server -> Client | A workspace member went offline |

### Rooms/Channels

- **Workspace room** (`workspace:<id>`) — for online/offline events
- **Task room** (`task:<id>`) — for comment events (clients join when viewing a task)

---

## Date/Time Format

- All dates in responses are **ISO 8601 UTC**: `2026-04-10T12:00:00.000Z`
- All dates in requests accept **ISO 8601**: `2026-04-10` or `2026-04-10T12:00:00.000Z`
- The frontend converts to local time using the user's `timezone` field

---

## File Upload Flow

File uploads use **presigned URLs** to upload directly to S3 from the frontend:

### Step 1 — Request Presigned URL

```
POST /api/v1/attachments/presign
Body: { "file_name": "screenshot.png", "mime_type": "image/png", "task_id": "uuid" }
```

Response:

```json
{
  "success": true,
  "data": {
    "upload_url": "https://s3.amazonaws.com/bucket/...",
    "s3_key": "attachments/workspace-uuid/task-uuid/abc123-screenshot.png",
    "attachment_id": "uuid"
  }
}
```

### Step 2 — Frontend Uploads to S3 Directly

Frontend uses the `upload_url` to PUT the file to S3.

### Step 3 — Confirm Upload

```
POST /api/v1/attachments/:id/confirm
Body: { "file_size": 245000 }
```

This marks the attachment as uploaded and creates the activity log entry.

### Download

```
GET /api/v1/attachments/:id/download
```

Returns a presigned download URL (short-lived, e.g., 15 min).

---

## Summary of HTTP Status Codes Used

| Status | Meaning           | When                                    |
| ------ | ----------------- | --------------------------------------- |
| 200    | OK                | Successful GET, PATCH, action           |
| 201    | Created           | Successful POST that creates a resource |
| 204    | No Content        | Successful DELETE                       |
| 400    | Bad Request       | Validation or malformed request         |
| 401    | Unauthorized      | Missing/invalid/expired token           |
| 403    | Forbidden         | Insufficient permissions                |
| 404    | Not Found         | Resource doesn't exist                  |
| 409    | Conflict          | Duplicate resource                      |
| 422    | Unprocessable     | Business logic violation                |
| 429    | Too Many Requests | Rate limited                            |
| 500    | Internal Error    | Unexpected server error                 |
