import type { Prisma } from '@app/database/generated/prisma/client';

export const TASK_LIST_NOT_FOUND = 'Task list not found';
export const PROJECT_NOT_FOUND = 'Project not found';
export const TASK_LIST_NAME_TAKEN = 'A list with this name already exists in this project';
export const INVALID_REORDER_PAYLOAD = 'Reorder payload must include every active list exactly once';
export const TASK_LIST_ALREADY_ARCHIVED = 'Task list is already archived';
export const TASK_LIST_NOT_ARCHIVED = 'Task list is not archived';

export const TASK_LIST_SELECT = {
  id: true,
  projectId: true,
  name: true,
  position: true,
  isArchived: true,
  createdBy: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.TaskListSelect;
