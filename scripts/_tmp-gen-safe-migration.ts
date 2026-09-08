import * as fs from 'fs';

// [prismaModel, prismaField, refTable] — refTable is what the FK points at
const TARGETS: Array<[string, string, string]> = [
  ['Workspace', 'createdBy', 'users'],
  ['WorkspaceInvite', 'invitedBy', 'users'],
  ['Project', 'createdBy', 'users'],
  ['ProjectMember', 'invitedBy', 'users'],
  ['TaskList', 'createdBy', 'users'],
  ['Task', 'createdBy', 'users'],
  ['TaskAssignee', 'userId', 'users'],
  ['TaskAssignee', 'assignedBy', 'users'],
  ['Comment', 'userId', 'users'],
  ['Mention', 'mentionedUserId', 'users'],
  ['Attachment', 'uploadedBy', 'users'],
  ['TimeEntry', 'userId', 'users'],
  ['ActivityLog', 'performedBy', 'users'],
  ['ChannelMember', 'userId', 'users'],
  ['ChannelMessageMention', 'mentionedUserId', 'users'],
  ['ChannelMessageReaction', 'userId', 'users'],
  ['ChannelJoinRequest', 'userId', 'users'],
  ['Doc', 'ownerId', 'users'],
  ['DocVersion', 'createdById', 'users'],
  ['DocPermission', 'userId', 'users'],
  ['DocPermission', 'grantedById', 'users'],
  ['DocCommentThread', 'createdById', 'users'],
  ['DocComment', 'authorId', 'users'],
  ['DocShareLink', 'createdById', 'users'],
];

const schema = fs.readFileSync('prisma/schema.prisma', 'utf-8');
const lines = schema.split('\n');

let currentModel = '';
let currentTable = '';
const modelTable = new Map<string, string>();
const fieldColumn = new Map<string, string>(); // key: Model.field -> column

for (const line of lines) {
  const modelMatch = line.match(/^model\s+(\w+)\s*\{/);
  if (modelMatch) { currentModel = modelMatch[1]; currentTable = ''; }
  const mapMatch = line.match(/@@map\("(\w+)"\)/);
  if (mapMatch && currentModel) modelTable.set(currentModel, mapMatch[1]);

  const fieldMatch = line.match(/^\s*(\w+)\s+String[?]?\s+.*@map\("(\w+)"\)/);
  if (fieldMatch && currentModel) {
    fieldColumn.set(`${currentModel}.${fieldMatch[1]}`, fieldMatch[2]);
  }
  // fields with no @map (column name === field name), e.g. userId, ownerUserId without explicit map is rare here but handle:
  const plainFieldMatch = line.match(/^\s*(\w+)\s+String[?]?\s*$/);
  if (plainFieldMatch && currentModel && !fieldColumn.has(`${currentModel}.${plainFieldMatch[1]}`)) {
    // not used for our targets, skip
  }
}

function genBlock(table: string, column: string, refTable: string): string {
  const defaultName = `${table}_${column}_fkey`;
  return `DO $$
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

const blocks: string[] = [];
for (const [model, field, refTable] of TARGETS) {
  const table = modelTable.get(model);
  const column = fieldColumn.get(`${model}.${field}`);
  if (!table || !column) {
    console.error(`MISSING MAPPING for ${model}.${field} -> table=${table} column=${column}`);
    continue;
  }
  blocks.push(`-- ${model}.${field}\n` + genBlock(table, column, refTable));
}

const header = `-- Deleting a User should delete every piece of associated data across the
-- app, per explicit request. These FKs to users(id) previously had no
-- ON DELETE clause (Postgres default: NO ACTION / RESTRICT, blocking the
-- delete). This switches them to CASCADE.
--
-- Each block looks up the CURRENT constraint name for the given (table,
-- column) pair via information_schema rather than assuming Prisma's default
-- <table>_<column>_fkey naming, since a prior version of this migration
-- guessed a wrong column name for the Doc* "...ById" fields and failed
-- against production with "constraint ... does not exist". This form can't
-- fail that way regardless of naming drift, and is idempotent to re-run.
--
-- NOTE (deliberate, discussed with the user before applying): this includes
-- Workspace.created_by, Project.created_by, and Doc.owner_id -- deleting the
-- creator of a workspace/project/doc will now cascade-delete that entire
-- workspace/project/doc and everything under it for every other member, not
-- just the deleted user's own data. Comment.user_id cascading combined with
-- the existing self-referential Comment.parent_id cascade also means other
-- users' replies to a deleted user's comment disappear too. Chosen anyway,
-- with these tradeoffs understood.

`;

fs.writeFileSync('prisma/migrations/20260908130000_cascade_user_delete/migration.sql', header + blocks.join('\n'));
console.log('Wrote migration 1 with', blocks.length, 'blocks');
