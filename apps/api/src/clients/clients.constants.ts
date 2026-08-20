import type { Prisma } from '@app/database/generated/prisma/client';

export const CLIENT_NOT_FOUND = 'Client not found';
export const CLIENT_HAS_TRANSACTIONS =
  'Cannot delete a client that still has transactions';

export const CLIENTS_SORT_FIELDS = [
  'clientName',
  'createdAt',
  'updatedAt',
] as const;

export const CLIENT_TRANSACTION_SELECT = {
  id: true,
  saleAmount: true,
  currency: true,
  saleDate: true,
  refId: true,
  description: true,
  createdAt: true,
  updatedAt: true,
  // The account a payment came in through — the closest thing to a
  // "payment method" now that there's no PaymentPlatform enum.
  bankAccount: { select: { id: true, bankName: true, logoUrl: true } },
} satisfies Prisma.TransactionSelect;

export const CLIENTS_SELECT = {
  id: true,
  clientName: true,
  totalRevenue: true,
  currencyType: true,
  createdAt: true,
  updatedAt: true,
  _count: { select: { transactions: true } },
  transactions: {
    select: CLIENT_TRANSACTION_SELECT,
    orderBy: { createdAt: 'desc' },
  },
} satisfies Prisma.ClientsSelect;

// Same shape as CLIENTS_SELECT — the list endpoint now embeds every
// transaction per client too, not just enough to compute a total.
export const CLIENTS_LIST_SELECT = {
  id: true,
  clientName: true,
  totalRevenue: true,
  currencyType: true,
  createdAt: true,
  updatedAt: true,
  _count: { select: { transactions: true } },
  transactions: {
    select: CLIENT_TRANSACTION_SELECT,
    orderBy: { createdAt: 'desc' },
  },
} satisfies Prisma.ClientsSelect;

export const CLIENT_SEARCH_SELECT = {
  id: true,
  clientName: true,
} satisfies Prisma.ClientsSelect;
