-- Normalize existing rows before adding constraints
UPDATE "notifications"
SET
  "is_snoozed" = false,
  "snoozed_at" = NULL,
  "is_read" = false,
  "read_at" = NULL
WHERE "is_cleared" = true;

UPDATE "notifications"
SET
  "is_read" = false,
  "read_at" = NULL
WHERE "is_cleared" = false
  AND "is_snoozed" = true;

UPDATE "notifications"
SET "snoozed_at" = NULL
WHERE "is_snoozed" = false;

UPDATE "notifications"
SET "read_at" = NULL
WHERE "is_read" = false;

ALTER TABLE "notifications"
  DROP CONSTRAINT IF EXISTS "notifications_single_state_check";

ALTER TABLE "notifications"
  ADD CONSTRAINT "notifications_single_state_check"
  CHECK (
    (CASE WHEN "is_cleared" THEN 1 ELSE 0 END)
    + (CASE WHEN "is_snoozed" THEN 1 ELSE 0 END)
    + (CASE WHEN "is_read" THEN 1 ELSE 0 END)
    <= 1
  );

ALTER TABLE "notifications"
  DROP CONSTRAINT IF EXISTS "notifications_snoozed_at_check";

ALTER TABLE "notifications"
  ADD CONSTRAINT "notifications_snoozed_at_check"
  CHECK (
    "is_snoozed" = true
    OR "snoozed_at" IS NULL
  );

ALTER TABLE "notifications"
  DROP CONSTRAINT IF EXISTS "notifications_read_at_check";

ALTER TABLE "notifications"
  ADD CONSTRAINT "notifications_read_at_check"
  CHECK (
    "is_read" = true
    OR "read_at" IS NULL
  );
