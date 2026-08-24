-- Adds employees as a first-class entity and lets a transaction optionally
-- carry who gets credited for the sale and what commission they're owed.
-- Purely additive: new nullable columns on Transaction, new Employee table.
-- No existing rows are touched.
--
-- Generated via schema-to-schema diff (`prisma migrate diff --from-config-datasource
-- prisma.config.ts --to-schema prisma/schema.prisma --script`) against the live
-- dev database — not `prisma migrate dev`, whose shadow-database drift check
-- was requesting a full reset (migration history is out of sync with the
-- actual schema in this environment, unrelated to this change).

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "commission_amount" DECIMAL(12,2),
ADD COLUMN     "commission_currency" "Currency",
ADD COLUMN     "employee_id" TEXT;

-- CreateTable
CREATE TABLE "Employee" (
    "id" TEXT NOT NULL,
    "workspace_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Employee_workspace_id_idx" ON "Employee"("workspace_id");

-- CreateIndex
CREATE INDEX "Employee_name_idx" ON "Employee"("name");

-- CreateIndex
CREATE INDEX "Transaction_employee_id_idx" ON "Transaction"("employee_id");

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;
