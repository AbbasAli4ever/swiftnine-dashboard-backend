import type { Prisma } from '@app/database/generated/prisma/client';

export const EMPLOYEE_NOT_FOUND = 'Employee not found';
export const EMPLOYEE_HAS_TRANSACTIONS =
  'Cannot delete an employee that still has transactions';

export const EMPLOYEES_SORT_FIELDS = [
  'name',
  'createdAt',
  'updatedAt',
] as const;

export const EMPLOYEE_TRANSACTION_SELECT = {
  id: true,
  saleAmount: true,
  currency: true,
  commissionAmount: true,
  commissionCurrency: true,
  saleDate: true,
  refId: true,
  description: true,
  createdAt: true,
  updatedAt: true,
  client: { select: { id: true, clientName: true } },
} satisfies Prisma.TransactionSelect;

export const EMPLOYEES_SELECT = {
  id: true,
  name: true,
  createdAt: true,
  updatedAt: true,
  _count: { select: { transactions: true } },
  transactions: {
    select: EMPLOYEE_TRANSACTION_SELECT,
    orderBy: { createdAt: 'desc' },
  },
} satisfies Prisma.EmployeeSelect;

// Same shape as EMPLOYEES_SELECT — the list endpoint embeds every transaction
// per employee too, matching how GET /clients works.
export const EMPLOYEES_LIST_SELECT = EMPLOYEES_SELECT;

export const EMPLOYEE_SEARCH_SELECT = {
  id: true,
  name: true,
} satisfies Prisma.EmployeeSelect;
