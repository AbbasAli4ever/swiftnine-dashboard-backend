-- CreateEnum
CREATE TYPE "AiModelTier" AS ENUM ('PREMIUM', 'STANDARD');

-- AlterTable
ALTER TABLE "workspace_members" ADD COLUMN "ai_model_tier" "AiModelTier" NOT NULL DEFAULT 'STANDARD';

-- CreateTable
CREATE TABLE "tier_change_secrets" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "secret_hash" TEXT NOT NULL,
    "revoked_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tier_change_secrets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tier_change_attempts" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "failed_count" INTEGER NOT NULL DEFAULT 0,
    "locked_until" TIMESTAMP(3),
    "last_fail_at" TIMESTAMP(3),

    CONSTRAINT "tier_change_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_tier_change_logs" (
    "id" TEXT NOT NULL,
    "workspace_id" TEXT NOT NULL,
    "target_user_id" TEXT NOT NULL,
    "actor_user_id" TEXT NOT NULL,
    "from_tier" "AiModelTier" NOT NULL,
    "to_tier" "AiModelTier" NOT NULL,
    "secret_label" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_tier_change_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tier_change_secrets_label_key" ON "tier_change_secrets"("label");

-- CreateIndex
CREATE INDEX "tier_change_secrets_revoked_at_idx" ON "tier_change_secrets"("revoked_at");

-- CreateIndex
CREATE UNIQUE INDEX "tier_change_attempts_user_id_key" ON "tier_change_attempts"("user_id");

-- CreateIndex
CREATE INDEX "tier_change_attempts_locked_until_idx" ON "tier_change_attempts"("locked_until");

-- CreateIndex
CREATE INDEX "ai_tier_change_logs_workspace_id_created_at_idx" ON "ai_tier_change_logs"("workspace_id", "created_at");

-- CreateIndex
CREATE INDEX "ai_tier_change_logs_target_user_id_idx" ON "ai_tier_change_logs"("target_user_id");

-- AddForeignKey
ALTER TABLE "tier_change_attempts" ADD CONSTRAINT "tier_change_attempts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_tier_change_logs" ADD CONSTRAINT "ai_tier_change_logs_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_tier_change_logs" ADD CONSTRAINT "ai_tier_change_logs_target_user_id_fkey" FOREIGN KEY ("target_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_tier_change_logs" ADD CONSTRAINT "ai_tier_change_logs_actor_user_id_fkey" FOREIGN KEY ("actor_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
