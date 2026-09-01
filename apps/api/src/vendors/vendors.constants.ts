import type { Prisma } from '@app/database/generated/prisma/client';

export const VENDOR_NOT_FOUND = 'Vendor not found';

export const VENDORS_SORT_FIELDS = [
  'name',
  'dueDate',
  'createdAt',
  'updatedAt',
] as const;

// pendingPayment/dueDate are the manually-entered figures this select exists
// to expose. No transactions/_count — a vendor has no relation to a
// Transaction.
export const VENDORS_SELECT = {
  id: true,
  name: true,
  pendingPayment: true,
  dueDate: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.VendorSelect;

export const VENDOR_SEARCH_SELECT = {
  id: true,
  name: true,
} satisfies Prisma.VendorSelect;
