# FocusHub — Frontend Integration Guide

**Base URL:** `http://localhost:3000/api/v1`  
**Swagger UI:** `http://localhost:3000/api/docs`  
**Content-Type:** `application/json` on all requests with a body

---

## Table of Contents

1. [Response Format](#1-response-format)
2. [Token Management](#2-token-management)
3. [Error Handling](#3-error-handling)
4. [Auth Endpoints](#4-auth-endpoints)
5. [User Endpoints](#5-user-endpoints)
6. [Workspace Endpoints](#6-workspace-endpoints)
7. [Project Endpoints](#7-project-endpoints)
8. [System](#8-system)
9. [Quick Reference](#9-quick-reference)

---

## 1. Response Format

### Standard Wrapper — Workspace & Project endpoints

```json
{
  "success": true,
  "data": { ... },
  "message": "Human readable string or null"
}
```

Paginated lists add a `meta` key:

```json
{
  "success": true,
  "data": [ ... ],
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

### Bare Response — Auth endpoints

Auth endpoints return the data object directly with no wrapper:

```json
{
  "user": { "id": "...", "fullName": "...", ... },
  "accessToken": "eyJ..."
}
```

> **Note:** `POST /auth/register`, `POST /auth/forgot-password`, `POST /auth/logout`, and `POST /auth/reset-password` return either a `{ message }` string or an empty body — see each endpoint for details.

---

## 2. Token Management

### Two tokens, two locations

| Token | Where stored | Lifetime | How it's sent |
|---|---|---|---|
| **Access token** | JS memory (Zustand / React state) | 15 min | `Authorization: Bearer <token>` header on every protected request |
| **Refresh token** | `httpOnly` cookie (`refresh_token`) | 7 days | Browser sends automatically on same-origin requests |

**Never store the access token in `localStorage` or `sessionStorage`.** If the page reloads, use `POST /auth/refresh` (cookie is still there) to silently get a new access token.

### Auto-refresh strategy

```
Any request → 401 Unauthorized
    └─► POST /auth/refresh  (no body — browser sends cookie automatically)
            ├─ 200 OK → save new accessToken → retry the original request
            └─ 401 Unauthorized → cookie is gone → clear state → redirect to /login
```

Implement this once as an Axios interceptor or fetch wrapper so every module benefits automatically.

### Google OAuth flow

```
1. window.location.href = 'http://localhost:3000/api/v1/auth/google'
   (full page redirect — NOT fetch/axios)

2. Google handles auth → redirects to /api/v1/auth/google/callback

3. Server reads the ?token=<accessToken> from the redirect URL
   Frontend reads it: new URL(window.location.href).searchParams.get('token')
   Store accessToken in memory.
```

---

## 3. Error Handling

All errors follow this shape:

```json
{
  "statusCode": 401,
  "message": "Invalid or expired access token"
}
```

Validation errors (`422`) include per-field details:

```json
{
  "statusCode": 422,
  "message": "Validation failed",
  "errors": [
    { "field": "email", "message": "Invalid email address" },
    { "field": "password", "message": "Must contain at least one uppercase letter" }
  ]
}
```

| Status | Meaning |
|---|---|
| `400` | Bad request (wrong body, business rule violation) |
| `401` | Missing/invalid/expired access token — try refresh |
| `403` | Authenticated but not allowed (wrong role, not a member, email not verified) |
| `404` | Resource not found |
| `409` | Conflict (email taken, duplicate prefix) |
| `422` | Validation failed — check `errors` array |
| `500` | Server error |

---

## 4. Auth Endpoints

All auth endpoints are **public** — no `Authorization` header needed.

---

### `POST /auth/register`

Creates a new account. Does **not** return tokens. Instead, sends a 6-digit OTP to the email. The user must verify the OTP before they can log in.

Use this for normal sign-up flows. **Workspace invite recipients can now skip OTP** by claiming the invite directly with `POST /workspaces/invite/claim`.

**Request**
```json
{
  "fullName": "Zaeem Hassan",
  "email": "zaeem@example.com",
  "password": "Secure123!"
}
```

Password rules: min 8 chars · at least 1 uppercase · 1 lowercase · 1 number · 1 special character.

**Response `201`**
```json
{
  "message": "Account created. Check your email for the verification code."
}
```

**If the email is already registered but unverified**, a new OTP is sent and the response is:
```json
{
  "message": "This email is already registered but not yet verified. A new verification code has been sent."
}
```

**Errors**
| Status | When |
|---|---|
| `409` | Email already registered **and** verified |
| `422` | Validation failed |

---

### `POST /auth/verify-email`

Verifies the OTP sent during registration. On success, activates the account and returns tokens — same as login.

**Request**
```json
{
  "email": "zaeem@example.com",
  "otp": "482931"
}
```

`otp` must be the exact 6-digit code from the email. Valid for **15 minutes**.

**Response `200`** — sets `refresh_token` httpOnly cookie
```json
{
  "user": {
    "id": "uuid",
    "fullName": "Zaeem Hassan",
    "email": "zaeem@example.com",
    "avatarUrl": null,
    "avatarColor": "#6366f1"
  },
  "accessToken": "eyJ..."
}
```

**Errors**
| Status | When |
|---|---|
| `401` | OTP wrong, expired (> 15 min), or already used |
| `422` | Validation failed |

---

### `POST /auth/login`

**Request**
```json
{
  "email": "zaeem@example.com",
  "password": "Secure123!"
}
```

**Response `200`** — same shape as `verify-email` above, sets refresh cookie.

**Errors**
| Status | When |
|---|---|
| `401` | Wrong email or password |
| `403` | Correct credentials but **email not yet verified** — show "check your inbox" UI |
| `422` | Validation failed |

> The `403` case is important: the user exists, the password is right, but they haven't clicked verify. Show a resend-OTP option or a message to check their inbox.

---

### `GET /auth/google`

Redirect the browser here to start Google OAuth. **Do not call with fetch/axios.**

```js
window.location.href = 'http://localhost:3000/api/v1/auth/google';
```

---

### `GET /auth/google/callback`

Handled by the server automatically. After Google redirects here, the server redirects the browser to:

```
http://localhost:3000/auth/callback?token=<accessToken>
```

Read the token from the URL and store it in memory:

```js
const token = new URL(window.location.href).searchParams.get('token');
```

The `refresh_token` cookie is also set at this point.

---

### `POST /auth/refresh`

Exchange the `refresh_token` cookie for a new token pair. Call this when any request returns `401`.

**Request** — no body (cookie is sent automatically by the browser)

**Response `200`** — same shape as login, new access token in body, rotated cookie set.

**Errors**
| Status | When |
|---|---|
| `401` | Cookie missing, expired, revoked, or already rotated |

---

### `POST /auth/logout`

Invalidates the current session and clears the cookie.

**Request** — no body

**Response `200`** — empty body

After calling this, clear the access token from memory and redirect to `/login`.

---

### `POST /auth/forgot-password`

Sends a password reset link to the email. Always returns `200` regardless of whether the email exists (prevents enumeration attacks).

**Request**
```json
{
  "email": "zaeem@example.com"
}
```

**Response `200`** — empty body

The email contains a link like:
```
http://localhost:3000/reset-password?token=<uuid>
```

The link is valid for **1 hour**. When the user clicks it, read the `token` query param and use it in `reset-password`.

---

### `POST /auth/reset-password`

Resets the password using the token from the email link. **Logs out all active sessions** — the user must log in again.

**Request**
```json
{
  "token": "the-uuid-from-the-link-query-param",
  "newPassword": "NewSecure456!"
}
```

`token` must be the full UUID from the email link's `?token=` query param. Password rules same as register.

**Response `200`** — empty body

After success, redirect to `/login` with a "Password reset successfully. Please log in." message.

**Errors**
| Status | When |
|---|---|
| `401` | Token invalid, expired (> 1 hour), or already used |
| `422` | Validation failed |

---

## 5. User Endpoints

All user endpoints require `Authorization: Bearer <accessToken>`.

---

### `POST /user/profile`

Initialize the current user's extended profile after registration. Call once during onboarding.

**Request**
```json
{
  "designation": "Senior Backend Engineer",
  "profilePicture": "initials:ZH",
  "status": "ONLINE",
  "bio": "Building scalable APIs.",
  "timezone": "Asia/Karachi",
  "showLocalTime": true
}
```

All fields optional. `profilePicture` accepts:
- `"initials:ZH"` — colored circle with initials (1–4 letters)
- `"ZH"` — shorthand, server normalizes to `"initials:ZH"`
- `"https://cdn.example.com/avatar.png"` — direct image URL

`timezone` must be a valid IANA timezone string (e.g. `"Asia/Karachi"`, `"Europe/London"`).

**Response `201`**
```json
{
  "id": "uuid",
  "fullName": "Zaeem Hassan",
  "email": "zaeem@example.com",
  "designation": "Senior Backend Engineer",
  "profilePicture": "initials:ZH",
  "status": "ONLINE",
  "bio": "Building scalable APIs.",
  "timezone": "Asia/Karachi",
  "showLocalTime": true,
  "localTime": "14/04/2026, 17:30:00",
  "createdAt": "2026-04-14T12:00:00.000Z",
  "updatedAt": "2026-04-14T12:00:00.000Z"
}
```

`localTime` is computed server-side from `timezone`. Returns `null` if `showLocalTime` is `false` or no timezone set.

---

### `GET /user/profile`

Get the current user's full profile.

**Response `200`** — same shape as above.

---

### `PATCH /user/profile`

Update one or more profile fields. Send only the fields you want to change.

**Request** — all fields optional
```json
{
  "fullName": "Zaeem Ul Hassan",
  "designation": "Lead Engineer",
  "profilePicture": "https://cdn.example.com/new-avatar.png",
  "bio": "I love clean architecture.",
  "timezone": "Europe/London",
  "showLocalTime": false
}
```

Pass `"description": null` or `"icon": null` to clear those fields. At least one field must be present.

**Response `200`** — updated profile shape.

---

### `PATCH /user/status`

Quick status toggle without touching other profile fields.

**Request**
```json
{
  "status": "ONLINE"
}
```

`status` must be `"ONLINE"` or `"OFFLINE"`.

**Response `200`** — updated profile shape.

---

### `PATCH /user/change-password`

Change the password. Requires current password for verification. **Logs out all sessions** — redirect user to `/login` after success.

**Request**
```json
{
  "currentPassword": "OldSecure123!",
  "newPassword": "NewSecure456!"
}
```

**Response `200`**
```json
{
  "message": "Password changed successfully. Please login again."
}
```

**Errors**
| Status | When |
|---|---|
| `400` | New password is the same as current |
| `403` | Current password wrong, or account uses Google OAuth (no password) |
| `422` | Validation failed |

---

### `DELETE /user/profile`

Soft-delete the account. Deactivates the account and revokes all sessions. Redirect to `/login` after calling.

**Response `204`** — no body.

---

## 6. Workspace Endpoints

`POST /workspaces` only needs `Authorization`. All other workspace endpoints and all project endpoints additionally need `x-workspace-id`.

---

### `POST /workspaces`

Create a new workspace. The calling user automatically becomes the `OWNER`.

**Request**
```json
{
  "name": "Acme Corp",
  "logoUrl": "https://cdn.example.com/logo.png",
  "workspaceUse": "WORK",
  "managementType": "SOFTWARE_DEVELOPMENT"
}
```

`logoUrl` is optional.

`workspaceUse` is required and must be one of:
- `WORK`
- `PERSONAL`
- `SCHOOL`

`managementType` is required and must be one of:
- `HR_RECRUITING`
- `CREATIVE_DESIGN`
- `PROFESSIONAL_SERVICES`
- `FINANCE_ACCOUNTING`
- `OPERATIONS`
- `SOFTWARE_DEVELOPMENT`
- `IT`
- `SALES_CRM`
- `PERSONAL_USE`
- `SUPPORT`
- `STARTUP`
- `PMO`
- `MARKETING`
- `OTHER`

**Response `201`**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Acme Corp",
    "logoUrl": "https://cdn.example.com/logo.png",
    "workspaceUse": "WORK",
    "managementType": "SOFTWARE_DEVELOPMENT",
    "createdBy": "user-uuid",
    "createdAt": "2026-04-14T12:00:00.000Z",
    "updatedAt": "2026-04-14T12:00:00.000Z"
  },
  "message": "Workspace created successfully"
}
```

---

### `GET /workspaces`

List all workspaces the current user belongs to.

**Response `200`**
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "name": "...",
      "workspaceUse": "WORK",
      "managementType": "SOFTWARE_DEVELOPMENT"
    }
  ],
  "message": null
}
```

---

### `GET /workspaces/:workspaceId`

Get a single workspace with member count. User must be a member.

**Headers required:** `Authorization` + `x-workspace-id: <workspaceId>`

**Response `200`**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Acme Corp",
    "logoUrl": null,
    "workspaceUse": "WORK",
    "managementType": "SOFTWARE_DEVELOPMENT",
    "createdBy": "user-uuid",
    "createdAt": "...",
    "updatedAt": "...",
    "memberCount": 5
  },
  "message": null
}
```

**Errors**
| Status | When |
|---|---|
| `403` | Header missing or user not a member |
| `404` | Workspace not found |

---

### `PATCH /workspaces/:workspaceId`

Update workspace settings. **OWNER only.** Pass `"logoUrl": null` to remove the logo.

**Headers required:** `Authorization` + `x-workspace-id`

**Request** — all optional
```json
{
  "name": "Acme Corporation",
  "logoUrl": null,
  "workspaceUse": "PERSONAL",
  "managementType": "OTHER"
}
```

**Response `200`**
```json
{
  "success": true,
  "data": { ... },
  "message": "Workspace updated successfully"
}
```

---

### `DELETE /workspaces/:workspaceId`

Soft delete the workspace and all data inside. **OWNER only.**

**Headers required:** `Authorization` + `x-workspace-id`

**Response `200`**
```json
{
  "success": true,
  "data": null,
  "message": "Workspace deleted successfully"
}
```

---

### `POST /workspaces/:workspaceId/invite`

Send an invite email to a new member. **OWNER only.** If the email is already an active member, returns `200` silently. If a pending invite already exists for that email, it is revoked and a fresh one is sent.

**Headers required:** `Authorization` + `x-workspace-id: <workspaceId>`

**Request**
```json
{
  "email": "newmember@example.com",
  "role": "MEMBER"
}
```

`role` is optional, defaults to `"MEMBER"`. Can also be `"OWNER"`.

**Response `200`**
```json
{
  "success": true,
  "data": null,
  "message": "Invite sent successfully"
}
```

The invited user receives an email with a link:
```
http://localhost:3000/invite?token=<uuid>
```

**Errors**
| Status | When |
|---|---|
| `403` | Not OWNER |
| `404` | Workspace not found |

---

### `POST /workspaces/:workspaceId/invites`

Send invite emails in bulk. **OWNER only.** This is the recommended endpoint when the frontend submits multiple emails at once.

The backend normalizes and deduplicates emails before processing. Each email is handled independently, so one failure does **not** fail the whole request.

**Headers required:** `Authorization` + `x-workspace-id: <workspaceId>`

**Request**
```json
{
  "emails": [
    "newmember1@example.com",
    "newmember2@example.com",
    "newmember3@example.com"
  ],
  "role": "MEMBER"
}
```

`role` is optional, defaults to `"MEMBER"`. Can also be `"OWNER"`.

**Response `200`**
```json
{
  "success": true,
  "data": {
    "results": [
      {
        "email": "newmember1@example.com",
        "status": "invited",
        "message": null
      },
      {
        "email": "newmember2@example.com",
        "status": "already_member",
        "message": null
      },
      {
        "email": "newmember3@example.com",
        "status": "failed",
        "message": "Failed to send invite email"
      }
    ],
    "summary": {
      "total": 3,
      "invited": 1,
      "alreadyMember": 1,
      "failed": 1
    }
  },
  "message": "Batch invite processed"
}
```

**Status meanings**
- `invited` → fresh invite created and email sent
- `already_member` → email already belongs to an active workspace member
- `failed` → invite processing failed for that specific email

**Errors**
| Status | When |
|---|---|
| `403` | Not OWNER |
| `404` | Workspace not found |
| `422` | Validation failed |

---

### `GET /workspaces/invite/:token`

**Public — no auth required.** Preview invite details before the user logs in or signs up. Use this to render the invite landing page.

Read the `token` query param from the invite URL and pass it here.

**Response `200`**
```json
{
  "success": true,
  "data": {
    "workspaceId": "uuid",
    "workspaceName": "Acme Corp",
    "invitedEmail": "newmember@example.com",
    "role": "MEMBER",
    "inviterName": "Zaeem Hassan",
    "nextStep": "claim_account"
  },
  "message": null
}
```

`nextStep` tells the frontend what to render immediately:
- `claim_account` → show the invite claim form with `fullName` + `password`
- `login` → show the login flow for the invited email

**Errors**
| Status | When |
|---|---|
| `404` | Token not found, already used, expired (> 7 days), or revoked |

---

### `POST /workspaces/invite/accept`

Accept the invite. The user **must be logged in** and their account email must match the invited email.

**Typical flow for an existing account:**
```
1. User clicks invite link → frontend calls GET /workspaces/invite/:token
2. Frontend checks `nextStep`
3. Frontend shows the login flow
4. Frontend calls POST /workspaces/invite/accept with the same token
5. User is added to the workspace → redirect to workspace dashboard
```

**Headers required:** `Authorization: Bearer <accessToken>`

**Request**
```json
{
  "token": "the-uuid-from-the-invite-link"
}
```

**Response `200`**
```json
{
  "success": true,
  "data": {
    "workspaceId": "uuid"
  },
  "message": "Invite accepted successfully"
}
```

Use `workspaceId` from the response to redirect the user directly into their new workspace.

**Errors**
| Status | When |
|---|---|
| `400` | Logged-in user's email ≠ invited email |
| `401` | Not authenticated |
| `404` | Token not found, expired, or already used |

---

### `POST /workspaces/invite/claim`

Claim the invite without OTP. This is the receiver flow for invitees who do **not** already have a verified account. The backend validates the invite token, creates or upgrades the user account with the invited email, marks the email as verified, signs the user in, and accepts the invite in one step.

**Public — no auth required.**

**Request**
```json
{
  "token": "the-uuid-from-the-invite-link",
  "fullName": "Jane Invitee",
  "password": "Secure123!"
}
```

Password rules: min 8 chars · at least 1 uppercase · 1 lowercase · 1 number · 1 special character.

**Response `200`** — sets `refresh_token` httpOnly cookie
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "fullName": "Jane Invitee",
      "email": "newmember@example.com",
      "avatarUrl": null,
      "avatarColor": "#6366f1"
    },
    "accessToken": "eyJ...",
    "workspaceId": "uuid"
  },
  "message": "Invite claimed successfully"
}
```

Use `workspaceId` from the response to redirect the user directly into their new workspace.

**Errors**
| Status | When |
|---|---|
| `404` | Token not found, expired, revoked, or already used |
| `409` | A verified account already exists for the invited email — user should log in instead |
| `422` | Validation failed |

---

## 7. Project Endpoints

All project endpoints require **both** `Authorization` and `x-workspace-id`. Any workspace member can create, view, and edit. Only OWNER can delete.

---

### `POST /projects`

Create a project. Automatically creates grouped default statuses: **To Do** (`NOT_STARTED`), **In Progress** (`ACTIVE`), and **Complete** (`CLOSED`).

**Headers required:** `Authorization` + `x-workspace-id`

**Request**
```json
{
  "name": "Backend API",
  "description": "Core REST API for FocusHub",
  "color": "#6366f1",
  "icon": "code",
  "taskIdPrefix": "API"
}
```

| Field | Required | Notes |
|---|---|---|
| `name` | Yes | 1–100 chars |
| `description` | No | max 500 chars |
| `color` | No | hex string, default `#6366f1` |
| `icon` | No | any string identifier, max 50 chars |
| `taskIdPrefix` | Yes | 2–6 chars, letters/numbers only (e.g. `API`, `FH`). Auto-uppercased. Unique per workspace. Cannot be changed after creation. |

**Response `201`**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "workspaceId": "uuid",
    "name": "Backend API",
    "description": "Core REST API for FocusHub",
    "color": "#6366f1",
    "icon": "code",
    "taskIdPrefix": "API",
    "isArchived": false,
    "createdBy": "user-uuid",
    "createdAt": "...",
    "updatedAt": "...",
    "statuses": [
      { "id": "uuid", "name": "To Do",       "color": "#94a3b8", "group": "NOT_STARTED", "position": 1000, "isDefault": true, "isProtected": false, "isClosed": false },
      { "id": "uuid", "name": "In Progress", "color": "#3b82f6", "group": "ACTIVE",      "position": 1000, "isDefault": true, "isProtected": false, "isClosed": false },
      { "id": "uuid", "name": "Complete",    "color": "#22c55e", "group": "CLOSED",      "position": 1000, "isDefault": true, "isProtected": true,  "isClosed": true  }
    ],
    "_count": { "taskLists": 0 }
  },
  "message": "Project created successfully"
}
```

**Errors**
| Status | When |
|---|---|
| `409` | `taskIdPrefix` already used in this workspace |
| `422` | Validation failed |

---

### `GET /projects`

List all active (non-archived, non-deleted) projects in the workspace.

**Response `200`** — array of the same project shape above.

---

### `GET /projects/:projectId`

Get a single project with its full status list.

**Errors**
| Status | When |
|---|---|
| `404` | Project not found or not in this workspace |

---

### `PATCH /projects/:projectId`

Update project metadata. Send only fields you want to change. `taskIdPrefix` cannot be updated.

**Request** — all optional
```json
{
  "name": "Backend API v2",
  "description": "Updated",
  "color": "#10b981",
  "icon": "server"
}
```

Pass `null` on `description` or `icon` to clear them.

**Response `200`** — updated project shape.

---

### `DELETE /projects/:projectId`

Soft-delete the project and **all its data** (task lists, tasks, statuses). **OWNER only.** No undo.

**Response `200`**
```json
{
  "success": true,
  "data": null,
  "message": "Project deleted successfully"
}
```

---

## 8. Status Endpoints

All status endpoints require **both** `Authorization` and `x-workspace-id`. Viewing is allowed for any workspace member. Creating, editing, deleting, reordering, and resetting are **OWNER only**.

Status groups:
- `NOT_STARTED`
- `ACTIVE`
- `DONE`
- `CLOSED`

Rules:
- Custom statuses can only be created in `NOT_STARTED`, `ACTIVE`, or `DONE`
- `CLOSED` always contains exactly one protected status
- The protected closed status can be renamed, but cannot be recolored or deleted

### `POST /statuses`

Create a custom status for a project.

```json
{
  "projectId": "uuid",
  "name": "QA Review",
  "color": "#f59e0b",
  "group": "DONE"
}
```

### `GET /statuses?projectId=<uuid>`

Return grouped statuses for the project.

```json
{
  "success": true,
  "data": {
    "projectId": "uuid",
    "groups": {
      "notStarted": [],
      "active": [],
      "done": [],
      "closed": []
    }
  }
}
```

### `GET /statuses/:id`

Return one status by id.

### `PUT /statuses/:id`

Update a status. Protected closed statuses only support `name`.

```json
{
  "name": "In QA",
  "color": "#8b5cf6"
}
```

### `DELETE /statuses/:id`

Delete a custom status. If tasks still use it, send a replacement status.

```json
{
  "replacementStatusId": "uuid"
}
```

### `PUT /statuses/reorder`

Reorder statuses within groups and move them across `NOT_STARTED`, `ACTIVE`, and `DONE`.

```json
{
  "projectId": "uuid",
  "groups": {
    "notStarted": ["status-1"],
    "active": ["status-2", "status-3"],
    "done": ["status-4"],
    "closed": ["status-5"]
  }
}
```

### `POST /statuses/default`

Apply or repair the default grouped template for a project.

```json
{
  "projectId": "uuid"
}
```

---

## 9. System

### `GET /health`

Public. Use for startup checks or uptime monitoring.

**Response `200`**
```json
{ "status": "ok", "database": "connected" }
```

**Response `503`** — database unreachable.

---

## 10. Quick Reference

### Headers cheatsheet

| Endpoint group | Auth header | x-workspace-id header |
|---|---|---|
| Auth endpoints | Not needed | Not needed |
| User endpoints | Required | Not needed |
| `POST /workspaces` | Required | Not needed |
| `GET /workspaces` | Required | Not needed |
| `GET/PATCH/DELETE /workspaces/:id` | Required | Required |
| `POST /workspaces/:id/invite` | Required | Required |
| `POST /workspaces/:id/invites` | Required | Required |
| `GET /workspaces/invite/:token` | Not needed | Not needed |
| `POST /workspaces/invite/accept` | Required | Not needed |
| All project endpoints | Required | Required |
| All status endpoints | Required | Required |

---

### Role permissions

| Action | Minimum role |
|---|---|
| Register / login | Public |
| Create workspace | Any authenticated user |
| View workspace | Workspace member |
| Update workspace name/logo | OWNER |
| Delete workspace | OWNER |
| Send workspace invite | OWNER |
| Send batch workspace invites | OWNER |
| Accept workspace invite | Authenticated (email must match) |
| Create / view / update project | Any workspace member |
| Delete project | OWNER |
| View statuses | Any workspace member |
| Create / update / delete / reorder / reset statuses | OWNER |

---

### Full sign-up + verify flow (step by step)

```
1. POST /auth/register        → { message }
2. User checks email, gets 6-digit OTP
3. POST /auth/verify-email    → { user, accessToken } + sets refresh cookie
4. Store accessToken in memory
5. Call any protected endpoint normally
```

---

### Full forgot-password flow (step by step)

```
1. POST /auth/forgot-password   → 200 empty (email sent silently)
2. User clicks link in email:
   http://localhost:3000/reset-password?token=<uuid>
3. Read token from URL query param
4. POST /auth/reset-password    → 200 empty
5. Redirect to /login
```

---

### Full workspace invite flow (step by step)

```
ADMIN SIDE:
1. POST /workspaces/:id/invite  → 200 (email sent to invitee)

INVITEE SIDE (not registered):
2. Clicks link: http://localhost:3000/invite?token=<uuid>
3. GET /workspaces/invite/:token → shows workspace name, inviter, role, nextStep
4. Frontend sees `nextStep = claim_account` and renders Name + Password form
5. User submits POST /workspaces/invite/claim
6. Backend creates/verifies the account, signs user in, accepts invite
7. Redirect to /workspaces/<workspaceId>

INVITEE SIDE (already registered):
2–3. Same as above
4. Frontend sees `nextStep = login`; user logs in: POST /auth/login
5. POST /workspaces/invite/accept  → { workspaceId }
6. Redirect to /workspaces/<workspaceId>
```

---

### `profilePicture` field rendering

| Value | How to render |
|---|---|
| `"initials:ZH"` | Colored circle with letters `ZH` |
| `"https://..."` | `<img src="..." />` |

Check `value.startsWith('initials:')` to decide which to render.

---

### Task ID display format

Tasks (coming soon) have display IDs like `API-1`, `API-2` — computed from `taskIdPrefix + '-' + taskNumber`. The prefix is permanent after project creation.

---

### Task Search, List View, and Board View

For the current task search/filter API contract, list ordering behavior, board ordering behavior, and board drag/drop rules, use:

```text
project_mngmnt/technical_docs/frontend_task_search_board_guide.md
```

---

*Last updated: 2026-04-16 — reflects sign-up OTP verification, forgot-password link flow, and workspace invite endpoints.*
