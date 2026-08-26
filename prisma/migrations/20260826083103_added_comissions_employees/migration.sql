-- Originally: ALTER INDEX "Transaction_employeeId_idx"
--               RENAME TO "Transaction_employee_id_idx";
--
-- That rename is now a no-op. Two developers' migrations interleaved by
-- timestamp: this file replays BEFORE 20260826120000_add_transaction_commission_link,
-- which is what creates the index — so on a fresh replay (shadow database,
-- CI, a new environment) the target did not exist and Prisma failed with
-- P3006 / P1014 "The underlying table for model
-- `Transaction_employeeId_idx` does not exist."
--
-- 20260826120000 now creates the index directly as "Transaction_employee_id_idx",
-- so there is nothing left to rename. Kept as a guarded statement rather than
-- deleted, because this migration is already recorded as applied in existing
-- databases — removing the folder would make Prisma report those as drifted.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_class WHERE relname = 'Transaction_employeeId_idx') THEN
    ALTER INDEX "Transaction_employeeId_idx" RENAME TO "Transaction_employee_id_idx";
  END IF;
END $$;
