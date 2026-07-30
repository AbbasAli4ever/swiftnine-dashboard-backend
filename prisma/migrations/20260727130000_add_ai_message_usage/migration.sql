-- AlterTable
ALTER TABLE "ai_conversation_messages" ADD COLUMN "model" TEXT;
ALTER TABLE "ai_conversation_messages" ADD COLUMN "prompt_tokens" INTEGER;
ALTER TABLE "ai_conversation_messages" ADD COLUMN "completion_tokens" INTEGER;
ALTER TABLE "ai_conversation_messages" ADD COLUMN "estimated_cost_usd" DECIMAL(12,6);
