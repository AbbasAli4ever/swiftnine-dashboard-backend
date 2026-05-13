# Project-Level Attachments — Feature Plan

Status: Proposed
Owner: TBD
Last updated: 2026-05-13

## Overview

Add a project-level "Attachments" view (a sibling of List view and Board view) where workspace members can upload files and add external links as project resources. This is for docs, reference material, design files, and similar — things that belong to the project as a whole rather than to a single task.

Scope is intentionally minimal: flat list, no folders, reuse the existing `Attachment` table and S3 pipeline.

---

## Requirements (locked in)

| Topic | Decision |
|---|---|
| Data model | Reuse existing `Attachment` table — add nullable `projectId` |
| Organization | Flat list. No folders, no tags |
| Resource types | Uploaded files (S3) **and** external links (URL + title/description) |
| Permissions | Mirror task attachments: any project member uploads; uploader + workspace OWNER/ADMIN can delete |
| View placement | New project-level view at `GET /projects/:id/attachments`, sibling of List/Board |
| Upload limits | Same as existing task attachments (no new limits) |
| Link metadata | URL + user-provided title/description only. **No** server-side OG fetching |
| Filtering | By type (file/link), by uploader, text search on filename/title |
| Global search | Project attachments included in workspace-wide search |
| Lifecycle | Cascade with project (soft delete with parent; existing S3 GC handles cleanup) |
| Activity log | Yes — log `attachment.uploaded`, `attachment.linked`, `attachment.deleted` |
| Realtime | No — clients refetch on focus. No socket events |
| Password gate | Apply `ProjectUnlockedGuard` (consistent with locked-project feature) |

---

## Schema changes

### `Attachment` (extend, single migration)

```prisma
model Attachment {
  id               String    @id @default(uuid())
  taskId           String?   @map("task_id")
  docId            String?   @map("doc_id")
  channelMessageId String?   @map("channel_message_id")
  projectId        String?   @map("project_id")          // NEW
  uploadedBy       String    @map("uploaded_by")
  fileName         String    @map("file_name")
  s3Key            String?   @unique @map("s3_key")      // CHANGED: now nullable for link-type rows
  mimeType         String?   @map("mime_type")           // CHANGED: nullable for links
  fileSize         BigInt?   @map("file_size")           // CHANGED: nullable for links
  kind             AttachmentKind @default(FILE)         // NEW
  linkUrl          String?   @map("link_url")            // NEW
  title            String?                               // NEW — for links; optional override for files
  description      String?                               // NEW — for links
  createdAt        DateTime  @default(now()) @map("created_at")
  deletedAt        DateTime? @map("deleted_at")

  task           Task?           @relation(fields: [taskId], references: [id], onDelete: Cascade)
  doc            Doc?            @relation(fields: [docId], references: [id], onDelete: Cascade)
  channelMessage ChannelMessage? @relation(fields: [channelMessageId], references: [id], onDelete: Cascade)
  project        Project?        @relation(fields: [projectId], references: [id], onDelete: Cascade)  // NEW
  uploader       User            @relation(fields: [uploadedBy], references: [id])

  @@index([taskId])
  @@index([docId])
  @@index([channelMessageId])
  @@index([projectId])                                   // NEW
  @@map("attachments")
}

enum AttachmentKind {                                    // NEW
  FILE
  LINK
}
```

### `Project` (add relation)

```prisma
attachments Attachment[]
```

### DB invariants enforced at the service layer

- Exactly one of `taskId | docId | channelMessageId | projectId` must be set.
- If `kind == FILE` → `s3Key`, `mimeType`, `fileSize` required; `linkUrl` null.
- If `kind == LINK` → `linkUrl` required; `s3Key`/`mimeType`/`fileSize` null.

(Could be added as DB `CHECK` constraints later if we want hard enforcement, but service-layer is sufficient for now.)

### Migration

Single Prisma migration:
- Add `projectId`, `kind`, `linkUrl`, `title`, `description` columns.
- Relax `s3Key`, `mimeType`, `fileSize` to nullable.
- Add `attachments_project_id_idx`.
- No backfill — all existing rows are `kind = FILE` (enum default) and have null `projectId`.

---

## Module layout

Extend the **existing** `AttachmentsModule` rather than creating a new module. The S3 / presign / delete plumbing is identical.

```
apps/api/src/attachments/
├── attachments.controller.ts           # add project endpoints
├── attachments.service.ts              # add project-scoped methods
├── dto/
│   ├── presign-project-attachment.dto.ts          # NEW
│   ├── create-project-link.dto.ts                 # NEW
│   ├── confirm-project-attachment.dto.ts          # NEW (mirrors task confirm flow)
│   ├── list-project-attachments.query.dto.ts      # NEW — filters
│   └── delete-project-attachment.dto.ts           # NEW
```

No new module. Wire `ProjectUnlockedGuard` (from password-protection feature) when applying it to these routes.

---

## HTTP endpoints

| Method | Path | Guards | Purpose |
|---|---|---|---|
| `POST`   | `/projects/:id/attachments/presign`  | Jwt, ProjectMember, ProjectUnlocked | Get presigned S3 upload URL for a project file (mirrors task presign) |
| `POST`   | `/projects/:id/attachments/confirm`  | Jwt, ProjectMember, ProjectUnlocked | Confirm upload completed → create `Attachment` row with `kind = FILE`, `projectId = :id` |
| `POST`   | `/projects/:id/attachments/links`    | Jwt, ProjectMember, ProjectUnlocked | Create a `kind = LINK` attachment from URL + title + description |
| `GET`    | `/projects/:id/attachments`          | Jwt, ProjectMember, ProjectUnlocked | List + filter (see query params below) |
| `GET`    | `/projects/:id/attachments/:attachmentId` | Jwt, ProjectMember, ProjectUnlocked | Get single; for files returns presigned **view** URL |
| `PATCH`  | `/projects/:id/attachments/:attachmentId` | Jwt, ProjectMember, ProjectUnlocked | Update `title` / `description` only (uploader or admin) |
| `DELETE` | `/projects/:id/attachments/:attachmentId` | Jwt, ProjectMember, ProjectUnlocked | Soft-delete; uploader or workspace OWNER/ADMIN only |

### `GET /projects/:id/attachments` query params

| Param | Type | Notes |
|---|---|---|
| `kind` | `FILE` \| `LINK` \| omitted | Type filter |
| `uploadedBy` | userId | Filter to one uploader |
| `q` | string | Substring match against `fileName` (files) and `title` (links). Case-insensitive |
| `cursor` | string | Pagination — created_at + id |
| `limit` | number (default 50, max 100) | |

Sort: `createdAt DESC` always (no toggles in v1).

### Response shape (list item)

```ts
{
  id: string;
  kind: "FILE" | "LINK";
  title: string | null;
  description: string | null;
  uploadedBy: { id, name, avatarUrl };
  createdAt: string;

  // FILE only
  fileName?: string;
  mimeType?: string;
  fileSize?: number;
  viewUrl?: string; // presigned, short-lived

  // LINK only
  linkUrl?: string;
}
```

---

## Permission model (mirrors task attachments)

| Action | Allowed |
|---|---|
| Upload file / add link | Any workspace member with project access (+ active unlock if locked) |
| Update title/description | Uploader, workspace OWNER/ADMIN |
| Delete | Uploader, workspace OWNER/ADMIN |
| View / list | Any project member with active unlock |

Permissions enforced in `AttachmentsService` using the same helpers task-attachment paths already use. No new role logic.

---

## Service-layer changes (`attachments.service.ts`)

New methods, paralleling the existing task/doc methods:

- `presignProjectUpload(userId, projectId, dto)` → returns `{ uploadUrl, s3Key, expiresIn }`. Reuses existing presign helper, scoping the S3 key under `projects/{projectId}/attachments/{uuid}-{fileName}`.
- `confirmProjectUpload(userId, projectId, dto)` → verifies S3 object exists, creates `Attachment` row with `projectId` set, `kind = FILE`.
- `createProjectLink(userId, projectId, dto)` → validates URL (basic `https?://` check + max length), creates row with `kind = LINK`.
- `listProjectAttachments(userId, projectId, query)` → paginated query with filters; for FILE rows, attaches a presigned view URL (same TTL as existing list endpoints).
- `updateProjectAttachment(userId, projectId, attachmentId, dto)` → uploader or admin; only `title`/`description` mutable.
- `deleteProjectAttachment(userId, projectId, attachmentId)` → uploader or admin; soft delete (`deletedAt = now()`). S3 cleanup handled by the existing GC job that already sweeps soft-deleted attachments.

All methods enforce:
1. User is a member of the project's workspace and has access to the project.
2. (When applicable) project is unlocked — enforced by `ProjectUnlockedGuard` at controller level, no double-check needed in service.

---

## Activity logging

Write to `ActivityLog` (existing append-only table) with:

| Action | `entityType` | `entityId` | Extra |
|---|---|---|---|
| Upload file | `project_attachment` | attachment.id | `{ kind: "FILE", fileName }` |
| Add link | `project_attachment` | attachment.id | `{ kind: "LINK", linkUrl, title }` |
| Update meta | `project_attachment` | attachment.id | `{ field, old, new }` |
| Delete | `project_attachment` | attachment.id | `{ kind, fileName?\|linkUrl? }` |

Hooked at the service-layer write points. Reuses the same logger the rest of the app uses.

---

## Global search

The workspace-wide search (in [docs/dashboard-api.md](docs/dashboard-api.md) / whichever search service powers it) needs to include project attachments:

- Index: `fileName` (FILE), `title` (both), `description` (both), `linkUrl` (LINK).
- Result entity type: `project_attachment`.
- Respect the locked-project rule: filter out results where `projectId` is locked for the user and no active unlock exists. Same predicate used by notifications filtering.

(If search is currently DB-side `ILIKE`, this is just a `UNION ALL` on the search query. If it goes through a separate index, add this collection there.)

---

## Lifecycle & cleanup

- Project soft-delete (`Project.deletedAt`) → existing project deletion service must also soft-delete its attachments. Add a `prisma.attachment.updateMany({ where: { projectId }, data: { deletedAt: new Date() } })` call where projects are soft-deleted today.
- Hard delete (cascade) — already handled by `onDelete: Cascade` on the new relation.
- S3 cleanup — the existing GC job that walks `Attachment WHERE deletedAt IS NOT NULL` picks these up for free. No new worker.

---

## Tests

- `attachments.service.spec.ts` (extend):
  - presign / confirm file flow scoped to a project
  - create link with valid URL; reject invalid URL
  - permission matrix for update + delete (uploader vs admin vs other member)
  - list with each filter (`kind`, `uploadedBy`, `q`) and pagination cursor
  - soft delete + S3 GC eligibility flag set
- `attachments.controller.spec.ts` (extend):
  - 403 when project is locked and user has no unlock session (relies on `ProjectUnlockedGuard`)
  - 403 when user is not a project member
  - happy path: presign → confirm → appears in list
  - link creation appears in list with `kind = LINK`
- Migration smoke test: existing task/doc attachments remain readable with new nullable columns.

---

## Rollout

- One Prisma migration. Backwards-compatible:
  - Existing rows: `projectId = null`, `kind = FILE` (default), `linkUrl/title/description = null`. No behavior change.
  - Nullable `s3Key/mimeType/fileSize` is safe because no existing row has them null.
- No feature flag — endpoints are new paths; UI adds the view when ready.
- Frontend change: new "Attachments" tab in the project view; renders the list + upload + add-link affordances.

---

## Open assumptions (confirm before implementing)

1. The existing `AttachmentsModule` already exposes a presign + confirm pattern that we can reuse verbatim for project uploads (skimmed `attachments.controller.ts` — looks like presign is there; confirm step name/shape will follow the same convention).
2. "Workspace OWNER/ADMIN" matches the same role check used in current task-attachment delete logic. We reuse that helper, not invent a new one.
3. The global search layer is the same one referenced elsewhere in the codebase; if it's a separate indexed system (Meilisearch/Elastic) the indexing hook is a small additional task — flagged but not designed here.
4. Project-attachment routes will be added to the `ProjectUnlockedGuard`'s applied-routes list as part of the password feature rollout (or now if that feature ships first).
5. No need for download counters / view tracking in v1.
