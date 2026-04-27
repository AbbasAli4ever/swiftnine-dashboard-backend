"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TASK_LIST_SELECT = exports.TASK_LIST_INVALID_DATE_RANGE = exports.TASK_LIST_OWNER_NOT_IN_WORKSPACE = exports.TASK_LIST_NOT_ARCHIVED = exports.TASK_LIST_ALREADY_ARCHIVED = exports.INVALID_REORDER_PAYLOAD = exports.TASK_LIST_NAME_TAKEN = exports.PROJECT_NOT_FOUND = exports.TASK_LIST_NOT_FOUND = void 0;
exports.TASK_LIST_NOT_FOUND = 'Task list not found';
exports.PROJECT_NOT_FOUND = 'Project not found';
exports.TASK_LIST_NAME_TAKEN = 'A list with this name already exists in this project';
exports.INVALID_REORDER_PAYLOAD = 'Reorder payload must include every active list exactly once';
exports.TASK_LIST_ALREADY_ARCHIVED = 'Task list is already archived';
exports.TASK_LIST_NOT_ARCHIVED = 'Task list is not archived';
exports.TASK_LIST_OWNER_NOT_IN_WORKSPACE = 'Owner must be an active member of this workspace';
exports.TASK_LIST_INVALID_DATE_RANGE = 'List start date cannot be after list end date';
exports.TASK_LIST_SELECT = {
    id: true,
    projectId: true,
    name: true,
    position: true,
    startDate: true,
    endDate: true,
    ownerUserId: true,
    priority: true,
    isArchived: true,
    createdBy: true,
    createdAt: true,
    updatedAt: true,
    owner: {
        select: {
            id: true,
            fullName: true,
            avatarUrl: true,
            avatarColor: true,
        },
    },
};
//# sourceMappingURL=task-list.constants.js.map