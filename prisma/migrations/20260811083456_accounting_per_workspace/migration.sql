-- Wipe existing accounting data — pre-existing rows have no workspace to
-- backfill into (test/seed data only), so this clears them instead of
-- backfilling before workspaceId/bankAccountId become required below.
TRUNCATE TABLE "Transaction", "Clients", "BankAccount";

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('CREDIT', 'DEBIT');

-- DropIndex
DROP INDEX "Transaction_refId_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "role";

-- AlterTable
ALTER TABLE "workspace_members" ADD COLUMN     "accounting_role" "UserRole";

-- AlterTable
ALTER TABLE "Clients" ADD COLUMN     "workspace_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "bank_account_id" TEXT NOT NULL,
ADD COLUMN     "type" "TransactionType" NOT NULL DEFAULT 'CREDIT',
ADD COLUMN     "workspace_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "BankAccount" ADD COLUMN     "workspace_id" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Clients_workspace_id_idx" ON "Clients"("workspace_id");

-- CreateIndex
CREATE INDEX "Transaction_workspace_id_idx" ON "Transaction"("workspace_id");

-- CreateIndex
CREATE INDEX "Transaction_bank_account_id_idx" ON "Transaction"("bank_account_id");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_workspace_id_refId_key" ON "Transaction"("workspace_id", "refId");

-- CreateIndex
CREATE INDEX "BankAccount_workspace_id_idx" ON "BankAccount"("workspace_id");

-- AddForeignKey
ALTER TABLE "Clients" ADD CONSTRAINT "Clients_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_bank_account_id_fkey" FOREIGN KEY ("bank_account_id") REFERENCES "BankAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BankAccount" ADD CONSTRAINT "BankAccount_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;
