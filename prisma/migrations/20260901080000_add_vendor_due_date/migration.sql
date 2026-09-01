-- Vendor.dueDate: optional, hand-entered date the outstanding pendingPayment
-- is due. Purely additive, nullable, no default — existing rows read as
-- NULL, no data loss.

-- AlterTable
ALTER TABLE "Vendor" ADD COLUMN "due_date" TIMESTAMP(3);
