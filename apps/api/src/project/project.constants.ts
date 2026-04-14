export const PROJECT_NOT_FOUND = 'Project not found';
export const PROJECT_PREFIX_TAKEN = 'A project with this task ID prefix already exists in this workspace';
export const OWNER_ONLY = 'Only the workspace owner can perform this action';

export const DEFAULT_STATUSES = [
  { name: 'To Do',       color: '#94a3b8', position: 1000, isDefault: true, isClosed: false },
  { name: 'In Progress', color: '#3b82f6', position: 2000, isDefault: true, isClosed: false },
  { name: 'Review',      color: '#f59e0b', position: 3000, isDefault: true, isClosed: false },
  { name: 'Completed',   color: '#22c55e', position: 4000, isDefault: true, isClosed: true  },
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
      position: true,
      isDefault: true,
      isClosed: true,
    },
    orderBy: { position: 'asc' as const },
  },
  _count: {
    select: { taskLists: true },
  },
} as const;
