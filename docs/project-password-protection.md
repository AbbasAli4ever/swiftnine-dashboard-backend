# Project Password Protection — Feature Plan

Status: Proposed
Owner: TBD
Last updated: 2026-05-12

## Overview

Allow a workspace OWNER or a project's creator to enable a password on a specific project. Once enabled, every workspace member (including the workspace owner) must enter the password before viewing or interacting with any of the project's contents. Unlock is per-user, per-project, time-limited (hard 24-hour window).

The feature is fully opt-in per project — projects without a password behave exactly as today.

---

## Requirements (locked in)

| Topic | Decision |
|---|---|
| Who can set / change / remove password | Workspace OWNER **or** project `createdBy` (project owner) |
| Who must unlock | Everyone — no bypass (even workspace owner) |
| Unlock TTL | Hard 24-hour window per user/project (not sliding) |
| What is gated | Project contents (tasks, docs, files, chat), project metadata in lists, notifications/mentions, search results |
| Password format | Min 8 chars, at least 1 number |
| Storage | bcrypt hash (cost 12), never reversible, never returned |
| Forgot password | Email reset link sent to project owner |
| On password change | All existing unlock sessions invalidated immediately |
| Token transport | Server-side DB record (`ProjectUnlockSession`), checked per request |
| Realtime / sockets | Cannot join project's socket rooms without an active unlock |
| Brute-force protection | 5 failed attempts → 15-minute lockout per user/project |

### Why server-side unlock sessions (not JWT, not cookie)

- Membership/role is already checked in DB on every request — adding an indexed lookup is cheap.
- "Change password invalidates all sessions immediately" requires revocation; with JWTs that means a denylist anyway. DB rows we just `DELETE`.
- Works identically for REST, sockets, and mobile clients (no cookie scoping issues).

---

## Schema changes

### `Project` (extend)

```prisma
passwordHash       String?   @map("password_hash")
passwordSetBy      String?   @map("password_set_by")
passwordUpdatedAt  DateTime? @map("password_updated_at")
```

`passwordHash IS NOT NULL` ⇒ project is locked.

### New models

```prisma
model ProjectUnlockSession {
  id        String   @id @default(uuid())
  projectId String   @map("project_id")
  userId    String   @map("user_id")
  expiresAt DateTime @map("expires_at")
  createdAt DateTime @default(now()) @map("created_at")

  project Project @relation(fields: [projectId], references: [id], onDelete: Cascade)
  user    User    @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([projectId, userId])
  @@index([expiresAt])
  @@map("project_unlock_sessions")
}

model ProjectUnlockAttempt {
  id          String    @id @default(uuid())
  projectId   String    @map("project_id")
  userId      String    @map("user_id")
  failedCount Int       @default(0) @map("failed_count")
  lockedUntil DateTime? @map("locked_until")
  lastFailAt  DateTime? @map("last_fail_at")

  @@unique([projectId, userId])
  @@map("project_unlock_attempts")
}

model ProjectPasswordResetToken {
  id        String    @id @default(uuid())
  projectId String    @map("project_id")
  tokenHash String    @unique @map("token_hash")
  expiresAt DateTime  @map("expires_at")
  usedAt    DateTime? @map("used_at")
  createdAt DateTime  @default(now()) @map("created_at")

  @@index([projectId])
  @@map("project_password_reset_tokens")
}
```

### Migration

Single Prisma migration: 3 new tables + 3 new columns on `projects`. No backfill — existing projects keep `passwordHash = null` and behave unchanged.

---

## Module layout

Co-located under `apps/api/src/project/password/` (kept inside `ProjectModule`, not a separate top-level module):

```
apps/api/src/project/password/
├── project-password.controller.ts
├── project-password.service.ts        # set / change / remove / format validation / hash
├── project-unlock.service.ts          # verify, session create/check/invalidate, lockout
├── project-password.constants.ts      # error codes
└── guards/
    └── project-unlocked.guard.ts
```

Error codes (used in HTTP and socket errors):
- `PROJECT_LOCKED`
- `INVALID_PASSWORD`
- `TOO_MANY_ATTEMPTS`
- `INVALID_PASSWORD_FORMAT`
- `PASSWORD_ALREADY_SET`
- `RESET_TOKEN_INVALID`

---

## HTTP endpoints

| Method | Path | Auth | Purpose |
|---|---|---|---|
| `POST` | `/projects/:id/password` | workspace OWNER or project `createdBy` | Set initial password |
| `PUT`  | `/projects/:id/password` | same | Change password (invalidates all unlock sessions) |
| `DELETE` | `/projects/:id/password` | same | Remove protection (deletes hash + all unlock sessions) |
| `POST` | `/projects/:id/unlock` | any workspace member with project access | Submit password → create 24h unlock session |
| `POST` | `/projects/:id/password/reset-request` | any workspace member | Emails reset link to project owner only |
| `POST` | `/projects/:id/password/reset-confirm` | holder of reset token | Set new password via token |
| `GET`  | `/projects/:id/lock-status` | any workspace member | `{ locked: bool, unlockedUntil?: Date }` — cheap, no password required |

`lock-status` exists so the frontend can decide whether to show a password prompt without making a request that gets rejected.

---

## Access enforcement — `ProjectUnlockedGuard`

Applied to every project-scoped controller that returns content:
- `task`, `task-list`, `status`
- `channels` (REST), `chat` (REST)
- `docs`, `comments`, `time-entry`, `attachments`, `activity`, `tag`
- `favorites` (when scoped to a locked project)

### Guard logic

1. Resolve `projectId` from the route param **or** from the entity (e.g. `taskId → project`) via a small `ProjectResolver` helper.
2. If `project.passwordHash == null` → allow.
3. Else look up `ProjectUnlockSession (projectId, userId)`. If row exists and `expiresAt > now` → allow.
4. Else → `403 { code: 'PROJECT_LOCKED' }`. Frontend uses this signal to show the password prompt.

### List endpoints (cross-project results)

These need service-layer filtering instead of the guard, because they aggregate across projects:

- **Sidebar project list** — locked projects are still returned, but with `{ id, workspaceId, locked: true }` only. Name/description/icon/etc. are stripped until the user has an active unlock. (Decision: keep the row visible so users know what to ask the password for.)
- **Notifications** (`apps/api/src/notifications/`) — filter out items whose `projectId` is locked and the recipient lacks an active unlock session.
- **Global search** — same predicate as notifications.

---

## Sockets / realtime

`apps/api/src/chat/chat.gateway.ts` and any presence/realtime gateways that subscribe to project channels:

- On `joinRoom` / channel subscription handlers, call `ProjectUnlockService.assertUnlocked(userId, projectId)` before the join. On failure, emit a socket error `PROJECT_LOCKED`.
- On password change/removal, emit `project.unlock.revoked` to all sockets currently in the project's rooms and force-leave them server-side (`socket.leave`).

---

## Lockout (`ProjectUnlockService.verify`)

- On failed attempt: increment `failedCount`, set `lastFailAt`.
- When `failedCount >= 5`: set `lockedUntil = now + 15min`, reset `failedCount` on the next window.
- On success: delete the attempt row; upsert `ProjectUnlockSession` with `expiresAt = now + 24h`.
- Before any verify: if `lockedUntil > now`, reject early with `TOO_MANY_ATTEMPTS` and `retryAfter`.

---

## Password format validation

Single helper in `project-password.service.ts`:

```ts
/^(?=.*\d).{8,}$/
```

Reused by set / change / reset-confirm. Reject with `INVALID_PASSWORD_FORMAT`.

---

## Email reset flow

1. **`reset-request`**:
   - Generate a 32-byte random token; store `sha256(token)` in `ProjectPasswordResetToken` with `expiresAt = now + 1h`.
   - Email the **project owner only** (the `createdBy` user) with a link containing the raw token.
   - Rate-limit: 1 request per project per 15 minutes.
2. **`reset-confirm`**:
   - Look up by `sha256(token)`, ensure not expired and not used.
   - Validate new password format.
   - Update `passwordHash`, mark token `usedAt`.
   - **Invalidate all unlock sessions** for the project.

Mailer: reuse the provider already used by `auth.service.ts`.

---

## Invalidation rules (centralized)

Anywhere the password changes or is removed:

```ts
await prisma.projectUnlockSession.deleteMany({ where: { projectId } });
```

Then emit a socket event `project:locked-changed` so frontends drop cached unlock state.

---

## Tests

- `project-password.service.spec.ts` — set/change/remove permission rules, format validation, hash never returned in responses
- `project-unlock.service.spec.ts` — verify happy path, wrong password, lockout at 5, lockout expiry, session TTL, change-password invalidation
- `project-unlocked.guard.spec.ts` — gate behavior for locked vs unlocked vs no-password projects
- e2e integration: create project → owner sets password → second user blocked → second user unlocks → access works → owner changes password → second user blocked again

---

## Rollout

- One Prisma migration. No backfill.
- Feature is opt-in per project. Projects that never enable a password are unaffected.
- No flag needed — the absence of `passwordHash` is the off switch.

---

## Open assumptions (confirm before implementing)

1. "Project owner" = `Project.createdBy`. If a separate owner concept exists on projects, this changes.
2. Project owner changes their own password via the change-password endpoint directly; the email reset flow is meant for non-owner members to request the owner reset it. (Confirm: should non-owners be allowed to trigger reset emails at all?)
3. Workspace ADMINS do **not** manage project passwords (only OWNER + project creator).
4. Locked projects appear in list views as `{ id, locked: true, workspaceId }` — visible row, hidden metadata — rather than being hidden entirely.
5. Reset emails go through the same mailer used by `auth.service.ts`.
