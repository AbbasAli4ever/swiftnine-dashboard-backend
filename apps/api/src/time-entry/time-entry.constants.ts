import type { Prisma } from '@app/database/generated/prisma/client';

export const TIME_ENTRY_NOT_FOUND = 'Time entry not found';
export const TASK_NOT_FOUND = 'Task not found';
export const ACTIVE_TIMER_STOPPED = 'Previous active timer was stopped automatically';
export const NO_ACTIVE_TIMER = 'No active timer found for this user in this workspace';
export const FORBIDDEN_TIME_ENTRY = 'You can only manage your own time entries';
export const INVALID_TIME_RANGE = 'End time must be after start time';
export const DURATION_REQUIRED = 'Provide either startTime + endTime, or durationMinutes';

export const TIME_ENTRY_SELECT = {
  id: true,
  taskId: true,
  userId: true,
  description: true,
  startTime: true,
  endTime: true,
  duration: true,
  isManual: true,
  createdAt: true,
  updatedAt: true,
  user: {
    select: {
      id: true,
      fullName: true,
      avatarUrl: true,
      avatarColor: true,
    },
  },
} satisfies Prisma.TimeEntrySelect;
