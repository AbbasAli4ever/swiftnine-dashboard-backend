-- Backfills the ProjectMember row that 20260826150000_add_project_visibility
-- should have created for every pre-existing project's creator, but didn't
-- (that migration only created the table, with no data migration). Without
-- this, any project created before that migration has no ProjectMember row
-- at all — latent while it stays PUBLIC, but the creator gets locked out of
-- their own project (404, same as a non-member) the moment it's switched to
-- PRIVATE, since ProjectService.findProjectOrThrow checks membership for
-- every PRIVATE project, including against its own creator.
--
-- Idempotent (NOT EXISTS-guarded) — safe to run more than once, and safe to
-- run after ProjectService.updateVisibility's own self-healing fix (which
-- now always includes the creator in its grandfather insert) has already
-- repaired some of these rows.
INSERT INTO "project_members" (id, project_id, user_id, invited_by, created_at)
SELECT gen_random_uuid(), p.id, p.created_by, p.created_by, NOW()
FROM "projects" p
WHERE p.deleted_at IS NULL
  AND NOT EXISTS (
    SELECT 1 FROM "project_members" pm
    WHERE pm.project_id = p.id AND pm.user_id = p.created_by
  );
