-- AlterTable
ALTER TABLE "tasks" ADD COLUMN "description_json" JSONB,
                    ADD COLUMN "description_plaintext" TEXT;
