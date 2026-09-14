import type { Prisma } from '@app/database/generated/prisma/client';

export const USER_NOT_MEMBER = 'One or more users are not members of this workspace';
export const MEETING_NOT_FOUND = 'Meeting not found';
export const PROJECT_NOT_FOUND = 'Project not found';
export const USER_NOT_PROJECT_MEMBER = 'One or more assignees cannot access one or more selected projects';
export const PROJECT_HAS_NO_LIST = 'Selected project has no task list to add this task to';
export const PROJECT_HAS_NO_TODO_STATUS = 'Selected project has no "To Do" status';
export const MEETING_UPDATE_FORBIDDEN = 'Only the meeting creator can update this meeting';
export const MEETING_DELETE_FORBIDDEN = 'Only the meeting creator can delete this meeting';
export const MEETING_TASK_ADD_FORBIDDEN = 'Only the meeting creator can add a follow-up task to this meeting';

// ─── Shared inline selects ────────────────────────────────────────────────────

const USER_BRIEF_SELECT = {
  id: true,
  fullName: true,
  avatarUrl: true,
  avatarColor: true,
} as const;

const MEETING_TASK_SELECT = {
  id: true,
  taskNumber: true,
  title: true,
  createdAt: true,
  startDate: true,
  dueDate: true,
  // isClosed is what actually decides completed vs pending (see
  // MeetingService.computeTaskStats) — it's the same flag the project board
  // itself derives from group === 'CLOSED' when statuses are created, so a
  // task only counts as "completed" once it's sitting in whichever column is
  // the project's actual terminal one (e.g. "Completed"), not just any
  // status with a done-sounding name.
  status: { select: { id: true, name: true, color: true, group: true, isClosed: true } },
  list: {
    select: {
      project: { select: { id: true, name: true, taskIdPrefix: true } },
    },
  },
  assignees: {
    select: { user: { select: USER_BRIEF_SELECT } },
  },
  // When a task has subtasks, progress is measured by how many of them are
  // done instead of by date — see MeetingService.computeTaskProgress.
  children: {
    where: { deletedAt: null },
    select: {
      id: true,
      title: true,
      status: { select: { isClosed: true } },
    },
  },
} as const;

// Lightweight — no summary/decisions/full task array, just enough to render
// a "Recent meetings" card (title, date, creator, participants, task
// counts). Use MEETING_DETAIL_SELECT for a single meeting's full view.
export const MEETING_LIST_ITEM_SELECT = {
  id: true,
  title: true,
  meetingDate: true,
  createdAt: true,
  creator: { select: USER_BRIEF_SELECT },
  participants: {
    select: { user: { select: USER_BRIEF_SELECT } },
  },
  tasks: {
    where: { deletedAt: null },
    select: { status: { select: { isClosed: true } } },
  },
} satisfies Prisma.MeetingMinutesSelect;

export const MEETING_DETAIL_SELECT = {
  id: true,
  workspaceId: true,
  title: true,
  meetingDate: true,
  summary: true,
  decisions: true,
  createdBy: true,
  createdAt: true,
  updatedAt: true,
  creator: { select: USER_BRIEF_SELECT },
  participants: {
    select: { user: { select: USER_BRIEF_SELECT } },
  },
  tasks: {
    where: { deletedAt: null },
    select: MEETING_TASK_SELECT,
    orderBy: { createdAt: 'asc' as const },
  },
} satisfies Prisma.MeetingMinutesSelect;
