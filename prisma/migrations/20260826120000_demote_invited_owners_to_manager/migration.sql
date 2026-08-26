-- Backfill for the single-OWNER rule.
--
-- Before MANAGER existed, the only way to give someone full workspace-management
-- rights was to invite them as OWNER, so existing workspaces can hold several
-- OWNER rows. The DTOs and `WorkspaceService.changeMemberRole()` now stop new
-- duplicates from forming, but they do not repair rows already in the database
-- -- this migration does that, once.
--
-- The workspace creator (`workspaces.created_by`) keeps OWNER. Every *other*
-- OWNER becomes MANAGER, which is the role that now carries exactly the rights
-- those members were invited to have: full parity with OWNER on settings,
-- delete, invites, add/remove member and change-role.
--
-- Safe by construction: the WHERE clause can only ever demote a non-creator, so
-- a workspace cannot lose its owner. A workspace whose creator has no OWNER row
-- (deleted account, hand-edited data) is left alone rather than silently
-- promoting someone -- verify those by hand if the count below is non-zero:
--
--   SELECT w.id, w.name FROM workspaces w
--   WHERE NOT EXISTS (
--     SELECT 1 FROM workspace_members wm
--     WHERE wm.workspace_id = w.id AND wm.user_id = w.created_by
--       AND wm.role = 'OWNER'
--   );

UPDATE workspace_members wm
SET role = 'MANAGER'
FROM workspaces w
WHERE w.id = wm.workspace_id
  AND wm.role = 'OWNER'
  AND w.created_by <> wm.user_id;
