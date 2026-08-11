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
- DTOs (`create-transaction.dto.ts`, `update-transaction.dto.ts`), the response shape (`transaction-response.dto.ts`, `TRANSACTION_SELECT`), and Swagger docs on the controller were all updated to carry `bankAccountId`/`type` and the nested `bankAccount: { id, bankName }`.

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

**One real bug found only by the live testing** — `getRevenueOverview()`'s raw SQL referenced `t."workspaceId"`, but the actual Postgres column is `workspace_id` (the schema `@map`s it). `$queryRaw` bypasses Prisma's field-name mapping, so this was valid TypeScript and valid SQL that failed at runtime with a `500`. `tsc`, `eslint`, and `nest build` all passed on it. Fixed. Worth remembering: **any `$queryRaw` touching a `@map`ped column must use the DB column name, and only a real query proves it.**

## Known follow-ups (not done as part of this change)

- **`scripts/seed-accounting.js` is now broken** — it inserts rows via raw SQL and never populated `workspaceId` (now required everywhere) or `bankAccountId`/`type` on `Transaction` (now required). Fixing it needs a decision on which workspace to seed into, so it was left broken and flagged in `docs/accounting-api.md`'s Known Gaps rather than guessed at.
- **Pre-existing auth hole, now leaking one more field.** `GET /workspaces/:workspaceId/members/:memberId` (`workspace.controller.ts`) is guarded by `JwtAuthGuard` only — no `WorkspaceGuard`, no `RolesGuard` — so any authenticated user can read any member's full detail in any workspace by id. Not introduced by this refactor, but adding `accountingRole` to `MemberDetailResponseDto` means it now leaks that too. Not fixed here because the fix (adding `WorkspaceGuard`) makes the `x-workspace-id` header mandatory on that route, which breaks any existing caller that omits it — that's a coordinated frontend/backend change, not a drive-by.
- No frontend changes were made — this is a backend-only change. The frontend needs to start sending `x-workspace-id` on every accounting request, and `bankAccountId` on every transaction create/update (see `docs/accounting-api.md` section 7 for the suggested flow, including using `GET /bank-accounts` to populate a bank account picker).
- `Clients.totalRevenue` vs. `totalSaleAmount` drift, and the equivalent new drift risk on `BankAccount.amount` vs. the sum of its transactions, are both unresolved — `amount` stays directly editable via `PATCH /bank-accounts` by design (confirmed with the user), not synced against transaction history beyond the debit/credit adjustments transactions themselves make.
