import type { Prisma } from '@app/database/generated/prisma/client';

export const TRANSACTION_NOT_FOUND = 'Transaction not found';
export const TRANSACTION_REF_ID_TAKEN =
  'A transaction with this reference ID already exists';
export const CLIENT_NOT_FOUND = 'Client not found';
export const BANK_ACCOUNT_NOT_FOUND = 'Bank account not found';
export const TRANSACTION_LOCAL_ACCOUNT_CURRENCY =
  'A LOCAL bank account only accepts PKR transactions';
export const EMPLOYEE_NOT_FOUND = 'Employee not found';
export const TRANSACTION_EMPLOYEE_COMMISSION_PAIR =
  'employeeId and commissionAmount must be provided together, or not at all';

export const CURRENCY_VALUES = [
  'USD',
  'HKD',
  'PKR',
  'AED',
  'EUR',
  'GBP',
  'CRYPTO',
] as const;

export const TRANSACTION_SORT_FIELDS = [
  'saleDate',
  'createdAt',
  'updatedAt',
  'clientName',
  'saleAmount',
] as const;

export const TRANSACTION_SELECT = {
  id: true,
  clientId: true,
  clientName: true,
  bankAccountId: true,
  saleAmount: true,
  currency: true,
  saleDate: true,
  refId: true,
  description: true,
  createdAt: true,
  updatedAt: true,
  client: { select: { id: true, clientName: true } },
  bankAccount: { select: { id: true, bankName: true, logoUrl: true } },
  employeeId: true,
  commissionAmount: true,
  employee: { select: { id: true, name: true } },
} satisfies Prisma.TransactionSelect;
