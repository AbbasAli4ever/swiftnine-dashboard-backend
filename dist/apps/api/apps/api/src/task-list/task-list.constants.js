"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TASK_LIST_SELECT = exports.TASK_LIST_NOT_ARCHIVED = exports.TASK_LIST_ALREADY_ARCHIVED = exports.INVALID_REORDER_PAYLOAD = exports.TASK_LIST_NAME_TAKEN = exports.PROJECT_NOT_FOUND = exports.TASK_LIST_NOT_FOUND = void 0;
exports.TASK_LIST_NOT_FOUND = 'Task list not found';
exports.PROJECT_NOT_FOUND = 'Project not found';
exports.TASK_LIST_NAME_TAKEN = 'A list with this name already exists in this project';
exports.INVALID_REORDER_PAYLOAD = 'Reorder payload must include every active list exactly once';
exports.TASK_LIST_ALREADY_ARCHIVED = 'Task list is already archived';
exports.TASK_LIST_NOT_ARCHIVED = 'Task list is not archived';
exports.TASK_LIST_SELECT = {
    id: true,
    projectId: true,
    name: true,
    position: true,
    isArchived: true,
    createdBy: true,
    createdAt: true,
    updatedAt: true,
};
//# sourceMappingURL=task-list.constants.js.map