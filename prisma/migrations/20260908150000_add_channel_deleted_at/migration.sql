-- Channel.deletedAt: an owner "deleting" a channel freezes it (blocks new
-- messages, excluded from listings) without destroying the row, its
-- members, or its message history. Purely additive, defaulted null.

-- AlterTable
ALTER TABLE "channels" ADD COLUMN "deleted_at" TIMESTAMP(3);
