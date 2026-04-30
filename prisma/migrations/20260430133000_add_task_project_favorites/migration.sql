-- User-scoped starred/favorite mappings. These are separate from tasks/projects
-- because favorite state is personal, not shared workspace state.
CREATE TABLE IF NOT EXISTS "project_favorites" (
  "id" TEXT NOT NULL,
  "user_id" TEXT NOT NULL,
  "workspace_id" TEXT NOT NULL,
  "project_id" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "project_favorites_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "task_favorites" (
  "id" TEXT NOT NULL,
  "user_id" TEXT NOT NULL,
  "workspace_id" TEXT NOT NULL,
  "task_id" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "task_favorites_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "project_favorites_user_id_project_id_key"
  ON "project_favorites"("user_id", "project_id");
CREATE INDEX IF NOT EXISTS "project_favorites_workspace_id_user_id_created_at_idx"
  ON "project_favorites"("workspace_id", "user_id", "created_at");
CREATE INDEX IF NOT EXISTS "project_favorites_project_id_idx"
  ON "project_favorites"("project_id");

CREATE UNIQUE INDEX IF NOT EXISTS "task_favorites_user_id_task_id_key"
  ON "task_favorites"("user_id", "task_id");
CREATE INDEX IF NOT EXISTS "task_favorites_workspace_id_user_id_created_at_idx"
  ON "task_favorites"("workspace_id", "user_id", "created_at");
CREATE INDEX IF NOT EXISTS "task_favorites_task_id_idx"
  ON "task_favorites"("task_id");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'project_favorites_user_id_fkey'
  ) THEN
    ALTER TABLE "project_favorites"
      ADD CONSTRAINT "project_favorites_user_id_fkey"
      FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'project_favorites_workspace_id_fkey'
  ) THEN
    ALTER TABLE "project_favorites"
      ADD CONSTRAINT "project_favorites_workspace_id_fkey"
      FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'project_favorites_project_id_fkey'
  ) THEN
    ALTER TABLE "project_favorites"
      ADD CONSTRAINT "project_favorites_project_id_fkey"
      FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'task_favorites_user_id_fkey'
  ) THEN
    ALTER TABLE "task_favorites"
      ADD CONSTRAINT "task_favorites_user_id_fkey"
      FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'task_favorites_workspace_id_fkey'
  ) THEN
    ALTER TABLE "task_favorites"
      ADD CONSTRAINT "task_favorites_workspace_id_fkey"
      FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'task_favorites_task_id_fkey'
  ) THEN
    ALTER TABLE "task_favorites"
      ADD CONSTRAINT "task_favorites_task_id_fkey"
      FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;
