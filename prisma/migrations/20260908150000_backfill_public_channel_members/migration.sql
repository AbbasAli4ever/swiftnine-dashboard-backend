-- Backfill: every active workspace member belongs to every PUBLIC channel.
--
-- Commit 139bcb0 made this an invariant going forward (create() enrols the
-- whole workspace; joinAllPublicChannels() enrols later joiners), but shipped
-- no migration for channels created before it. Those channels still hold only
-- the members who were added by hand, so the rest of the workspace gets
-- 403 "Channel membership required" on rooms the product now calls open.
--
-- Idempotent: the (channel_id, user_id) unique index turns re-runs into no-ops.
-- Soft-deleted workspace members are skipped. Only kind = 'CHANNEL' is touched;
-- DMs are never public.
INSERT INTO "channel_members" ("id", "channel_id", "user_id", "role")
SELECT gen_random_uuid()::text, c."id", wm."user_id", 'MEMBER'::"Role"
FROM "channels" c
JOIN "workspace_members" wm
  ON wm."workspace_id" = c."workspace_id"
 AND wm."deleted_at" IS NULL
WHERE c."kind" = 'CHANNEL'
  AND c."privacy" = 'PUBLIC'
ON CONFLICT ("channel_id", "user_id") DO NOTHING;
