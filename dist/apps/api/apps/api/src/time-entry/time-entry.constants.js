"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TIME_ENTRY_SELECT = exports.DURATION_REQUIRED = exports.INVALID_TIME_RANGE = exports.FORBIDDEN_TIME_ENTRY = exports.NO_ACTIVE_TIMER = exports.ACTIVE_TIMER_STOPPED = exports.TASK_NOT_FOUND = exports.TIME_ENTRY_NOT_FOUND = void 0;
exports.TIME_ENTRY_NOT_FOUND = 'Time entry not found';
exports.TASK_NOT_FOUND = 'Task not found';
exports.ACTIVE_TIMER_STOPPED = 'Previous active timer was stopped automatically';
exports.NO_ACTIVE_TIMER = 'No active timer found for this user in this workspace';
exports.FORBIDDEN_TIME_ENTRY = 'You can only manage your own time entries';
exports.INVALID_TIME_RANGE = 'End time must be after start time';
exports.DURATION_REQUIRED = 'Provide either startTime + endTime, or durationMinutes';
exports.TIME_ENTRY_SELECT = {
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
};
//# sourceMappingURL=time-entry.constants.js.map