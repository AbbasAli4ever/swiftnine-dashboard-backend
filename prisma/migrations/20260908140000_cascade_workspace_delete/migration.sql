-- Completes the User-delete cascade chain from the prior migration: since
-- Workspace.created_by now cascades from users, deleting a user who created
-- a workspace also deletes that workspace -- but activity_logs.workspace_id
-- and channels.workspace_id had no ON DELETE clause (implicit RESTRICT),
-- which would block the workspace delete. Switching both to CASCADE.
--
-- Uses the same self-discovering DO-block form as the prior migration (looks
-- up the actual constraint name via information_schema rather than assuming
-- Prisma's default naming) since that assumption already broke once.

-- activity_logs.workspace_id
DO $$
DECLARE
  con_name text;
BEGIN
  SELECT tc.constraint_name INTO con_name
  FROM information_schema.table_constraints tc
  JOIN information_schema.key_column_usage kcu
    ON tc.constraint_name = kcu.constraint_name AND tc.table_schema = kcu.table_schema
  WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_schema = 'public'
    AND tc.table_name = 'activity_logs'
    AND kcu.column_name = 'workspace_id'
  LIMIT 1;

  IF con_name IS NOT NULL THEN
    EXECUTE format('ALTER TABLE %I DROP CONSTRAINT %I', 'activity_logs', con_name);
  END IF;

  EXECUTE format(
    'ALTER TABLE %I ADD CONSTRAINT %I FOREIGN KEY (%I) REFERENCES %I(%I) ON DELETE CASCADE ON UPDATE CASCADE',
    'activity_logs', 'activity_logs_workspace_id_fkey', 'workspace_id', 'workspaces', 'id'
  );
END $$;

-- channels.workspace_id
DO $$
DECLARE
  con_name text;
BEGIN
  SELECT tc.constraint_name INTO con_name
  FROM information_schema.table_constraints tc
  JOIN information_schema.key_column_usage kcu
    ON tc.constraint_name = kcu.constraint_name AND tc.table_schema = kcu.table_schema
  WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_schema = 'public'
    AND tc.table_name = 'channels'
    AND kcu.column_name = 'workspace_id'
  LIMIT 1;

  IF con_name IS NOT NULL THEN
    EXECUTE format('ALTER TABLE %I DROP CONSTRAINT %I', 'channels', con_name);
  END IF;

  EXECUTE format(
    'ALTER TABLE %I ADD CONSTRAINT %I FOREIGN KEY (%I) REFERENCES %I(%I) ON DELETE CASCADE ON UPDATE CASCADE',
    'channels', 'channels_workspace_id_fkey', 'workspace_id', 'workspaces', 'id'
  );
END $$;
