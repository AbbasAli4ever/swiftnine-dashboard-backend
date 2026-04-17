import type { Prisma } from '@app/database/generated/prisma/client';

export const STATUS_NOT_FOUND = 'Status not found';
export const PROJECT_NOT_FOUND = 'Project not found';
export const OWNER_ONLY = 'Only the workspace owner can perform this action';
export const CLOSED_STATUS_CREATE_FORBIDDEN =
  'Closed statuses cannot be created manually';
export const PROTECTED_STATUS_DELETE_FORBIDDEN =
  'The protected closed status cannot be deleted';
export const PROTECTED_STATUS_UPDATE_FORBIDDEN =
  'The protected closed status can only be renamed';
export const DELETE_REPLACEMENT_REQUIRED =
  'A replacement status is required when tasks use this status';
export const INVALID_REPLACEMENT_STATUS =
  'Replacement status must belong to the same project and be active';
export const INVALID_REORDER_PAYLOAD =
  'Reorder payload must include every active status exactly once';
export const CLOSED_GROUP_REORDER_FORBIDDEN =
  'Closed group must contain exactly one protected closed status';

export const STATUS_SELECT = {
  id: true,
  projectId: true,
  name: true,
  color: true,
  group: true,
  position: true,
  isDefault: true,
  isProtected: true,
  isClosed: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.StatusSelect;

export const DEFAULT_STATUS_TEMPLATE = [
  {
    name: 'To Do',
    color: '#94a3b8',
    group: 'NOT_STARTED',
    position: 1000,
    isDefault: true,
    isProtected: false,
    isClosed: false,
  },
  {
    name: 'In Progress',
    color: '#3b82f6',
    group: 'ACTIVE',
    position: 1000,
    isDefault: true,
    isProtected: false,
    isClosed: false,
  },
  {
    name: 'Complete',
    color: '#22c55e',
    group: 'CLOSED',
    position: 1000,
    isDefault: true,
    isProtected: true,
    isClosed: true,
  },
] as const;
