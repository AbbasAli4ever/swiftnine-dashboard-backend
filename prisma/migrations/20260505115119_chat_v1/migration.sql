-- CreateEnum (idempotent)
DO $$ BEGIN
  CREATE TYPE "ChannelKind" AS ENUM ('CHANNEL', 'DM');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- CreateEnum (idempotent)
DO $$ BEGIN
  CREATE TYPE "ChannelMessageKind" AS ENUM ('USER', 'SYSTEM');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- CreateEnum (idempotent)
DO $$ BEGIN
  CREATE TYPE "ChannelJoinRequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- AlterEnum (idempotent — value may already exist from a partial prior run)
DO $$ BEGIN
  ALTER TYPE "Role" ADD VALUE 'ADMIN';
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- AlterTable
ALTER TABLE "attachments" ADD COLUMN     "channel_message_id" TEXT;

-- AlterTable
ALTER TABLE "channel_members" ADD COLUMN     "is_muted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "last_read_message_id" TEXT,
ADD COLUMN     "unread_count" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "channels" ADD COLUMN     "kind" "ChannelKind" NOT NULL DEFAULT 'CHANNEL',
ALTER COLUMN "name" DROP NOT NULL;

-- CreateTable
CREATE TABLE "channel_messages" (
    "id" TEXT NOT NULL,
    "channel_id" TEXT NOT NULL,
    "sender_id" TEXT,
    "kind" "ChannelMessageKind" NOT NULL DEFAULT 'USER',
    "content_json" JSONB NOT NULL,
    "plaintext" TEXT NOT NULL DEFAULT '',
    "reply_to_message_id" TEXT,
    "is_edited" BOOLEAN NOT NULL DEFAULT false,
    "edited_at" TIMESTAMP(3),
    "is_pinned" BOOLEAN NOT NULL DEFAULT false,
    "pinned_at" TIMESTAMP(3),
    "pinned_by_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "channel_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "channel_message_mentions" (
    "id" TEXT NOT NULL,
    "message_id" TEXT NOT NULL,
    "mentioned_user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "channel_message_mentions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "channel_message_reactions" (
    "id" TEXT NOT NULL,
    "message_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "emoji" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "channel_message_reactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "channel_join_requests" (
    "id" TEXT NOT NULL,
    "channel_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "status" "ChannelJoinRequestStatus" NOT NULL DEFAULT 'PENDING',
    "requested_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "decided_by_id" TEXT,
    "decided_at" TIMESTAMP(3),

    CONSTRAINT "channel_join_requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "channel_messages_channel_id_created_at_id_idx" ON "channel_messages"("channel_id", "created_at" DESC, "id");

-- CreateIndex
CREATE INDEX "channel_messages_channel_id_is_pinned_created_at_idx" ON "channel_messages"("channel_id", "is_pinned", "created_at");

-- CreateIndex
CREATE INDEX "channel_messages_sender_id_idx" ON "channel_messages"("sender_id");

-- CreateIndex
CREATE INDEX "channel_message_mentions_mentioned_user_id_idx" ON "channel_message_mentions"("mentioned_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "channel_message_mentions_message_id_mentioned_user_id_key" ON "channel_message_mentions"("message_id", "mentioned_user_id");

-- CreateIndex
CREATE INDEX "channel_message_reactions_message_id_idx" ON "channel_message_reactions"("message_id");

-- CreateIndex
CREATE UNIQUE INDEX "channel_message_reactions_message_id_user_id_emoji_key" ON "channel_message_reactions"("message_id", "user_id", "emoji");

-- CreateIndex
CREATE INDEX "channel_join_requests_channel_id_status_idx" ON "channel_join_requests"("channel_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "channel_join_requests_channel_id_user_id_status_key" ON "channel_join_requests"("channel_id", "user_id", "status");

-- CreateIndex
CREATE INDEX "attachments_channel_message_id_idx" ON "attachments"("channel_message_id");

-- CreateIndex
CREATE INDEX "channel_members_user_id_channel_id_idx" ON "channel_members"("user_id", "channel_id");

-- CreateIndex
CREATE INDEX "channels_workspace_id_kind_idx" ON "channels"("workspace_id", "kind");

-- AddForeignKey
ALTER TABLE "attachments" ADD CONSTRAINT "attachments_channel_message_id_fkey" FOREIGN KEY ("channel_message_id") REFERENCES "channel_messages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "channel_messages" ADD CONSTRAINT "channel_messages_channel_id_fkey" FOREIGN KEY ("channel_id") REFERENCES "channels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "channel_messages" ADD CONSTRAINT "channel_messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "channel_messages" ADD CONSTRAINT "channel_messages_pinned_by_id_fkey" FOREIGN KEY ("pinned_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "channel_messages" ADD CONSTRAINT "channel_messages_reply_to_message_id_fkey" FOREIGN KEY ("reply_to_message_id") REFERENCES "channel_messages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "channel_message_mentions" ADD CONSTRAINT "channel_message_mentions_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "channel_messages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "channel_message_mentions" ADD CONSTRAINT "channel_message_mentions_mentioned_user_id_fkey" FOREIGN KEY ("mentioned_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "channel_message_reactions" ADD CONSTRAINT "channel_message_reactions_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "channel_messages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "channel_message_reactions" ADD CONSTRAINT "channel_message_reactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "channel_join_requests" ADD CONSTRAINT "channel_join_requests_channel_id_fkey" FOREIGN KEY ("channel_id") REFERENCES "channels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "channel_join_requests" ADD CONSTRAINT "channel_join_requests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "channel_join_requests" ADD CONSTRAINT "channel_join_requests_decided_by_id_fkey" FOREIGN KEY ("decided_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
