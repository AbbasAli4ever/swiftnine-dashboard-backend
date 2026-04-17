import type { Prisma } from '@app/database/generated/prisma/client';

export const PROJECT_NOT_FOUND = 'Project not found';
export const PROJECT_PREFIX_TAKEN = 'A project with this task ID prefix already exists in this workspace';
export const OWNER_ONLY = 'Only the workspace owner can perform this action';

export const DEFAULT_STATUSES = [
  {
    name: 'To Do',
    color: '#94a3b8',
    position: 1000,
    group: 'NOT_STARTED',
    isDefault: true,
    isProtected: false,
    isClosed: false,
  },
  {
    name: 'In Progress',
    color: '#3b82f6',
    position: 1000,
    group: 'ACTIVE',
    isDefault: true,
    isProtected: false,
    isClosed: false,
  },
  {
    name: 'Complete',
    color: '#22c55e',
    position: 1000,
    group: 'CLOSED',
    isDefault: true,
    isProtected: true,
    isClosed: true,
  },
] as const;

export const PROJECT_SELECT = {
  id: true,
  workspaceId: true,
  name: true,
  description: true,
  color: true,
  icon: true,
  taskIdPrefix: true,
  isArchived: true,
  createdBy: true,
  createdAt: true,
  updatedAt: true,
} as const;

export const PROJECT_WITH_STATUSES_SELECT = {
  ...PROJECT_SELECT,
  statuses: {
    where: { deletedAt: null },
    select: {
      id: true,
      name: true,
      color: true,
      group: true,
      position: true,
      isDefault: true,
      isProtected: true,
      isClosed: true,
    },
    orderBy: [{ group: 'asc' }, { position: 'asc' }],
  },
  _count: {
    select: { taskLists: true },
  },
} satisfies Prisma.ProjectSelect;
