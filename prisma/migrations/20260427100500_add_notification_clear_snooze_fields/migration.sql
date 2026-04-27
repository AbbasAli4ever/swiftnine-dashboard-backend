-- AlterTable
ALTER TABLE "notifications"
  ADD COLUMN IF NOT EXISTS "is_cleared" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "is_snoozed" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "snoozed_at" TIMESTAMP(3);

-- Drop old index that no longer matches schema
DROP INDEX IF EXISTS "notifications_user_id_is_read_created_at_idx";

-- Create index that matches Prisma schema
CREATE INDEX IF NOT EXISTS "notifications_user_id_is_read_is_cleared_is_snoozed_created_at_idx"
  ON "notifications"("user_id", "is_read", "is_cleared", "is_snoozed", "created_at");
