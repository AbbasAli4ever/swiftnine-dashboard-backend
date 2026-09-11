# Per-Module Access Control — Implementation Plan

**Status: planned, not implemented.** This document captures a design discussion; no code has been written against it yet. Re-verify the "current state" facts below against the codebase before implementing, since they may have shifted by the time this is picked up.

---

## 1. The actual problem being solved

Platform admin wants to restrict which **app sidebar modules** a user can use at all — e.g. "this user only gets Projects, not Chatbot or University" — not fine-grained CRUD permissions within a module. Full access inside a granted module; zero access outside it.

**Explicitly not this feature:**
- Not per-action permissions (no separate READ/WRITE/UPDATE/DELETE per module) — module access is binary: you can use everything in it, or nothing.
- Not a replacement for anything that exists today. In particular:

### Accounting stays completely separate
Accounting already has its own dashboard, its own axis (`WorkspaceMember.accountingRole`: `ACCOUNTANT` | `CEO` | `null`), and its own guard (`AccountingRoleGuard`, `apps/api/src/auth/guards/accounting-role.guard.ts`). It is **not** one of the sidebar modules this system governs, and this work should not touch it, rename it, or fold it in. It's the closest existing precedent for *how* to build this (see §3), but stays a distinct system.

### Sidebar modules in scope (today)
Projects, Chatbot, University, Chat. Confirmed via codebase search: **no backend `University` or `Chatbot` controller/module exists yet** — those are currently frontend-only concepts. This plan's guard mechanism can be wired up module-by-module as each one gets a real backend controller; it doesn't require all four to exist up front.

### Designed to extend cleanly (e.g. MoM later)
If MoM becomes a sidebar item, adding it is meant to be: one new enum value (additive migration, no data migration) + one `@RequireModule('MOM')` line on `MeetingController` (which already has a class-level `@UseGuards(...)` / `@Roles(...)` to add alongside) + one entry in the frontend's module dropdown. Not a new subsystem per module.

---

## 2. Current state (re-verified, not assumed)

Grepped directly against the codebase at time of writing:

- `AccountingRoleGuard` (`apps/api/src/auth/guards/accounting-role.guard.ts:29`) — the pattern to copy from. Reads `req.workspaceContext.accountingRole` (populated by `WorkspaceGuard`), compares against `@RequireAccountingRole(...)` metadata via `Reflector.getAllAndOverride`.
- `User.isPlatformAdmin` (`prisma/schema.prisma:157`) — global, company-wide flag. `PlatformAdminGuard` gates on it. This is how "platform admin" is already represented and enforced elsewhere (it currently gates *granting* `accountingRole`).
- Two pre-existing, unrelated RBAC bugs also confirmed still present (found during an earlier audit this session, **not required to fix as part of this plan**, but cheap to bundle in if convenient when this work starts):
  - `apps/api/src/project/project.controller.ts:111` and `:133` — `@Roles('OWNER', 'ADMIN')` on project archive/restore. Workspace-level `ADMIN` is never actually assignable (every invite/add-member DTO only allows `MANAGER`/`MEMBER`), so no MANAGER can archive/restore a project today — almost certainly should read `@Roles('OWNER', 'MANAGER')` like every other workspace-scoped endpoint.
  - `apps/api/src/roles/roles.guard.ts:65` — hardcoded `'Only the workspace owner can perform this action'` regardless of which roles were actually required.

---

## 3. Proposed design

### Data model
```prisma
enum ModuleName {
  PROJECTS
  CHATBOT
  UNIVERSITY
  CHAT
  // add new modules here as they ship — additive, no data migration
}
```
A new array field, `enabledModules: ModuleName[]` (Postgres enum array — this schema already uses array columns elsewhere, e.g. `MeetingMinutes.decisions String[]`, so this isn't a new pattern for the DB layer).

**Open decision — where does `enabledModules` live?** (see §4)

### Guard + decorator
Modeled directly on `AccountingRoleGuard`/`RequireAccountingRole` — same shape, new field:
```ts
export const RequireModule = (...modules: ModuleName[]) => SetMetadata(MODULE_ACCESS_KEY, modules);

@Injectable()
export class ModuleAccessGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<ModuleName[]>(MODULE_ACCESS_KEY, [...]);
    if (!required?.length) return true;
    const enabled = /* wherever enabledModules resolves to, see §4 */;
    if (!required.some((m) => enabled.includes(m))) {
      throw new ForbiddenException(`This workspace member does not have access to: ${required.join(', ')}`);
    }
    return true;
  }
}
```
Applied per-controller: `@UseGuards(..., ModuleAccessGuard)` + `@RequireModule('CHATBOT')` at the top of each module's controller(s) — same place `MeetingController` already stacks `RolesGuard` + `@Roles(...)`.

### Granting
Platform-admin-only, same restriction `accountingRole`'s setter already has (`PlatformAdminGuard`) — a new endpoint, e.g. `PATCH /workspaces/:workspaceId/members/:memberId/modules` (or a global equivalent, depending on §4's answer), body `{ enabledModules: ModuleName[] }`, replacing the whole set (like `MeetingService.update`'s `participantIds` replace-not-merge behavior).

### Frontend contract
- Module list returned at login (or on session/workspace-context fetch) so the sidebar can conditionally render.
- A dropdown (multi-select) on the people/members list, platform-admin only, to set a user's `enabledModules`.
- **Important:** if `enabledModules` is baked into a long-lived JWT, a platform admin revoking a module mid-session won't take effect until the token refreshes/re-issues. Prefer resolving it from the DB per-request (same as `accountingRole` does via `workspaceContext`) or on a short-lived cache, not embedding it as a JWT claim that outlives a revocation.

---

## 4. Open decisions — settle these before writing code

1. **Per-workspace or global to the user?** `accountingRole` lives on `WorkspaceMember` (a user could have different accounting access in different workspaces); `isPlatformAdmin` lives on `User` (global). The user's own framing ("give access to a user only to Projects module **in workspace**") leans toward per-workspace, matching `accountingRole`'s exact shape — but this needs an explicit yes/no before implementing, since it decides which table the field goes on and how the guard resolves it.
2. **Default posture for existing members.** Opt-in (nothing enabled until platform admin grants it — risks silently locking out every current user of every module the moment this ships) vs. opt-out (everyone keeps full access until explicitly restricted — safe rollout, no surprise lockouts). Recommend opt-out — but note this requires real sequencing, not just picking a default:
   - The migration that adds `enabledModules` must **explicitly backfill** every existing row to the full module list (`UPDATE ... SET enabled_modules = ARRAY[...]`), not rely on a `@default([])` and an implicit "empty = unrestricted" rule in the guard. An empty array should always mean "genuinely no access," never "not decided yet" — otherwise a future engineer reading the guard code has no way to tell the two apart.
   - That backfill must ship and be confirmed applied **before** `@RequireModule(...)` is wired onto any controller — two separate deploys, not one, so there's no window where the column exists-but-empty while enforcement is already live.
   - Every place that creates a new `WorkspaceMember` row afterward (invite-accept, `addMemberByUserId`, batch-add) must populate the full module list at creation time, same reasoning.
   - This isn't one-time: every time a *new* module is added to the `ModuleName` enum later, it needs the same backfill onto every existing member, or everyone is silently locked out of the new module until an admin notices and grants it.
3. **Does workspace OWNER bypass this?** Workspace-role-based restrictions elsewhere in this app let OWNER bypass by convention (can't lock the owner out of their own workspace). Module access is a different, platform-admin-granted axis — decide explicitly whether an OWNER with no `enabledModules` entry for, say, Chatbot is still blocked from it, or whether OWNER always passes regardless.

---

## 5. Suggested build order (when this is picked up)

1. Settle §4's three decisions.
2. Schema: `ModuleName` enum + `enabledModules` field (wherever §4.1 lands it) + migration + backfill per §4.2.
3. `ModuleAccessGuard` + `RequireModule` decorator (copy `AccountingRoleGuard`'s shape).
4. Grant/revoke endpoint, platform-admin-gated.
5. Wire `@RequireModule(...)` onto whichever module controllers exist today (Projects at minimum; Chatbot/University once those backends exist).
6. Frontend: module list in the login/session response, sidebar conditional rendering, the platform-admin dropdown on the people list.
7. (Optional, bundle-in-if-convenient, not required) Fix the two pre-existing bugs noted in §2.
