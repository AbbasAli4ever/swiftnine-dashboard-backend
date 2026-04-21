import type { Prisma } from '@app/database/generated/prisma/client';

export const TASK_NOT_FOUND = 'Task not found';
export const TASK_LIST_NOT_FOUND = 'Task list not found';
export const PROJECT_NOT_FOUND = 'Project not found';
export const STATUS_NOT_FOUND = 'Status not found or does not belong to this project';
export const USER_NOT_MEMBER = 'One or more users are not members of this workspace';
export const TAG_NOT_IN_WORKSPACE = 'One or more tags do not belong to this workspace';
export const SUBTASK_DEPTH_LIMIT = 'Subtask nesting limit reached (max depth 2)';
export const TAG_ALREADY_ON_TASK = 'Tag is already added to this task';
export const TAG_NOT_ON_TASK = 'Tag is not on this task';
export const FORBIDDEN_DELETE = 'Only the task creator or workspace owner can delete this task';
export const INVALID_REORDER_PAYLOAD = 'Reorder payload must include every active task in the list exactly once';

// ─── Shared inline selects ────────────────────────────────────────────────────

const USER_BRIEF_SELECT = {
  id: true,
  fullName: true,
  avatarUrl: true,
  avatarColor: true,
} as const;

const STATUS_BRIEF_SELECT = {
  id: true,
  name: true,
  color: true,
  group: true,
} as const;

const ASSIGNEES_SELECT = {
  select: {
    user: { select: USER_BRIEF_SELECT },
    assignedBy: true,
  },
} as const;

const TAGS_SELECT = {
  select: {
    tag: { select: { id: true, name: true, color: true } },
  },
} as const;

const LIST_WITH_PROJECT_SELECT = {
  select: {
    id: true,
    name: true,
    project: {
      select: { id: true, name: true, taskIdPrefix: true },
    },
  },
} as const;

// ─── List item select (used for GET /lists/:listId/tasks) ────────────────────

export const TASK_LIST_ITEM_SELECT = {
  id: true,
  taskNumber: true,
  title: true,
  priority: true,
  startDate: true,
  dueDate: true,
  position: true,
  depth: true,
  isCompleted: true,
  completedAt: true,
  createdAt: true,
  updatedAt: true,
  status: { select: STATUS_BRIEF_SELECT },
  assignees: ASSIGNEES_SELECT,
  tags: TAGS_SELECT,
  list: LIST_WITH_PROJECT_SELECT,
  _count: { select: { children: { where: { deletedAt: null } } } },
} satisfies Prisma.TaskSelect;

// ─── Full detail select (used for GET /tasks/:taskId) ────────────────────────

export const TASK_DETAIL_SELECT = {
  id: true,
  taskNumber: true,
  parentId: true,
  depth: true,
  title: true,
  description: true,
  priority: true,
  startDate: true,
  dueDate: true,
  position: true,
  isCompleted: true,
  completedAt: true,
  createdBy: true,
  createdAt: true,
  updatedAt: true,
  status: { select: STATUS_BRIEF_SELECT },
  creator: { select: USER_BRIEF_SELECT },
  assignees: ASSIGNEES_SELECT,
  tags: TAGS_SELECT,
  list: LIST_WITH_PROJECT_SELECT,
  children: {
    where: { deletedAt: null },
    select: {
      id: true,
      taskNumber: true,
      title: true,
      priority: true,
      isCompleted: true,
      completedAt: true,
      depth: true,
      position: true,
      status: { select: STATUS_BRIEF_SELECT },
      assignees: ASSIGNEES_SELECT,
    },
    orderBy: { position: 'asc' as const },
  },
  timeEntries: {
    where: { deletedAt: null },
    select: {
      id: true,
      userId: true,
      description: true,
      startTime: true,
      endTime: true,
      duration: true,
      isManual: true,
      createdAt: true,
      user: { select: USER_BRIEF_SELECT },
    },
    orderBy: { startTime: 'desc' as const },
  },
} satisfies Prisma.TaskSelect;
