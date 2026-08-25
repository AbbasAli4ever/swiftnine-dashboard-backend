-- Reverses the previous day's commission-on-transaction link
-- (20260824140000_add_employee_commission). Commission is no longer tied to
-- a sale at all: an employee's paidCommission/pendingCommission are now
-- independent, manually-entered PKR figures with no relation to Transaction.
--
-- Data note: 3 transactions and their employee links existed only as test
-- data (refIds DEMO-EMP-001/002/003, in the "Test" workspace) — verified
-- before writing this migration, not real production data.

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_employee_id_fkey";

-- DropIndex
DROP INDEX "Transaction_employee_id_idx";

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "employee_id",
DROP COLUMN "commission_amount",
DROP COLUMN "commission_currency";

-- AlterTable
ALTER TABLE "Employee" ADD COLUMN     "paid_commission" DECIMAL(12,2) NOT NULL DEFAULT 0,
ADD COLUMN     "pending_commission" DECIMAL(12,2) NOT NULL DEFAULT 0;
