import type { Prisma } from '@app/database/generated/prisma/client';

export const BANK_ACCOUNT_NOT_FOUND = 'Bank account not found';

export const ACCOUNT_TYPE_VALUES = ['LOCAL', 'INTERNATIONAL'] as const;

export const BANK_ACCOUNT_SORT_FIELDS = [
  'bankName',
  'accountType',
  'currencyType',
  'amount',
  'createdAt',
  'updatedAt',
] as const;

export const BANK_ACCOUNT_SELECT = {
  id: true,
  bankName: true,
  accountType: true,
  currencyType: true,
  amount: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.BankAccountSelect;
