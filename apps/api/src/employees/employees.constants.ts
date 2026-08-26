import type { Prisma } from '@app/database/generated/prisma/client';

export const EMPLOYEE_NOT_FOUND = 'Employee not found';

export const EMPLOYEES_SORT_FIELDS = [
  'name',
  'createdAt',
  'updatedAt',
] as const;

// The sales this employee is attached to — mirrors CLIENT_TRANSACTION_SELECT
// in clients.constants.ts (same embed-on-every-response pattern), plus
// commissionAmount, which is the reason this list exists on an employee at
// all: "on which sale" a given commission figure came from.
export const EMPLOYEE_TRANSACTION_SELECT = {
  id: true,
  clientName: true,
  saleAmount: true,
  currency: true,
  saleDate: true,
  refId: true,
  description: true,
  commissionAmount: true,
  createdAt: true,
  updatedAt: true,
  bankAccount: { select: { id: true, bankName: true, logoUrl: true } },
} satisfies Prisma.TransactionSelect;

export const EMPLOYEES_SELECT = {
  id: true,
  name: true,
  paidCommission: true,
  pendingCommission: true,
  createdAt: true,
  updatedAt: true,
  _count: { select: { transactions: true } },
  transactions: {
    select: EMPLOYEE_TRANSACTION_SELECT,
    orderBy: { createdAt: 'desc' },
  },
} satisfies Prisma.EmployeeSelect;

export const EMPLOYEE_SEARCH_SELECT = {
  id: true,
  name: true,
} satisfies Prisma.EmployeeSelect;
