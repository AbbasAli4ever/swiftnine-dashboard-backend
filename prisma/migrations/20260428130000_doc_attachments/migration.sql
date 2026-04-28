-- Allow attachments to belong to either a task or a doc.
ALTER TABLE "attachments" ADD COLUMN "doc_id" TEXT;
ALTER TABLE "attachments" ALTER COLUMN "task_id" DROP NOT NULL;

CREATE INDEX "attachments_doc_id_idx" ON "attachments"("doc_id");

ALTER TABLE "attachments"
  ADD CONSTRAINT "attachments_doc_id_fkey"
  FOREIGN KEY ("doc_id") REFERENCES "docs"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "attachments"
  ADD CONSTRAINT "attachments_exactly_one_owner_check"
  CHECK (
    ("task_id" IS NOT NULL AND "doc_id" IS NULL)
    OR ("task_id" IS NULL AND "doc_id" IS NOT NULL)
  );
