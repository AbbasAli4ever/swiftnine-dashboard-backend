import * as fs from 'fs';

function genBlock(table: string, column: string, refTable: string): string {
  const defaultName = `${table}_${column}_fkey`;
  return `-- ${table}.${column}
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
    AND tc.table_name = '${table}'
    AND kcu.column_name = '${column}'
  LIMIT 1;

  IF con_name IS NOT NULL THEN
    EXECUTE format('ALTER TABLE %I DROP CONSTRAINT %I', '${table}', con_name);
  END IF;

  EXECUTE format(
    'ALTER TABLE %I ADD CONSTRAINT %I FOREIGN KEY (%I) REFERENCES %I(%I) ON DELETE CASCADE ON UPDATE CASCADE',
    '${table}', '${defaultName}', '${column}', '${refTable}', 'id'
  );
END $$;
`;
}

const header = `-- Completes the User-delete cascade chain from the prior migration: since
-- Workspace.created_by now cascades from users, deleting a user who created
-- a workspace also deletes that workspace -- but activity_logs.workspace_id
-- and channels.workspace_id had no ON DELETE clause (implicit RESTRICT),
-- which would block the workspace delete. Switching both to CASCADE.
--
-- Uses the same self-discovering DO-block form as the prior migration (looks
-- up the actual constraint name via information_schema rather than assuming
-- Prisma's default naming) since that assumption already broke once.

`;

const blocks = [
  genBlock('activity_logs', 'workspace_id', 'workspaces'),
  genBlock('channels', 'workspace_id', 'workspaces'),
];

fs.writeFileSync('prisma/migrations/20260908140000_cascade_workspace_delete/migration.sql', header + blocks.join('\n'));
console.log('Wrote migration 2');
