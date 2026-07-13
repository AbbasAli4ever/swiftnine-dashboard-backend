/*
  Warnings:

  - Added the required column `updated_at` to the `attachments` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AttachmentContentType" AS ENUM ('IMAGE', 'PDF', 'PPT', 'EXCEL', 'CSV', 'DOCUMENT', 'CODE', 'TEXT', 'GENERATED_IMAGE', 'GENERATED_PDF', 'GENERATED_PPT');

-- CreateEnum
CREATE TYPE "AttachmentUploadStatus" AS ENUM ('PENDING', 'CONFIRMED');

-- AlterTable
ALTER TABLE "attachments" ADD COLUMN     "ai_conversation_id" TEXT,
ADD COLUMN     "ai_conversation_message_id" TEXT,
ADD COLUMN     "content_type" "AttachmentContentType",
ADD COLUMN     "metadata" JSONB,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "upload_status" "AttachmentUploadStatus" NOT NULL DEFAULT 'CONFIRMED';

-- CreateIndex
CREATE INDEX "attachments_ai_conversation_id_deleted_at_created_at_idx" ON "attachments"("ai_conversation_id", "deleted_at", "created_at");

-- CreateIndex
CREATE INDEX "attachments_ai_conversation_message_id_idx" ON "attachments"("ai_conversation_message_id");

-- AddForeignKey
ALTER TABLE "attachments" ADD CONSTRAINT "attachments_ai_conversation_id_fkey" FOREIGN KEY ("ai_conversation_id") REFERENCES "ai_conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attachments" ADD CONSTRAINT "attachments_ai_conversation_message_id_fkey" FOREIGN KEY ("ai_conversation_message_id") REFERENCES "ai_conversation_messages"("id") ON DELETE CASCADE ON UPDATE CASCADE;
