-- CreateEnum
CREATE TYPE "DocScope" AS ENUM ('WORKSPACE', 'PROJECT', 'PERSONAL');

-- CreateEnum
CREATE TYPE "DocRole" AS ENUM ('VIEWER', 'COMMENTER', 'EDITOR', 'OWNER');

-- CreateEnum
CREATE TYPE "DocVersionType" AS ENUM ('AUTO', 'MANUAL', 'RESTORE_SAFETY');

-- CreateTable
CREATE TABLE "docs" (
    "id" TEXT NOT NULL,
    "workspace_id" TEXT NOT NULL,
    "project_id" TEXT,
    "owner_id" TEXT NOT NULL,
    "scope" "DocScope" NOT NULL,
    "title" TEXT NOT NULL,
    "content_json" JSONB NOT NULL DEFAULT '{}',
    "plaintext" TEXT NOT NULL DEFAULT '',
    "version" INTEGER NOT NULL DEFAULT 0,
    "last_checkpoint_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "docs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "doc_versions" (
    "id" TEXT NOT NULL,
    "doc_id" TEXT NOT NULL,
    "content_json" JSONB NOT NULL,
    "type" "DocVersionType" NOT NULL,
    "label" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" TEXT NOT NULL,

    CONSTRAINT "doc_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "doc_permissions" (
    "id" TEXT NOT NULL,
    "doc_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "role" "DocRole" NOT NULL,
    "granted_by_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "doc_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "doc_comment_threads" (
    "id" TEXT NOT NULL,
    "doc_id" TEXT NOT NULL,
    "anchor_block_id" TEXT,
    "anchor_meta" JSONB,
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "is_orphan" BOOLEAN NOT NULL DEFAULT false,
    "created_by_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "doc_comment_threads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "doc_comments" (
    "id" TEXT NOT NULL,
    "thread_id" TEXT NOT NULL,
    "author_id" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "edited_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "doc_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "doc_share_links" (
    "id" TEXT NOT NULL,
    "doc_id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "role" "DocRole" NOT NULL,
    "expires_at" TIMESTAMP(3),
    "created_by_id" TEXT NOT NULL,
    "revoked_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "doc_share_links_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "docs_workspace_id_scope_deleted_at_idx" ON "docs"("workspace_id", "scope", "deleted_at");

-- CreateIndex
CREATE INDEX "docs_project_id_idx" ON "docs"("project_id");

-- CreateIndex
CREATE INDEX "docs_owner_id_idx" ON "docs"("owner_id");

-- CreateIndex
CREATE INDEX "doc_versions_doc_id_created_at_idx" ON "doc_versions"("doc_id", "created_at");

-- CreateIndex
CREATE INDEX "doc_permissions_user_id_idx" ON "doc_permissions"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "doc_permissions_doc_id_user_id_key" ON "doc_permissions"("doc_id", "user_id");

-- CreateIndex
CREATE INDEX "doc_comment_threads_doc_id_resolved_idx" ON "doc_comment_threads"("doc_id", "resolved");

-- CreateIndex
CREATE INDEX "doc_comments_thread_id_created_at_idx" ON "doc_comments"("thread_id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "doc_share_links_token_key" ON "doc_share_links"("token");

-- CreateIndex
CREATE INDEX "doc_share_links_doc_id_idx" ON "doc_share_links"("doc_id");

-- AddForeignKey
ALTER TABLE "docs" ADD CONSTRAINT "docs_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "docs" ADD CONSTRAINT "docs_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "docs" ADD CONSTRAINT "docs_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doc_versions" ADD CONSTRAINT "doc_versions_doc_id_fkey" FOREIGN KEY ("doc_id") REFERENCES "docs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doc_versions" ADD CONSTRAINT "doc_versions_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doc_permissions" ADD CONSTRAINT "doc_permissions_doc_id_fkey" FOREIGN KEY ("doc_id") REFERENCES "docs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doc_permissions" ADD CONSTRAINT "doc_permissions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doc_permissions" ADD CONSTRAINT "doc_permissions_granted_by_id_fkey" FOREIGN KEY ("granted_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doc_comment_threads" ADD CONSTRAINT "doc_comment_threads_doc_id_fkey" FOREIGN KEY ("doc_id") REFERENCES "docs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doc_comment_threads" ADD CONSTRAINT "doc_comment_threads_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doc_comments" ADD CONSTRAINT "doc_comments_thread_id_fkey" FOREIGN KEY ("thread_id") REFERENCES "doc_comment_threads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doc_comments" ADD CONSTRAINT "doc_comments_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doc_share_links" ADD CONSTRAINT "doc_share_links_doc_id_fkey" FOREIGN KEY ("doc_id") REFERENCES "docs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doc_share_links" ADD CONSTRAINT "doc_share_links_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "notifications_user_id_is_read_is_cleared_is_snoozed_created_at_" RENAME TO "notifications_user_id_is_read_is_cleared_is_snoozed_created_idx";
