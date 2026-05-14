-- CreateEnum
CREATE TYPE "AttachmentKind" AS ENUM ('FILE', 'LINK');

-- AlterTable
ALTER TABLE "attachments"
  ADD COLUMN "project_id" TEXT,
  ADD COLUMN "kind" "AttachmentKind" NOT NULL DEFAULT 'FILE',
  ADD COLUMN "link_url" TEXT,
  ADD COLUMN "title" TEXT,
  ADD COLUMN "description" TEXT,
  ALTER COLUMN "s3_key" DROP NOT NULL,
  ALTER COLUMN "mime_type" DROP NOT NULL,
  ALTER COLUMN "file_size" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "attachments_project_id_idx" ON "attachments"("project_id");

-- AddForeignKey
ALTER TABLE "attachments"
  ADD CONSTRAINT "attachments_project_id_fkey"
  FOREIGN KEY ("project_id") REFERENCES "projects"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;
