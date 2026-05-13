# Project Attachments Feature Implementation Plan

Source spec: [project-attachments.md](project-attachments.md)

Status: Phase 7 complete
Owner: Codex
Last updated: 2026-05-13

## Ground Rules

- Do not use Aiden for this feature.
- Implement in phases so each chunk can be reviewed, tested, and shipped safely.
- Reuse the existing `AttachmentsModule`, S3 presign flow, activity logging, workspace membership model, and project password gate.
- Keep the API shape aligned with the spec while matching current backend conventions.
- Use `ProjectUnlockedGuard` on project-scoped attachment routes. Important: the guard currently reads `req.params.projectId`, so project attachment routes should use `:projectId`, not `:id`.
- Preserve existing task, doc, channel-message, workspace, and user attachment behavior.

## Codebase Understanding

### Existing Attachment System

Current files:

- `apps/api/src/attachments/attachments.module.ts`
- `apps/api/src/attachments/attachments.controller.ts`
- `apps/api/src/attachments/attachments.service.ts`
- `apps/api/src/attachments/dto/*`
- `apps/api/src/attachments/attachments.service.spec.ts`
- `prisma/schema.prisma`

Current behavior:

- Task attachments are confirmed through `POST /attachments`.
- Doc attachments are confirmed through `POST /attachments/docs`.
- Task/doc attachment viewing is handled through body-based routes:
  - `POST /attachments/view`
  - `POST /attachments/docs/view`
- Channel-message attachment presign creates a staged `Attachment` row with `channelMessageId: null`.
- S3 keys are currently scoped as:
  - `attachments/task-{taskId}/...`
  - `attachments/doc-{docId}/...`
  - `attachments/channel-{channelId}/...`
  - `attachments/workspace-{workspaceId}/...`
  - `attachments/user-{userId}/...`
- Existing S3 view URL TTL is 15 minutes.
- Existing upload presign TTL is 15 minutes.

### Current Attachment Schema

`Attachment` currently has required file columns:

- `s3Key String @unique`
- `mimeType String`
- `fileSize BigInt`

For project links, these must become nullable. Existing code assumes they are non-null in multiple places, so all conversion/view helpers must become kind-aware.

### Current Project Password Gate

Current files:

- `apps/api/src/project-security/guards/project-unlocked.guard.ts`
- `apps/api/src/project-security/project-security.service.ts`
- `apps/api/src/project-security/project-access-resolver.service.ts`

Important behavior:

- `ProjectUnlockedGuard` reads `req.params.projectId`.
- It requires `WorkspaceGuard` to run first because it reads `req.workspaceContext.workspaceId`.
- Project-scoped routes such as `TaskProjectTasksController` use:
  - `@Controller('projects/:projectId/tasks')`
  - `@UseGuards(JwtAuthGuard, WorkspaceGuard, ProjectUnlockedGuard)`

Project attachment routes should follow this same route/guard pattern.

### Current Permission Model

There is no dedicated project-member guard. Existing code generally enforces workspace membership through `WorkspaceGuard`, then service methods verify project ownership/access by querying project/list/doc/channel data scoped to the active workspace.

For this feature:

- Upload/list/view link/file: any active workspace member with access to the project.
- Update/delete: uploader or workspace `OWNER`/`ADMIN`.
- The controller can pass `req.workspaceContext.role` into service methods for update/delete checks.
- The service must verify the project belongs to `req.workspaceContext.workspaceId` and is not deleted.

### Current Global Search Reality

There is not one obvious unified workspace-wide global search service.

Existing search surfaces include:

- Tasks: `TaskService.findTasksByWorkspace`, `findTasksByProject`, `findTasksByList`.
- Docs: `DocSearchService`.
- Chat: `ChatService.searchMessages`.
- Activity: `ActivityService`.

Because the feature spec says "Project attachments included in workspace-wide search", implement an attachment-specific search/list surface first through project attachment listing, then add project-attachment search integration only where the current backend has an actual global search endpoint or service. If no unified global search endpoint exists, document that finding and add a clearly named service method that can be wired into the future unified search surface.

## Target API

Project attachment routes should live in a new controller inside the existing attachments module:

`apps/api/src/attachments/project-attachments.controller.ts`

Use:

```ts
@Controller('projects/:projectId/attachments')
@UseGuards(JwtAuthGuard, WorkspaceGuard, ProjectUnlockedGuard)
```

Endpoints:

| Method | Path | Purpose |
|---|---|---|
| `POST` | `/projects/:projectId/attachments/presign` | Presign project file upload |
| `POST` | `/projects/:projectId/attachments/confirm` | Confirm uploaded file and create `Attachment` row |
| `POST` | `/projects/:projectId/attachments/links` | Create external link attachment |
| `GET` | `/projects/:projectId/attachments` | List project attachments with filters |
| `GET` | `/projects/:projectId/attachments/:attachmentId` | Get a single attachment; files include short-lived view URL |
| `PATCH` | `/projects/:projectId/attachments/:attachmentId` | Update `title` and/or `description` |
| `DELETE` | `/projects/:projectId/attachments/:attachmentId` | Soft delete attachment |

Required header:

- `x-workspace-id: <workspaceId>`

Auth:

- Bearer JWT.

Password gate:

- Locked projects return the existing project security locked response through `ProjectUnlockedGuard`.

## Response Shape

List and single item should return:

```ts
{
  id: string;
  kind: 'FILE' | 'LINK';
  title: string | null;
  description: string | null;
  uploadedBy: {
    id: string;
    name: string | null;
    avatarUrl: string | null;
  };
  createdAt: string;
  fileName?: string;
  mimeType?: string;
  fileSize?: number;
  viewUrl?: string;
  linkUrl?: string;
}
```

Pagination should use the repo's existing `paginated(...)` response helper where practical.

## Phase 1: Schema And Prisma Foundation

Goal: make the database capable of representing project-level files and external links without breaking existing attachment behavior.

Files to touch:

- `prisma/schema.prisma`
- `prisma/migrations/<timestamp>_add_project_attachments/migration.sql`

Schema changes:

- Add enum:

```prisma
enum AttachmentKind {
  FILE
  LINK
}
```

- Extend `Attachment`:

```prisma
projectId   String?          @map("project_id")
s3Key       String?          @unique @map("s3_key")
mimeType    String?          @map("mime_type")
fileSize    BigInt?          @map("file_size")
kind        AttachmentKind   @default(FILE)
linkUrl     String?          @map("link_url")
title       String?
description String?
project     Project?         @relation(fields: [projectId], references: [id], onDelete: Cascade)
```

- Add `@@index([projectId])`.
- Add `attachments Attachment[]` relation to `Project`.

Migration requirements:

- Create enum `AttachmentKind`.
- Add nullable `project_id`, `link_url`, `title`, `description`.
- Add `kind` with default `FILE`.
- Relax `s3_key`, `mime_type`, and `file_size` to nullable.
- Add project foreign key with cascade.
- Add project index.

Code implications to handle later:

- Any TypeScript code that assumes `s3Key`, `mimeType`, and `fileSize` are always present must be updated before build passes.
- Existing task/doc/channel file rows should continue to have `kind = FILE`.

Validation:

```bash
rtk npm run db:generate
rtk npm run build
```

Exit criteria:

- Prisma client generates successfully.
- Build failures, if any, are only expected nullability follow-ups documented for Phase 2.

## Phase 2: DTOs, Controller, And Module Wiring

Goal: expose the project attachment API surface under `/projects/:projectId/attachments` with correct guards and Swagger docs.

Files to add:

- `apps/api/src/attachments/project-attachments.controller.ts`
- `apps/api/src/attachments/dto/presign-project-attachment.dto.ts`
- `apps/api/src/attachments/dto/confirm-project-attachment.dto.ts`
- `apps/api/src/attachments/dto/create-project-link.dto.ts`
- `apps/api/src/attachments/dto/list-project-attachments.query.dto.ts`
- `apps/api/src/attachments/dto/update-project-attachment.dto.ts`
- `apps/api/src/attachments/dto/project-attachment-response.dto.ts`
- `apps/api/src/attachments/dto/project-attachment-search-response.dto.ts` if needed by search phase

Files to update:

- `apps/api/src/attachments/attachments.module.ts`

Controller requirements:

- Add `ProjectAttachmentsController` to `AttachmentsModule.controllers`.
- Use `JwtAuthGuard`, `WorkspaceGuard`, and `ProjectUnlockedGuard`.
- Use `@Controller('projects/:projectId/attachments')`.
- Use `@ApiHeader({ name: 'x-workspace-id', required: true })`.
- Pass `req.user.id`, `req.workspaceContext.workspaceId`, `req.workspaceContext.role`, and `projectId` to the service.

DTO requirements:

- `PresignProjectAttachmentDto`
  - `fileName?: string`
  - `mimeType: string`
  - `fileSize?: number`
- `ConfirmProjectAttachmentDto`
  - `s3Key: string`
  - `fileName?: string`
  - `mimeType?: string`
  - `fileSize?: number`
  - `title?: string`
  - `description?: string`
- `CreateProjectLinkDto`
  - `linkUrl: string`
  - `title: string`
  - `description?: string`
- `ListProjectAttachmentsQueryDto`
  - `kind?: 'FILE' | 'LINK'`
  - `uploadedBy?: string`
  - `q?: string`
  - `cursor?: string`
  - `limit?: number`
- `UpdateProjectAttachmentDto`
  - `title?: string | null`
  - `description?: string | null`

Validation rules:

- Link URLs must be `http://` or `https://`.
- `limit` default is `50`; max is `100`.
- Trim text fields.
- Put reasonable max lengths on URL/title/description/search.

Exit criteria:

- Routes compile and are visible through Swagger metadata.
- Service methods can be stubbed or implemented in Phase 3.

Validation:

```bash
rtk npm run build
```

## Phase 3: Project Attachment Service Methods

Goal: implement the actual project attachment behavior in `AttachmentsService`.

Files to update:

- `apps/api/src/attachments/attachments.service.ts`
- Possibly `apps/api/src/attachments/attachments.service.spec.ts`

New service methods:

- `presignProjectUpload(userId, workspaceId, projectId, dto)`
- `confirmProjectUpload(userId, workspaceId, projectId, dto)`
- `createProjectLink(userId, workspaceId, projectId, dto)`
- `listProjectAttachments(userId, workspaceId, projectId, query)`
- `getProjectAttachment(userId, workspaceId, projectId, attachmentId)`
- `updateProjectAttachment(userId, workspaceId, role, projectId, attachmentId, dto)`
- `deleteProjectAttachment(userId, workspaceId, role, projectId, attachmentId)`

Shared helpers to add:

- `findProjectForAttachmentOrThrow(workspaceId, projectId)`
- `assertProjectAttachmentKey(projectId, s3Key)`
- `projectAttachmentPrefix(projectId)`
- `toProjectAttachmentResponse(att)`
- `assertCanManageProjectAttachment(userId, workspaceRole, attachment)`
- `normalizeProjectAttachmentLimit(limit)`
- `buildProjectAttachmentCursor(cursor)`

Project lookup:

- Query project by `{ id: projectId, workspaceId, deletedAt: null }`.
- Select `id`, `name`, `workspaceId`.
- If not found, throw `NotFoundException('Project not found')`.

Upload presign:

- S3 key prefix should be:

```txt
{AWS_S3_PREFIX}/attachments/project-{projectId}/{uuid}-{sanitizedFileName}
```

- Return `{ uploadUrl, s3Key, expiresAt }`.
- Do not create a row during presign for project files. Match task/doc confirm flow, not channel-message staged rows.

Confirm upload:

- Verify project exists in workspace.
- Verify `s3Key` starts with the project prefix.
- Resolve metadata with existing `resolveUploadedFileMetadata`.
- Create row:

```ts
{
  projectId,
  uploadedBy: userId,
  kind: 'FILE',
  fileName,
  s3Key,
  mimeType,
  fileSize,
  linkUrl: null,
  title,
  description,
}
```

Create link:

- Validate URL in DTO and/or service.
- Create row:

```ts
{
  projectId,
  uploadedBy: userId,
  kind: 'LINK',
  fileName: title,
  s3Key: null,
  mimeType: null,
  fileSize: null,
  linkUrl,
  title,
  description,
}
```

Important: if `fileName` remains required in Prisma after Phase 1 it should be populated for links using the title. If the schema later relaxes it, still return title as primary display text.

List:

- Filter by `projectId` and `deletedAt: null`.
- Optional filters:
  - `kind`
  - `uploadedBy`
  - `q` over `fileName`, `title`, `description`, and `linkUrl`
- Sort by `createdAt DESC`, then `id DESC`.
- Fetch `limit + 1` to determine next cursor.
- Include uploader:

```ts
uploader: { select: { id: true, fullName: true, avatarUrl: true } }
```

- For `FILE` rows only, generate `viewUrl`.
- Do not generate S3 URLs for `LINK` rows.

Get single:

- Same permission/project checks as list.
- Return one response item.
- For `FILE`, include `viewUrl`.

Update:

- Only `title` and `description` are mutable.
- Uploader, `OWNER`, or `ADMIN` only.
- Do not allow changing `kind`, `s3Key`, `linkUrl`, `fileName`, `mimeType`, `fileSize`, or `projectId`.

Delete:

- Uploader, `OWNER`, or `ADMIN` only.
- Soft delete via `deletedAt = new Date()`.
- Do not immediately delete S3 object. Existing GC should handle soft-deleted file rows.

Nullability cleanup:

- Update existing `toViewAttachment` and list methods so task/doc/channel file rows still work after Prisma sees `s3Key`, `mimeType`, and `fileSize` as nullable.
- Throw or skip only if a `FILE` row is malformed.

Exit criteria:

- All project service flows implemented.
- Existing task/doc attachment flows still behave the same.

Validation:

```bash
rtk npm run build
rtk npx jest --runInBand apps/api/src/attachments/attachments.service.spec.ts
```

## Phase 4: Permissions, Activity Logging, And Lifecycle

Goal: make the behavior safe and auditable.

Implementation status: Complete.

Files to update:

- `apps/api/src/attachments/attachments.service.ts`
- `apps/api/src/activity/activity.constants.ts`
- `apps/api/src/activity/activity.service.ts` if category mapping is needed
- `apps/api/src/project/project.service.ts`

Activity actions:

- For upload file: `attachment.uploaded`
- For add link: `attachment.linked`
- For update meta: `attachment.updated`
- For delete: `attachment.deleted`

Current app actions are snake_case like `file_uploaded` and `file_deleted`, so implementation can either:

- Use exact spec action strings and add them to activity category mapping.
- Or use app-native snake_case actions and document the mapping.

Preferred for spec alignment:

- `attachment_uploaded`
- `attachment_linked`
- `attachment_updated`
- `attachment_deleted`

Map all of these to the `attachments` activity category.

Metadata:

- Upload:

```ts
{
  projectId,
  projectName,
  kind: 'FILE',
  fileName,
  mimeType,
  fileSize,
}
```

- Link:

```ts
{
  projectId,
  projectName,
  kind: 'LINK',
  linkUrl,
  title,
}
```

- Update:

```ts
{
  projectId,
  projectName,
  kind,
  changedFields: ['title', 'description'],
  old: { title, description },
  new: { title, description },
}
```

- Delete:

```ts
{
  projectId,
  projectName,
  kind,
  fileName,
  linkUrl,
}
```

Lifecycle:

- Find current project soft-delete path in `ProjectService`.
- When a project is soft-deleted, also soft-delete active project attachments:

```ts
await tx.attachment.updateMany({
  where: { projectId, deletedAt: null },
  data: { deletedAt: now },
});
```

- Prefer doing this inside the same transaction as project deletion, if the current code uses one.

Permission checks:

- Uploader can update/delete.
- Workspace `OWNER` and `ADMIN` can update/delete.
- Other members can view/list/upload/add links but cannot update/delete someone else's attachment.

Exit criteria:

- Activity feed categorizes project attachment events as attachment activity.
- Project soft-delete also soft-deletes project attachments.
- Delete/update permission matrix matches spec.

Implemented:

- Added project attachment activity actions:
  - `attachment_uploaded`
  - `attachment_linked`
  - `attachment_updated`
  - `attachment_deleted`
- Mapped all project attachment actions to the existing `attachments` activity category.
- Logged project file uploads with project, file, MIME type, and file-size metadata.
- Logged project external links with project, link URL, and title metadata.
- Logged project attachment metadata updates with changed fields plus old/new title and description.
- Logged project attachment deletes with project, kind, file, MIME type, file-size, and link metadata.
- Kept update/delete authorization as uploader or workspace `OWNER`/`ADMIN`.
- Added project deletion lifecycle cleanup so active project attachments are soft-deleted in the same transaction as project deletion.
- Added focused service tests for project attachment activity logging and project deletion attachment cascade.

Validation:

```bash
rtk npx jest --runInBand apps/api/src/attachments/attachments.service.spec.ts apps/api/src/project/project.service.spec.ts
rtk npm run build
```

## Phase 5: Search Integration

Goal: make project attachments searchable in the backend shape currently available.

Implementation status: Complete.

Files to inspect first:

- `apps/api/src/task/task.service.ts`
- `apps/api/src/docs/doc-search.service.ts`
- `apps/api/src/chat/chat.service.ts`
- `docs/dashboard-api.md`

Implementation path:

1. Confirm whether a unified global workspace search endpoint exists beyond task/doc/chat specific endpoints.
2. If a unified search endpoint exists, add `project_attachment` results there.
3. If no unified endpoint exists, add a service method in `AttachmentsService` that can power global search later:

```ts
searchProjectAttachments(userId, workspaceId, query)
```

Search fields:

- `fileName`
- `title`
- `description`
- `linkUrl`

Result shape:

```ts
{
  id: string;
  entityType: 'project_attachment';
  projectId: string;
  kind: 'FILE' | 'LINK';
  title: string | null;
  fileName: string | null;
  description: string | null;
  linkUrl: string | null;
  createdAt: string;
  uploadedBy: { id, name, avatarUrl };
}
```

Locked project behavior:

- Search must exclude locked projects unless the user has an active unlock.
- Reuse the same approach as notifications/search filtering from the project-password feature.
- If using Prisma relations, filter locked project IDs after query or add a helper in `ProjectSecurityService`.

Exit criteria:

- Either global search includes project attachments, or the repo's lack of a unified global search endpoint is explicitly documented in this plan and a reusable search method exists.
- Locked project attachments are not leaked into search results.

Findings:

- The repo does not currently have one unified global workspace search endpoint for every entity type.
- Existing search surfaces are entity-specific:
  - Task search through task list/project/workspace task endpoints.
  - Document search through `DocSearchService`.
  - Chat search through `ChatService.searchMessages`.
  - Activity search/filtering through `ActivityService`.
- Because there is no unified global search endpoint to extend safely, Phase 5 implemented the reusable backend search method requested by the fallback path.

Implemented:

- Added `AttachmentsService.searchProjectAttachments(userId, workspaceId, query)`.
- Search fields:
  - `fileName`
  - `title`
  - `description`
  - `linkUrl`
- Result shape uses `ProjectAttachmentSearchResponseDto` with `entityType: 'project_attachment'`.
- Workspace-wide search excludes locked project attachments unless the user has an active unlock session.
- Project-scoped search calls `ProjectSecurityService.assertUnlocked(...)` before returning results.
- Search limit is clamped to `1..50`, with default `50`.
- Added unit coverage for locked-project filtering and project-scoped unlock behavior.
- Tightened attachment file metadata validation so nullable file metadata from link support remains type-safe for file response generation.

Validation:

```bash
rtk npm run build
rtk npx jest --runInBand apps/api/src/attachments/attachments.service.spec.ts
```

## Phase 6: Tests

Goal: lock down the feature behavior and prevent regressions in existing attachment flows.

Implementation status: Complete.

Files to update/add:

- `apps/api/src/attachments/attachments.service.spec.ts`
- `apps/api/src/attachments/project-attachments.controller.spec.ts`
- Existing search/activity specs if integration touches them.

Service test cases:

- Presign project file returns key under `attachments/project-{projectId}/`.
- Confirm project file creates `kind = FILE` row with `projectId`.
- Confirm rejects S3 keys outside the project prefix.
- Create link creates `kind = LINK` row with URL/title/description.
- Create link rejects invalid URL schemes.
- List supports `kind = FILE`.
- List supports `kind = LINK`.
- List supports `uploadedBy`.
- List supports `q`.
- List returns file `viewUrl` only for file rows.
- Get single returns file `viewUrl` for files and no `viewUrl` for links.
- Update title/description succeeds for uploader.
- Update title/description succeeds for workspace `OWNER` or `ADMIN`.
- Update/delete fails for a non-uploader `MEMBER`.
- Delete soft-deletes and logs activity.
- Existing doc attachment tests still pass after nullable file columns.
- Existing channel staged attachment behavior still works.

Controller test cases:

- Controller uses `JwtAuthGuard`, `WorkspaceGuard`, `ProjectUnlockedGuard`.
- Locked project returns the existing locked-project error through the guard.
- Non-member workspace request is rejected by `WorkspaceGuard`.
- Happy path: presign, confirm, list.
- Link creation appears in list.
- Patch/delete route passes role/user/workspace/project IDs to service.

Migration smoke:

- Existing task/doc attachments remain readable after nullable columns and `kind = FILE` default.

Implemented:

- Expanded `AttachmentsService` coverage for:
  - Project file presign prefix.
  - Project file confirm with `kind = FILE`.
  - Invalid S3 project prefix rejection.
  - Project link creation with nullable S3 metadata.
  - HTTP/HTTPS-only link validation.
  - List filters for `kind`, `uploadedBy`, and `q`.
  - FILE list responses with signed `viewUrl`.
  - Single FILE fetch with signed `viewUrl`.
  - Single LINK fetch without `viewUrl`.
  - Uploader update permission.
  - Workspace `ADMIN` update permission.
  - Non-uploader `MEMBER` update rejection.
  - Admin delete soft-delete and activity logging.
  - Locked-safe search filtering and project-scoped search unlock checks.
  - Existing doc attachment behavior after nullable file metadata.
  - Existing channel-message staged attachment behavior.
- Added `ProjectAttachmentsController` coverage for:
  - Controller guard metadata: `JwtAuthGuard`, `WorkspaceGuard`, `ProjectUnlockedGuard`.
  - Presign request service arguments.
  - Confirm request service arguments.
  - Link creation service arguments.
  - List query service arguments.
  - Get route attachment/project IDs.
  - Patch route user/workspace/role/project/attachment arguments.
  - Delete route user/workspace/role/project/attachment arguments.
- Added project deletion lifecycle coverage in Phase 4 for project attachment soft-delete cascade.

Notes:

- Locked-project and non-member behavior are enforced by Nest guards at runtime. The controller unit spec verifies the required guards are attached; full guard execution belongs in an integration/e2e suite.

Validation:

```bash
rtk npx jest --runInBand apps/api/src/attachments/attachments.service.spec.ts apps/api/src/attachments/project-attachments.controller.spec.ts
rtk npm run build
```

## Phase 7: Delivery Hardening And Documentation

Goal: make the feature smooth for frontend integration and production delivery.

Implementation status: Complete.

Files to add/update:

- `docs/project-attachments-frontend-integration.md`
- `docs/project-attachments-feature-implementation-plan.md`
- Any API docs if the repo maintains a central backend API doc.

Frontend doc should include:

- Required auth/header:
  - Bearer token
  - `x-workspace-id`
- Full endpoint list.
- Request/response examples.
- Upload flow:
  - presign
  - `PUT` file to S3 upload URL
  - confirm
  - refetch list
- Link flow:
  - submit URL/title/description
  - refetch list
- List filters:
  - `kind`
  - `uploadedBy`
  - `q`
  - `cursor`
  - `limit`
- Update/delete permissions.
- Locked project behavior and `PROJECT_LOCKED` handling.
- S3 view URL expiry behavior.
- Cache invalidation recommendations.
- No realtime events. Clients should refetch on focus.

Final verification:

```bash
rtk npm run db:generate
rtk npm run build
rtk npx jest --runInBand apps/api/src/attachments/attachments.service.spec.ts apps/api/src/attachments/project-attachments.controller.spec.ts
```

Exit criteria:

- Backend compiles.
- Targeted tests pass.
- Frontend integration doc exists.
- Implementation plan status updated with completed phases.

Implemented:

- Added `docs/project-attachments-frontend-integration.md`.
- Documented auth headers and common API response shape.
- Documented every project attachment endpoint.
- Added request/response examples for file upload, link creation, list, update, and delete.
- Documented presign -> S3 PUT -> confirm -> refetch flow.
- Documented list filters, cursor pagination, and cache key suggestions.
- Documented update/delete permissions and backend `403` fallback behavior.
- Documented locked-project `PROJECT_LOCKED` handling and retry-after-unlock flow.
- Documented 15-minute S3 `viewUrl` expiry behavior.
- Documented no-realtime behavior and refetch recommendations.
- Documented current search reality: list `q` is public, reusable backend search method exists, no unified public global search endpoint yet.

## Phase Tracking

| Phase | Status | Notes |
|---|---|---|
| Phase 1: Schema And Prisma Foundation | Complete | Added `AttachmentKind`, project attachment relation/fields, migration, and nullable file-metadata compatibility fixes |
| Phase 2: DTOs, Controller, And Module Wiring | Complete | Added project attachment DTOs, guarded controller shell, module wiring, and Phase 3 service placeholders |
| Phase 3: Project Attachment Service Methods | Complete | Implemented project file presign/confirm, link creation, list/get, metadata update, soft delete, cursor pagination, and service coverage |
| Phase 4: Permissions, Activity Logging, And Lifecycle | Complete | Activity actions mapped, project attachment logs emitted, project-delete soft cascade added |
| Phase 5: Search Integration | Complete | No unified global endpoint exists; reusable locked-safe attachment search method added |
| Phase 6: Tests | Complete | Service and controller coverage added; targeted tests and build pass |
| Phase 7: Delivery Hardening And Documentation | Complete | Frontend integration doc added and final verification completed |

## Implementation Order

1. Start with schema and generated Prisma types.
2. Add DTOs and the project attachment controller shell.
3. Implement service helpers and core flows.
4. Add permission/activity/lifecycle logic.
5. Wire search only after confirming the actual backend search surface.
6. Add/repair tests.
7. Write frontend integration docs and run final checks.

## Known Risks

- Nullable `s3Key`, `mimeType`, and `fileSize` can break existing TypeScript assumptions in task/doc/chat attachment code.
- `ProjectUnlockedGuard` only recognizes `:projectId`, so route param naming matters.
- Link rows need `s3Key = null`, which means any S3 cleanup job must ignore rows without an S3 key.
- Existing dashboard attachment widgets may assume all attachments belong to tasks and have non-null file metadata.
- The repo may not have a true unified global search endpoint. Do not invent a public API without confirming the existing product pattern.
- Activity action naming differs between the spec's dotted names and the app's existing snake_case names.
- Project soft-delete implementation may or may not already use a transaction; attachment soft-delete should follow the existing transaction style.

## Definition Of Done

- Project attachments support uploaded files and external links.
- Project attachments are flat, paginated, filterable, and searchable by the fields in the spec.
- Locked projects do not expose project attachments through list/view/search/upload/link flows.
- Uploader/admin delete and update rules are enforced.
- Project soft-delete marks project attachments deleted.
- Activity logs are written for upload/link/update/delete.
- Existing task/doc/channel attachment behavior remains intact.
- Targeted tests and build pass.
- Frontend integration documentation is complete.
