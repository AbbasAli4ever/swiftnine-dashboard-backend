/*
  Warnings:

  - Added the required column `workspace_id` to the `notifications` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "notifications" ADD COLUMN     "workspace_id" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "notifications_workspace_id_user_id_idx" ON "notifications"("workspace_id", "user_id");

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;
