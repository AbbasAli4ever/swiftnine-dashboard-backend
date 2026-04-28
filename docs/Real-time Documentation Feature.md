# Implementation Plan — Real-time Documentation Feature

> **Stack:** TipTap editor (no Yjs), soft real-time with block-level locking, NestJS WebSocket gateway, Postgres, S3. Single instance, no Redis.
> **Date:** 2026-04-28

---

## Locked Decisions

| # | Decision |
|---|---|
| Collab model | **Soft real-time.** Autosave full doc JSON every 2-3s of idle. Broadcast to other viewers over WebSocket. |
| Conflict model | **Block-level soft locks.** User acquires a lock on a block when focused. Others see "User X is editing this block" and that block renders read-only. Server enforces locks on save (reject edits to blocks not held by the saving user). |
| Editor | **TipTap** (no Yjs collab extension). |
| Doc hierarchy | Docs live at **workspace level**, **project level**, and as **personal private docs** (all carry `workspaceId`). |
| Page structure | **Single page — no subpage nesting.** |
| v1 features | ✅ Rich text (bold/italic/headings/lists/quotes/code), tables, inline images (S3), file attachments, embedded live task cards, embedded media (YouTube/Loom/Figma), slash menu, inline+threaded comments, @mentions, public share link, PDF+Markdown export, full-text search. ❌ Banner cover, ❌ templates, ❌ DOCX (phase 2). |
| Versioning | Manual "Save version" button + automatic 20-min checkpoint (only when doc changed since last checkpoint). Retention: forever. Diff + restore UI required. |
| Permissions | Inherit from parent (workspace/project roles) + per-doc overrides (`VIEWER \| COMMENTER \| EDITOR \| OWNER`). |
| Concurrent editors | 2-5 per doc. |
| Infra | Single Nest instance. No Redis. S3 reused for images/attachments. |
| WS auth | JWT access token passed in handshake `auth.token`. Validated via existing `authService.findActiveAuthUser(...)`. Public-share connections use handshake `auth.shareToken`. |

---

## 1. Prisma Schema Additions

| Model | Purpose | Key Fields |
|---|---|---|
| `Doc` | The document | `id`, `title`, `scope` (`WORKSPACE \| PROJECT \| PERSONAL`), `workspaceId` (always set), `projectId?`, `ownerId`, `contentJson` (Jsonb), `plaintext` (text, denormalized for search), `searchVector` (tsvector, GIN-indexed), `version` (int, increments on save), `lastCheckpointAt`, `createdAt`, `updatedAt`, `deletedAt` |
| `DocVersion` | Snapshot history | `id`, `docId`, `contentJson` (Jsonb), `type` (`AUTO \| MANUAL`), `label?`, `createdById`, `createdAt` |
| `DocPermission` | Per-doc role overrides | `id`, `docId`, `userId`, `role` (`VIEWER \| COMMENTER \| EDITOR \| OWNER`), `grantedById`, `createdAt`. Unique `(docId, userId)`. |
| `DocCommentThread` | Inline/page-level thread | `id`, `docId`, `anchorBlockId?`, `anchorMeta` (Jsonb — `{ charStart, charEnd }`), `resolved`, `isOrphan`, `createdById`, `createdAt` |
| `DocComment` | Single comment in a thread | `id`, `threadId`, `authorId`, `body`, `createdAt`, `updatedAt`, `deletedAt` |
| `DocShareLink` | Public share token | `id`, `docId`, `token` (unique), `role` (`VIEWER \| COMMENTER`), `expiresAt?`, `createdById`, `revokedAt?` |

**Additional model changes (existing models):**
- `Attachment` — add nullable `docId`. One model, two owner types (task or doc).
- `Mention` — add nullable `docId` and `docCommentId`. Same model, more contexts.

**Not in Prisma (in-memory only):**
- Block locks — `DocLocksService` holds `Map<docId, Map<blockId, { userId, expiresAt }>>`. TTL 30s, heartbeat 10s. Cleared on server restart (acceptable — single instance).
- Presence — `DocPresenceService` holds `Map<docId, Map<socketId, { userId, name, avatarUrl }>>`.

---

## 2. Module Structure

```
apps/api/src/docs/
  docs.module.ts
  docs.controller.ts              # REST: CRUD, list
  docs.service.ts                 # doc read/write + block-level merge
  docs.gateway.ts                 # WebSocket
  doc-versions.controller.ts      # GET list, manual save, restore, diff
  doc-versions.service.ts
  doc-comments.controller.ts      # threads + replies + resolve
  doc-comments.service.ts
  doc-share-links.controller.ts   # create/revoke, public read
  doc-share-links.service.ts
  doc-permissions.service.ts      # inherit + override resolution
  doc-locks.service.ts            # in-memory block locks
  doc-presence.service.ts         # in-memory presence
  doc-export.service.ts           # PDF / Markdown
  doc-search.service.ts           # tsvector queries
  doc-snapshot.cron.ts            # 20-min checkpoint job
  doc-task-bridge.service.ts      # task.updated events → WS broadcasts
  dto/                            # Zod schemas
  guards/                         # DocViewerGuard, DocEditorGuard, etc.
```

**Existing code touched in exactly three places:**
1. `Attachment` model — add `docId?`
2. `Mention` model — add `docId?`, `docCommentId?`
3. `TaskService` — emit `task.updated` via `EventEmitter2` after any task mutation (one line per write path)

---

## 3. WebSocket Gateway

**Namespace:** `/docs`  
**Rooms:** `doc:{docId}`

### Client → Server Events

| Event | Payload | Effect |
|---|---|---|
| `doc:join` | `{ docId }` | Join room. Server replies with presence snapshot + lock snapshot. |
| `doc:leave` | `{ docId }` | Leave room. Release all locks held by this user in this doc. |
| `doc:lock-block` | `{ docId, blockId }` | Acquire soft lock (30s TTL). Rejected if already locked by another user. |
| `doc:lock-heartbeat` | `{ docId, blockId }` | Refresh lock TTL (send every 10s while editing). |
| `doc:unlock-block` | `{ docId, blockId }` | Release lock (on blur). |
| `doc:autosave` | `{ docId, contentJson, baseVersion }` | Persist + broadcast. See §4. |

### Server → Client Events

| Event | Payload | Notes |
|---|---|---|
| `doc:presence-snapshot` | `{ users: [{ userId, name, avatarUrl, locks: [blockId] }] }` | On join |
| `doc:user-joined` | `{ userId, name, avatarUrl }` | Broadcast to room |
| `doc:user-left` | `{ userId }` | Broadcast to room |
| `doc:block-locked` | `{ blockId, userId }` | Broadcast to room |
| `doc:block-unlocked` | `{ blockId, userId }` | Broadcast to room |
| `doc:lock-rejected` | `{ blockId, lockedBy: { userId, name } }` | Only to requester |
| `doc:saved` | `{ contentJson, version, savedAt, savedBy }` | Broadcast to all *other* clients in room |
| `doc:save-conflict` | `{ conflictBlockIds, reason }` | Only to the saving client |
| `doc:thread-created` | thread payload | Broadcast to room |
| `doc:comment-added` | comment payload | Broadcast to room |
| `doc:thread-resolved` | `{ threadId }` | Broadcast to room |
| `doc:task-card-updated` | `{ taskId, fields: { ... } }` | Broadcast to rooms that reference this task |

---

## 4. Autosave + Block-Level Merge

This is the only mechanically complex part of the design. Lives in `docs.service.ts::applyAutosave`.

```
on doc:autosave({ docId, contentJson, baseVersion }) by user U:

  serverDoc = load Doc with FOR UPDATE lock

  if serverDoc.version !== baseVersion:
    // a concurrent save landed since this client last synced
    // compute which blocks changed server-side since baseVersion
    if those changes intersect the blocks the client modified:
      → emit doc:save-conflict to client
      → client refreshes from latest doc:saved and retries
      return

  diff = blockDiff(serverDoc.contentJson, contentJson)
  // diff = { modified: blockId[], added: Block[], deleted: blockId[] }

  for each blockId in diff.modified ∪ diff.deleted:
    if DocLocksService does not show U holding that blockId in this doc:
      → emit doc:save-conflict { conflictBlockIds: [blockId] }
      return

  // merge is safe
  serverDoc.contentJson = contentJson
  serverDoc.version += 1
  serverDoc.updatedAt = now()
  recompute plaintext + searchVector
  persist

  broadcast doc:saved to room (excluding U)
```

**Block identity** comes from TipTap's `UniqueID` extension — every block must carry a stable `id` attribute. If a block arrives without one (copy-paste from outside), the server assigns one and treats it as `added`.

**Why store full JSON, not per-block rows:** One query on read. Export is trivial. At v1 doc sizes (<1MB limit) this is fine. Decomposition to block rows is a straightforward migration if needed later.

**Hard limit:** contentJson > 1MB → reject with HTTP 413.  
**Throttle:** server accepts max 1 autosave/sec/user per doc.

---

## 5. Versioning

| Operation | Endpoint | Behavior |
|---|---|---|
| Manual save | `POST /docs/:id/versions { label? }` | Snapshots current `contentJson`, `type=MANUAL`. No-op if nothing changed since last manual version. |
| List versions | `GET /docs/:id/versions` | Paginated, newest first. |
| Diff two versions | `GET /docs/:id/versions/compare?a=:vid&b=:vid` | Returns both JSONs + server-computed block-level diff `{ added, removed, modified }`. FE handles visual rendering. |
| Restore | `POST /docs/:id/versions/:versionId/restore` | 1) Auto-snapshot current state as pre-restore safety. 2) Replace `contentJson` with version's. 3) Broadcast synthetic `doc:saved`. |

**Auto checkpoint cron** (`doc-snapshot.cron.ts`):
- Runs every 5 minutes.
- For each doc where `updatedAt > lastCheckpointAt` AND the last auto-version is older than 20 min: create `DocVersion` with `type=AUTO`, update `lastCheckpointAt`.

**Retention:** forever. No cleanup job needed.

---

## 6. Permissions Resolution

`DocPermissionsService.resolveEffectiveRole(userId, doc)` → `OWNER | EDITOR | COMMENTER | VIEWER | null`

```
if scope === PERSONAL:
  base = (userId === doc.ownerId) ? OWNER : null
else:
  base = projectRoleToDocRole(membership) | workspaceRoleToDocRole(membership)

override = DocPermission row for (doc, user)
effective = max(base, override?.role)   // rank: OWNER > EDITOR > COMMENTER > VIEWER > null

// For public share connections: role comes from DocShareLink.role, bypasses above.
```

**Default inheritance map** (defined in `doc-permissions.constants.ts`):

| Workspace/Project Role | Effective Doc Role |
|---|---|
| OWNER | OWNER |
| ADMIN | EDITOR |
| MEMBER | EDITOR |
| GUEST | VIEWER |

**Guards:** `DocViewerGuard`, `DocCommenterGuard`, `DocEditorGuard`, `DocOwnerGuard`. WS gateway calls the same service in its connection middleware.

---

## 7. Inline / Threaded Comments

- Anchor: `{ blockId, charStart, charEnd }` stored in `anchorMeta` Jsonb.
- Doc-level threads (no anchor) are also supported — for general page comments.
- **Orphan handling:** on autosave, if a thread's `anchorBlockId` is no longer in `contentJson`, set `isOrphan=true`. Thread stays visible in the side panel without a location indicator.
- Comment edits allowed at any time; track `editedAt`.
- WS broadcasts `doc:thread-created`, `doc:comment-added`, `doc:thread-resolved` to the room on every mutation.

**REST:**
```
POST   /docs/:id/threads         { anchorBlockId?, anchorMeta?, body }
GET    /docs/:id/threads          ?resolved=false
POST   /threads/:id/comments      { body }
PATCH  /threads/:id/resolve
DELETE /comments/:id              (soft delete)
```

---

## 8. Mentions Integration

Reuse existing `Mention` model. Add nullable `docId`, `docCommentId`.

When a comment body is saved or doc is autosaved:
1. Walk JSON / parse comment body for TipTap `mention` nodes (`attrs.userId`).
2. Diff against existing `Mention` rows for that context — avoid re-notifying unchanged mentions.
3. Create new `Mention` rows.
4. Emit `Notification` via the existing notification module.

---

## 9. Embedded Live Task Cards

**TipTap custom node:** `taskCard` with `attrs.taskId`.

**Backend wiring:**
- `DocsGateway` maintains `Map<docId, Set<taskId>>` — populated from `contentJson` on `doc:join`, updated on each `doc:saved`.
- `DocTaskBridgeService` subscribes to `task.updated` via `EventEmitter2`. On each event: find all doc rooms that reference the updated `taskId`, broadcast `doc:task-card-updated` to those rooms.
- **Change required in `TaskService`:** after any successful task write, emit `{ type: 'task.updated', taskId, fields }` via `EventEmitter2`. One line per write path. Mark with a comment so future contributors know to do the same.

No DB hit per broadcast — purely in-memory lookup.

---

## 10. Public Share Links

```
POST   /docs/:id/share-links     { role: VIEWER|COMMENTER, expiresAt? }   → { token, url }
DELETE /docs/:id/share-links/:id  (revoke — sets revokedAt)
GET    /public/docs/:token        (anonymous, no JWT)
```

- Anonymous WS connection: handshake `{ shareToken }`. Validated against `DocShareLink`. Treated as anonymous viewer/commenter depending on link role. Cannot acquire locks (commenter role — commenting only, no editing).
- Rate-limit `/public/docs/:token` per IP via `@nestjs/throttler`.

---

## 11. Export Pipeline

| Format | Approach | Phase |
|---|---|---|
| **Markdown** | Custom JSON→MD walker mapping each TipTap node type. Tables → GFM. Embeds → MD links with metadata fence. | v1 |
| **PDF** | JSON → HTML (server-side render) → PDF via `puppeteer-core` + `@sparticuz/chromium`. | v1 |
| **DOCX** | JSON → DOCX via `docx` npm package. Custom mapper for every node type. | Phase 2 |

```
POST /docs/:id/export?format=md|pdf|docx
→ returns file stream or signed S3 URL for large outputs
```

**Honest assessment:** DOCX mapping for all supported node types (tables, embeds, code blocks) is ~3-5 days of mapping work on its own. Recommend deferring to phase 2.

**Validate before building:** confirm the production hosting environment can run headless Chromium (memory + binary). If serverless, `@sparticuz/chromium` is required. Test this before the PDF task begins.

---

## 12. Full-Text Search

- `Doc.plaintext` — denormalized text column. Populated on every autosave by walking the JSON tree and concatenating all text nodes.
- `Doc.searchVector` — `tsvector` generated from `plaintext + title`. GIN index.
- `websearch_to_tsquery` for query. `ts_headline` for result snippets.
- Scoped by workspace + permission filter (only docs the user can view).

```
GET /docs/search?q=...&workspaceId=...&projectId=...
```

v1 only. Meilisearch/Elastic deferred until result quality requires it.

---

## 13. Phasing

| Phase | Deliverables | Dependency |
|---|---|---|
| **P1 — Foundation** | Prisma models, REST CRUD for docs, permissions model + guards, doc attachments, plaintext + search column, list + search endpoints. No realtime. | None. Unblocks FE immediately. |
| **P2 — Real-time** | WS gateway, presence, block locks, autosave with block-level merge, conflict events. | P1 |
| **P3 — Collab** | Threaded comments + REST, @mentions + notifications, embedded live task cards + task bridge. | P2 |
| **P4 — Versioning** | Manual versions, 20-min cron, diff API, restore. | P1 (can run in parallel with P2/P3) |
| **P5 — Sharing & Export** | Public share links, Markdown export, PDF export, search endpoints. | P1 |
| **P6 — DOCX** | DOCX export. | P5 |

No feature flags needed — greenfield, no existing users.

---

## 14. Documentation Deliverables for the Frontend Engineer

Living location: **`docs/docs-feature/`** in this repo.

| File | Contents |
|---|---|
| `00-overview.md` | Architecture diagram + glossary (Doc, Block, Lock, Presence, Thread, ShareLink). 5-min read. |
| `01-rest-api.md` | Auto-generated OpenAPI/Swagger reference. All endpoints, DTOs, status codes. |
| `02-websocket-protocol.md` | Full event catalog (both directions). Every event: trigger, TypeScript payload interface, error cases, reconnection semantics, heartbeat cadence. |
| `03-tiptap-integration.md` | Required TipTap extensions, custom node definitions (`taskCard`, `mention`, embed nodes). Autosave debounce wiring. How to acquire/release locks on `onFocus`/`onBlur`. |
| `04-doc-json-schema.md` | Every supported block type by TipTap node name. Required attributes (especially `id` from `UniqueID` — non-negotiable). Custom node schemas. |
| `05-realtime-flows.md` | Mermaid sequence diagrams: (a) opening a doc, (b) two users editing different blocks, (c) lock conflict, (d) save conflict, (e) embedded task card live update, (f) reconnection. |
| `06-permissions-cheatsheet.md` | Table: each role × each UI action (edit, comment, resolve thread, share, export, restore version) → show/hide. |
| `07-error-catalog.md` | Every 4xx/5xx HTTP error + every WS error event. Meaning. Recommended FE handling. |
| `08-conflict-handling.md` | Specific UX recipe for `doc:save-conflict` and `doc:lock-rejected`: what state to roll back, what to show the user, retry strategy. |
| `09-public-share.md` | Public link flow, unauthenticated WS connection, which features are disabled in share mode. |
| `10-snippets.md` | Copy-pasteable TypeScript for: socket connect, autosave hook, lock manager hook, comment thread component skeleton. |

**Maintenance rule:** every new WS event or REST endpoint added post-v1 must update `02-websocket-protocol.md` or `01-rest-api.md` in the same PR.

---

## 15. Open Risks

| Risk | Mitigation |
|---|---|
| TipTap `UniqueID` duplicates on copy/paste | Backend validates block ID uniqueness on save; reassigns duplicates. Verify no FE flow produces collisions before P2 ships. |
| Lock TTL tuning | Start at 30s TTL + 10s heartbeat. Adjust based on observed editing behavior. |
| Puppeteer/Chromium on production host | Validate before P5. If serverless, use `@sparticuz/chromium`. |
| Single-instance assumption undocumented | Add startup warning if `INSTANCE_COUNT > 1`. Mark lock/presence/broadcast code with `// NOTE: single-instance only — needs Redis pub/sub to scale out`. |
| Save conflict rate | Should be near-zero with block-level locks + 2-5 editors. If >1% of saves conflict, re-examine locking model. |
| Task event emission completeness | Audit all `TaskService` write paths before P3. Every path must emit `task.updated`. |
| DOCX scope | Confirmed deferred to P6. Raise if it becomes a v1 requirement. |

---

## Assumptions

```
1. Doc title is mandatory, ≤256 chars.
2. contentJson hard limit: 1MB per doc. Saves exceeding this are rejected with 413.
3. Personal docs carry workspaceId. They appear in the user's Private section
   of that workspace (ClickUp-style).
4. Block lock TTL = 30s, heartbeat = 10s. Tunable.
5. Autosave debounce on FE = 2s idle. Server accepts max 1 save/sec/user.
6. No real-time cursor tracking — only block-level "X is editing this block."
   Character-level cursor sharing contradicts the soft-realtime model chosen.
7. Search is workspace-scoped.
8. Comments support plain text + @mentions only in v1. No rich text in comments.
9. No reactions on doc comments in v1 (existing Reaction model not extended).
10. MD + PDF export ship in v1. DOCX ships in P6.
```
