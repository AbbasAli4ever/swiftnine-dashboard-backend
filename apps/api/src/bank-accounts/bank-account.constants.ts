import type { Prisma } from '@app/database/generated/prisma/client';

export const BANK_ACCOUNT_NOT_FOUND = 'Bank account not found';
export const BANK_ACCOUNT_HAS_TRANSACTIONS =
  'Cannot delete a bank account that still has transactions';

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
  logoUrl: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.BankAccountSelect;

export const BANK_LOGO_KEY_PREFIX = 'accounts_dashboard_assets/bank-logos';

export const BANK_LOGO_ALLOWED_MIME_TYPES = [
  'image/png',
  'image/jpeg',
  'image/svg+xml',
  'image/webp',
] as const;

export const BANK_LOGO_MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024; // 2MB

export const BANK_LOGO_PRESIGN_EXPIRES_IN_SECONDS = 60 * 15;
