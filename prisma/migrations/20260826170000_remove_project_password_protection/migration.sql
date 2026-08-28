-- Removes the project password-lock feature entirely, superseded by
-- PRIVATE project visibility (20260826150000_add_project_visibility),
-- which already blocks setting a new password on a PRIVATE project and
-- clears any existing one when a project is switched to PRIVATE.

-- DropForeignKey
ALTER TABLE "projects" DROP CONSTRAINT IF EXISTS "projects_password_set_by_fkey";
ALTER TABLE "project_unlock_sessions" DROP CONSTRAINT IF EXISTS "project_unlock_sessions_project_id_fkey";
ALTER TABLE "project_unlock_sessions" DROP CONSTRAINT IF EXISTS "project_unlock_sessions_user_id_fkey";
ALTER TABLE "project_unlock_attempts" DROP CONSTRAINT IF EXISTS "project_unlock_attempts_project_id_fkey";
ALTER TABLE "project_unlock_attempts" DROP CONSTRAINT IF EXISTS "project_unlock_attempts_user_id_fkey";
ALTER TABLE "project_password_reset_tokens" DROP CONSTRAINT IF EXISTS "project_password_reset_tokens_project_id_fkey";

-- DropTable
DROP TABLE IF EXISTS "project_unlock_sessions";
DROP TABLE IF EXISTS "project_unlock_attempts";
DROP TABLE IF EXISTS "project_password_reset_tokens";

-- AlterTable
ALTER TABLE "projects"
  DROP COLUMN IF EXISTS "password_hash",
  DROP COLUMN IF EXISTS "password_set_by",
  DROP COLUMN IF EXISTS "password_updated_at";
