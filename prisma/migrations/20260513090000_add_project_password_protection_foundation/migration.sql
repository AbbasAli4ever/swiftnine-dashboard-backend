-- AlterTable
ALTER TABLE "projects"
  ADD COLUMN "password_hash" TEXT,
  ADD COLUMN "password_set_by" TEXT,
  ADD COLUMN "password_updated_at" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "project_unlock_sessions" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "project_unlock_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_unlock_attempts" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "failed_count" INTEGER NOT NULL DEFAULT 0,
    "locked_until" TIMESTAMP(3),
    "last_fail_at" TIMESTAMP(3),

    CONSTRAINT "project_unlock_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_password_reset_tokens" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "token_hash" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "used_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "project_password_reset_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "project_unlock_sessions_project_id_user_id_key" ON "project_unlock_sessions"("project_id", "user_id");

-- CreateIndex
CREATE INDEX "project_unlock_sessions_expires_at_idx" ON "project_unlock_sessions"("expires_at");

-- CreateIndex
CREATE UNIQUE INDEX "project_unlock_attempts_project_id_user_id_key" ON "project_unlock_attempts"("project_id", "user_id");

-- CreateIndex
CREATE INDEX "project_unlock_attempts_locked_until_idx" ON "project_unlock_attempts"("locked_until");

-- CreateIndex
CREATE UNIQUE INDEX "project_password_reset_tokens_token_hash_key" ON "project_password_reset_tokens"("token_hash");

-- CreateIndex
CREATE INDEX "project_password_reset_tokens_project_id_idx" ON "project_password_reset_tokens"("project_id");

-- CreateIndex
CREATE INDEX "project_password_reset_tokens_expires_at_idx" ON "project_password_reset_tokens"("expires_at");

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_password_set_by_fkey" FOREIGN KEY ("password_set_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_unlock_sessions" ADD CONSTRAINT "project_unlock_sessions_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_unlock_sessions" ADD CONSTRAINT "project_unlock_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_unlock_attempts" ADD CONSTRAINT "project_unlock_attempts_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_unlock_attempts" ADD CONSTRAINT "project_unlock_attempts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_password_reset_tokens" ADD CONSTRAINT "project_password_reset_tokens_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
