import type { Prisma } from '@app/database/generated/prisma/client';

export const EMPLOYEE_NOT_FOUND = 'Employee not found';

export const EMPLOYEES_SORT_FIELDS = [
  'name',
  'createdAt',
  'updatedAt',
] as const;

// No transactions/_count here any more — an employee no longer has any
// relation to a Transaction. paidCommission/pendingCommission are the
// manually-entered figures this whole select exists to expose.
export const EMPLOYEES_SELECT = {
  id: true,
  name: true,
  paidCommission: true,
  pendingCommission: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.EmployeeSelect;

export const EMPLOYEE_SEARCH_SELECT = {
  id: true,
  name: true,
} satisfies Prisma.EmployeeSelect;
