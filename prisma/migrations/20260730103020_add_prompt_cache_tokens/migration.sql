-- AlterTable
ALTER TABLE "ai_conversation_messages" ADD COLUMN     "cache_write_prompt_tokens" INTEGER,
ADD COLUMN     "cached_prompt_tokens" INTEGER;
