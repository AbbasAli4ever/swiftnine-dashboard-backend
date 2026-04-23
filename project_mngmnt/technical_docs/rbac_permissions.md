# FocusHub RBAC Permissions

Last updated: 2026-04-23

## Role Model

FocusHub currently supports two workspace roles:

| Role | Meaning |
| --- | --- |
| `OWNER` | Workspace administrator. Can manage workspace settings, members, invites, statuses, and destructive workspace/project operations. Owners also have every member capability. |
| `MEMBER` | Normal collaborator. Can use the workspace for day-to-day project work: projects, lists, tasks, tags, time tracking, attachments, and activity viewing, subject to ownership rules on a few resources. |

There is no `ADMIN` role. Any old product wording that says "admin" should be interpreted as `OWNER`.

## Enforcement Strategy

Workspace-scoped APIs use:

| Layer | Responsibility |
| --- | --- |
| `JwtAuthGuard` | Verifies the user is authenticated. |
| `WorkspaceGuard` | Verifies the user belongs to the active workspace and stores `req.workspaceContext = { workspaceId, role }`. |
| `RolesGuard` | Enforces route-level role requirements from `@Roles(...)`. It supports `x-workspace-id`, `body.workspaceId`, params, or query when needed. |
| Service checks | Keep business-specific checks such as "task creator or owner" and "only own time entry". |

The preferred pattern for owner-only endpoints is:

```ts
@UseGuards(JwtAuthGuard, WorkspaceGuard, RolesGuard)
@Roles('OWNER')
```

For endpoints that historically pass `workspaceId` in the body, `RolesGuard` can read `body.workspaceId`; however, new workspace-scoped APIs should prefer `x-workspace-id`.

## Permission Summary

| Capability | Owner | Member | Notes |
| --- | --- | --- | --- |
| Create workspace | Yes | Yes | Authenticated user becomes owner of the new workspace. |
| View own workspaces | Yes | Yes | Only workspaces where user is a member. |
| View workspace details | Yes | Yes | Requires workspace membership. |
| View members | Yes | Yes | Member list is visible to all members. |
| Update workspace settings | Yes | No | Owner-only. |
| Delete workspace | Yes | No | Owner-only soft delete. |
| Send invites | Yes | No | Owner-only. |
| Accept/claim invite | Yes | Yes | Public/authenticated invite flow, role comes from invite. |
| Remove members | Yes | No | Owner-only. |
| Change member role | Yes | No | Owner-only. |
| Delete a member user account from workspace | Yes | No | Owner-only; owners cannot delete another owner through this flow. |
| Create/list/read/update projects | Yes | Yes | Day-to-day workspace work. |
| Delete projects | Yes | No | Owner-only destructive operation. |
| Manage statuses | Yes | No | Owner-only because statuses are project workflow configuration. |
| Manage task lists | Yes | Yes | Members can create, rename, reorder, archive, restore, and delete lists. |
| Manage tasks | Yes | Yes | Members can create/update/complete/assign/tag/reorder tasks. Task delete is creator-or-owner. |
| Manage tags | Yes | Yes | Members can create/update/delete workspace tags. |
| Manage time entries | Yes | Yes | Users can create/view task time; update/delete own time entries only. |
| Manage attachments | Yes | Yes | Authenticated uploader/member checks apply. |
| View activity feed | Yes | Yes | Workspace membership required. |
| Profile/password/preferences | Yes | Yes | User-level APIs for the current authenticated user. |

## API Permission Matrix

### Auth APIs

| Method | Path | Access | Functionality |
| --- | --- | --- | --- |
| `POST` | `/api/v1/auth/register` | Public | Register account and send verification OTP. |
| `POST` | `/api/v1/auth/verify-email` | Public | Verify registration OTP. |
| `POST` | `/api/v1/auth/login` | Public | Login with email/password. |
| `GET` | `/api/v1/auth/google` | Public | Start Google OAuth. |
| `GET` | `/api/v1/auth/google/callback` | Public | Complete Google OAuth. |
| `POST` | `/api/v1/auth/refresh` | Auth cookie | Rotate refresh/access token. |
| `POST` | `/api/v1/auth/logout` | Auth cookie | Logout current session. |
| `POST` | `/api/v1/auth/forgot-password` | Public | Send reset link if account exists. |
| `POST` | `/api/v1/auth/reset-password` | Public | Reset password by token. |

### User APIs

| Method | Path | Owner | Member | Functionality |
| --- | --- | --- | --- | --- |
| `POST` | `/api/v1/user/profile` | Yes | Yes | Create/initialize current user profile. |
| `GET` | `/api/v1/user/profile` | Yes | Yes | Get current user profile. |
| `GET` | `/api/v1/user/:id` | Yes | Yes | Get a user profile by ID. |
| `PATCH` | `/api/v1/user/profile` | Yes | Yes | Update current user profile. |
| `PATCH` | `/api/v1/user/status` | Yes | Yes | Update current user's online/offline status. |
| `DELETE` | `/api/v1/user/profile` | Yes | Yes | Soft delete own account. |
| `DELETE` | `/api/v1/user/:id` | Yes | No | Owner-only delete of a workspace member account. Requires workspace context. |
| `PATCH` | `/api/v1/user/change-password` | Yes | Yes | Change own password. |
| `PATCH` | `/api/v1/user/notifications` | Yes | Yes | Update own notification preferences. |

### Workspace APIs

| Method | Path | Owner | Member | Functionality |
| --- | --- | --- | --- | --- |
| `POST` | `/api/v1/workspaces` | Yes | Yes | Create a new workspace. Creator becomes owner. |
| `GET` | `/api/v1/workspaces` | Yes | Yes | List workspaces the user belongs to. |
| `GET` | `/api/v1/workspaces/:workspaceId` | Yes | Yes | Get active workspace details. |
| `GET` | `/api/v1/workspaces/:workspaceId/members` | Yes | Yes | List workspace members. |
| `PATCH` | `/api/v1/workspaces/:workspaceId` | Yes | No | Update workspace settings. |
| `DELETE` | `/api/v1/workspaces/:workspaceId` | Yes | No | Soft delete workspace. |
| `POST` | `/api/v1/workspaces/:workspaceId/invite` | Yes | No | Send a single invite. |
| `POST` | `/api/v1/workspaces/:workspaceId/invites` | Yes | No | Send batch invites. |
| `GET` | `/api/v1/workspaces/invite/:token` | Public | Public | Preview invite details. |
| `POST` | `/api/v1/workspaces/invite/claim` | Public | Public | Create/upgrade account from invite. |
| `POST` | `/api/v1/workspaces/invite/accept` | Authenticated | Authenticated | Accept invite for logged-in matching email. |

### Organization / Member Management APIs

| Method | Path | Owner | Member | Functionality |
| --- | --- | --- | --- | --- |
| `DELETE` | `/api/v1/organizations/members` | Yes | No | Remove a member from a workspace. |
| `PUT` | `/api/v1/organizations/members/:id/role` | Yes | No | Change a member role to `OWNER` or `MEMBER`. |

### Project APIs

| Method | Path | Owner | Member | Functionality |
| --- | --- | --- | --- | --- |
| `POST` | `/api/v1/projects` | Yes | Yes | Create project in active workspace. |
| `GET` | `/api/v1/projects` | Yes | Yes | List active projects. |
| `GET` | `/api/v1/projects/:projectId` | Yes | Yes | Get project with statuses. |
| `PATCH` | `/api/v1/projects/:projectId` | Yes | Yes | Update project name, description, color, icon. |
| `DELETE` | `/api/v1/projects/:projectId` | Yes | No | Owner-only soft delete of project and child data. |

### Status APIs

| Method | Path | Owner | Member | Functionality |
| --- | --- | --- | --- | --- |
| `POST` | `/api/v1/statuses` | Yes | No | Create custom project status. |
| `GET` | `/api/v1/statuses` | Yes | Yes | List grouped statuses for a project. |
| `PUT` | `/api/v1/statuses/reorder` | Yes | No | Reorder statuses and move across groups. |
| `POST` | `/api/v1/statuses/default` | Yes | No | Apply default status template. |
| `GET` | `/api/v1/statuses/:id` | Yes | Yes | Get a single status. |
| `PUT` | `/api/v1/statuses/:id` | Yes | No | Update status. |
| `DELETE` | `/api/v1/statuses/:id` | Yes | No | Delete status and optionally reassign tasks. |

### Task List APIs

| Method | Path | Owner | Member | Functionality |
| --- | --- | --- | --- | --- |
| `POST` | `/api/v1/projects/:projectId/lists` | Yes | Yes | Create task list. |
| `GET` | `/api/v1/projects/:projectId/lists` | Yes | Yes | List task lists. |
| `PUT` | `/api/v1/projects/:projectId/lists/reorder` | Yes | Yes | Reorder task lists. |
| `PATCH` | `/api/v1/projects/:projectId/lists/:listId` | Yes | Yes | Rename task list. |
| `PATCH` | `/api/v1/projects/:projectId/lists/:listId/archive` | Yes | Yes | Archive task list. |
| `PATCH` | `/api/v1/projects/:projectId/lists/:listId/restore` | Yes | Yes | Restore archived task list. |
| `DELETE` | `/api/v1/projects/:projectId/lists/:listId` | Yes | Yes | Soft delete task list. |

### Task APIs

| Method | Path | Owner | Member | Functionality |
| --- | --- | --- | --- | --- |
| `POST` | `/api/v1/projects/:projectId/lists/:listId/tasks` | Yes | Yes | Create task in list. |
| `GET` | `/api/v1/projects/:projectId/lists/:listId/tasks` | Yes | Yes | List top-level list tasks. |
| `PUT` | `/api/v1/projects/:projectId/lists/:listId/tasks/reorder` | Yes | Yes | Reorder tasks. |
| `GET` | `/api/v1/tasks/:taskId` | Yes | Yes | Get task detail. |
| `PATCH` | `/api/v1/tasks/:taskId` | Yes | Yes | Update task fields or move task. |
| `DELETE` | `/api/v1/tasks/:taskId` | Yes | Creator only | Owner can delete any task. Member can delete tasks they created. |
| `PATCH` | `/api/v1/tasks/:taskId/complete` | Yes | Yes | Mark task complete. |
| `PATCH` | `/api/v1/tasks/:taskId/uncomplete` | Yes | Yes | Mark task incomplete. |
| `POST` | `/api/v1/tasks/:taskId/subtasks` | Yes | Yes | Create subtask. |
| `GET` | `/api/v1/tasks/:taskId/subtasks` | Yes | Yes | List subtasks. |
| `POST` | `/api/v1/tasks/:taskId/assignees` | Yes | Yes | Add task assignees. |
| `DELETE` | `/api/v1/tasks/:taskId/assignees/:userId` | Yes | Yes | Remove task assignee. |
| `POST` | `/api/v1/tasks/:taskId/tags` | Yes | Yes | Add tag to task. |
| `DELETE` | `/api/v1/tasks/:taskId/tags/:tagId` | Yes | Yes | Remove tag from task. |

### Tag APIs

| Method | Path | Owner | Member | Functionality |
| --- | --- | --- | --- | --- |
| `POST` | `/api/v1/tags` | Yes | Yes | Create workspace tag. |
| `GET` | `/api/v1/tags` | Yes | Yes | List workspace tags. |
| `PATCH` | `/api/v1/tags/:tagId` | Yes | Yes | Update tag name or color. |
| `DELETE` | `/api/v1/tags/:tagId` | Yes | Yes | Delete tag and remove it from tasks. |

### Time Entry APIs

| Method | Path | Owner | Member | Functionality |
| --- | --- | --- | --- | --- |
| `POST` | `/api/v1/tasks/:taskId/time/manual` | Yes | Yes | Add manual time entry. |
| `POST` | `/api/v1/tasks/:taskId/time/start` | Yes | Yes | Start task timer. |
| `POST` | `/api/v1/tasks/:taskId/time/stop` | Yes | Yes | Stop running timer on task. |
| `GET` | `/api/v1/tasks/:taskId/time` | Yes | Yes | List task time entries. |
| `GET` | `/api/v1/time-entries/active` | Yes | Yes | Get current user's active timer. |
| `PATCH` | `/api/v1/time-entries/:entryId` | Own entry | Own entry | Update own time entry only. |
| `DELETE` | `/api/v1/time-entries/:entryId` | Own entry | Own entry | Delete own time entry only. |

### Attachment APIs

| Method | Path | Owner | Member | Functionality |
| --- | --- | --- | --- | --- |
| `POST` | `/api/v1/attachments/presign` | Yes | Yes | Create presigned upload URL. |
| `POST` | `/api/v1/attachments` | Yes | Yes | Create attachment record after upload. Actor must match member. |
| `POST` | `/api/v1/attachments/view` | Yes | Yes | List attachment view URLs for task. |
| `DELETE` | `/api/v1/attachments` | Yes | Yes | Delete attachment. Actor must match member. |

### Activity APIs

| Method | Path | Owner | Member | Functionality |
| --- | --- | --- | --- | --- |
| `GET` | `/api/v1/activity` | Yes | Yes | Workspace activity feed with filters. |
| `GET` | `/api/v1/tasks/:taskId/activity` | Yes | Yes | Task activity timeline. |

## Implementation Notes

- Owner-only routes should use `@Roles('OWNER')` even when the service also checks ownership. Service checks are retained as defense-in-depth.
- Avoid adding an `ADMIN` enum or accepting `ADMIN` in DTOs. Owner is the administrative role.
- Future permissions such as "members cannot delete tags" or "members cannot create projects" should be added as explicit product decisions in this document before code changes.
