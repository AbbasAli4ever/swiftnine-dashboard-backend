-- Deleting a User should delete every piece of associated data across the
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

-- Workspace.createdBy
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
    AND tc.table_name = 'workspaces'
    AND kcu.column_name = 'created_by'
  LIMIT 1;

  IF con_name IS NOT NULL THEN
    EXECUTE format('ALTER TABLE %I DROP CONSTRAINT %I', 'workspaces', con_name);
  END IF;

  EXECUTE format(
    'ALTER TABLE %I ADD CONSTRAINT %I FOREIGN KEY (%I) REFERENCES %I(%I) ON DELETE CASCADE ON UPDATE CASCADE',
    'workspaces', 'workspaces_created_by_fkey', 'created_by', 'users', 'id'
  );
END $$;

-- WorkspaceInvite.invitedBy
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
    AND tc.table_name = 'workspace_invites'
    AND kcu.column_name = 'invited_by'
  LIMIT 1;

  IF con_name IS NOT NULL THEN
    EXECUTE format('ALTER TABLE %I DROP CONSTRAINT %I', 'workspace_invites', con_name);
  END IF;

  EXECUTE format(
    'ALTER TABLE %I ADD CONSTRAINT %I FOREIGN KEY (%I) REFERENCES %I(%I) ON DELETE CASCADE ON UPDATE CASCADE',
    'workspace_invites', 'workspace_invites_invited_by_fkey', 'invited_by', 'users', 'id'
  );
END $$;

-- Project.createdBy
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
    AND tc.table_name = 'projects'
    AND kcu.column_name = 'created_by'
  LIMIT 1;

  IF con_name IS NOT NULL THEN
    EXECUTE format('ALTER TABLE %I DROP CONSTRAINT %I', 'projects', con_name);
  END IF;

  EXECUTE format(
    'ALTER TABLE %I ADD CONSTRAINT %I FOREIGN KEY (%I) REFERENCES %I(%I) ON DELETE CASCADE ON UPDATE CASCADE',
    'projects', 'projects_created_by_fkey', 'created_by', 'users', 'id'
  );
END $$;

-- ProjectMember.invitedBy
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
    AND tc.table_name = 'project_members'
    AND kcu.column_name = 'invited_by'
  LIMIT 1;

  IF con_name IS NOT NULL THEN
    EXECUTE format('ALTER TABLE %I DROP CONSTRAINT %I', 'project_members', con_name);
  END IF;

  EXECUTE format(
    'ALTER TABLE %I ADD CONSTRAINT %I FOREIGN KEY (%I) REFERENCES %I(%I) ON DELETE CASCADE ON UPDATE CASCADE',
    'project_members', 'project_members_invited_by_fkey', 'invited_by', 'users', 'id'
  );
END $$;

-- TaskList.createdBy
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
    AND tc.table_name = 'task_lists'
    AND kcu.column_name = 'created_by'
  LIMIT 1;

  IF con_name IS NOT NULL THEN
    EXECUTE format('ALTER TABLE %I DROP CONSTRAINT %I', 'task_lists', con_name);
  END IF;

  EXECUTE format(
    'ALTER TABLE %I ADD CONSTRAINT %I FOREIGN KEY (%I) REFERENCES %I(%I) ON DELETE CASCADE ON UPDATE CASCADE',
    'task_lists', 'task_lists_created_by_fkey', 'created_by', 'users', 'id'
  );
END $$;

-- Task.createdBy
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
    AND tc.table_name = 'tasks'
    AND kcu.column_name = 'created_by'
  LIMIT 1;

  IF con_name IS NOT NULL THEN
    EXECUTE format('ALTER TABLE %I DROP CONSTRAINT %I', 'tasks', con_name);
  END IF;

  EXECUTE format(
    'ALTER TABLE %I ADD CONSTRAINT %I FOREIGN KEY (%I) REFERENCES %I(%I) ON DELETE CASCADE ON UPDATE CASCADE',
    'tasks', 'tasks_created_by_fkey', 'created_by', 'users', 'id'
  );
END $$;

-- TaskAssignee.userId
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
    AND tc.table_name = 'task_assignees'
    AND kcu.column_name = 'user_id'
  LIMIT 1;

  IF con_name IS NOT NULL THEN
    EXECUTE format('ALTER TABLE %I DROP CONSTRAINT %I', 'task_assignees', con_name);
  END IF;

  EXECUTE format(
    'ALTER TABLE %I ADD CONSTRAINT %I FOREIGN KEY (%I) REFERENCES %I(%I) ON DELETE CASCADE ON UPDATE CASCADE',
    'task_assignees', 'task_assignees_user_id_fkey', 'user_id', 'users', 'id'
  );
END $$;

-- TaskAssignee.assignedBy
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
    AND tc.table_name = 'task_assignees'
    AND kcu.column_name = 'assigned_by'
  LIMIT 1;

  IF con_name IS NOT NULL THEN
    EXECUTE format('ALTER TABLE %I DROP CONSTRAINT %I', 'task_assignees', con_name);
  END IF;

  EXECUTE format(
    'ALTER TABLE %I ADD CONSTRAINT %I FOREIGN KEY (%I) REFERENCES %I(%I) ON DELETE CASCADE ON UPDATE CASCADE',
    'task_assignees', 'task_assignees_assigned_by_fkey', 'assigned_by', 'users', 'id'
  );
END $$;

-- Comment.userId
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
    AND tc.table_name = 'comments'
    AND kcu.column_name = 'user_id'
  LIMIT 1;

  IF con_name IS NOT NULL THEN
    EXECUTE format('ALTER TABLE %I DROP CONSTRAINT %I', 'comments', con_name);
  END IF;

  EXECUTE format(
    'ALTER TABLE %I ADD CONSTRAINT %I FOREIGN KEY (%I) REFERENCES %I(%I) ON DELETE CASCADE ON UPDATE CASCADE',
    'comments', 'comments_user_id_fkey', 'user_id', 'users', 'id'
  );
END $$;

-- Mention.mentionedUserId
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
    AND tc.table_name = 'mentions'
    AND kcu.column_name = 'mentioned_user_id'
  LIMIT 1;

  IF con_name IS NOT NULL THEN
    EXECUTE format('ALTER TABLE %I DROP CONSTRAINT %I', 'mentions', con_name);
  END IF;

  EXECUTE format(
    'ALTER TABLE %I ADD CONSTRAINT %I FOREIGN KEY (%I) REFERENCES %I(%I) ON DELETE CASCADE ON UPDATE CASCADE',
    'mentions', 'mentions_mentioned_user_id_fkey', 'mentioned_user_id', 'users', 'id'
  );
END $$;

-- Attachment.uploadedBy
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
    AND tc.table_name = 'attachments'
    AND kcu.column_name = 'uploaded_by'
  LIMIT 1;

  IF con_name IS NOT NULL THEN
    EXECUTE format('ALTER TABLE %I DROP CONSTRAINT %I', 'attachments', con_name);
  END IF;

  EXECUTE format(
    'ALTER TABLE %I ADD CONSTRAINT %I FOREIGN KEY (%I) REFERENCES %I(%I) ON DELETE CASCADE ON UPDATE CASCADE',
    'attachments', 'attachments_uploaded_by_fkey', 'uploaded_by', 'users', 'id'
  );
END $$;

-- TimeEntry.userId
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
    AND tc.table_name = 'time_entries'
    AND kcu.column_name = 'user_id'
  LIMIT 1;

  IF con_name IS NOT NULL THEN
    EXECUTE format('ALTER TABLE %I DROP CONSTRAINT %I', 'time_entries', con_name);
  END IF;

  EXECUTE format(
    'ALTER TABLE %I ADD CONSTRAINT %I FOREIGN KEY (%I) REFERENCES %I(%I) ON DELETE CASCADE ON UPDATE CASCADE',
    'time_entries', 'time_entries_user_id_fkey', 'user_id', 'users', 'id'
  );
END $$;

-- ActivityLog.performedBy
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
    AND kcu.column_name = 'performed_by'
  LIMIT 1;

  IF con_name IS NOT NULL THEN
    EXECUTE format('ALTER TABLE %I DROP CONSTRAINT %I', 'activity_logs', con_name);
  END IF;

  EXECUTE format(
    'ALTER TABLE %I ADD CONSTRAINT %I FOREIGN KEY (%I) REFERENCES %I(%I) ON DELETE CASCADE ON UPDATE CASCADE',
    'activity_logs', 'activity_logs_performed_by_fkey', 'performed_by', 'users', 'id'
  );
END $$;

-- ChannelMember.userId
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
    AND tc.table_name = 'channel_members'
    AND kcu.column_name = 'user_id'
  LIMIT 1;

  IF con_name IS NOT NULL THEN
    EXECUTE format('ALTER TABLE %I DROP CONSTRAINT %I', 'channel_members', con_name);
  END IF;

  EXECUTE format(
    'ALTER TABLE %I ADD CONSTRAINT %I FOREIGN KEY (%I) REFERENCES %I(%I) ON DELETE CASCADE ON UPDATE CASCADE',
    'channel_members', 'channel_members_user_id_fkey', 'user_id', 'users', 'id'
  );
END $$;

-- ChannelMessageMention.mentionedUserId
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
    AND tc.table_name = 'channel_message_mentions'
    AND kcu.column_name = 'mentioned_user_id'
  LIMIT 1;

  IF con_name IS NOT NULL THEN
    EXECUTE format('ALTER TABLE %I DROP CONSTRAINT %I', 'channel_message_mentions', con_name);
  END IF;

  EXECUTE format(
    'ALTER TABLE %I ADD CONSTRAINT %I FOREIGN KEY (%I) REFERENCES %I(%I) ON DELETE CASCADE ON UPDATE CASCADE',
    'channel_message_mentions', 'channel_message_mentions_mentioned_user_id_fkey', 'mentioned_user_id', 'users', 'id'
  );
END $$;

-- ChannelMessageReaction.userId
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
    AND tc.table_name = 'channel_message_reactions'
    AND kcu.column_name = 'user_id'
  LIMIT 1;

  IF con_name IS NOT NULL THEN
    EXECUTE format('ALTER TABLE %I DROP CONSTRAINT %I', 'channel_message_reactions', con_name);
  END IF;

  EXECUTE format(
    'ALTER TABLE %I ADD CONSTRAINT %I FOREIGN KEY (%I) REFERENCES %I(%I) ON DELETE CASCADE ON UPDATE CASCADE',
    'channel_message_reactions', 'channel_message_reactions_user_id_fkey', 'user_id', 'users', 'id'
  );
END $$;

-- ChannelJoinRequest.userId
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
    AND tc.table_name = 'channel_join_requests'
    AND kcu.column_name = 'user_id'
  LIMIT 1;

  IF con_name IS NOT NULL THEN
    EXECUTE format('ALTER TABLE %I DROP CONSTRAINT %I', 'channel_join_requests', con_name);
  END IF;

  EXECUTE format(
    'ALTER TABLE %I ADD CONSTRAINT %I FOREIGN KEY (%I) REFERENCES %I(%I) ON DELETE CASCADE ON UPDATE CASCADE',
    'channel_join_requests', 'channel_join_requests_user_id_fkey', 'user_id', 'users', 'id'
  );
END $$;

-- Doc.ownerId
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
    AND tc.table_name = 'docs'
    AND kcu.column_name = 'owner_id'
  LIMIT 1;

  IF con_name IS NOT NULL THEN
    EXECUTE format('ALTER TABLE %I DROP CONSTRAINT %I', 'docs', con_name);
  END IF;

  EXECUTE format(
    'ALTER TABLE %I ADD CONSTRAINT %I FOREIGN KEY (%I) REFERENCES %I(%I) ON DELETE CASCADE ON UPDATE CASCADE',
    'docs', 'docs_owner_id_fkey', 'owner_id', 'users', 'id'
  );
END $$;

-- DocVersion.createdById
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
    AND tc.table_name = 'doc_versions'
    AND kcu.column_name = 'created_by_id'
  LIMIT 1;

  IF con_name IS NOT NULL THEN
    EXECUTE format('ALTER TABLE %I DROP CONSTRAINT %I', 'doc_versions', con_name);
  END IF;

  EXECUTE format(
    'ALTER TABLE %I ADD CONSTRAINT %I FOREIGN KEY (%I) REFERENCES %I(%I) ON DELETE CASCADE ON UPDATE CASCADE',
    'doc_versions', 'doc_versions_created_by_id_fkey', 'created_by_id', 'users', 'id'
  );
END $$;

-- DocPermission.userId
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
    AND tc.table_name = 'doc_permissions'
    AND kcu.column_name = 'user_id'
  LIMIT 1;

  IF con_name IS NOT NULL THEN
    EXECUTE format('ALTER TABLE %I DROP CONSTRAINT %I', 'doc_permissions', con_name);
  END IF;

  EXECUTE format(
    'ALTER TABLE %I ADD CONSTRAINT %I FOREIGN KEY (%I) REFERENCES %I(%I) ON DELETE CASCADE ON UPDATE CASCADE',
    'doc_permissions', 'doc_permissions_user_id_fkey', 'user_id', 'users', 'id'
  );
END $$;

-- DocPermission.grantedById
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
    AND tc.table_name = 'doc_permissions'
    AND kcu.column_name = 'granted_by_id'
  LIMIT 1;

  IF con_name IS NOT NULL THEN
    EXECUTE format('ALTER TABLE %I DROP CONSTRAINT %I', 'doc_permissions', con_name);
  END IF;

  EXECUTE format(
    'ALTER TABLE %I ADD CONSTRAINT %I FOREIGN KEY (%I) REFERENCES %I(%I) ON DELETE CASCADE ON UPDATE CASCADE',
    'doc_permissions', 'doc_permissions_granted_by_id_fkey', 'granted_by_id', 'users', 'id'
  );
END $$;

-- DocCommentThread.createdById
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
    AND tc.table_name = 'doc_comment_threads'
    AND kcu.column_name = 'created_by_id'
  LIMIT 1;

  IF con_name IS NOT NULL THEN
    EXECUTE format('ALTER TABLE %I DROP CONSTRAINT %I', 'doc_comment_threads', con_name);
  END IF;

  EXECUTE format(
    'ALTER TABLE %I ADD CONSTRAINT %I FOREIGN KEY (%I) REFERENCES %I(%I) ON DELETE CASCADE ON UPDATE CASCADE',
    'doc_comment_threads', 'doc_comment_threads_created_by_id_fkey', 'created_by_id', 'users', 'id'
  );
END $$;

-- DocComment.authorId
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
    AND tc.table_name = 'doc_comments'
    AND kcu.column_name = 'author_id'
  LIMIT 1;

  IF con_name IS NOT NULL THEN
    EXECUTE format('ALTER TABLE %I DROP CONSTRAINT %I', 'doc_comments', con_name);
  END IF;

  EXECUTE format(
    'ALTER TABLE %I ADD CONSTRAINT %I FOREIGN KEY (%I) REFERENCES %I(%I) ON DELETE CASCADE ON UPDATE CASCADE',
    'doc_comments', 'doc_comments_author_id_fkey', 'author_id', 'users', 'id'
  );
END $$;

-- DocShareLink.createdById
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
    AND tc.table_name = 'doc_share_links'
    AND kcu.column_name = 'created_by_id'
  LIMIT 1;

  IF con_name IS NOT NULL THEN
    EXECUTE format('ALTER TABLE %I DROP CONSTRAINT %I', 'doc_share_links', con_name);
  END IF;

  EXECUTE format(
    'ALTER TABLE %I ADD CONSTRAINT %I FOREIGN KEY (%I) REFERENCES %I(%I) ON DELETE CASCADE ON UPDATE CASCADE',
    'doc_share_links', 'doc_share_links_created_by_id_fkey', 'created_by_id', 'users', 'id'
  );
END $$;
