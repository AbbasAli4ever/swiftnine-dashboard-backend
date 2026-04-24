ALTER TABLE "tasks" ADD COLUMN "board_position" INTEGER;

WITH ranked_tasks AS (
  SELECT
    "id",
    ROW_NUMBER() OVER (
      PARTITION BY "status_id"
      ORDER BY "created_at" ASC, "list_id" ASC, "position" ASC, "id" ASC
    ) AS "rank"
  FROM "tasks"
  WHERE "deleted_at" IS NULL
)
UPDATE "tasks"
SET "board_position" = ranked_tasks."rank" * 1000
FROM ranked_tasks
WHERE "tasks"."id" = ranked_tasks."id";

UPDATE "tasks"
SET "board_position" = COALESCE("position", 1000)
WHERE "board_position" IS NULL;

ALTER TABLE "tasks" ALTER COLUMN "board_position" SET DEFAULT 1000;
ALTER TABLE "tasks" ALTER COLUMN "board_position" SET NOT NULL;

CREATE INDEX "tasks_status_id_board_position_idx" ON "tasks"("status_id", "board_position");
