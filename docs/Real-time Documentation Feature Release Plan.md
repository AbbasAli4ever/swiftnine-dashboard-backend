# Real-time Documentation Feature Release Plan

> Built on top of `docs/Real-time Documentation Feature.md`.
> Goal: ship the complete docs feature in small, mergeable chunks with minimal file conflicts and clear verification gates.
> Date: 2026-04-28

---

## Release Strategy

This feature should be released through additive vertical slices, not one large branch. The first slices create the docs domain in isolation, then later slices touch shared modules (`Attachment`, `Mention`, `TaskService`, app dependencies) only when the docs module is already stable.

Use one branch or PR per chunk below. Each chunk owns a narrow file set. Avoid parallel work on the same chunk unless the write scopes are explicitly separated.

**Core rule:** keep `apps/api/src/docs/**` as the main work area. Shared files are touched in short, planned integration chunks only.

---

## Dependency And Conflict Map

| Area | Shared Files | Conflict Risk | Plan |
|---|---|---:|---|
| Database models | `prisma/schema.prisma` | High | One schema PR early. No other PR edits Prisma until merged. |
| App registration | `apps/api/src/app.module.ts` | Medium | Register `DocsModule` once in Chunk 1.2. Later chunks edit only `docs.module.ts`. |
| Attachments | `prisma/schema.prisma`, `apps/api/src/attachments/**` | Medium | Add doc ownership in one focused chunk after Doc CRUD. |
| Mentions | `prisma/schema.prisma`, `apps/api/src/comments/**`, `apps/api/src/notifications/**` | Medium | Keep task comments unchanged; add docs mention service separately. |
| Task live cards | `apps/api/src/task/task.service.ts`, `package.json`, `app.module.ts` | High | One task-event audit chunk near the end of collaboration work. |
| WebSocket infra | `package.json`, `docs/**`, `main.ts` if adapter needed | Medium | Install and wire socket dependencies before gateway implementation. |
| Export infra | `package.json`, S3/config docs | Medium | Validate Chromium separately before PDF work. |

---

## Phase 0 - Preparation

### Chunk 0.1 - Baseline Audit

**Purpose:** lock down current behavior before adding a large feature.

**Files touched:** none, or only docs if findings are recorded.

**Work:**
- Run current unit test suite.
- Confirm Prisma generate works.
- Confirm current comments, attachments, notifications, task CRUD, workspace/project guards are green.
- Record any existing failures in the PR description so they are not confused with docs regressions.

**Verification:**
- `npm test`
- `npm run build`
- `npm run db:generate`

**Exit criteria:** known-good baseline or known failing tests documented.

---

## Phase 1 - Data Foundation

### Chunk 1.1 - Docs Prisma Schema

**Purpose:** add the database shape in one controlled migration.

**Primary owner files:**
- `prisma/schema.prisma`
- generated Prisma migration

**Work:**
- Add enums:
  - `DocScope`: `WORKSPACE`, `PROJECT`, `PERSONAL`
  - `DocRole`: `VIEWER`, `COMMENTER`, `EDITOR`, `OWNER`
  - `DocVersionType`: `AUTO`, `MANUAL`, `RESTORE_SAFETY`
- Add models:
  - `Doc`
  - `DocVersion`
  - `DocPermission`
  - `DocCommentThread`
  - `DocComment`
  - `DocShareLink`
- Add relations to `User`, `Workspace`, and `Project`.
- Add `plaintext` as `String @default("")`.
- Add regular indexes first.
- Add Postgres full-text search index in the migration SQL manually because Prisma schema support for `tsvector` is limited.

**Do not include yet:**
- `Attachment.docId`
- `Mention.docId`
- runtime services

**Verification:**
- `npm run db:migrate`
- `npm run db:generate`
- `npm run build`

**Exit criteria:** schema compiles and generated client exposes docs models.

---

### Chunk 1.2 - Docs Module Skeleton

**Purpose:** create a safe home for all later docs work.

**Primary owner files:**
- `apps/api/src/docs/**`
- `apps/api/src/app.module.ts`

**Work:**
- Add `DocsModule`.
- Register it once in `AppModule`.
- Add placeholder services:
  - `DocsService`
  - `DocPermissionsService`
  - `DocSearchService`
- Add constants for role rank and inherited role mapping.
- Add basic DTO folder using the repo's current `class-validator`/DTO style.

**Verification:**
- `npm run build`

**Exit criteria:** app builds with an empty docs module registered.

---

## Phase 2 - REST CRUD And Permissions

### Chunk 2.1 - Permission Resolution

**Purpose:** make one authoritative permission resolver before exposing endpoints.

**Primary owner files:**
- `apps/api/src/docs/doc-permissions.service.ts`
- `apps/api/src/docs/doc-permissions.constants.ts`
- `apps/api/src/docs/guards/**`
- `apps/api/src/docs/doc-permissions.service.spec.ts`

**Work:**
- Implement `resolveEffectiveRole(userId, doc)`.
- Support workspace, project, personal, and per-doc override roles.
- Add helpers:
  - `assertCanView`
  - `assertCanComment`
  - `assertCanEdit`
  - `assertCanOwn`
- Add guard classes or service-backed guard helpers for controllers.

**Verification:**
- Unit tests for:
  - owner personal docs
  - workspace inherited access
  - project inherited access
  - override upgrade
  - no membership denied

**Exit criteria:** permissions are independently testable.

---

### Chunk 2.2 - Doc CRUD And Listing

**Purpose:** unblock frontend screens without realtime.

**Primary owner files:**
- `apps/api/src/docs/docs.controller.ts`
- `apps/api/src/docs/docs.service.ts`
- `apps/api/src/docs/dto/**`
- `apps/api/src/docs/docs.service.spec.ts`

**Endpoints:**
- `POST /docs`
- `GET /docs`
- `GET /docs/:id`
- `PATCH /docs/:id`
- `DELETE /docs/:id`

**Work:**
- Enforce mandatory title, max 256 chars.
- Enforce max 1MB `contentJson`.
- Store `workspaceId` on all docs, including personal docs.
- On every content write:
  - validate TipTap JSON is an object
  - normalize block IDs
  - update `plaintext`
  - increment `version`
- Soft delete via `deletedAt`.
- Return consistent response DTOs.

**Verification:**
- Unit tests for CRUD.
- Controller tests for access checks.
- `npm run build`

**Exit criteria:** docs can be created, read, listed, updated, and soft deleted through REST.

---

### Chunk 2.3 - Search V1

**Purpose:** ship scoped search after CRUD and permission logic are stable.

**Primary owner files:**
- `apps/api/src/docs/doc-search.service.ts`
- `apps/api/src/docs/docs.controller.ts`
- migration SQL if search index was deferred

**Endpoint:**
- `GET /docs/search?q=...&workspaceId=...&projectId=...`

**Work:**
- Implement plaintext extraction from TipTap JSON.
- Use Postgres `websearch_to_tsquery`.
- Restrict results by workspace/project and effective view permission.
- Return snippets when possible.

**Verification:**
- Unit tests for plaintext extraction.
- Integration-style service test for permission-filtered results.

**Exit criteria:** search returns only viewable docs.

---

## Phase 3 - Attachments And Inline Images

### Chunk 3.1 - Doc Attachment Ownership

**Purpose:** extend attachments with doc ownership without breaking task attachments.

**Primary owner files:**
- `prisma/schema.prisma`
- migration
- `apps/api/src/attachments/**`
- `apps/api/src/docs/doc-attachments.*` if separated

**Work:**
- Change `Attachment.taskId` to nullable.
- Add nullable `Attachment.docId`.
- Add relation from `Doc` to attachments.
- Add DB-level check in migration: exactly one of `task_id` or `doc_id` must be set.
- Add S3 prefix support for docs: `attachments/doc-{docId}`.
- Add doc attachment create/list/delete methods guarded by doc editor/viewer access.
- Keep existing task attachment API behavior unchanged.

**Verification:**
- Existing attachment tests still pass.
- New tests for doc attachment ownership and access.
- `npm run db:migrate`
- `npm run build`

**Exit criteria:** docs can use S3-backed images/files and task attachments remain compatible.

---

## Phase 4 - Realtime Infrastructure

### Chunk 4.1 - WebSocket Dependencies And Gateway Shell

**Purpose:** add socket runtime separately from business logic.

**Primary owner files:**
- `package.json`
- `package-lock.json`
- `apps/api/src/docs/docs.gateway.ts`
- `apps/api/src/docs/docs.module.ts`

**Dependencies to add if not already present:**
- `@nestjs/websockets`
- `@nestjs/platform-socket.io`
- `socket.io`

**Work:**
- Create `/docs` namespace gateway.
- Validate JWT from handshake `auth.token`.
- Validate public share token shape later; return unsupported until share links exist.
- Add connection and disconnect logging.
- Add no-op `doc:join` handler that checks view access.

**Verification:**
- `npm install`
- `npm run build`
- Gateway unit test for rejected missing token.

**Exit criteria:** socket gateway boots but does not yet save content.

---

### Chunk 4.2 - Presence And Locks

**Purpose:** implement in-memory collaboration state before autosave.

**Primary owner files:**
- `apps/api/src/docs/doc-presence.service.ts`
- `apps/api/src/docs/doc-locks.service.ts`
- `apps/api/src/docs/docs.gateway.ts`
- `apps/api/src/docs/*spec.ts`

**Events:**
- `doc:join`
- `doc:leave`
- `doc:lock-block`
- `doc:lock-heartbeat`
- `doc:unlock-block`

**Work:**
- Track room presence by `docId` and socket ID.
- Track locks by `docId`, `blockId`, and `userId`.
- Lock TTL: 30 seconds.
- Heartbeat interval expected from client: 10 seconds.
- Release locks on leave and disconnect.
- Add cleanup interval for expired locks.
- Add single-instance code comments where state is memory-only.

**Verification:**
- Unit tests for:
  - lock acquired
  - lock rejected by different user
  - heartbeat extends TTL
  - owner disconnect releases locks

**Exit criteria:** clients can see presence and lock state with no persistence changes.

---

### Chunk 4.3 - Autosave And Conflict Enforcement

**Purpose:** ship the main realtime save behavior.

**Primary owner files:**
- `apps/api/src/docs/docs.service.ts`
- `apps/api/src/docs/docs.gateway.ts`
- `apps/api/src/docs/doc-blocks.util.ts`
- `apps/api/src/docs/docs.service.spec.ts`

**Events:**
- `doc:autosave`
- `doc:saved`
- `doc:save-conflict`

**Work:**
- Implement block extraction/diff utilities.
- Enforce content size limit.
- Enforce block ID uniqueness and assign IDs to missing/duplicate block IDs.
- Use database transaction for doc row update.
- Reject changes to modified/deleted blocks not locked by the saving user.
- Reject stale saves when the stale server-side block changes intersect with client changes.
- Throttle max 1 autosave/sec/user/doc in memory.
- Mark orphan comment threads when anchor blocks disappear.

**Verification:**
- Tests for:
  - different locked blocks can save
  - unlocked modified block rejects
  - stale non-overlapping save accepted or handled by defined merge behavior
  - stale overlapping save rejects
  - deleted anchored block orphans thread

**Exit criteria:** soft realtime editing is usable with conflict protection.

---

## Phase 5 - Comments And Mentions

### Chunk 5.1 - Doc Comment Threads

**Purpose:** add inline/page-level comments without touching existing task comments.

**Primary owner files:**
- `apps/api/src/docs/doc-comments.controller.ts`
- `apps/api/src/docs/doc-comments.service.ts`
- `apps/api/src/docs/dto/**`
- `apps/api/src/docs/docs.gateway.ts`

**Endpoints:**
- `POST /docs/:id/threads`
- `GET /docs/:id/threads?resolved=false`
- `POST /threads/:id/comments`
- `PATCH /threads/:id/resolve`
- `DELETE /comments/:id`

**Events:**
- `doc:thread-created`
- `doc:comment-added`
- `doc:thread-resolved`

**Work:**
- Support anchored and doc-level threads.
- Store plain text comment bodies.
- Allow thread resolve by commenter/editor policy from the spec.
- Broadcast thread mutations to the doc room.

**Verification:**
- Tests for create/list/reply/resolve/delete.
- Permission tests for viewer/commenter/editor.

**Exit criteria:** threaded comments work over REST and realtime broadcast.

---

### Chunk 5.2 - Doc Mentions And Notifications

**Purpose:** reuse existing notification behavior while avoiding regressions in task comments.

**Primary owner files:**
- `prisma/schema.prisma`
- migration
- `apps/api/src/docs/doc-mentions.service.ts`
- `apps/api/src/docs/doc-comments.service.ts`
- `apps/api/src/docs/docs.service.ts`
- `apps/api/src/notifications/notifications.service.ts` only if payload enrichment requires docs links

**Work:**
- Make `Mention.commentId` nullable.
- Add nullable `Mention.docId` and `Mention.docCommentId`.
- Add uniqueness indexes for each context:
  - task comment mention
  - doc content mention
  - doc comment mention
- Parse TipTap mention nodes on autosave.
- Parse mention markers from doc comment body.
- Diff mentions per context so unchanged mentions are not re-notified.
- Create notifications with `referenceType` values like `doc` and `doc_comment`.

**Verification:**
- Existing task mention tests still pass.
- New tests prove no duplicate notifications on repeated autosave.

**Exit criteria:** @mentions notify users from docs and doc comments.

---

## Phase 6 - Versions

### Chunk 6.1 - Manual Versions And Compare

**Purpose:** ship user-driven history first.

**Primary owner files:**
- `apps/api/src/docs/doc-versions.controller.ts`
- `apps/api/src/docs/doc-versions.service.ts`
- `apps/api/src/docs/doc-blocks.util.ts`

**Endpoints:**
- `POST /docs/:id/versions`
- `GET /docs/:id/versions`
- `GET /docs/:id/versions/compare?a=:vid&b=:vid`

**Work:**
- Snapshot current `contentJson`.
- No-op manual save if unchanged since last manual version.
- List versions newest first.
- Compare two versions with block-level added/removed/modified output.

**Verification:**
- Unit tests for no-op manual save and block diff output.

**Exit criteria:** users can save and inspect named versions.

---

### Chunk 6.2 - Restore And Auto Checkpoints

**Purpose:** finish version lifecycle.

**Primary owner files:**
- `apps/api/src/docs/doc-versions.service.ts`
- `apps/api/src/docs/doc-snapshot.cron.ts`
- `apps/api/src/docs/docs.gateway.ts`
- `package.json` if `@nestjs/schedule` is needed

**Dependencies to add if not already present:**
- `@nestjs/schedule`

**Endpoint:**
- `POST /docs/:id/versions/:versionId/restore`

**Work:**
- Before restore, create a `RESTORE_SAFETY` snapshot.
- Replace doc content/title-related searchable text as needed.
- Increment doc version.
- Broadcast synthetic `doc:saved`.
- Add cron every 5 minutes to create 20-minute auto checkpoints when changed.

**Verification:**
- Tests for restore safety snapshot.
- Tests for cron eligibility logic.

**Exit criteria:** manual and automatic history is complete.

---

## Phase 7 - Live Task Cards

### Chunk 7.1 - Task Reference Registry

**Purpose:** track task cards in docs without touching `TaskService` yet.

**Primary owner files:**
- `apps/api/src/docs/doc-task-bridge.service.ts`
- `apps/api/src/docs/docs.gateway.ts`
- `apps/api/src/docs/docs.service.ts`

**Work:**
- Extract `taskCard.attrs.taskId` from doc content.
- Maintain in-memory maps:
  - `docId -> Set<taskId>`
  - `taskId -> Set<docId>`
- Populate on `doc:join`.
- Refresh on `doc:saved`.

**Verification:**
- Unit tests for extraction and registry updates.

**Exit criteria:** docs gateway knows which docs reference which tasks.

---

### Chunk 7.2 - Task Update Events

**Purpose:** connect task changes to doc rooms in one focused shared-module edit.

**Primary owner files:**
- `package.json`
- `package-lock.json`
- `apps/api/src/app.module.ts`
- `apps/api/src/task/task.service.ts`
- `apps/api/src/docs/doc-task-bridge.service.ts`

**Dependencies to add if not already present:**
- `@nestjs/event-emitter`

**Work:**
- Register `EventEmitterModule`.
- Inject `EventEmitter2` into `TaskService`.
- Audit every successful task mutation path.
- Emit `task.updated` with `{ taskId, fields }` after mutation commits.
- Subscribe in `DocTaskBridgeService`.
- Broadcast `doc:task-card-updated` to active doc rooms that reference the task.

**Verification:**
- Unit tests for at least one representative update path.
- Audit checklist in PR:
  - create
  - update title/description/status/priority/dates
  - reorder
  - assign/unassign
  - tag add/remove
  - subtask changes
  - delete/restore if supported

**Exit criteria:** embedded task cards receive live update events.

---

## Phase 8 - Public Sharing

### Chunk 8.1 - Share Link REST

**Purpose:** add token management before anonymous socket support.

**Primary owner files:**
- `apps/api/src/docs/doc-share-links.controller.ts`
- `apps/api/src/docs/doc-share-links.service.ts`
- `apps/api/src/docs/dto/**`

**Endpoints:**
- `POST /docs/:id/share-links`
- `DELETE /docs/:id/share-links/:id`
- `GET /public/docs/:token`

**Work:**
- Generate cryptographically secure token.
- Support `VIEWER` and `COMMENTER`.
- Support expiration and revocation.
- Return public doc payload without private permission data.

**Verification:**
- Tests for expired/revoked links.
- Tests that public links cannot expose non-doc workspace data.

**Exit criteria:** anonymous read flow works through REST.

---

### Chunk 8.2 - Public WS And Rate Limits

**Purpose:** allow public viewers/commenters into realtime safely.

**Primary owner files:**
- `apps/api/src/docs/docs.gateway.ts`
- `apps/api/src/docs/doc-share-links.service.ts`
- `package.json` if throttler is needed

**Dependencies to add if not already present:**
- `@nestjs/throttler`

**Work:**
- Accept handshake `auth.shareToken`.
- Treat share users as anonymous viewer/commenter identities.
- Public viewers cannot lock or autosave.
- Public commenters can comment only if link role is `COMMENTER`.
- Rate limit public doc reads by IP.

**Verification:**
- Gateway tests for public viewer denied lock.
- Gateway tests for revoked token denied.

**Exit criteria:** share links work for public read/comment with realtime updates.

---

## Phase 9 - Export

### Chunk 9.1 - Markdown Export

**Purpose:** ship low-risk export first.

**Primary owner files:**
- `apps/api/src/docs/doc-export.service.ts`
- `apps/api/src/docs/docs.controller.ts`
- `apps/api/src/docs/doc-markdown-renderer.ts`

**Endpoint:**
- `POST /docs/:id/export?format=md`

**Work:**
- Implement TipTap JSON to Markdown renderer.
- Support headings, paragraphs, marks, lists, quotes, code, tables, images, attachments, embeds, task cards as links.
- Stream or return file response.

**Verification:**
- Golden output tests for supported node types.

**Exit criteria:** Markdown export is complete for v1 nodes.

---

### Chunk 9.2 - PDF Export

**Purpose:** add headless rendering after environment validation.

**Primary owner files:**
- `package.json`
- `package-lock.json`
- `apps/api/src/docs/doc-export.service.ts`
- `apps/api/src/docs/doc-html-renderer.ts`

**Dependencies to add after validation:**
- `puppeteer-core`
- `@sparticuz/chromium` if deployment environment requires it

**Work:**
- Validate production/runtime support for headless Chromium before coding.
- Render TipTap JSON to safe HTML.
- Convert HTML to PDF.
- Return file stream or signed S3 URL for large outputs.

**Verification:**
- Renderer unit tests.
- One local smoke test that produces a non-empty PDF.

**Exit criteria:** PDF export works in the intended runtime.

---

## Phase 10 - Frontend Contract Documentation

### Chunk 10.1 - API And Protocol Docs

**Purpose:** make frontend integration deterministic.

**Primary owner files:**
- `docs/docs-feature/00-overview.md`
- `docs/docs-feature/01-rest-api.md`
- `docs/docs-feature/02-websocket-protocol.md`
- `docs/docs-feature/04-doc-json-schema.md`
- `docs/docs-feature/07-error-catalog.md`

**Work:**
- Document all shipped REST endpoints and response shapes.
- Document all WS events and payloads.
- Document auth modes: JWT and share token.
- Document error codes and FE recovery behavior.

**Verification:**
- Compare docs against implemented controllers/gateway.

**Exit criteria:** frontend can implement against docs without reading backend code.

---

### Chunk 10.2 - Integration Recipes

**Purpose:** reduce frontend mistakes around locks, autosave, and conflicts.

**Primary owner files:**
- `docs/docs-feature/03-tiptap-integration.md`
- `docs/docs-feature/05-realtime-flows.md`
- `docs/docs-feature/06-permissions-cheatsheet.md`
- `docs/docs-feature/08-conflict-handling.md`
- `docs/docs-feature/09-public-share.md`
- `docs/docs-feature/10-snippets.md`

**Work:**
- Add TipTap extension requirements.
- Add sequence diagrams.
- Add role/action table.
- Add reconnect, lock retry, and save conflict recipes.
- Add TypeScript snippets for socket, autosave, and locks.

**Verification:**
- Review with frontend engineer before frontend starts P2/P3 integration.

**Exit criteria:** frontend integration has clear UX and protocol guidance.

---

## Phase 11 - Hardening And Release

### Chunk 11.1 - Security And Limits Pass

**Purpose:** catch data leaks and abuse cases before release.

**Work:**
- Confirm every REST endpoint checks effective doc permission.
- Confirm every WS event checks role before state mutation.
- Confirm public share payload excludes private membership and permission rows.
- Confirm content size limit is enforced in REST and WS.
- Confirm attachment access cannot cross workspace boundaries.
- Confirm search cannot return inaccessible docs.

**Verification:**
- Permission matrix tests.
- Negative tests for cross-workspace access.

**Exit criteria:** no known access-control gaps.

---

### Chunk 11.2 - End-to-End Release Smoke

**Purpose:** verify feature works as a complete workflow.

**Smoke flow:**
1. Create workspace doc.
2. Add rich content, table, image attachment, task card, mention.
3. Open same doc as second user.
4. User A locks one block.
5. User B is rejected from that block but can edit another.
6. Autosaves broadcast between users.
7. Add comment thread and reply.
8. Save manual version.
9. Restore previous version.
10. Search for doc text.
11. Create public commenter link.
12. Anonymous user reads and comments.
13. Export Markdown.
14. Export PDF.

**Verification:**
- `npm test`
- `npm run build`
- targeted integration tests if available

**Exit criteria:** release candidate is ready.

---

## Suggested PR Order

1. `docs-prisma-foundation`
2. `docs-module-skeleton`
3. `docs-permissions`
4. `docs-crud-list`
5. `docs-search`
6. `docs-attachments`
7. `docs-ws-shell`
8. `docs-presence-locks`
9. `docs-autosave-conflicts`
10. `docs-comments`
11. `docs-mentions-notifications`
12. `docs-versions-manual`
13. `docs-versions-restore-cron`
14. `docs-task-reference-registry`
15. `docs-task-update-events`
16. `docs-share-links`
17. `docs-public-ws-rate-limits`
18. `docs-export-markdown`
19. `docs-export-pdf`
20. `docs-frontend-contract`
21. `docs-release-hardening`

---

## Parallel Work Guide

These can run in parallel after their dependencies are merged:

| Workstream | Can Start After | Avoid Touching |
|---|---|---|
| Version APIs | Chunk 2.2 | Realtime gateway files unless restore broadcasts are being added |
| Frontend docs draft | Chunk 4.1 | Controller/gateway implementation files |
| Markdown export | Chunk 2.2 | PDF dependencies |
| Share-link REST | Chunk 2.2 | Gateway auth until Chunk 8.2 |
| Task registry extraction | Chunk 4.3 | `TaskService` until Chunk 7.2 |

Do not parallelize:
- Prisma schema chunks with each other.
- `TaskService` event audit with unrelated task feature work.
- Gateway autosave work with presence/locks unless the same engineer owns both.

---

## Definition Of Done For Each Chunk

Every chunk should include:
- Tests for the new behavior or a written reason tests are not practical.
- `npm run build` passing.
- No unrelated formatting churn.
- No changes outside the chunk's owner files unless called out in the PR.
- Updated frontend contract docs if the chunk adds or changes a REST endpoint, WS event, DTO, or error shape.

---

## Deferred To Phase 2 After V1

- DOCX export.
- Redis-backed distributed locks/presence/pub-sub.
- Character-level cursors.
- Rich text comments.
- Comment reactions for docs.
- Nested subpages.
- Templates.
- Banner covers.

