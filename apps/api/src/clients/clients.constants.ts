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
  paymentPlatform: true,
  currency: true,
  saleDate: true,
  refId: true,
  description: true,
  createdAt: true,
  updatedAt: true,
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

// Listing endpoint doesn't need every transaction row — only enough
// (saleAmount + currency) to compute a per-currency total in the service.
export const CLIENTS_LIST_SELECT = {
  id: true,
  clientName: true,
  totalRevenue: true,
  currencyType: true,
  createdAt: true,
  updatedAt: true,
  _count: { select: { transactions: true } },
  transactions: { select: { saleAmount: true, currency: true } },
} satisfies Prisma.ClientsSelect;

export const CLIENT_SEARCH_SELECT = {
  id: true,
  clientName: true,
} satisfies Prisma.ClientsSelect;
