CREATE TYPE "StatusGroup" AS ENUM ('NOT_STARTED', 'ACTIVE', 'DONE', 'CLOSED');

ALTER TABLE "statuses"
ADD COLUMN "group" "StatusGroup",
ADD COLUMN "is_protected" BOOLEAN NOT NULL DEFAULT false;

UPDATE "statuses"
SET "group" = CASE
  WHEN "is_closed" = true THEN 'CLOSED'::"StatusGroup"
  WHEN LOWER("name") = 'to do' THEN 'NOT_STARTED'::"StatusGroup"
  ELSE 'ACTIVE'::"StatusGroup"
END;

UPDATE "statuses"
SET "is_protected" = true
WHERE "is_closed" = true;

ALTER TABLE "statuses"
ALTER COLUMN "group" SET NOT NULL,
ALTER COLUMN "group" SET DEFAULT 'ACTIVE';

CREATE INDEX "statuses_project_id_group_position_idx"
ON "statuses"("project_id", "group", "position");
