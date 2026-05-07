ALTER TABLE "attachments"
  DROP CONSTRAINT IF EXISTS "attachments_exactly_one_owner_check";

ALTER TABLE "attachments"
  ADD CONSTRAINT "attachments_at_most_one_owner_check"
  CHECK (
    (CASE WHEN "task_id" IS NOT NULL THEN 1 ELSE 0 END) +
    (CASE WHEN "doc_id" IS NOT NULL THEN 1 ELSE 0 END) +
    (CASE WHEN "channel_message_id" IS NOT NULL THEN 1 ELSE 0 END)
    <= 1
  );
