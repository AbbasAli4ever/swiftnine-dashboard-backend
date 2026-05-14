# Project Password Protection - Feature + Implementation Plan

> Built from `docs/project-password-protection.md` and adjusted to match the current backend structure.
> Goal: implement project-level password protection in mergeable phases with clear ownership, low conflict risk, and explicit validation gates.
> Date: 2026-05-12

---

## 1. Objective

Allow a workspace `OWNER` or the project creator (`Project.createdBy`) to protect a single project with a password.

When a project is locked:

- every workspace member must unlock it before viewing or interacting with protected project content
- there is no owner/admin bypass for content access
- unlock is per user, per project
- unlock expires after a hard 24-hour window
- changing or removing the password invalidates all active unlock sessions immediately

This feature is opt-in. Projects without a password must continue to behave exactly as they do now.

---

## 2. Codebase Reality Check

This backend already has strong workspace-level access control through:

- `JwtAuthGuard`
- `WorkspaceGuard`
- module-local permission checks

But project access is not centralized in one place yet.

Project-scoped data currently flows through many modules:

- `project`
- `task`
- `task-list`
- `status`
- `dashboard`
- `favorites`
- `comments`
- `time-entry`
- `attachments`
- `activity`
- `channels`
- `chat`
- `docs`
- `notifications`

Important codebase observations:

- Project membership is effectively inherited from workspace membership, not a dedicated project-members table.
- Many services use direct Prisma checks like `findProjectOrThrow`, `findTaskOrThrow`, or channel/doc-specific lookup helpers instead of one shared project guard.
- `DocsModule` already has its own permission resolver pattern, which is a good reference for service-based access checks.
- Notifications and search are potential leak points because they aggregate across projects.
- Realtime is split across gateways, especially:
  - `apps/api/src/chat/chat.gateway.ts`
  - `apps/api/src/docs/docs.gateway.ts`

Because of that, the safest implementation strategy is:

1. create a shared project-security foundation
2. land the password APIs
3. protect direct project endpoints
4. protect indirect project content paths
5. lock down realtime and notification/search leaks

Do not start by scattering ad hoc checks across modules without the shared foundation.

---

## 3. Locked Decisions

These are the working decisions for implementation unless product requirements change.

| Topic | Decision |
|---|---|
| Who can set/change/remove password | Workspace `OWNER` or `Project.createdBy` |
| Who must unlock | Everyone, including workspace owner |
| Unlock TTL | Hard 24 hours, non-sliding |
| Password format | Minimum 8 chars, at least 1 digit |
| Password storage | `bcrypt`, never reversible, never returned |
| Unlock transport | Server-side DB row, not JWT/cookie unlock token |
| Failed attempts | 5 failed attempts per user/project |
| Lockout duration | 15 minutes |
| Password change effect | Delete all unlock sessions immediately |
| Password removal effect | Delete password hash and all unlock sessions |
| Reset delivery | Email project owner via existing mailer |
| Reset token storage | Hashed token in DB |
| Projects list behavior | Locked projects remain visible but redacted until unlocked |
| Search/notifications behavior | Locked project content must be filtered out until unlocked |
| Realtime behavior | No project room join without active unlock |

---

## 4. Suggested Module Layout

Do not keep all of this hidden inside `ProjectModule` only, because many other modules need to consume the logic.

Recommended structure:

```text
apps/api/src/project-security/
├── project-security.module.ts
├── project-security.constants.ts
├── project-security.service.ts
├── project-password.service.ts
├── project-unlock.service.ts
├── project-reset.service.ts
├── project-access-resolver.service.ts
├── dto/
│   ├── set-project-password.dto.ts
│   ├── change-project-password.dto.ts
│   ├── unlock-project.dto.ts
│   ├── request-project-password-reset.dto.ts
│   └── confirm-project-password-reset.dto.ts
└── guards/
    └── project-unlocked.guard.ts
```

Recommended controller placement:

- keep password management endpoints under the existing `projects` route space
- either:
  - add them to `ProjectController`, or
  - create `project-password.controller.ts` and register it alongside `ProjectController`

Recommended helper service:

- `ProjectAccessResolverService`
- responsibility: resolve `projectId` from route/entity context like:
  - `taskId -> list -> projectId`
  - `listId -> projectId`
  - `statusId -> projectId`
  - `commentId -> task -> projectId`
  - `timeEntryId -> task -> projectId`
  - `channelId -> projectId`
  - `messageId -> channel -> projectId`
  - `docId -> projectId`

This resolver is critical for later phases.

---

## 5. Data Model Plan

## 5.1 Prisma changes

Extend `Project`:

```prisma
passwordHash      String?   @map("password_hash")
passwordSetBy     String?   @map("password_set_by")
passwordUpdatedAt DateTime? @map("password_updated_at")
```

Interpretation:

- `passwordHash IS NULL` means the project is not protected
- `passwordHash IS NOT NULL` means the project is protected

Add new models:

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

  project Project @relation(fields: [projectId], references: [id], onDelete: Cascade)
  user    User    @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([projectId, userId])
  @@index([lockedUntil])
  @@map("project_unlock_attempts")
}

model ProjectPasswordResetToken {
  id        String    @id @default(uuid())
  projectId String    @map("project_id")
  tokenHash String    @unique @map("token_hash")
  expiresAt DateTime  @map("expires_at")
  usedAt    DateTime? @map("used_at")
  createdAt DateTime  @default(now()) @map("created_at")

  project Project @relation(fields: [projectId], references: [id], onDelete: Cascade)

  @@index([projectId])
  @@index([expiresAt])
  @@map("project_password_reset_tokens")
}
```

## 5.2 Migration strategy

- one additive Prisma migration
- no backfill required
- existing projects stay unlocked by default
- run `prisma generate` after migration

## 5.3 Data-safety notes

- do not store raw passwords
- do not store raw reset tokens
- do not return `passwordHash` from API responses
- include new password-related project fields only in internal selects where needed

---

## 6. API Surface Plan

Recommended endpoints:

| Method | Path | Purpose |
|---|---|---|
| `POST` | `/projects/:projectId/password` | Set initial password |
| `PUT` | `/projects/:projectId/password` | Change password |
| `DELETE` | `/projects/:projectId/password` | Remove password |
| `POST` | `/projects/:projectId/unlock` | Submit password and create unlock session |
| `GET` | `/projects/:projectId/lock-status` | Return lock state and active unlock expiry |
| `POST` | `/projects/:projectId/password/reset-request` | Send reset email to project owner |
| `POST` | `/projects/:projectId/password/reset-confirm` | Set new password using reset token |

Expected response behavior:

- `lock-status` must not require the project to already be unlocked
- password fields must never be returned
- when a project is locked and caller has no valid unlock:
  - return `403`
  - include a stable machine-readable code like `PROJECT_LOCKED`

Recommended error codes:

- `PROJECT_LOCKED`
- `INVALID_PASSWORD`
- `TOO_MANY_ATTEMPTS`
- `INVALID_PASSWORD_FORMAT`
- `PASSWORD_ALREADY_SET`
- `PROJECT_PASSWORD_NOT_SET`
- `RESET_TOKEN_INVALID`
- `RESET_TOKEN_EXPIRED`

---

## 7. Shared Enforcement Rules

## 7.1 Unlock check behavior

Shared algorithm:

1. load project lock state
2. if project has no password, allow
3. if project has a password:
   - load `ProjectUnlockSession` by `(projectId, userId)`
   - require `expiresAt > now`
4. if no valid session, reject with `PROJECT_LOCKED`

## 7.2 Password verify behavior

For `POST /unlock`:

1. verify the user belongs to the workspace already
2. verify the project belongs to that workspace
3. if project is not locked, either:
   - return success without creating a session, or
   - return a descriptive no-op response
4. check lockout row before bcrypt compare
5. on invalid password:
   - increment failure count
   - lock after the 5th failed attempt
6. on valid password:
   - clear attempt row
   - upsert unlock session
   - `expiresAt = now + 24h`

## 7.3 Session invalidation behavior

Immediately delete all unlock sessions on:

- password change
- password reset confirm
- password removal

Implementation should centralize this in one helper to avoid drift.

## 7.4 Password format validation

Single reusable validation rule:

```ts
/^(?=.*\d).{8,}$/
```

Use the same rule in:

- set password
- change password
- reset confirm

---

## 8. Phase Plan

## Phase 0 - Preparation and Shared Decisions

### Goal

Create a clean implementation base so later phases do not fight each other.

### Work

- confirm exact endpoint ownership and naming
- confirm whether project list rows for locked projects should expose:
  - only `id`, `workspaceId`, `locked`
  - or also `color`, `icon`
- confirm whether non-owners are allowed to trigger reset emails
- confirm whether workspace `ADMIN` is intentionally excluded from password management

### Output

- no large code changes yet
- final decisions reflected in constants and plan comments

### Validation

- none beyond review alignment

### Exit criteria

- no open product ambiguity that would force rewrites in phases 2 to 5

---

## Phase 1 - Schema and Shared Security Foundation

### Goal

Add the data model and shared services that every later phase depends on.

### Primary files

- `prisma/schema.prisma`
- new Prisma migration
- `apps/api/src/project-security/**`
- `apps/api/src/app.module.ts`

### Work

1. Add project password columns and new unlock/reset tables.
2. Create `ProjectSecurityModule`.
3. Implement:
   - `ProjectSecurityService`
   - `ProjectPasswordService`
   - `ProjectUnlockService`
   - `ProjectResetService`
   - `ProjectAccessResolverService`
4. Expose shared methods such as:
   - `findProjectOrThrow`
   - `assertPasswordManager`
   - `isProjectLocked`
   - `assertUnlocked`
   - `resolveProjectIdFromTaskId`
   - `resolveProjectIdFromChannelId`
   - `invalidateUnlockSessions`
5. Add shared constants and typed error payload helpers.

### Notes

- This module should be imported by feature modules that need project-lock enforcement.
- Keep it independent enough to avoid circular imports.
- Prefer exporting services instead of reaching into `ProjectModule` internals.

### Validation

- `npm run db:generate`
- `npm run build`

### Exit criteria

- schema compiles
- shared services are injectable
- no feature module enforcement has started yet

---

## Phase 2 - Password Management and Unlock APIs

### Goal

Ship the core feature API before touching every project-content surface.

### Primary files

- `apps/api/src/project/project.controller.ts` or new controller beside it
- `apps/api/src/project/project.module.ts`
- `apps/api/src/project-security/**`
- DTO files

### Work

1. Add set password endpoint.
2. Add change password endpoint.
3. Add remove password endpoint.
4. Add unlock endpoint.
5. Add lock-status endpoint.
6. Add reset-request endpoint.
7. Add reset-confirm endpoint.
8. Reuse existing email patterns from:
   - `apps/api/src/auth/auth.service.ts`
   - `libs/common/src/email/email.service.ts`
9. Build reset links from `FRONTEND_URL`.

### Permission rules

- only workspace `OWNER` or project creator can set/change/remove
- any workspace member with access to the project can attempt unlock
- reset email goes to the project creator only

### Response rules

- never return `passwordHash`
- return stable error codes in failures
- return `unlockedUntil` for successful unlock and lock-status where applicable

### Validation

- unit tests for:
  - permission matrix
  - password format
  - password hashing
  - unlock success/failure
  - lockout after 5 failures
  - unlock session invalidation on change/remove/reset

### Exit criteria

- core API works end-to-end in isolation
- unlock sessions are stored and revoked correctly

---

## Phase 3 - Direct Project Surface Enforcement

### Goal

Protect endpoints that already work directly with `projectId`.

### Primary files

- `apps/api/src/project/**`
- `apps/api/src/task-list/**`
- `apps/api/src/status/**`
- `apps/api/src/dashboard/**`
- `apps/api/src/channels/channels.service.ts`
- `apps/api/src/favorites/favorites.service.ts`

### Work

Protect these areas first:

- `GET /projects/:projectId`
- `GET /projects`
- `GET /projects/archived`
- `GET /projects/:projectId/dashboard`
- project task-list endpoints
- project board endpoints
- status endpoints that take `projectId`
- project channel listing
- project favorites list and project favorite actions

### Enforcement style

Use shared helpers and, where routes are directly project-scoped, consider a reusable guard.

Recommended split:

- controller/guard for routes with a direct `projectId` param
- service-level redaction/filtering for aggregate list endpoints

### Special handling for project lists

For workspace project lists and favorites:

- locked projects should still appear
- redact sensitive metadata until unlocked

Suggested redacted shape:

```json
{
  "id": "project-id",
  "workspaceId": "workspace-id",
  "locked": true,
  "isFavorite": false
}
```

If frontend needs more fields, add only after explicit confirmation.

### Validation

- manual route validation
- unit tests for list redaction behavior
- project dashboard access test for locked vs unlocked user

### Exit criteria

- direct project endpoints no longer leak content without unlock

---

## Phase 4 - Indirect Content Enforcement

### Goal

Protect content paths that reach projects through related entities instead of direct `projectId`.

### Primary files

- `apps/api/src/task/task.service.ts`
- `apps/api/src/comments/comments.service.ts`
- `apps/api/src/time-entry/time-entry.service.ts`
- `apps/api/src/attachments/attachments.service.ts`
- `apps/api/src/activity/activity.service.ts`
- `apps/api/src/docs/docs.service.ts`
- `apps/api/src/docs/doc-search.service.ts`
- `apps/api/src/chat/chat.service.ts`

### Work

Add unlock enforcement for:

- task detail
- workspace task search
- project task search
- list task search
- comments on tasks
- time entries on tasks
- task attachments
- project activity and task activity where the task belongs to a locked project
- project-scoped docs
- doc search rows tied to locked projects
- chat REST calls for project channels

### Recommended approach

Use `ProjectAccessResolverService` heavily here.

Pattern:

1. resolve project id from entity id
2. if project id is null, skip project-lock check
3. if project id exists, call shared unlock assertion

### Important nuance

Not all data is project-scoped:

- workspace docs may remain accessible
- personal docs may remain accessible
- DMs should not depend on project unlock
- workspace-level channels without `projectId` should not depend on project unlock

### Validation

- service tests for resolver-backed project checks
- doc search permission plus lock filtering tests
- task search tests proving locked project tasks do not appear before unlock

### Exit criteria

- indirect entity access no longer bypasses project protection

---

## Phase 5 - Realtime Enforcement

### Goal

Prevent locked-project data from leaking through websockets or room membership.

### Primary files

- `apps/api/src/chat/chat.gateway.ts`
- `apps/api/src/docs/docs.gateway.ts`
- any related fanout helpers

### Work

#### Chat gateway

- before joining a project channel room, verify:
  - user is channel member
  - if channel has `projectId`, user has active unlock
- reject with stable websocket error for locked project access

#### Docs gateway

- before joining project-backed doc rooms, verify active unlock
- workspace and personal docs should still use existing permission checks only

#### Session revocation

On password change, reset, or removal:

- revoke unlock sessions
- broadcast a project lock-change event if useful
- force disconnect or force-leave project rooms where practical

### Notes

The current gateways use `WsException` and gateway-local validation patterns. Follow those conventions.

### Validation

- websocket tests for join allowed vs denied
- revocation test proving prior room access no longer works after password change

### Exit criteria

- realtime no longer bypasses unlock checks

---

## Phase 6 - Notifications, Search, and Leak Prevention

### Goal

Close the cross-project aggregation leaks that are easiest to miss.

### Primary files

- `apps/api/src/notifications/notifications.service.ts`
- `apps/api/src/notifications/notifications.controller.ts`
- `apps/api/src/task/task.service.ts`
- `apps/api/src/docs/doc-search.service.ts`
- `apps/api/src/chat/chat.service.ts`

### Work

#### Notifications

Current notifications only store polymorphic `referenceType` and `referenceId`, so filtering will require lookup logic.

Implement helper resolution for notifications:

- `task` notification -> task -> project
- `comment` notification -> comment -> task -> project
- if a notification resolves to a locked project and the recipient is not unlocked:
  - exclude it from init payload
  - suppress SSE broadcast

#### Search

Filter out locked-project rows from:

- workspace task search
- doc search
- chat message search for project channels

#### Mentions and fanout

Any notification creation tied to project content should be filtered before delivery, not only before listing.

### Validation

- notification init list filtering tests
- SSE notification suppression tests where practical
- search tests across mixed locked and unlocked projects

### Exit criteria

- aggregate endpoints and event streams do not leak locked content

---

## Phase 7 - Audit, Cleanup, and Hardening

### Goal

Make the feature production-safe and maintainable.

### Work

- add activity log entries for:
  - password set
  - password changed
  - password removed
  - reset requested
  - reset completed
- review rate limiting around reset-request
- review lockout expiry behavior
- confirm archived/deleted project behavior with unlock records
- ensure password-related project selects are not accidentally reused in public DTOs
- add cleanup handling for expired sessions if needed

### Optional follow-up

- scheduled cleanup for expired unlock sessions and used/expired reset tokens
- dedicated telemetry counters for lockouts and unlock attempts

### Validation

- build
- targeted unit tests
- targeted e2e flow

### Exit criteria

- feature is stable, observable, and not carrying obvious operational debt

---

## 9. Recommended Delivery Order

Implement in this exact order to reduce churn:

1. Phase 1
2. Phase 2
3. Phase 3
4. Phase 4
5. Phase 5
6. Phase 6
7. Phase 7

Do not start notifications or realtime before phases 1 and 2 are complete.

Do not start broad service-level enforcement before the shared resolver exists.

---

## 10. File Conflict and Ownership Guide

High-conflict files:

- `prisma/schema.prisma`
- `apps/api/src/app.module.ts`
- `apps/api/src/project/project.controller.ts`
- `apps/api/src/task/task.service.ts`
- `apps/api/src/chat/chat.gateway.ts`
- `apps/api/src/notifications/notifications.service.ts`

Suggested execution rule:

- one agent owns schema changes
- one agent owns shared `project-security` foundation
- one agent owns direct project surfaces
- one agent owns indirect task/content enforcement
- one agent owns realtime
- one agent owns notification/search leak prevention

Do not have multiple agents edit `task.service.ts` or `notifications.service.ts` at the same time unless work is explicitly serialized.

---

## 11. Test Plan

## Unit tests

- password service
- unlock service
- reset service
- resolver service
- redaction helpers
- guard behavior

## Service/integration tests

- project dashboard access
- task search filtering
- docs search filtering
- notification filtering
- chat/project channel access

## End-to-end path

Minimum e2e happy-path plus invalidation flow:

1. user A creates project
2. user A sets password
3. user B tries to access project content and gets `PROJECT_LOCKED`
4. user B unlocks successfully
5. user B can access protected content
6. user A changes password
7. user B loses access immediately
8. user B must unlock again with the new password

## Additional edge cases

- wrong password 5 times triggers lockout
- lockout expires after 15 minutes
- unlocked session expires after 24 hours
- removing password restores normal project access
- reset-confirm invalidates all prior unlock sessions
- workspace and personal docs remain accessible when unrelated projects are locked

---

## 12. Definition of Done

This feature is done only when all of the following are true:

- project password and unlock APIs are implemented
- direct project endpoints are protected
- indirect entity-based content endpoints are protected
- realtime joins enforce unlock state
- notifications and search do not leak locked project content
- password changes and resets revoke active unlock sessions immediately
- tests cover the main happy path and main bypass risks

If only the password endpoints exist, the feature is not done.

If direct project endpoints are protected but search/notifications/realtime still leak data, the feature is not done.

---

## 13. First Implementation Chunk

If starting immediately, the best first chunk is:

### Chunk 1

- update `prisma/schema.prisma`
- generate the migration
- add `ProjectSecurityModule`
- add shared constants
- add `ProjectPasswordService`
- add `ProjectUnlockService`
- add `ProjectAccessResolverService`
- wire the module into `AppModule`

### Why this chunk first

- every later phase depends on it
- it isolates the hardest architecture decision early
- it reduces the chance of later duplicate logic across modules

### Exit gate for Chunk 1

- build passes
- Prisma client generates
- shared services are injectable
- no endpoint behavior has changed yet outside internal wiring

