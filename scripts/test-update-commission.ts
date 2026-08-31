/**
 * Exercises TransactionService.update() changing commissionAmount after
 * creation, to confirm Employee.pendingCommission is kept in sync via a
 * delta (old commission reversed, new one applied) — including when the
 * currency used to express the commission changes between the create and
 * the update.
 *
 * Usage:
 *   node -r ts-node/register -r tsconfig-paths/register \
 *     scripts/test-update-commission.ts
 */
import 'dotenv/config';
import { PrismaService } from '../libs/database/src/prisma.service';
import { ExchangeRateService } from './../apps/api/src/exchange-rate/exchange-rate.service';
import { TransactionService } from './../apps/api/src/transactions/transaction.service';
import { EmployeesService } from './../apps/api/src/employees/employees.service';

const WORKSPACE_ID = '847e1f05-df94-4051-b8f3-8307f9a4e0f9';
const CLIENT_ID = '0de3d41f-5fb1-4c87-89d4-072090dd268b'; // Ironclad Security
const PKR_BANK_ACCOUNT_ID = '5ca856e3-6a69-48d9-a559-697f1a7a026d'; // Test PKR Bank (LOCAL/PKR)
const EMPLOYEE_ID = '2d8dd476-3771-4d91-adc8-dfe2ccd8ea7e'; // Sara Khan

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

async function main(): Promise<void> {
  const prisma = new PrismaService();
  const exchangeRateService = new ExchangeRateService();
  const transactionService = new TransactionService(prisma, exchangeRateService);
  const employeesService = new EmployeesService(prisma, exchangeRateService);
  await exchangeRateService.refresh();

  const stamp = Date.now();

  console.log('--- Creating PKR sale with a 2000 PKR commission ---');
  const sale = await transactionService.create(WORKSPACE_ID, {
    clientId: CLIENT_ID,
    bankAccountId: PKR_BANK_ACCOUNT_ID,
    saleAmount: 20000,
    currency: 'PKR',
    refId: `TEST-UPDATE-${stamp}`,
    description: 'Test transaction for update-commission flow',
    employeeId: EMPLOYEE_ID,
    commissionAmount: 2000,
    commissionCurrency: 'PKR',
  });
  console.log({ id: sale.id, commissionAmount: sale.commissionAmount });

  const afterCreate = await employeesService.findOne(WORKSPACE_ID, EMPLOYEE_ID);
  console.log('pendingCommission after create:', afterCreate.pendingCommission);

  console.log('\n--- Updating commissionAmount 2000 -> 5000 PKR (same currency) ---');
  const updated1 = await transactionService.update(WORKSPACE_ID, sale.id, {
    employeeId: EMPLOYEE_ID,
    commissionAmount: 5000,
    commissionCurrency: 'PKR',
  });
  console.log({ commissionAmount: updated1.commissionAmount });

  const afterUpdate1 = await employeesService.findOne(WORKSPACE_ID, EMPLOYEE_ID);
  console.log('pendingCommission after update 1:', afterUpdate1.pendingCommission);
  const expected1 = round2(afterCreate.pendingCommission + (5000 - 2000));
  console.log(
    `expected ${expected1} === actual ${afterUpdate1.pendingCommission}:`,
    expected1 === afterUpdate1.pendingCommission,
  );

  console.log('\n--- Updating commissionAmount to $20 USD (currency change) ---');
  const updated2 = await transactionService.update(WORKSPACE_ID, sale.id, {
    employeeId: EMPLOYEE_ID,
    commissionAmount: 20,
    commissionCurrency: 'USD',
  });
  const newCommissionPkr = round2(exchangeRateService.convert(20, 'USD', 'PKR'));
  console.log({
    storedCommissionAmount: updated2.commissionAmount,
    expectedCommissionPkr: newCommissionPkr,
  });

  const afterUpdate2 = await employeesService.findOne(WORKSPACE_ID, EMPLOYEE_ID);
  console.log('pendingCommission after update 2:', afterUpdate2.pendingCommission);
  const expected2 = round2(afterUpdate1.pendingCommission + (newCommissionPkr - 5000));
  console.log(
    `expected ${expected2} === actual ${afterUpdate2.pendingCommission}:`,
    expected2 === afterUpdate2.pendingCommission,
  );

  await prisma.$disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
