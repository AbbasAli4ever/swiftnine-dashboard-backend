-- Add notifications.workspace_id safely for production databases that already
-- contain notification rows from before notifications became workspace-scoped.

ALTER TABLE "notifications"
  ADD COLUMN IF NOT EXISTS "workspace_id" TEXT;

-- Direct workspace/project references.
UPDATE "notifications" n
SET "workspace_id" = n."reference_id"
WHERE n."workspace_id" IS NULL
  AND n."reference_type" = 'workspace'
  AND EXISTS (
    SELECT 1
    FROM "workspaces" w
    WHERE w."id" = n."reference_id"
  );

UPDATE "notifications" n
SET "workspace_id" = p."workspace_id"
FROM "projects" p
WHERE n."workspace_id" IS NULL
  AND n."reference_type" = 'project'
  AND p."id" = n."reference_id";

-- Task references resolve through task_lists -> projects -> workspaces.
UPDATE "notifications" n
SET "workspace_id" = p."workspace_id"
FROM "tasks" t
JOIN "task_lists" tl ON tl."id" = t."list_id"
JOIN "projects" p ON p."id" = tl."project_id"
WHERE n."workspace_id" IS NULL
  AND n."reference_type" = 'task'
  AND t."id" = n."reference_id";

-- Comment references resolve through comments -> tasks -> task_lists -> projects.
UPDATE "notifications" n
SET "workspace_id" = p."workspace_id"
FROM "comments" c
JOIN "tasks" t ON t."id" = c."task_id"
JOIN "task_lists" tl ON tl."id" = t."list_id"
JOIN "projects" p ON p."id" = tl."project_id"
WHERE n."workspace_id" IS NULL
  AND n."reference_type" = 'comment'
  AND c."id" = n."reference_id";

-- Channel references are directly workspace-scoped.
UPDATE "notifications" n
SET "workspace_id" = c."workspace_id"
FROM "channels" c
WHERE n."workspace_id" IS NULL
  AND n."reference_type" = 'channel'
  AND c."id" = n."reference_id";

-- Chat message references resolve through channel_messages -> channels.
UPDATE "notifications" n
SET "workspace_id" = c."workspace_id"
FROM "channel_messages" cm
JOIN "channels" c ON c."id" = cm."channel_id"
WHERE n."workspace_id" IS NULL
  AND n."reference_type" = 'channel_message'
  AND cm."id" = n."reference_id";

-- Doc references, included for forward/backward compatibility with older
-- notification rows even if current code paths do not create them.
UPDATE "notifications" n
SET "workspace_id" = d."workspace_id"
FROM "docs" d
WHERE n."workspace_id" IS NULL
  AND n."reference_type" = 'doc'
  AND d."id" = n."reference_id";

UPDATE "notifications" n
SET "workspace_id" = d."workspace_id"
FROM "doc_comment_threads" dct
JOIN "docs" d ON d."id" = dct."doc_id"
WHERE n."workspace_id" IS NULL
  AND n."reference_type" = 'doc_comment_thread'
  AND dct."id" = n."reference_id";

UPDATE "notifications" n
SET "workspace_id" = d."workspace_id"
FROM "doc_comments" dc
JOIN "doc_comment_threads" dct ON dct."id" = dc."thread_id"
JOIN "docs" d ON d."id" = dct."doc_id"
WHERE n."workspace_id" IS NULL
  AND n."reference_type" = 'doc_comment'
  AND dc."id" = n."reference_id";

-- Conservative fallback: if the recipient belongs to exactly one active
-- workspace, assign that workspace. Ambiguous users remain unresolved and make
-- the migration fail below instead of guessing.
WITH single_workspace_members AS (
  SELECT
    wm."user_id",
    MIN(wm."workspace_id") AS "workspace_id"
  FROM "workspace_members" wm
  WHERE wm."deleted_at" IS NULL
  GROUP BY wm."user_id"
  HAVING COUNT(DISTINCT wm."workspace_id") = 1
)
UPDATE "notifications" n
SET "workspace_id" = swm."workspace_id"
FROM single_workspace_members swm
WHERE n."workspace_id" IS NULL
  AND swm."user_id" = n."user_id";

-- Stop before enforcing NOT NULL if any rows still need manual attention.
DO $$
DECLARE
  unresolved_count INTEGER;
  unresolved_sample TEXT;
BEGIN
  SELECT COUNT(*)
  INTO unresolved_count
  FROM "notifications"
  WHERE "workspace_id" IS NULL;

  IF unresolved_count > 0 THEN
    SELECT STRING_AGG("id", ', ')
    INTO unresolved_sample
    FROM (
      SELECT "id"
      FROM "notifications"
      WHERE "workspace_id" IS NULL
      ORDER BY "created_at" DESC
      LIMIT 10
    ) unresolved;

    RAISE EXCEPTION
      'Cannot enforce notifications.workspace_id: % notification rows remain unresolved. Sample ids: %',
      unresolved_count,
      unresolved_sample;
  END IF;
END $$;

ALTER TABLE "notifications"
  ALTER COLUMN "workspace_id" SET NOT NULL;

CREATE INDEX IF NOT EXISTS "notifications_workspace_id_user_id_idx"
  ON "notifications"("workspace_id", "user_id");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM "pg_constraint"
    WHERE "conname" = 'notifications_workspace_id_fkey'
  ) THEN
    ALTER TABLE "notifications"
      ADD CONSTRAINT "notifications_workspace_id_fkey"
      FOREIGN KEY ("workspace_id")
      REFERENCES "workspaces"("id")
      ON DELETE CASCADE
      ON UPDATE CASCADE;
  END IF;
END $$;
