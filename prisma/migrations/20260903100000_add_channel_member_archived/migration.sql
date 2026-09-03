-- ChannelMember.isArchived: per-person, hides a channel/DM from only that
-- member's own list. Purely additive, defaulted false, no data loss.

-- AlterTable
ALTER TABLE "channel_members" ADD COLUMN "is_archived" BOOLEAN NOT NULL DEFAULT false;
