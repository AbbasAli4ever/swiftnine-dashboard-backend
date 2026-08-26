-- Re-adds a link between Transaction and Employee, with different shape
-- than the earlier (removed, see 20260825120000_remove_transaction_commission_link)
-- design: PKR-only (no commission_currency column this time), and optional —
-- a transaction may carry an employee + commission, or neither, never one
-- without the other (enforced at the application layer, not the DB).
ALTER TABLE "Transaction"
  ADD COLUMN "employee_id" TEXT,
  ADD COLUMN "commission_amount" DECIMAL(12,2) NOT NULL DEFAULT 0;

CREATE INDEX "Transaction_employeeId_idx" ON "Transaction"("employee_id");

-- SetNull, not Restrict/Cascade — deleting an employee must stay
-- unconditional (see EmployeesService.remove()); it just clears the link on
-- that employee's past transactions instead of being blocked.
ALTER TABLE "Transaction"
  ADD CONSTRAINT "Transaction_employee_id_fkey"
  FOREIGN KEY ("employee_id") REFERENCES "Employee"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;
