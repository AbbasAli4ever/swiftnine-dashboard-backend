import type { Prisma } from '@app/database/generated/prisma/client';

export const PROJECT_NOT_FOUND = 'Project not found';
export const PROJECT_PREFIX_TAKEN = 'A project with this task ID prefix already exists in this workspace';
export const PROJECT_DELETE_FORBIDDEN =
  "Only the workspace owner or the project's creator can delete it";
export const PROJECT_ALREADY_ARCHIVED = 'Project is already archived';
export const PROJECT_NOT_ARCHIVED = 'Project is not archived';
export const PROJECT_VISIBILITY_MANAGER_ONLY =
  'Only the project creator can change its visibility or manage its members';
export const PROJECT_MEMBER_NOT_WORKSPACE_MEMBER =
  'User is not a member of this workspace';
export const PROJECT_MEMBER_ALREADY_INVITED =
  'User is already a member of this project';
export const PROJECT_MEMBER_NOT_FOUND = 'User is not a member of this project';
export const PROJECT_CANNOT_INVITE_TO_PUBLIC =
  'Cannot invite members to a PUBLIC project — every workspace member already has access. Switch it to PRIVATE first';
export const PROJECT_CANNOT_REMOVE_CREATOR =
  "Cannot remove the project's creator from its member list";

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
  visibility: true,
  createdAt: true,
  updatedAt: true,
} as const;

export const PROJECT_MEMBER_SELECT = {
  id: true,
  userId: true,
  invitedBy: true,
  createdAt: true,
  user: {
    select: {
      id: true,
      fullName: true,
      email: true,
      avatarUrl: true,
      avatarColor: true,
    },
  },
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
