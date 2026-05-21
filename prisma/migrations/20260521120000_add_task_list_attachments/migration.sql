ALTER TABLE "attachments"
  ADD COLUMN "task_list_id" TEXT;

CREATE INDEX "attachments_task_list_id_idx" ON "attachments"("task_list_id");

ALTER TABLE "attachments"
  ADD CONSTRAINT "attachments_task_list_id_fkey"
  FOREIGN KEY ("task_list_id") REFERENCES "task_lists"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "attachments"
  DROP CONSTRAINT IF EXISTS "attachments_at_most_one_owner_check";

ALTER TABLE "attachments"
  ADD CONSTRAINT "attachments_at_most_one_owner_check"
  CHECK (
    (CASE WHEN "task_id" IS NOT NULL THEN 1 ELSE 0 END) +
    (CASE WHEN "doc_id" IS NOT NULL THEN 1 ELSE 0 END) +
    (CASE WHEN "channel_message_id" IS NOT NULL THEN 1 ELSE 0 END) +
    (CASE WHEN "project_id" IS NOT NULL THEN 1 ELSE 0 END) +
    (CASE WHEN "task_list_id" IS NOT NULL THEN 1 ELSE 0 END)
    <= 1
  );
