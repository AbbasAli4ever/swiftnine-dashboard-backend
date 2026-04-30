-- Keep the physical notifications table in sync with Prisma's
-- Notification.isCommented field (@map("is_commented")).
ALTER TABLE "notifications"
  ADD COLUMN IF NOT EXISTS "is_commented" BOOLEAN NOT NULL DEFAULT false;
