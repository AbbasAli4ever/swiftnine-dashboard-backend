/**
 * Exercises real sale creation (TransactionService.create) with a PKR sale
 * and a USD sale, each carrying a commission, then reads the commissioned
 * employee back through EmployeesService to confirm:
 *   - commissionAmount/commissionCurrency together let a commission be
 *     entered in any currency; it's converted to PKR once, at creation, and
 *     only the PKR figure is ever persisted on the Transaction row
 *   - Employee.pendingCommission accumulates all of them correctly in PKR
 *   - EmployeesService now returns paidCommissionUsd/pendingCommissionUsd/
 *     totalCommissionUsd alongside the PKR figures
 *
 * Not idempotent — each run creates two new transactions (unique refId) and
 * further increments the employee's pendingCommission. Re-running is safe,
 * it just adds more.
 *
 * Usage:
 *   node -r ts-node/register -r tsconfig-paths/register \
 *     scripts/test-sale-commission.ts
 */
import 'dotenv/config';
import { PrismaService } from '../libs/database/src/prisma.service';
import { ExchangeRateService } from './../apps/api/src/exchange-rate/exchange-rate.service';
import { TransactionService } from './../apps/api/src/transactions/transaction.service';
import { EmployeesService } from './../apps/api/src/employees/employees.service';

const WORKSPACE_ID = '847e1f05-df94-4051-b8f3-8307f9a4e0f9';
const CLIENT_ID = '0de3d41f-5fb1-4c87-89d4-072090dd268b'; // Ironclad Security
const PKR_BANK_ACCOUNT_ID = '5ca856e3-6a69-48d9-a559-697f1a7a026d'; // Test PKR Bank (LOCAL/PKR)
const USD_BANK_ACCOUNT_ID = '34eb2b63-a5ca-46ae-b20c-83aa5dfe83e4'; // PayPal (INTERNATIONAL/USD)
const EMPLOYEE_ID = '2d8dd476-3771-4d91-adc8-dfe2ccd8ea7e'; // Sara Khan

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

async function main(): Promise<void> {
  const prisma = new PrismaService();
  const exchangeRateService = new ExchangeRateService();
  const transactionService = new TransactionService(prisma, exchangeRateService);
  const employeesService = new EmployeesService(prisma, exchangeRateService);

  const before = await employeesService.findOne(WORKSPACE_ID, EMPLOYEE_ID);
  console.log('--- Employee before ---');
  console.log({
    paidCommission: before.paidCommission,
    paidCommissionUsd: before.paidCommissionUsd,
    pendingCommission: before.pendingCommission,
    pendingCommissionUsd: before.pendingCommissionUsd,
    totalCommission: before.totalCommission,
    totalCommissionUsd: before.totalCommissionUsd,
  });

  const stamp = Date.now();

  console.log('\n--- Creating PKR sale with commission ---');
  const pkrSale = await transactionService.create(WORKSPACE_ID, {
    clientId: CLIENT_ID,
    bankAccountId: PKR_BANK_ACCOUNT_ID,
    saleAmount: 50000,
    currency: 'PKR',
    refId: `TEST-PKR-${stamp}`,
    description: 'Test PKR sale with commission',
    employeeId: EMPLOYEE_ID,
    commissionAmount: 4000,
    commissionCurrency: 'PKR',
  });
  console.log({
    id: pkrSale.id,
    saleAmount: pkrSale.saleAmount,
    currency: pkrSale.currency,
    commissionAmount: pkrSale.commissionAmount,
  });

  console.log('\n--- Creating USD sale with commission ---');
  const usdSale = await transactionService.create(WORKSPACE_ID, {
    clientId: CLIENT_ID,
    bankAccountId: USD_BANK_ACCOUNT_ID,
    saleAmount: 300,
    currency: 'USD',
    refId: `TEST-USD-${stamp}`,
    description: 'Test USD sale with commission',
    employeeId: EMPLOYEE_ID,
    commissionAmount: 3000,
    commissionCurrency: 'PKR',
  });
  console.log({
    id: usdSale.id,
    saleAmount: usdSale.saleAmount,
    currency: usdSale.currency,
    commissionAmount: usdSale.commissionAmount,
  });

  const afterPkr = await employeesService.findOne(WORKSPACE_ID, EMPLOYEE_ID);
  console.log('\n--- Employee after PKR-denominated commissions ---');
  console.log({
    pendingCommission: afterPkr.pendingCommission,
    pendingCommissionUsd: afterPkr.pendingCommissionUsd,
  });

  const expectedPendingCommission = before.pendingCommission + 4000 + 3000;
  console.log('\n--- Assertion (PKR-denominated) ---');
  console.log(
    `pendingCommission ${afterPkr.pendingCommission} === expected ${expectedPendingCommission}:`,
    afterPkr.pendingCommission === expectedPendingCommission,
  );

  // Now a sale with a commission ENTERED IN USD — this is the case that
  // used to be silently mispriced (a bare "50" was stored and read back as
  // 50 PKR, not $50). commissionCurrency should make this correct.
  console.log('\n--- Creating USD sale with a USD-denominated commission ---');
  await exchangeRateService.refresh();
  const usdCommissionSale = await transactionService.create(WORKSPACE_ID, {
    clientId: CLIENT_ID,
    bankAccountId: USD_BANK_ACCOUNT_ID,
    saleAmount: 500,
    currency: 'USD',
    refId: `TEST-USD-COMM-${stamp}`,
    description: 'Test USD sale with a $50 commission',
    employeeId: EMPLOYEE_ID,
    commissionAmount: 50,
    commissionCurrency: 'USD',
  });
  const expectedCommissionPkr = round2(exchangeRateService.convert(50, 'USD', 'PKR'));
  console.log({
    id: usdCommissionSale.id,
    saleAmount: usdCommissionSale.saleAmount,
    currency: usdCommissionSale.currency,
    // Always PKR on the row — should equal $50 converted to PKR, not 50.
    storedCommissionAmount: usdCommissionSale.commissionAmount,
    expectedCommissionPkr,
  });

  const afterUsdComm = await employeesService.findOne(WORKSPACE_ID, EMPLOYEE_ID);
  console.log('\n--- Employee after USD-denominated commission ---');
  console.log({
    pendingCommission: afterUsdComm.pendingCommission,
    pendingCommissionUsd: afterUsdComm.pendingCommissionUsd,
  });

  const expectedPendingCommission2 = round2(
    afterPkr.pendingCommission + expectedCommissionPkr,
  );
  console.log('\n--- Assertion (USD-denominated) ---');
  console.log(
    `pendingCommission ${afterUsdComm.pendingCommission} === expected ${expectedPendingCommission2}:`,
    afterUsdComm.pendingCommission === expectedPendingCommission2,
  );
  console.log(
    `pendingCommissionUsd ${afterUsdComm.pendingCommissionUsd} ~= before + 50:`,
    Math.abs(afterUsdComm.pendingCommissionUsd - (afterPkr.pendingCommissionUsd + 50)) < 0.05,
  );

  await prisma.$disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
