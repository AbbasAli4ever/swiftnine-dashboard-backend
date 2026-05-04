# Codebase Issues Report

**Project:** FocusHub (swiftnine-dashboard-backend)  
**Date:** 2026-05-01  
**Stack:** NestJS 11, Prisma 7, PostgreSQL 16, Socket.IO, Zod v4

---

## Table of Contents

- [Critical Issues](#critical-issues)
- [High Priority Issues](#high-priority-issues)
- [Medium Priority Issues](#medium-priority-issues)
- [Low Priority Issues](#low-priority-issues)
- [Summary by Module](#summary-by-module)

---

## Critical Issues

### C1. Access Token Exposed in URL Query String (Auth Module)
- **File:** `apps/api/src/auth/auth.controller.ts:110-113`
- **Issue:** Google OAuth callback redirects with `?token=${accessToken}` in the URL. Query-string tokens are logged in browser history, server access logs, proxy logs, and referrer headers.
- **Impact:** Access token leakage defeats the purpose of httpOnly refresh token cookies.
- **Fix:** Pass the access token via POST redirect, POST body, or have the frontend read it from an httpOnly cookie.

### C2. No OTP Brute-Force Protection (Auth Module)
- **File:** `apps/api/src/auth/auth.service.ts:101-109`
- **Issue:** 6-digit OTP can be guessed with unlimited retries. No rate limiting, attempt counter, or lockout.
- **Impact:** Account takeover via OTP enumeration.
- **Fix:** Add rate limiting, max attempt lockout, or exponential backoff.

### C3. No Login Brute-Force Protection (Auth Module)
- **File:** `apps/api/src/auth/auth.service.ts:123-145`
- **Issue:** Unlimited password attempts per account. No per-account or per-IP throttling.
- **Impact:** Credential stuffing and brute-force attacks.
- **Fix:** Add `@nestjs/throttler` or similar rate limiting on login endpoint.

### C4. `getMember` Endpoint Has No Authorization Check (Workspace Module)
- **File:** `apps/api/src/workspace/workspace.controller.ts:117-127`
- **Issue:** `GET :workspaceId/members/:memberId` uses only `JwtAuthGuard` -- no `WorkspaceGuard`. Any authenticated user can look up any member in any workspace.
- **Impact:** Information disclosure across workspaces.
- **Fix:** Add `WorkspaceGuard` to the route or add a membership check in the service.

### C5. Race Condition: Concurrent `claimInvite` / `acceptInvite` (Workspace Module)
- **File:** `apps/api/src/workspace/workspace.service.ts:529-603, 616-653`
- **Issue:** Two concurrent requests with the same invite token can both pass the `PENDING` status check before either updates it to `ACCEPTED`, resulting in duplicate user creation or constraint violations.
- **Impact:** Data integrity corruption, duplicate accounts.
- **Fix:** Use `SELECT ... FOR UPDATE` equivalent or update invite status first in a separate transaction.

### C6. CORS Wide Open with Credentials (Config)
- **File:** `apps/api/src/config/cors.config.ts:38, 44`
- **Issue:** `origin: true` with `credentials: true` allows any website to make credentialed requests to the API, including sending httpOnly cookies.
- **Impact:** Cross-site request forgery, credential theft.
- **Fix:** Parse `CORS_ORIGINS` env var and validate request origin against an allowlist.

### C7. REST Update Bypasses WebSocket Locking/Conflict Detection (Docs Module)
- **File:** `apps/api/src/docs/docs.service.ts:110-127`
- **Issue:** HTTP PATCH updates `contentJson` without any lock checks or conflict detection. A REST client can silently overwrite concurrent WebSocket edits.
- **Impact:** Data loss in collaborative editing.
- **Fix:** Apply lock validation and conflict detection to REST update path.

### C8. Any Workspace Member Can Remove Any Assignee From Any Task (Task Module)
- **File:** `apps/api/src/task/task.service.ts:~613` (`removeAssignee`)
- **Issue:** No check that the requester is the task creator, the assignee being removed, or a workspace admin.
- **Impact:** IDOR-style authorization bypass; malicious members can strip assignees from others' tasks.
- **Fix:** Add ownership or admin authorization check.

### C9. Soft-Delete Cascade Misses Sub-Subtasks (Task Module)
- **File:** `apps/api/src/task/task.service.ts:~457`
- **Issue:** Soft-deleting a task only soft-deletes direct children (`parentId: taskId`). Sub-subtasks at depth 2 are not deleted, becoming orphaned.
- **Impact:** Orphaned subtasks remain visible after parent deletion.
- **Fix:** Cascade soft-delete to depth-2 children as well.

### C10. No Rate Limiting on WebSocket Handlers (Docs Module)
- **File:** `apps/api/src/docs/docs.gateway.ts`
- **Issue:** No per-socket rate limiting on `doc:autosave`, `doc:lock-block`, etc. Malicious client can spam to exhaust CPU/memory.
- **Impact:** Denial of service.
- **Fix:** Add per-socket throttling/rate limiting.

---

## High Priority Issues

### H1. Organizations Endpoints Lack `WorkspaceGuard` (Workspace Module)
- **File:** `apps/api/src/workspace/organizations.controller.ts:24, 53`
- **Issue:** `removeMember` and `changeMemberRole` use `JwtAuthGuard` + `RolesGuard` but not `WorkspaceGuard`. `RolesGuard` falls back to reading `workspaceId` from request body.
- **Impact:** Authorization bypass if body injection succeeds.
- **Fix:** Add `WorkspaceGuard` for defense-in-depth.

### H2. No Self-Removal / Last-Owner Protection (Workspace Module)
- **File:** `apps/api/src/workspace/workspace.service.ts:788-903`
- **Issue:** `removeMember` and `changeMemberRole` do not prevent an OWNER from removing/demoting themselves or removing the sole OWNER.
- **Impact:** Workspace orphaning with no owner.
- **Fix:** Add guard clauses preventing self-removal and checking at least one OWNER remains.

### H3. Workspace Soft-Delete Leaves Members/Invites Active (Workspace Module)
- **File:** `apps/api/src/workspace/workspace.service.ts:430-452`
- **Issue:** Soft-deleting a workspace does not soft-delete associated `WorkspaceMember` or `WorkspaceInvite` records.
- **Impact:** Deleted workspace still has active members and valid pending invites.
- **Fix:** Cascade soft-delete or revoke all associated invites and members.

### H4. No Rate Limiting on Public Invite Endpoints (Workspace Module)
- **File:** `apps/api/src/workspace/workspace.controller.ts:284-337`
- **Issue:** `GET invite/:token` and `POST invite/claim` are public (no auth guard) with no rate limiting.
- **Impact:** Token enumeration and brute-force attacks.
- **Fix:** Add `@Throttle()` decorator.

### H5. Race Condition in `getNextBoardPosition` / `getNextSubtaskPosition` (Task Module)
- **File:** `apps/api/src/task/task.service.ts:~114, ~520`
- **Issue:** Position fetch called outside the create transaction. Two concurrent creates can get the same position value.
- **Impact:** Duplicate position values, ordering corruption.
- **Fix:** Move position fetch inside the transaction.

### H6. Activity Log Uses Wrong `entityId` (Task Module)
- **File:** `apps/api/src/task/task.service.ts:~817`
- **Issue:** Activity log for task reorder uses `entityType: 'task'` but `entityId: listId`.
- **Impact:** Corrupt audit trail.
- **Fix:** Use correct `entityId` (task ID) or change `entityType` to `'list'`.

### H7. Activity Log Reports All `dto.userIds` as Added (Task Module)
- **File:** `apps/api/src/task/task.service.ts:~586`
- **Issue:** `addAssignees` logs `dto.userIds` (requested list) instead of `newUserIds` (actually added), due to `skipDuplicates: true`.
- **Impact:** Misleading audit trail.
- **Fix:** Log only the actually added user IDs.

### H8. WebSocket CORS Wide Open (Docs Module)
- **File:** `apps/api/src/docs/docs.gateway.ts:41`
- **Issue:** `cors: { origin: true, credentials: true }` allows any origin to establish WebSocket connections with credentials.
- **Impact:** Cross-site WebSocket hijacking.
- **Fix:** Restrict to known frontend origins.

### H9. Heartbeat/Unlock Don't Verify Edit Permission (Docs Module)
- **File:** `apps/api/src/docs/docs.gateway.ts:131-150`
- **Issue:** `handleLockHeartbeat` and `handleUnlockBlock` do not re-check that the user still has edit permission on the document.
- **Impact:** Revoked users can maintain locks indefinitely.
- **Fix:** Add permission verification to heartbeat and unlock handlers.

### H10. Duplicate Presence Snapshot Emitted to Joining Client (Docs Module)
- **File:** `apps/api/src/docs/docs.gateway.ts:97-101`
- **Issue:** Joining client receives `doc:presence-snapshot` directly and then again via `client.to(room).emit`, which includes the sender.
- **Impact:** Duplicate events, potential frontend bugs.
- **Fix:** Remove the direct emit or use `client.broadcast().emit()` to exclude sender.

### H11. Same-User Lock Overwrite From Multiple Sockets (Docs Module)
- **File:** `apps/api/src/docs/doc-locks.service.ts:41`
- **Issue:** If the same user holds a lock on block A from socket S1 and acquires from socket S2 (e.g., two browser tabs), the second call silently overwrites the first.
- **Impact:** First tab's lock is lost but tab still believes it holds the lock.
- **Fix:** Check for existing same-user lock and either reject or merge.

### H12. SSE Stream Left Hanging on Error (Comments Module)
- **File:** `apps/api/src/comments/comments.controller.ts:39`
- **Issue:** If `getCommentsForTask` throws, SSE headers are already set but `registerClient` was not called. Client hangs waiting for data.
- **Impact:** Resource leak, hung connections.
- **Fix:** Set up SSE headers only after the data fetch succeeds, or handle errors and close the stream.

### H13. No Rate Limiting on Auth Endpoints (Global)
- **Issue:** No `@nestjs/throttler` or express rate-limit middleware anywhere. Login, signup, password reset, and OTP verification are vulnerable to brute-force.
- **Impact:** Credential stuffing, OTP enumeration.
- **Fix:** Add rate limiting, especially on auth routes.

### H14. JWT Secrets Not Enforced in Docker Compose
- **File:** `docker-compose.yml`
- **Issue:** `docker-compose.yml` does not require or validate `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET`. If someone runs `docker compose up` without `.env`, the app may silently sign tokens with `undefined`.
- **Impact:** Token forgery with known secret.
- **Fix:** Add required env vars with non-default values in compose file.

### H15. Swagger UI Exposed Unconditionally
- **File:** `apps/api/src/main.ts:20-23`
- **Issue:** `SwaggerModule.setup('api/docs', app, document)` is unconditionally enabled in all environments.
- **Impact:** Full API documentation exposed in production.
- **Fix:** Guard behind `NODE_ENV !== 'production'` or `ENABLE_SWAGGER` env var.

### H16. Prisma Studio Exposed Without Authentication
- **File:** `docker-compose.yml:53-63`
- **Issue:** Prisma Studio provides full database read/write access, bound to port 5555 with no authentication.
- **Impact:** Full data exposure if port is reachable.
- **Fix:** Remove from compose or document as dev-only with network isolation.

### H17. Task List Delete Does Not Cascade to Tasks
- **File:** `apps/api/src/task-list/task-list.service.ts:166-179`
- **Issue:** Soft-deleting a task list does NOT soft-delete the tasks within it, leaving orphaned tasks with `listId` pointing to a deleted list.
- **Impact:** Orphaned tasks remain visible.
- **Fix:** Cascade soft-delete to tasks.

### H18. Project Delete Does Not Cascade to Comments, Attachments, Time Entries
- **File:** `apps/api/src/project/project.service.ts:198-222`
- **Issue:** Soft-deleting a project does not cascade to comments, attachments, time entries, or subtasks on its tasks.
- **Impact:** Orphaned records remain.
- **Fix:** Cascade soft-delete to all related entities.

---

## Medium Priority Issues

### M1. Fast OTP Hash (SHA-256) (Auth Module)
- **File:** `apps/api/src/auth/auth.service.ts:378-380`
- **Issue:** `createHash('sha256')` is cryptographically fast. If DB is compromised, 6-digit OTP space (1M possibilities) can be brute-forced quickly.
- **Fix:** Use HMAC-SHA256 with a server-side secret.

### M2. Non-Transactional Reset Token Rotation (Auth Module)
- **File:** `apps/api/src/auth/auth.service.ts:273-280`
- **Issue:** `deleteMany` and `create` for reset tokens are separate DB calls. If `create` fails, user has no valid reset token.
- **Fix:** Wrap in a transaction.

### M3. Google Profile Fields Not Validated (Auth Module)
- **File:** `apps/api/src/auth/strategies/google.strategy.ts:57-73`
- **Issue:** `avatarUrl` stored without URL format/length validation. `fullName` has no max length (bypasses `RegisterDto` cap of 100).
- **Fix:** Add URL validation and length limits.

### M4. Invite Token Leakage in URL (Workspace Module)
- **File:** `apps/api/src/workspace/workspace.service.ts:777`
- **Issue:** Raw unhashed invite token placed in URL query parameter, logged in browser history and referrer headers.
- **Fix:** Shorter TTL, single-use enforcement, or use POST-based invite claim.

### M5. `listMembers` Does Not Validate Workspace Existence (Workspace Module)
- **File:** `apps/api/src/workspace/workspace.service.ts:176-222`
- **Issue:** Queries member/invite tables by `workspaceId` without validating the workspace exists, leaking existence information.
- **Fix:** Add workspace existence check.

### M6. `OWNER` Role Assignable via Invite/Add DTOs (Workspace Module)
- **File:** `apps/api/src/workspace/dto/*.ts`
- **Issue:** DTOs allow `role: z.enum(['OWNER', 'MEMBER']).default('MEMBER')`. An OWNER can accidentally assign `OWNER` role to new members.
- **Fix:** Restrict to `MEMBER` only; use separate endpoint for promoting.

### M7. Duplicate Invite Race Condition (Workspace Module)
- **File:** `apps/api/src/workspace/workspace.service.ts:755-778`
- **Issue:** Between revoking pending invites and creating a new one, a concurrent request can create a duplicate pending invite.
- **Fix:** Add unique constraint on `(workspaceId, email, status)`.

### M8. `ForbiddenException` Used for Missing Header (Workspace Module)
- **File:** `apps/api/src/workspace/workspace.guard.ts:26`
- **Issue:** Missing `x-workspace-id` header throws `ForbiddenException` (403) instead of `BadRequestException` (400).
- **Fix:** Use correct HTTP status code.

### M9. Mixed Validation Libraries (Zod vs class-validator) (Workspace, Attachments)
- **Files:** `apps/api/src/workspace/dto/change-member-role.dto.ts`, `apps/api/src/attachments/dto/*.ts`
- **Issue:** Some DTOs use `class-validator` while others use Zod via `nestjs-zod`, causing inconsistent error response formats.
- **Fix:** Standardize on Zod.

### M10. `as any` Type Casts Throughout Services (Workspace Module)
- **File:** `apps/api/src/workspace/workspace.service.ts:210, 212, 213, 320-322`
- **Issue:** Multiple `as any` casts to access Prisma properties that should be correctly typed.
- **Fix:** Use properly typed Prisma select payloads.

### M11. N+1 in Batch Invite (Workspace Module)
- **File:** `apps/api/src/workspace/workspace.service.ts:476-483`
- **Issue:** Sequential DB operations for each email in batch invite (50 max = 50+ round trips).
- **Fix:** Batch member-check and revoke operations.

### M12. Guard Execution Order Not Guaranteed (Workspace Module)
- **File:** `apps/api/src/roles/roles.guard.ts:44-55`
- **Issue:** `RolesGuard` redundantly queries DB when `WorkspaceGuard` is also applied. NestJS does not guarantee guard execution order.
- **Fix:** Have `RolesGuard` trust `workspaceContext` from `WorkspaceGuard` when present.

### M13. Notification Failures Silently Swallowed (Task Module)
- **File:** `apps/api/src/task/task.service.ts:176-188, 601-611`
- **Issue:** Empty catch blocks `catch {}` silently drop all errors including programming bugs.
- **Fix:** Log the error at minimum.

### M14. `description` and `descriptionJson` Can Drift Out of Sync (Task Module)
- **Files:** `apps/api/src/task/dto/update-task.dto.ts`, `apps/api/src/task/task.service.ts:~340`
- **Issue:** If only `description` is updated, `descriptionPlaintext` is not updated. The two fields can become inconsistent.
- **Fix:** Derive `descriptionPlaintext` from `description` when `descriptionJson` is not provided, or require both to be updated together.

### M15. No Max Limit on `assigneeIds`/`tagIds` Arrays (Task Module)
- **File:** `apps/api/src/task/dto/create-task.dto.ts:12-13`
- **Issue:** Arrays can be arbitrarily large, enabling large DB writes.
- **Fix:** Add `.max(50)` validation.

### M16. Board Reorder Does N Individual Updates in Transaction (Task Module)
- **File:** `apps/api/src/task/task.service.ts:~873`
- **Issue:** Iterates over `orderedTaskIds` and performs one `tx.task.update` per task inside a transaction. Poor performance for large boards.
- **Fix:** Use `updateMany` with `CASE` expression or `executeRaw`.

### M17. `complete`/`uncomplete` Fire Even When Task Already in That State (Task Module)
- **File:** `apps/api/src/task/task.service.ts:465, 482`
- **Issue:** No early return if task is already completed/incomplete, firing unnecessary activity logs and DB updates.
- **Fix:** Add early return with no-op.

### M18. `descriptionJson` Schema Too Permissive (Task, Docs Modules)
- **Files:** `apps/api/src/task/dto/create-task.dto.ts:7`, `apps/api/src/docs/dto/create-doc.dto.ts:12`
- **Issue:** `z.record(z.string(), z.unknown())` allows any flat key-value object, not validating Tiptap/ProseMirror document structure.
- **Fix:** Add schema validation for expected document shape.

### M19. SSE Backpressure Not Handled (Comments Module)
- **File:** `apps/api/src/common/sse/sse.service.ts:57-69`
- **Issue:** If a client is slow to consume events, `res.write()` buffers indefinitely in memory.
- **Impact:** Memory leak.
- **Fix:** Check `res.write()` return value and handle drain.

### M20. N+1 Permission Queries in Doc Search (Docs Module)
- **File:** `apps/api/src/docs/doc-search.service.ts:34-41`
- **Issue:** For each search result, `resolveEffectiveRole` makes up to 2 DB queries. With 50 results = 100 additional queries.
- **Fix:** Batch the permission queries.

### M21. Unescaped HTML in Email Templates (Common Library)
- **File:** `libs/common/src/email/email.service.ts:140, 159, 190`
- **Issue:** Values like `fullName`, `workspaceName` interpolated directly into HTML without escaping. User-controlled content can inject HTML.
- **Fix:** HTML-escape all interpolated values.

### M22. `CORS_ORIGINS` Env Var Defined But Never Consumed (Config)
- **File:** `apps/api/src/config/cors.config.ts`
- **Issue:** `.env.example` defines `CORS_ORIGINS` but `buildCorsOptions` hardcodes `origin: true`.
- **Fix:** Parse and use `CORS_ORIGINS` for origin validation.

### M23. Migration Race Condition on Simultaneous Container Start (Docker)
- **File:** `docker-compose.yml:42`
- **Issue:** `prisma migrate deploy` runs on every API container start. Two simultaneous containers can cause migration race conditions.
- **Fix:** Run migrations as a separate one-shot service.

### M24. `start:prod` Script Has Wrong Output Path (Config)
- **File:** `package.json:17`
- **Issue:** `"start:prod": "node dist/apps/api/apps/api/src/main"` -- extra `apps/api/src` segment. Should be `dist/apps/api/main`.
- **Fix:** Correct the path.

### M25. S3 Key Path Traversal via Unsanitized fileName (Attachments Module)
- **File:** `apps/api/src/attachments/attachments.service.ts:59-64`
- **Issue:** `sanitizedFileName` only replaces whitespace. No sanitization for path traversal sequences like `../`.
- **Impact:** Arbitrary S3 prefix writes.
- **Fix:** Strip path traversal characters, validate filename.

### M26. SSE Stream Resource Exhaustion (Notifications Module)
- **File:** `apps/api/src/notifications/notifications.controller.ts:93-135`
- **Issue:** No rate limiting on how many SSE connections a single user can open.
- **Impact:** DoS via file descriptor exhaustion.
- **Fix:** Add per-user connection limits.

### M27. `listAttachmentsForTask` Missing Actor Authorization (Attachments Module)
- **File:** `apps/api/src/attachments/attachments.service.ts:195-220`
- **Issue:** `actorId` parameter accepted but never used for authorization check.
- **Impact:** Information disclosure.
- **Fix:** Verify `actorId` matches the member's `userId`.

---

## Low Priority Issues

### L1. Duplicate Validation in Login Guard (Auth Module)
- **File:** `apps/api/src/auth/guards/local-auth.guard.ts:12-13`
- **Issue:** Guard manually parses body with `LoginSchema.parse` before Passport, duplicating global `ZodValidationPipe`.
- **Fix:** Remove duplicate validation or ensure consistent error shapes.

### L2. Unsafe Request Type Casts for Cookies (Auth Module)
- **File:** `apps/api/src/auth/auth.controller.ts:133, 160`
- **Issue:** `(req as unknown as { cookies?: Record<string, string> }).cookies` pattern repeated.
- **Fix:** Extract to a helper method or add module augmentation for `Express.Request`.

### L3. AuthService Spec File Mocks `EmailService` Absence (Auth Module)
- **File:** `apps/api/src/auth/auth.service.spec.ts`
- **Issue:** Test casts with `as never` to suppress type error. Tests for `register` will crash at runtime.
- **Fix:** Mock `EmailService` properly.

### L4. Inconsistent Transaction Styles (Auth Module)
- **File:** `apps/api/src/auth/auth.service.ts:109, 299-308`
- **Issue:** `verifyEmail` uses callback-style transaction, `resetPassword` uses array-style.
- **Fix:** Standardize on callback style for safety.

### L5. ZodError Not Caught by Global Exception Filter (Auth Module)
- **File:** `apps/api/src/auth/guards/local-auth.guard.ts:13`
- **Issue:** `LoginSchema.parse` throws `ZodError` (not `BadRequestException`). Whether it renders correctly depends on global exception filter.
- **Fix:** Ensure `GlobalExceptionFilter` handles `ZodError`.

### L6. Race Condition on Email Verification (Auth Module)
- **File:** `apps/api/src/auth/auth.service.ts:109-120`
- **Issue:** Between token lookup and transaction execution, a user could be soft-deleted. Transaction's `user.update` does not re-check `deletedAt: null`.
- **Fix:** Add `deletedAt: null` check in transaction update.

### L7. No Token Reuse Detection (Auth Module)
- **File:** `apps/api/src/auth/auth.service.ts:220-256`
- **Issue:** Token rotation implemented, but no detection/alerting for concurrent use of consumed token (indicator of compromise).
- **Fix:** Log and alert on token reuse detection.

### L8. `forgotPassword` Silently Returns for Google-Only Accounts (Auth Module)
- **File:** `apps/api/src/auth/auth.service.ts:269`
- **Issue:** `if (!user || !user.passwordHash) return;` silently returns for Google-only accounts with no feedback.
- **Fix:** Consider sending a different email explaining Google sign-in.

### L9. `as any` Cast in Organization Controller (Workspace Module)
- **File:** `apps/api/src/workspace/organizations.controller.ts:84`
- **Issue:** `dto.role as any` circumvents type safety.
- **Fix:** Use properly typed enum.

### L10. Hardcoded Role Strings (Workspace Module)
- **File:** `apps/api/src/workspace/workspace.controller.ts:138, 155, 172, 189, 206, 223`
- **Issue:** `@Roles('OWNER')` uses hardcoded string literals throughout.
- **Fix:** Use a constant or enum.

### L11. N+1 Query Pattern in `sendBatchInvites` (Workspace Module)
- **File:** `apps/api/src/workspace/workspace.service.ts:476-483`
- **Issue:** Sequential DB operations for each email.
- **Fix:** Batch operations.

### L12. Duplicated Fallback Logic for memberId vs userId (Workspace Module)
- **File:** `apps/api/src/workspace/workspace.service.ts:242-271, 798-811, 843-855`
- **Issue:** Pattern of trying `memberId` then falling back to `userId` repeated in multiple methods.
- **Fix:** Extract to a private helper method.

### L13. `FavoritesService` Optional but Typed as Required (Task, Project Modules)
- **Files:** `apps/api/src/task/task.service.ts:90`, `apps/api/src/project/project.service.ts:24`
- **Issue:** Optional dependency with `?` in constructor does not make it truly optional at DI level.
- **Fix:** Use `@Inject(FavoritesService) @Optional()`.

### L14. Magic Number `1000` for Position Increment Scattered (Task Module)
- **File:** `apps/api/src/task/task.service.ts:716, 726, 734, 808, 1109`
- **Issue:** Position increment value `1000` appears in multiple places.
- **Fix:** Extract to a constant.

### L15. `toDetail` Assumes `taskIdPrefix` Always Exists (Task Module)
- **File:** `apps/api/src/task/task.service.ts:1056`
- **Issue:** If `taskIdPrefix` is null, resulting `taskId` would be `"null-104"`.
- **Fix:** Handle null case or enforce NOT NULL in schema.

### L16. Duplicate `q` and `search` Alias Handling (Task Module)
- **File:** `apps/api/src/task/dto/list-tasks-query.dto.ts:73`
- **Issue:** If both `q` and `search` are provided with different values, `q` wins silently.
- **Fix:** Warn or reject duplicate conflicting values.

### L17. `GlobalExceptionFilter` ZodError Type-Assertion Risk (Common Library)
- **File:** `libs/common/src/filters/global-exception.filter.ts:60-61`
- **Issue:** Manual type assertion duplicates ZodError shape instead of using the imported `ZodError` type.
- **Fix:** Use the already-imported `ZodError` type.

### L18. `EmailService.send` Swallows All Errors Silently (Common Library)
- **File:** `libs/common/src/email/email.service.ts:63-68`
- **Issue:** No mechanism to surface repeated email delivery failures.
- **Fix:** Emit a metric or implement circuit-breaker pattern.

### L19. `PrismaService` Does Not Handle `$connect` Failure Gracefully (Database Library)
- **File:** `libs/database/src/prisma.service.ts:27`
- **Issue:** If `$connect()` throws, module initialization fails with generic error.
- **Fix:** Wrap in try/catch with clear error message.

### L20. `GlobalExceptionFilter` HttpException Response Parsing Incomplete (Common Library)
- **File:** `libs/common/src/filters/global-exception.filter.ts:90-96`
- **Issue:** When `message` is an array (NestJS default), it is silently dropped.
- **Fix:** Handle array case.

### L21. `PrismaService` Uses `as string` on `DATABASE_URL` (Database Library)
- **File:** `libs/database/src/prisma.service.ts:12`
- **Issue:** `as string` cast suppresses TypeScript error, fails silently at runtime.
- **Fix:** Throw early with clear message.

### L22. `bootstrap()` Uses `console.error` and `process.exit` (Config)
- **File:** `apps/api/src/main.ts:26-29`
- **Issue:** Bypasses Winston logger and prevents `onModuleDestroy` hooks.
- **Fix:** Use `Logger.error()` and `await app.close()`.

### L23. No Health Check Endpoint Registered
- **File:** `apps/api/src/health/health.dto.ts` (exists but no controller/service)
- **Issue:** Health directory contains only a DTO. No controller or route for `/health`.
- **Fix:** Implement health controller with DB connectivity check.

### L24. `.dockerignore` Does Not Exclude `.env`
- **File:** `.dockerignore`
- **Issue:** `.env` not in `.dockerignore`, so it ends up in development Docker image.
- **Fix:** Add `.env` to `.dockerignore`.

### L25. Zod v4 with `nestjs-zod` Compatibility Uncertainty
- **File:** `package.json`
- **Issue:** Zod v4 is a major rewrite. `nestjs-zod` may not fully support Zod v4 API changes.
- **Fix:** Verify compatibility or pin to Zod v3.x.

### L26. Duplicate `contentJson` Normalization in REST and WebSocket Paths (Docs Module)
- **File:** `apps/api/src/docs/docs.service.ts`
- **Issue:** REST `update` calls `normalizeDocContent()` directly while `autosave()` also calls it. Not a bug but inconsistent.
- **Fix:** Ensure both paths use the same normalization logic.

### L27. `docId` Format Not Validated in WebSocket Gateway (Docs Module)
- **File:** `apps/api/src/docs/docs.gateway.ts`
- **Issue:** `requireString` only checks non-empty string, not UUID. Arbitrary strings can be used as doc IDs.
- **Fix:** Add UUID validation.

### L28. `$queryRawUnsafe` Used for Full-Text Search (Docs Module)
- **File:** `apps/api/src/docs/doc-search.service.ts:44, 118`
- **Issue:** Method name `Unsafe` is misleading even though parameters are properly bound.
- **Fix:** Consider using `$queryRaw` with `Prisma.sql` template literals.

### L29. Inconsistent `reactFace` Trimming (Comments Module)
- **File:** `apps/api/src/comments/comments.service.ts:310`
- **Issue:** `updateReaction` does not trim `reactFace` while `addReaction` does.
- **Impact:** Inconsistent data (`"like"` vs `" like "`).
- **Fix:** Trim in both places.

### L30. `updateReaction` Broadcasts With Potentially Null `taskId` (Comments Module)
- **File:** `apps/api/src/comments/comments.service.ts:313-315`
- **Issue:** If `taskId` is null, SSE broadcast silently fails.
- **Fix:** Log the failure.

### L31. `removeChannelMember` Transaction Returns `undefined` (Channels Module)
- **File:** `apps/api/src/channels/channels.service.ts:243-254`
- **Issue:** Transaction does not return anything, variable name `deleted` is misleading.
- **Fix:** Return the deleted record or rename variable.

### L32. `changePassword` Access Tokens Remain Valid After Password Change (User Module)
- **File:** `apps/api/src/user/user.service.ts:267-281`
- **Issue:** Access tokens issued before password change remain valid until expiry. No token blacklist.
- **Fix:** Consider token versioning or blacklist.

### L33. `applyDefaultTemplate` Overwrites Existing Status Config (Status Module)
- **File:** `apps/api/src/status/status.service.ts:262-310`
- **Issue:** When a status already exists matching a template name, the method silently overwrites custom configurations.
- **Fix:** Skip or warn when status already exists.

### L34. Empty Catch Blocks in Notification Broadcasting (Notifications Module)
- **File:** `apps/api/src/notifications/notifications.controller.ts:72`
- **Issue:** `broadcastUpdatedNotification` silently catches and discards all errors.
- **Fix:** Log errors.

### L35. `includeArchived` Parameter Is No-Op (Task List Module)
- **File:** `apps/api/src/task-list/task-list.service.ts:281-293`
- **Issue:** `...(includeArchived ? {} : {})` always produces empty object regardless of parameter value.
- **Fix:** Implement proper filtering or remove parameter.

### L36. Uses `any` Type in Notifications Service
- **File:** `apps/api/src/notifications/notifications.service.ts:6-8`
- **Issue:** `NotificationLike` type uses `[key: string]: any` index signature.
- **Fix:** Define proper type interface.

### L37. Duplicate Code: `resolveWorkspaceMember` Pattern
- **Files:** attachments, task-list, notifications, workspace services
- **Issue:** Pattern of "find by id first, then by userId" duplicated across multiple services.
- **Fix:** Extract to a shared utility in `@app/common`.

### L38. `LOG_LEVEL` String Comparison Case-Sensitive
- **File:** `apps/api/src/app.module.ts:44-46`
- **Issue:** `process.env['LOG_LEVEL'] === 'full'` is case-sensitive. Misspelling like `'Full'` silently disables middleware.
- **Fix:** Use `.toLowerCase()`.

### L39. `EmailService` `fromAddress` Hardcoded Fallback
- **File:** `libs/common/src/email/email.service.ts:17`
- **Issue:** Fallback `'Dashboard <noreply@swiftnine.com>'` may not have proper SPF/DKIM for Resend.
- **Fix:** Require `EMAIL_FROM` or use Resend-verified domain.

---

## Summary by Module

| Module | Critical | High | Medium | Low | Total |
|--------|----------|------|--------|-----|-------|
| **Auth** | 3 | 0 | 4 | 6 | 13 |
| **Workspace** | 2 | 4 | 8 | 5 | 19 |
| **Task** | 2 | 3 | 5 | 4 | 14 |
| **Docs** | 2 | 5 | 3 | 3 | 13 |
| **Comments** | 0 | 1 | 2 | 2 | 5 |
| **Config/Infra** | 1 | 4 | 3 | 5 | 13 |
| **Common/Database Lib** | 0 | 0 | 3 | 4 | 7 |
| **Project** | 0 | 1 | 0 | 2 | 3 |
| **Task List** | 0 | 1 | 0 | 2 | 3 |
| **Attachments** | 0 | 0 | 3 | 1 | 4 |
| **Notifications** | 0 | 0 | 2 | 2 | 4 |
| **Channels** | 0 | 0 | 0 | 1 | 1 |
| **Status** | 0 | 0 | 0 | 2 | 2 |
| **User** | 0 | 0 | 0 | 1 | 1 |
| **Total** | **10** | **18** | **35** | **40** | **103** |

---

## Recommendations by Priority

### Immediate Action Required (Critical)
1. Fix access token exposure in OAuth callback
2. Add OTP and login brute-force protection
3. Add `WorkspaceGuard` to `getMember` endpoint
4. Fix concurrent `claimInvite` race condition
5. Lock down CORS to specific origins
6. Add lock/conflict detection to REST doc update
7. Add authorization check to `removeAssignee`
8. Fix soft-delete cascade for sub-subtasks
9. Add WebSocket rate limiting

### High Priority (Next Sprint)
1. Add `WorkspaceGuard` to organization endpoints
2. Add self-removal / last-owner protection
3. Cascade workspace soft-delete to members/invites
4. Add rate limiting to public invite endpoints
5. Fix position race conditions in task creation
6. Fix activity log `entityId` bugs
7. Fix WebSocket CORS and permission checks
8. Fix duplicate presence snapshot
9. Fix same-user lock overwrite
10. Fix SSE stream error handling in comments
11. Add global rate limiting on auth endpoints
12. Enforce JWT secrets in Docker Compose
13. Guard Swagger UI in production
14. Restrict or remove Prisma Studio
15. Cascade task list and project deletes to related entities

### Medium Priority (Technical Debt)
1. Harden OTP hashing with HMAC
2. Wrap reset token rotation in transaction
3. Validate Google profile fields
4. Secure invite token handling
5. Validate workspace existence in `listMembers`
6. Restrict OWNER role assignment in DTOs
7. Fix duplicate invite race condition
8. Fix HTTP status codes in guards
9. Standardize on Zod validation
10. Remove `as any` type casts
11. Batch invite operations
12. Fix guard execution order dependency
13. Log notification errors
14. Fix `description`/`descriptionJson` sync
15. Add array length limits
16. Optimize board reorder with bulk updates
17. Add early returns for idempotent operations
18. Validate `descriptionJson` schema
19. Handle SSE backpressure
20. Batch doc search permission queries
21. HTML-escape email template values
22. Wire up `CORS_ORIGINS` env var
23. Fix migration race condition
24. Fix `start:prod` script path
25. Sanitize S3 filenames
26. Add SSE connection limits
27. Add actor authorization to attachment listing

### Low Priority (Maintenance)
- Clean up duplicate validation and type casts
- Fix test mocks
- Standardize transaction styles
- Extract shared utilities
- Add health check endpoint
- Verify Zod v4 compatibility
- Improve error handling in email service
- Clean up dead code and no-op parameters
