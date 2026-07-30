
-- CreateEnum
CREATE TYPE "TokenSource" AS ENUM ('MEASURED', 'TOKENIZED_PROMPT', 'HEURISTIC', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "AiTokenAllowanceEvent" AS ENUM ('LIMIT_SET', 'MANUAL_RESET', 'PERIOD_ROLLOVER');

-- AlterTable
ALTER TABLE "ai_conversation_messages" ADD COLUMN     "estimated_completion_tokens" INTEGER,
ADD COLUMN     "estimated_prompt_tokens" INTEGER,
ADD COLUMN     "image_count" INTEGER,
ADD COLUMN     "token_source" "TokenSource";


-- CreateTable
CREATE TABLE "ai_token_allowances" (
    "id" TEXT NOT NULL,
    "workspace_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "period_start" TIMESTAMP(3) NOT NULL,
    "token_limit" INTEGER NOT NULL,
    "consumed_tokens" INTEGER NOT NULL DEFAULT 0,
    "estimated_tokens" INTEGER NOT NULL DEFAULT 0,
    "cost_usd_used" DECIMAL(12,6) NOT NULL DEFAULT 0,
    "fallback_opt_in" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ai_token_allowances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_token_allowance_history" (
    "id" TEXT NOT NULL,
    "workspace_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "event" "AiTokenAllowanceEvent" NOT NULL,
    "period_start" TIMESTAMP(3) NOT NULL,
    "token_limit" INTEGER NOT NULL,
    "consumed_tokens" INTEGER NOT NULL,
    "cost_usd_used" DECIMAL(12,6) NOT NULL,
    "actor_user_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_token_allowance_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ai_token_allowances_workspace_id_user_id_period_start_idx" ON "ai_token_allowances"("workspace_id", "user_id", "period_start" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "ai_token_allowances_workspace_id_user_id_period_start_key" ON "ai_token_allowances"("workspace_id", "user_id", "period_start");

-- CreateIndex
CREATE INDEX "ai_token_allowance_history_workspace_id_user_id_created_at_idx" ON "ai_token_allowance_history"("workspace_id", "user_id", "created_at" DESC);

-- AddForeignKey
ALTER TABLE "ai_token_allowances" ADD CONSTRAINT "ai_token_allowances_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_token_allowances" ADD CONSTRAINT "ai_token_allowances_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_token_allowance_history" ADD CONSTRAINT "ai_token_allowance_history_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_token_allowance_history" ADD CONSTRAINT "ai_token_allowance_history_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_token_allowance_history" ADD CONSTRAINT "ai_token_allowance_history_actor_user_id_fkey" FOREIGN KEY ("actor_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

