# Accounting: Per-Workspace Scoping + Bank Account Debit/Credit Sync

Record of what changed and why. For the current API contract itself, see `docs/accounting-api.md` — this file is the changelog, not the reference.

## Why

The accounting feature (`clients`, `transactions`, `bank-accounts`, `accounting-dashboard`) was originally built as a single global ledger shared across the whole app, with one global `role` (`CEO` | `ACCOUNTANT`) on `User`. The business need changed: an accountant should be scoped to one workspace, and every client/transaction/bank account should belong to a specific workspace instead of one shared pool. Separately, transactions needed to be linked to a specific bank account, debiting or crediting its balance based on the transaction's type.

## Schema changes (`prisma/schema.prisma`)

- **Role relocated, not duplicated**: removed `role UserRole?` from `User`. Added `accountingRole UserRole?` to `WorkspaceMember`, sitting alongside the pre-existing workspace `role` (`OWNER`/`ADMIN`/`MEMBER`) and `aiModelTier` — same "independent per-membership attribute" pattern already used there. The `UserRole` enum itself (`CEO`, `ACCOUNTANT`) is unchanged, just relocated to a different model.
- Added required `workspaceId` (+ FK to `Workspace`, `onDelete: Cascade`, `@@index`) to `Clients`, `Transaction`, and `BankAccount`.
- Changed `Transaction.refId` from a global `@@unique` to `@@unique([workspaceId, refId])` — reference IDs only need to be unique within a workspace now.
- Added `enum TransactionType { CREDIT DEBIT }`.
- Added to `Transaction`: required `bankAccountId` (FK to `BankAccount`, `onDelete: Restrict` — deliberately not `Cascade`, unlike `Transaction.clientId`, so a bank account with transaction history can never be silently deleted along with its ledger) and `type TransactionType @default(CREDIT)`.
- Added back-relation fields on `Workspace` (`clients`, `transactions`, `bankAccounts`) and on `BankAccount` (`transactions`), required by Prisma for the new relations.

## Migration

One migration: `prisma/migrations/20260811083456_accounting_per_workspace/migration.sql`.

- Existing `Clients`/`Transaction`/`BankAccount` rows were **wiped** (`TRUNCATE`), not backfilled — confirmed as disposable test/seed data with no real business records at the time. Anyone applying this migration against a database with real accounting data would lose it; that wasn't the situation here.
- Generated via schema-to-schema diff (`prisma migrate diff --from-schema <old> --to-schema <new> --script`) — no database or shadow database was touched to produce it. The `TRUNCATE` line was added by hand afterward since diffing doesn't emit data-destructive statements on its own.

## Auth changes

- `WorkspaceGuard` (`apps/api/src/workspace/workspace.guard.ts`) now also selects `accountingRole` in its existing `WorkspaceMember` lookup and includes it in `req.workspaceContext` — one query, no extra DB round-trip.
- `WorkspaceContext` type (`apps/api/src/workspace/workspace.types.ts`) gained `accountingRole: UserRole | null`.
- `RolesGuard` (`apps/api/src/roles/roles.guard.ts`) updated to match — it independently constructs `req.workspaceContext` in its own fallback path, so it needed the same field to stay consistent with `WorkspaceGuard`. Also switched its local type to reuse `WorkspaceContext` instead of a duplicate inline type, so the two can't drift apart again.
- **Renamed** `apps/api/src/auth/guards/user-role.guard.ts` → `accounting-role.guard.ts`: `UserRoleGuard` → `AccountingRoleGuard`, `RequireUserRole` → `RequireAccountingRole`, `USER_ROLE_KEY` → `ACCOUNTING_ROLE_KEY`. Internals changed from reading `req.user?.role` (global, no DB lookup needed) to reading `req.workspaceContext?.accountingRole` (per-workspace, populated by `WorkspaceGuard`) — must now run *after* `WorkspaceGuard` in the guard chain.
- Removed now-dead `User.role` references:
  - `AUTH_USER_SELECT` (`auth.constants.ts`) no longer selects `role`.
  - `AuthUserDto` (`auth-response.dto.ts`) no longer has a `role` field.
  - The Google OAuth callback (`auth.controller.ts`) no longer appends `role` to its redirect URL.
  - `USER_PROFILE_SELECT` / `UserProfile` / `toUserProfile()` (`user.service.ts`) no longer select or return `role`.

## The four modules

Applied the same pattern to `clients`, `bank-accounts`, `transactions`, and `accounting-dashboard`:

- Controllers: guard chain changed to `@UseGuards(JwtAuthGuard, WorkspaceGuard, AccountingRoleGuard)`, class-level `@RequireAccountingRole('CEO', 'ACCOUNTANT')`, added `@ApiHeader({ name: 'x-workspace-id', required: true, ... })`. Every handler now takes `@Req() req: WorkspaceRequest` and passes `req.workspaceContext.workspaceId` into the service call. No route paths changed — scoping is header-only, matching how `/projects` already works.
- Services: every Prisma query's `where`/`data` now includes `workspaceId`. `findOne`/`update`/`remove` scope lookups by `{ id, workspaceId }` together so a caller can't reach another workspace's row by guessing an id.
- Modules: added `imports: [WorkspaceModule]` (bank-accounts keeps its existing `CommonModule` import too, for `PublicAssetsS3Service`).
- `accounting-dashboard.service.ts`: all 8 query methods (including the raw-SQL `getRevenueOverview`, where the workspace filter was added inside the `LEFT JOIN`'s `ON` clause) now scope by workspace.

### Transactions ↔ bank accounts: debit/credit balance sync

New logic in `transaction.service.ts`:

- **Validation**: a new `findBankAccountOrThrow` (mirrors the existing `findClientOrThrow`) resolves the target bank account within the workspace, `404` if missing. `assertCurrencyMatches` rejects with `400` if the transaction's `currency` doesn't exactly match the bank account's `currencyType` — there's no FX conversion anywhere in this feature, so this is a hard requirement.
- **Create**: bank account balance adjustment and transaction-row creation happen inside one `prisma.$transaction`, using Prisma's atomic `increment` (a negative value for `DEBIT`) rather than read-then-write, to avoid races under concurrent requests.
- **Update**: if `bankAccountId`, `saleAmount`, `currency`, or `type` change, the transaction's prior effect is reversed on its *old* bank account and the new effect applied to the new (possibly same) one — both inside one `$transaction`, so a same-account edit nets out correctly and a cross-account move never leaves one side unmatched. Changing only `clientId`/`clientName`/`description`/`saleDate` skips this entirely — no balance touched.
- **Delete**: the transaction's effect is reversed on its bank account before the row is removed.
- **Bank account delete**: `bank-account.service.ts`'s `remove()` now checks for linked transactions and returns `409` (`BANK_ACCOUNT_HAS_TRANSACTIONS`) rather than letting the new DB-level `ON DELETE RESTRICT` surface as a raw, unhandled error.
- DTOs (`create-transaction.dto.ts`, `update-transaction.dto.ts`), the response shape (`transaction-response.dto.ts`, `TRANSACTION_SELECT`), and Swagger docs on the controller were all updated to carry `bankAccountId`/`type` and the nested `bankAccount: { id, bankName }`. **Correction**: `type` on create is **required** at the API/DTO level (no `.default('CREDIT')` on the zod schema — omitting it returns `422`), not optional as originally implemented and documented here. The Prisma schema still carries `type TransactionType @default(CREDIT)` (a DB-level default, unaffected by this) — that's a deliberate safety net for any future direct-DB writer, not a contradiction; the API simply now requires the caller to state intent explicitly rather than silently assuming `CREDIT`. `bankAccountId` was correctly required from the start.

## Follow-up: making `accountingRole` reachable through the API

The refactor above left `accountingRole` **enforced but unreachable** — it gated every accounting endpoint, but no endpoint returned it and no endpoint could set it. Every membership was `NULL`, so the whole accounting feature 403'd for every user, and the only way to grant access was a direct DB write. `docs/accounting-api.md` told the frontend to "check the current workspace membership's `accountingRole`" via an endpoint that didn't exist. This was originally written up as a known limitation; that was wrong — an enforced field with no read or write path is a broken feature, not a documented gap. Closed as follows:

**Read:**
- `GET /workspaces/:workspaceId` now includes the caller's own `role` and `accountingRole`, sourced straight from `req.workspaceContext` (already populated by `WorkspaceGuard`) — no extra query, no schema change. This is the "who am I in this workspace" check the frontend needs to decide whether to show the accounting area at all, and to tell `CEO` (read-only) apart from `ACCOUNTANT` (read/write) so it can disable write controls. Probing can't substitute: `AccountingRoleGuard` throws an identical bare `403` for a null role and a wrong role.
- `accountingRole` added to `listMembers()` (`GET /workspaces/:workspaceId/members`) and `getMember()` (`GET /workspaces/:workspaceId/members/:memberId`), plus `MemberResponseDto` and `MemberDetailResponseDto`. Follows the `aiModelTier` precedent — the sibling per-membership attribute already exposed there. Pending invites report `accountingRole: null`, same reasoning as `aiModelTier` reporting its default: no membership row exists until the invite is accepted.

**Write:**
- New `PUT /organizations/members/:id/accounting-role`, OWNER-only, body `{ workspaceId, accountingRole }` where `accountingRole` is `'CEO' | 'ACCOUNTANT' | null` (`null` revokes access entirely). Deliberately mirrors the existing `PUT /organizations/members/:id/role` next to it — same controller, same guard chain (`JwtAuthGuard, RolesGuard` + `@Roles('OWNER')`), same `workspaceId`-in-body convention, same `memberId`-or-`userId` fallback resolution.
- Backed by `WorkspaceService.changeMemberAccountingRole()`, which mirrors `changeMemberRole()` exactly, including the `activityLog` entry (`action: 'member_accounting_role_changed'`, `fieldName: 'accountingRole'`) so role grants are auditable the same way workspace-role changes already are.
- New `ChangeMemberAccountingRoleDto` uses `@IsIn([...values, null])` rather than `@IsEnum` — `@IsEnum` can't express "or null", and `null` is a meaningful value here (revoke), not a missing one.

**Deliberately not done — needs a product decision:**
- **Self-elevation is unguarded.** An `OWNER` can grant themselves `CEO`/`ACCOUNTANT` and read all accounting data. Arguably fine (an OWNER already controls the workspace and can grant it to anyone anyway), but the previous DB-only state was an accidental air gap, so removing it is a real change. Options if it's not wanted: block `userId === req.user.id`, or require a shared secret the way `ChangeAiTierDto` does for AI tier changes.

## Follow-up: accountingRole at invite time, and auto-provisioned default bank accounts

**accountingRole settable at invite time**
- `WorkspaceInvite` gained `accountingRole UserRole?` (nullable, same enum, `@map("accounting_role")`) — one additive column, no data loss (`prisma/migrations/20260812090935_workspace_invite_accounting_role/migration.sql`).
- `InviteMemberDto` and `BatchInviteMembersDto` both gained `accountingRole: z.enum(['ACCOUNTANT','CEO']).nullable().default(null)` — independent of the existing `role` field, same "sits alongside, doesn't merge into" pattern as `aiModelTier`.
- `WorkspaceService.sendInviteToEmail` threads `accountingRole` through to `WorkspaceInvite.create()`; `sendInvite`/`sendBatchInvites` pass `dto.accountingRole` down. `getInviteDetails` also now selects and returns it, so an invite-preview screen can show what accounting access the invitee will get.
- `claimInvite` and `acceptInvite` both copy `invite.accountingRole` onto the new `WorkspaceMember` row verbatim, exactly as they already did for `role`.
- Verified live end-to-end: sent an invite with `accountingRole: 'ACCOUNTANT'`, confirmed the `workspace_invites` row, claimed it via a self-generated/self-hashed token (bypassing real email delivery), confirmed the resulting `workspace_members` row had `accounting_role: 'ACCOUNTANT'`. Test data cleaned up after.

**Auto-provisioned default bank accounts on first CEO/ACCOUNTANT acceptance**
- The moment `claimInvite` or `acceptInvite` creates a `WorkspaceMember` whose `accountingRole` is `CEO` or `ACCOUNTANT`, and the target workspace has zero `BankAccount` rows, a new private helper `WorkspaceService.provisionDefaultBankAccountsIfNeeded()` bulk-creates a fixed starter set of 12 accounts — 5 `LOCAL`/`PKR` (HBL, UBL, Alfalah, BOP, Faysal) and 7 `INTERNATIONAL`/`USD` (Whop, Slash, Payoneer, Airwallex, Wio, Mamo, Kraken) — each `amount: 0`, with a real `logoUrl` already uploaded to the public assets S3 bucket. Runs inside the same `$transaction` that creates the membership, right after it.
- Why: nothing previously created a workspace's bank accounts automatically — every account was either hand-created via `POST /bank-accounts` or came from the now-removed global seed script. A brand-new workspace's accounting screen would otherwise start completely empty.
- Starter list lives in `apps/api/src/bank-accounts/default-bank-accounts.data.ts` — logo URLs copied verbatim from `assets/bank-logo-urls.json` (hardcoded rather than read from that JSON at runtime, since it's a build-script artifact for `scripts/upload-bank-logos.ts`, not something the app's build copies into `dist/`). Every currently-uploaded logo is used; the two UAE-based platforms (`Wio`, `Mamo`) default to `USD` since `Currency` has no `AED` — the one place a currency choice was assumed rather than derived.
- Guarded twice: `if (!accountingRole) return;` (a plain `MEMBER` invite never triggers it) and `if (existingCount > 0) return;` (idempotent — accepting a second CEO/ACCOUNTANT invite into an already-provisioned workspace does not duplicate the 12 accounts).
- **Known accepted race**: the count-then-create isn't safe against two people accepting a CEO/ACCOUNTANT invite into the same brand-new workspace at the exact same instant — Postgres's default `READ COMMITTED` isolation won't stop a concurrent transaction from also seeing `count === 0`. Same category of already-accepted gap as the `BankAccount.amount`/`Clients.totalRevenue` drift noted below — not solved with locking unless it turns out to matter in practice.

**`scripts/seed-accounting.js` removed**
- It predated workspace-scoping (raw SQL inserts into `Clients`/`Transaction`/`BankAccount` with no `workspaceId`, and no `bankAccountId`/`type` on `Transaction`) and was already broken against the current schema (see the "Known follow-ups" note below, from the original migration). Its old job — giving a workspace some bank accounts to start with — is now handled for real, per-workspace, by the auto-provisioning above, so it was deleted rather than fixed for a data model it predates.

## Verification performed

Static checks, run after every step:
- `npx tsc --noEmit -p tsconfig.build.json` — clean.
- `npx eslint` on every touched file — clean. Pre-existing lint errors do exist in files this change touched but on lines it didn't (`roles.guard.ts`, `workspace.controller.ts`, `organizations.controller.ts`, `workspace.service.ts`, `user.controller.ts`) — left alone, not introduced here.
- `npx nest build api` — clean.
- `prisma validate` + `prisma migrate diff` — no drift between `schema.prisma` and the generated migration.

Live end-to-end testing against the local Postgres + running dev server (`curl`, real JWT, real workspace), after syncing the local DB via `prisma db push`:
- Bank account create (USD + PKR), client create — OK.
- `CREDIT` 250 → balance `1000 → 1250`. `DEBIT` 100 → `1250 → 1150`. Update amount `250 → 400` → `1150 → 1300` (old effect reversed, new applied). Delete the `DEBIT` → `1300 → 1400` (effect reversed). All exact.
- USD transaction against a PKR bank account → `400`, correct message.
- Delete a bank account with transactions → `409`.
- Missing `x-workspace-id` → `403`. Workspace isolation: another workspace's rows invisible in list, `404` on direct fetch by id.
- `CEO` blocked on create/update/delete/logo-presign (`403`), allowed on reads (`200`). `accountingRole: null` → `403` on everything.
- `GET /workspaces/:id` and `/members` return `accountingRole`; `PUT .../accounting-role` sets `CEO`, `ACCOUNTANT`, and `null`, each confirmed by re-reading and by the corresponding change in accounting-endpoint access.

accountingRole-at-invite and bank-account auto-provisioning follow-up, verified separately:
- `tsc`, `eslint`, `nest build` clean for both changes.
- accountingRole-at-invite: sent an invite with `accountingRole: 'ACCOUNTANT'` → confirmed on the `workspace_invites` row → claimed via a self-generated/self-hashed token → confirmed `workspace_members.accounting_role` matched. Test data cleaned up after.
- Bank-account auto-provisioning, against the real dev server + DB: (1) `CEO` claims a brand-new workspace → exactly 12 accounts created (5 `LOCAL`/7 `INTERNATIONAL`, all `amount: 0`, all with a `logoUrl`); (2) a plain-member (`accountingRole: null`) claim into a different fresh workspace → 0 accounts created; (3) a second `ACCOUNTANT` claim into the *same*, already-provisioned workspace → still 12, no duplicates; (4) the authenticated `acceptInvite` path (not just `claimInvite`) into a fresh workspace → 12 accounts created. All test data cleaned up after.

**One real bug found only by the live testing** — `getRevenueOverview()`'s raw SQL referenced `t."workspaceId"`, but the actual Postgres column is `workspace_id` (the schema `@map`s it). `$queryRaw` bypasses Prisma's field-name mapping, so this was valid TypeScript and valid SQL that failed at runtime with a `500`. `tsc`, `eslint`, and `nest build` all passed on it. Fixed. Worth remembering: **any `$queryRaw` touching a `@map`ped column must use the DB column name, and only a real query proves it.**

## Known follow-ups (not done as part of this change)

- ~~`scripts/seed-accounting.js` is now broken~~ — **removed.** See the "accountingRole at invite time, and auto-provisioned default bank accounts" follow-up above: a workspace now gets real bank accounts automatically on first CEO/ACCOUNTANT acceptance, so there was no reason to fix the script for a data model it predates.
- ~~Pre-existing auth hole, now leaking one more field~~ — **fixed.** `GET /workspaces/:workspaceId/members/:memberId` was guarded by `JwtAuthGuard` only — no `WorkspaceGuard`, no `RolesGuard` — so any authenticated user could read any member's full detail (including, after this refactor, `accountingRole`) in any workspace by id. Confirmed the frontend never calls this route without the workspace context it'd now require, so added `WorkspaceGuard` to the route and switched the handler to read `workspaceId` from `req.workspaceContext` (guard-verified) instead of the raw `:workspaceId` URL param, so the two can't disagree. Verified live: no header → `403`; header naming a workspace the target member isn't actually in → `404`; correct workspace → `200` with full detail as before.
- No frontend changes were made — this is a backend-only change. The frontend needs to start sending `x-workspace-id` on every accounting request, and `bankAccountId` on every transaction create/update (see `docs/accounting-api.md` section 7 for the suggested flow, including using `GET /bank-accounts` to populate a bank account picker).
- `Clients.totalRevenue` vs. `totalSaleAmount` drift, and the equivalent new drift risk on `BankAccount.amount` vs. the sum of its transactions, are both unresolved — `amount` stays directly editable via `PATCH /bank-accounts` by design (confirmed with the user), not synced against transaction history beyond the debit/credit adjustments transactions themselves make.
