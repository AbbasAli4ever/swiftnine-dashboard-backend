ALTER TABLE "task_lists"
ADD COLUMN "start_date" DATE,
ADD COLUMN "end_date" DATE,
ADD COLUMN "owner_user_id" TEXT,
ADD COLUMN "priority" "Priority";

CREATE INDEX "task_lists_owner_user_id_idx" ON "task_lists"("owner_user_id");

ALTER TABLE "task_lists"
ADD CONSTRAINT "task_lists_owner_user_id_fkey"
FOREIGN KEY ("owner_user_id") REFERENCES "users"("id")
ON DELETE SET NULL
ON UPDATE CASCADE;
