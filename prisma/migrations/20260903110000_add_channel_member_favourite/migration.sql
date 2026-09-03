-- ChannelMember.isFavourite: per-person, stars a channel/DM in only that
-- member's own list. Purely additive, defaulted false, no data loss.

-- AlterTable
ALTER TABLE "channel_members" ADD COLUMN "is_favourite" BOOLEAN NOT NULL DEFAULT false;
