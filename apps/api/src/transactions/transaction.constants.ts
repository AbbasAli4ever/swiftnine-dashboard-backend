import type { Prisma } from '@app/database/generated/prisma/client';

export const TRANSACTION_NOT_FOUND = 'Transaction not found';
export const TRANSACTION_REF_ID_TAKEN =
  'A transaction with this reference ID already exists';
export const CLIENT_NOT_FOUND = 'Client not found';

export const PAYMENT_PLATFORM_VALUES = [
  'WHOP',
  'AIRWALLEX',
  'SLASH',
  'PAYONEER',
  'WIO_BANK',
  'MAMO',
  'KRAKEN',
] as const;

export const CURRENCY_VALUES = ['USD', 'HKD', 'PKR'] as const;

export const TRANSACTION_SORT_FIELDS = [
  'createdAt',
  'updatedAt',
  'clientName',
  'saleAmount',
] as const;

export const TRANSACTION_SELECT = {
  id: true,
  clientId: true,
  clientName: true,
  saleAmount: true,
  paymentPlatform: true,
  currency: true,
  refId: true,
  description: true,
  createdAt: true,
  updatedAt: true,
  client: { select: { id: true, clientName: true } },
} satisfies Prisma.TransactionSelect;
