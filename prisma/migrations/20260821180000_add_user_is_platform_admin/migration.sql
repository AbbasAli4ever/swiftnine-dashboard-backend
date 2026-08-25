-- Company-wide super-admin flag. Its only power is granting/revoking
-- WorkspaceMember.accounting_role; see PlatformAdminGuard. Additive with a
-- default, so it is safe to apply to a populated table.
--
-- AlterTable
ALTER TABLE "users" ADD COLUMN "is_platform_admin" BOOLEAN NOT NULL DEFAULT false;

-- Grant it to the company admin. Keyed on email because the flag is never
-- settable through the API — this statement (or an equivalent manual UPDATE)
-- is the only way it is ever turned on.
--
-- Reports 0 rows if that user does not exist yet in this environment, in
-- which case re-run the UPDATE once they have signed in for the first time.
UPDATE "users" SET "is_platform_admin" = true WHERE "email" = 'ali@swiftnine.com';
