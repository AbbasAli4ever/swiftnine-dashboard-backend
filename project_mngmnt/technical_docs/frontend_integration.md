# FocusHub V1 — Frontend Integration Guide

**Base URL (dev):** `http://localhost:3020/api/v1`  
**Backend port:** `3020`  
**Swagger UI:** `http://localhost:3020/api` (auto-generated from decorators)

---

## Table of Contents

1. [Status: What Is and Is Not Implemented](#1-status-what-is-and-is-not-implemented)
2. [Auth Flow Overview](#2-auth-flow-overview)
3. [Token Storage Strategy](#3-token-storage-strategy)
4. [API Reference — Implemented Endpoints](#4-api-reference--implemented-endpoints)
   - [Health Check](#41-health-check)
   - [POST /auth/register](#42-post-authregister)
   - [POST /auth/login](#43-post-authlogin)
   - [GET /auth/google](#44-get-authgoogle)
   - [GET /auth/google/callback](#45-get-authgooglecallback)
5. [Standard Response Shapes](#5-standard-response-shapes)
6. [Error Handling](#6-error-handling)
7. [Axios / Fetch Setup](#7-axios--fetch-setup)
8. [Google OAuth Integration](#8-google-oauth-integration)
9. [Protected Route Pattern](#9-protected-route-pattern)
10. [Planned Endpoints (Not Yet Implemented)](#10-planned-endpoints-not-yet-implemented)

---

## 1. Status: What Is and Is Not Implemented

| Module | Status | Notes |
|--------|--------|-------|
| Health check | ✅ Done | `GET /health` |
| Register (email/password) | ✅ Done | `POST /auth/register` |
| Login (email/password) | ✅ Done | `POST /auth/login` |
| Google OAuth | ✅ Done | `GET /auth/google` + callback |
| JWT guard (protected routes) | ✅ Done | `Authorization: Bearer <token>` |
| Token refresh | ❌ Not yet | Cookie is set, endpoint not built |
| Forgot / Reset password | ❌ Not yet | Planned |
| Workspace CRUD | ❌ Not yet | Planned |
| Project CRUD | ❌ Not yet | Planned |
| Task CRUD | ❌ Not yet | Planned |
| Comments | ❌ Not yet | Planned |
| Notifications | ❌ Not yet | Planned |
| File Attachments | ❌ Not yet | Planned |
| Search | ❌ Not yet | Planned |
| WebSocket events | ❌ Not yet | Planned |

---

## 2. Auth Flow Overview

```
Register / Login
    │
    ▼
Backend signs JWT (15 min access token)
    │
    ├── access_token → returned in JSON body
    └── refresh_token → set as httpOnly cookie (7 days)
                        path: /api/v1/auth
                        secure: true in production

Frontend stores access_token in memory (NOT localStorage).
Attaches it to every protected request as:
    Authorization: Bearer <access_token>

When access_token expires → hit POST /auth/refresh (not yet implemented)
    → cookie is sent automatically by browser
    → new access_token returned in body
```

---

## 3. Token Storage Strategy

| Storage | Use | Reason |
|---------|-----|--------|
| **JavaScript memory** (e.g. React state / Zustand) | `access_token` | Short-lived (15 min), never persisted to disk, XSS-safe |
| **httpOnly cookie** (set by server) | `refresh_token` | Never readable by JS, CSRF-safe with `sameSite: strict` |
| ❌ `localStorage` | Never | Vulnerable to XSS — do not use for tokens |
| ❌ `sessionStorage` | Never | Same XSS risk as localStorage |

**Note:** On page refresh the access token is lost. The frontend should immediately call `POST /auth/refresh` on app mount to get a new access token from the cookie. (Endpoint not yet implemented — plan for it.)

---

## 4. API Reference — Implemented Endpoints

### 4.1 Health Check

```
GET /health
No auth required
```

**Response 200:**
```json
{
  "status": "ok",
  "database": "connected"
}
```

**Response 503:** database unreachable.

---

### 4.2 POST /auth/register

Creates a new account. Returns tokens.

```
POST /api/v1/auth/register
Content-Type: application/json
No auth required
```

**Request body:**
```json
{
  "fullName": "Jane Smith",
  "email": "jane@example.com",
  "password": "Secret@123"
}
```

**Validation rules (enforced server-side):**

| Field | Rule |
|-------|------|
| `fullName` | string, min 2 chars, max 100 chars |
| `email` | valid email format |
| `password` | min 8 chars, must contain: uppercase, lowercase, digit, special char |

**Response 201:**
```json
{
  "user": {
    "id": "uuid",
    "fullName": "Jane Smith",
    "email": "jane@example.com",
    "avatarUrl": null,
    "avatarColor": "#6366f1"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```
Cookie set: `refresh_token` (httpOnly, 7 days)

**Error responses:**

| Status | Code | When |
|--------|------|------|
| 409 | `CONFLICT` | Email already registered |
| 422 | `UNPROCESSABLE_ENTITY` | Validation failed |

---

### 4.3 POST /auth/login

Authenticates an existing user.

```
POST /api/v1/auth/login
Content-Type: application/json
No auth required
```

**Request body:**
```json
{
  "email": "jane@example.com",
  "password": "Secret@123"
}
```

**Response 200:**
```json
{
  "user": {
    "id": "uuid",
    "fullName": "Jane Smith",
    "email": "jane@example.com",
    "avatarUrl": null,
    "avatarColor": "#6366f1"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```
Cookie set: `refresh_token` (httpOnly, 7 days)

**Error responses:**

| Status | Code | When |
|--------|------|------|
| 401 | `UNAUTHORIZED` | Wrong email or password |
| 422 | `UNPROCESSABLE_ENTITY` | Validation failed |

---

### 4.4 GET /auth/google

Initiates the Google OAuth flow. **Do not call this via fetch/XHR.** Redirect the browser window directly.

```
GET /api/v1/auth/google
No auth required
```

**How to trigger from frontend:**
```ts
// Redirect the browser — do NOT use fetch()
window.location.href = 'http://localhost:3020/api/v1/auth/google';
```

What happens:
1. Backend redirects browser to Google consent screen.
2. User approves.
3. Google redirects back to the callback URL below.

---

### 4.5 GET /auth/google/callback

Handled entirely by the backend. Google redirects here after consent. The backend:
1. Receives the OAuth code from Google.
2. Creates or links the user account.
3. Issues access token + sets refresh cookie.
4. Returns the same `AuthResponseDto` as login/register.

```
GET /api/v1/auth/google/callback
Handled by backend (Passport strategy) — do not call manually
```

**After callback:** The response is returned directly to the browser window that was redirected. If you opened Google OAuth in a popup, you need a postMessage or redirect strategy:

**Option A — Full redirect (simpler):**
```ts
// On login page button click:
window.location.href = `${API_BASE}/auth/google`;

// In your root layout, on mount, check if user is already set
// (the callback returns JSON + sets cookie — the frontend will
//  parse the response if the callback page is handled as a
//  dedicated route, or you redirect to /auth/callback?token=...)
```

**Option B — Popup + postMessage:**
```ts
const popup = window.open(`${API_BASE}/auth/google`, '_blank', 'width=500,height=600');
window.addEventListener('message', (event) => {
  if (event.origin !== API_BASE) return;
  const { accessToken, user } = event.data;
  // store access token in memory
});
```

> The backend currently returns JSON directly from the callback. If you need a redirect to a specific frontend URL after OAuth, the backend will need a small change to redirect with the token as a query param or use postMessage. Flag this when building the OAuth UI.

**Error responses:**

| Status | When |
|--------|------|
| 401 | Google account has no verified email |
| 409 | Email is already linked to a different Google account, or account is deactivated |

---

## 5. Standard Response Shapes

All responses from this backend follow a consistent envelope:

### Auth Responses (login / register / Google)
```json
{
  "user": {
    "id": "string (uuid)",
    "fullName": "string",
    "email": "string",
    "avatarUrl": "string | null",
    "avatarColor": "string (hex)"
  },
  "accessToken": "string (JWT)"
}
```

### Future: Standard Success (single resource)
```json
{
  "success": true,
  "data": { ... },
  "message": "string | null"
}
```

### Future: Standard Success (paginated list)
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

---

## 6. Error Handling

All errors follow this shape:
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": null
  }
}
```

For validation errors, `details` is an array:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      { "field": "email", "message": "Invalid email address" },
      { "field": "password", "message": "Password must be at least 8 characters" }
    ]
  }
}
```

### Error Code Reference

| Code | HTTP | Frontend Action |
|------|------|----------------|
| `VALIDATION_ERROR` | 400 | Show per-field errors from `details` array |
| `BAD_REQUEST` | 400 | Show generic error message |
| `UNAUTHORIZED` | 401 | Clear token, redirect to login |
| `TOKEN_EXPIRED` | 401 | Call `POST /auth/refresh`, retry original request |
| `FORBIDDEN` | 403 | Show "you don't have permission" |
| `NOT_FOUND` | 404 | Show 404 state |
| `CONFLICT` | 409 | Show specific conflict message (e.g., "Email already in use") |
| `UNPROCESSABLE_ENTITY` | 422 | Show business logic error message |
| `TOO_MANY_REQUESTS` | 429 | Show rate limit warning, use `Retry-After` header |
| `INTERNAL_ERROR` | 500 | Show generic "something went wrong" |

---

## 7. Axios / Fetch Setup

### Recommended Axios Instance

```ts
// lib/api.ts
import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3020/api/v1';

export const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,  // REQUIRED: sends httpOnly refresh_token cookie
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach access token from memory on every request
api.interceptors.request.use((config) => {
  const token = getAccessToken(); // from your auth store (Zustand/Context)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 — attempt refresh, then retry once
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const { data } = await api.post('/auth/refresh');
        setAccessToken(data.accessToken); // store in memory
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch {
        clearAccessToken();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
```

> `withCredentials: true` is required for the httpOnly `refresh_token` cookie to be sent cross-origin. Make sure the backend has CORS configured to allow your frontend origin with `credentials: true`.

---

## 8. Google OAuth Integration

### Full Redirect Flow (recommended for simplicity)

```tsx
// components/GoogleLoginButton.tsx
export function GoogleLoginButton() {
  const handleClick = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
  };

  return (
    <button onClick={handleClick}>
      Sign in with Google
    </button>
  );
}
```

After Google redirects back to the callback, the backend returns the auth JSON response. You'll need a dedicated callback page on the frontend if you want to capture the token:

```tsx
// app/auth/callback/page.tsx (Next.js example)
// This only applies if backend is configured to redirect to frontend with token
// as a query param — requires a backend change.

// Current behavior: backend returns JSON directly from /auth/google/callback
// This means the full-redirect flow needs backend cooperation.
// Flag this to the backend developer before building this page.
```

**Recommended ask to backend:** After Google OAuth succeeds, redirect to:
```
http://localhost:3001/auth/callback?token=<access_token>
```
Then the frontend `/auth/callback` page reads the token from the URL, stores it in memory, and redirects to `/dashboard`.

---

## 9. Protected Route Pattern

All workspace/project/task routes (when implemented) require:

```
Authorization: Bearer <access_token>
x-workspace-id: <workspace_uuid>   ← required for workspace-scoped endpoints
```

### Next.js Middleware Example

```ts
// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_ROUTES = ['/login', '/register', '/auth/callback'];

export function middleware(req: NextRequest) {
  const isPublic = PUBLIC_ROUTES.some(r => req.nextUrl.pathname.startsWith(r));
  if (isPublic) return NextResponse.next();

  // Access token check — stored in a short-lived cookie or memory
  // Since we keep it in memory, we can't check it in middleware.
  // Redirect happens in the component/layout if the store is empty.
  return NextResponse.next();
}
```

### React/Zustand Auth Store Pattern

```ts
// stores/auth.store.ts
import { create } from 'zustand';

type AuthState = {
  accessToken: string | null;
  user: AuthUser | null;
  setAuth: (token: string, user: AuthUser) => void;
  clearAuth: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  setAuth: (accessToken, user) => set({ accessToken, user }),
  clearAuth: () => set({ accessToken: null, user: null }),
}));

// Helpers used by the axios interceptor
export const getAccessToken = () => useAuthStore.getState().accessToken;
export const setAccessToken = (t: string) =>
  useAuthStore.setState((s) => ({ ...s, accessToken: t }));
export const clearAccessToken = () =>
  useAuthStore.setState((s) => ({ ...s, accessToken: null, user: null }));
```

---

## 10. Planned Endpoints (Not Yet Implemented)

These endpoints are in the design spec but not yet built. Do not integrate against them yet — shapes may change during implementation.

### Auth (remaining)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/auth/refresh` | Exchange refresh cookie for new access token |
| POST | `/auth/forgot-password` | Send reset link to email |
| POST | `/auth/reset-password` | Set new password using reset token |
| POST | `/auth/logout` | Invalidate refresh token + clear cookie |

### User Profile

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/users/me` | Get current user profile |
| PATCH | `/users/me` | Update name, bio, designation, timezone, avatar |

### Workspaces

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/workspaces` | List workspaces for current user |
| POST | `/workspaces` | Create workspace |
| GET | `/workspaces/:id` | Get workspace detail |
| PATCH | `/workspaces/:id` | Update workspace |
| DELETE | `/workspaces/:id` | Delete workspace |
| GET | `/workspaces/:id/members` | List members |
| POST | `/workspaces/:id/invites` | Invite member by email |
| DELETE | `/workspaces/:id/members/:userId` | Remove member |

All workspace-scoped requests also need `x-workspace-id` header.

### Projects

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/projects` | List projects in workspace |
| POST | `/projects` | Create project |
| GET | `/projects/:id` | Get project |
| PATCH | `/projects/:id` | Update project |
| DELETE | `/projects/:id` | Delete project |

### Tasks

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/projects/:projectId/tasks` | List tasks (paginated, filterable) |
| POST | `/projects/:projectId/tasks` | Create task |
| GET | `/tasks/:id` | Get task detail |
| PATCH | `/tasks/:id` | Update task |
| DELETE | `/tasks/:id` | Delete task |
| POST | `/tasks/:id/assign` | Assign task to user |

### Comments

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/tasks/:taskId/comments` | List comments |
| POST | `/tasks/:taskId/comments` | Post comment |
| PATCH | `/comments/:id` | Edit comment |
| DELETE | `/comments/:id` | Delete comment |

### Notifications

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/notifications` | List notifications |
| PATCH | `/notifications/:id/read` | Mark as read |
| POST | `/notifications/read-all` | Mark all as read |

### File Attachments

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/attachments/presign` | Get S3 presigned upload URL |
| POST | `/attachments/:id/confirm` | Confirm upload complete |
| GET | `/attachments/:id/download` | Get presigned download URL |

### Search

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/search?q=...&workspace_id=...` | Full-text search across tasks/projects |

### WebSocket

```
ws://localhost:3020/ws?token=<access_token>
```

Events (server → client):
- `comment:created`
- `comment:updated`
- `comment:deleted`
- `mention:received`
- `user:online`
- `user:offline`

---

*Last updated: 2026-04-13 — reflects commit `8704587` (auth module complete)*
