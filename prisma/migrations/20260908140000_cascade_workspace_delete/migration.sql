-- Completes the User-delete cascade chain from the prior migration: since
-- Workspace.created_by now cascades from users, deleting a user who created
-- a workspace also deletes that workspace — but activity_logs.workspace_id
-- and channels.workspace_id had no ON DELETE clause (implicit RESTRICT),
-- which would block the workspace delete. Switching both to CASCADE.
-- channels.project_id is made an explicit SetNull to match its existing
-- (already-nullable) implicit behavior — no actual change there.

ALTER TABLE "activity_logs" DROP CONSTRAINT "activity_logs_workspace_id_fkey";
ALTER TABLE "activity_logs" ADD CONSTRAINT "activity_logs_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "channels" DROP CONSTRAINT "channels_workspace_id_fkey";
ALTER TABLE "channels" ADD CONSTRAINT "channels_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;
