# Workspace roles & access — current state

This is a snapshot of how workspace roles and accounting access work **right
now**. It is not a changelog — for the history of how this got here, see the
`[2026-08-21]` and `[2026-08-25]` follow-ups in
`docs/accounting-workspace-migration-changes.md`.

## Two independent systems

There are two separate axes of access, and they don't interact:

1. **Workspace role** — `OWNER` / `MANAGER` / `MEMBER`, stored on
   `WorkspaceMember.role`. Governs workspace management: settings, deletion,
   invites, adding/removing members, changing roles.
2. **Accounting access** — `CEO` (read) / `ACCOUNTANT` (read + write) /
   `null` (none), stored on `WorkspaceMember.accountingRole`. Governs the
   accounting feature only: transactions, clients, bank accounts, employees,
   reports.

A plain `MEMBER` can hold `ACCOUNTANT` access. An `OWNER` can hold none. The
two fields are set and checked completely independently.

There is also an `ADMIN` workspace-role value — it exists in the schema but
is unrelated to any of this. It's a separate permission tier used only by
chat, channels, and projects (moderation, project access, attachment
deletion). It has nothing to do with workspace management or invites.

## Workspace roles

| Role | How it's obtained | Can be granted by invite/promotion? |
|---|---|---|
| `OWNER` | Set once, automatically, when the workspace is created | **Never.** No invite, add-member, or role-change path can produce a new OWNER. |
| `MANAGER` | Invited directly, added directly, or promoted from MEMBER | Yes |
| `MEMBER` | Invited directly, added directly, or demoted from MANAGER | Yes (it's the default) |

### Permission matrix

| Action | OWNER | MANAGER | MEMBER |
|---|---|---|---|
| Update workspace settings | ✅ | ✅ | ❌ |
| Delete workspace (soft delete) | ✅ | ✅ | ❌ |
| Send invites (single or batch) | ✅ | ✅ | ❌ |
| Add existing users directly (single or batch) | ✅ | ✅ | ❌ |
| Remove a member | ✅ | ✅ | ❌ |
| Change a member's role (MANAGER ⇄ MEMBER) | ✅ | ✅ | ❌ |
| Promote/grant someone `OWNER` | ❌ | ❌ | ❌ |
| Grant or revoke accounting access | ❌ | ❌ | ❌ |

**`MANAGER` has full parity with `OWNER`** for every workspace-management
action above, by design — this is deliberate, not an oversight. It includes
being able to remove or demote the real OWNER, since that mirrors exactly
what an "invited OWNER" could already do before this role existed (there
was no way to distinguish a real owner from an invited one). The two things
neither of them can ever do are create a second OWNER, and touch accounting
access.

### Why a duplicate OWNER can't happen any more

Every path that could previously produce a `WorkspaceMember` (or an invite)
with `role: 'OWNER'` now rejects it:

- `InviteMemberDto` / `BatchInviteMembersDto` — `role` accepts only
  `MANAGER` / `MEMBER`.
- `AddMemberDto` / `BatchAddMembersDto` — same.
- `ChangeMemberRoleDto`'s `MemberRole` enum — same, and
  `WorkspaceService.changeMemberRole()` additionally rejects
  `newRole === 'OWNER'` at the service level even if a caller somehow got a
  raw `'OWNER'` string past the DTO. Belt-and-braces, matching how this
  codebase already double-checks other business rules (e.g. the LOCAL
  account / PKR currency rule).

`OWNER` is written to the database in exactly one place:
`WorkspaceService.create()`, when a workspace is first created.

**Not covered by any of this:** workspaces that already had more than one
`OWNER` before this rule existed (e.g. the live SwiftNine LLC workspace).
Nothing here retroactively fixes that — it only stops *new* duplicates from
forming.

## Accounting access

- `CEO` → read-only across transactions, clients, bank accounts, employees,
  reports, the accounting dashboard, and Excel export.
- `ACCOUNTANT` → all of the above, plus create/update/delete.
- `null` → no access to any accounting endpoint at all.

**The only way this is ever granted or revoked**: `PUT
/organizations/members/:id/accounting-role`, and only by a platform admin
(see below). Not by the workspace OWNER, not by a MANAGER, not through an
invite or add-member call — those DTOs don't even have an `accountingRole`
field any more.

## Platform admin (`User.isPlatformAdmin`)

A single boolean on the `User` table, company-wide, not tied to any one
workspace.

- **Set only by a direct database write.** There is no API endpoint that
  sets it, on anyone, ever — so there is no way to self-escalate into it
  through the app.
- **Its only current power**: calling
  `PUT /organizations/members/:id/accounting-role` — for **any** workspace,
  regardless of whether the platform admin is even a member of it. This is
  the one and only place `WorkspaceMember.accountingRole` is written.
- A platform admin who is also a workspace `OWNER`/`MANAGER` in some
  workspace has the normal permissions of that role there too — the flag
  doesn't grant anything extra beyond the accounting-role endpoint.

**Not built**: sending invites into a workspace the platform admin isn't a
member of. Today, sending an invite still requires being a real
`WorkspaceMember` with role `OWNER` or `MANAGER` in that specific workspace.
This was discussed as a possible future extension (a second
`isPlatformAdmin` bypass, same pattern as the accounting-role one) but has
not been implemented.

## Quick reference: guards involved

| Guard | Checks | Used for |
|---|---|---|
| `RolesGuard` + `@Roles(...)` | `WorkspaceMember.role` against a list | Workspace management routes (`@Roles('OWNER', 'MANAGER')`) |
| `AccountingRoleGuard` + `@RequireAccountingRole(...)` | `WorkspaceMember.accountingRole` against a list | Every accounting-feature route |
| `PlatformAdminGuard` | `User.isPlatformAdmin` | Only the accounting-role grant/revoke endpoint |

## Open items

- Existing multi-OWNER workspaces are not retroactively fixed.
- A `MEMBER` can be promoted straight to `MANAGER` via `changeMemberRole` —
  there's no intermediate step requiring a fresh invite.
- Platform-admin invite access (described above) is not built.
