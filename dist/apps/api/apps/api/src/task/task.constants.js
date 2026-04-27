"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TASK_DETAIL_SELECT = exports.TASK_LIST_ITEM_SELECT = exports.BOARD_REORDER_SUBTASK_FORBIDDEN = exports.INVALID_BOARD_REORDER_PAYLOAD = exports.INVALID_REORDER_PAYLOAD = exports.FORBIDDEN_DELETE = exports.TAG_NOT_ON_TASK = exports.TAG_ALREADY_ON_TASK = exports.SUBTASK_DEPTH_LIMIT = exports.TAG_NOT_IN_WORKSPACE = exports.USER_NOT_MEMBER = exports.STATUS_NOT_FOUND = exports.PROJECT_NOT_FOUND = exports.TASK_LIST_NOT_FOUND = exports.TASK_NOT_FOUND = void 0;
exports.TASK_NOT_FOUND = 'Task not found';
exports.TASK_LIST_NOT_FOUND = 'Task list not found';
exports.PROJECT_NOT_FOUND = 'Project not found';
exports.STATUS_NOT_FOUND = 'Status not found or does not belong to this project';
exports.USER_NOT_MEMBER = 'One or more users are not members of this workspace';
exports.TAG_NOT_IN_WORKSPACE = 'One or more tags do not belong to this workspace';
exports.SUBTASK_DEPTH_LIMIT = 'Subtask nesting limit reached (max depth 2)';
exports.TAG_ALREADY_ON_TASK = 'Tag is already added to this task';
exports.TAG_NOT_ON_TASK = 'Tag is not on this task';
exports.FORBIDDEN_DELETE = 'Only the task creator or workspace owner can delete this task';
exports.INVALID_REORDER_PAYLOAD = 'Reorder payload must include every active task in the list exactly once';
exports.INVALID_BOARD_REORDER_PAYLOAD = 'Board reorder payload must include every active top-level task in the destination status exactly once';
exports.BOARD_REORDER_SUBTASK_FORBIDDEN = 'Board reorder supports top-level tasks only';
const USER_BRIEF_SELECT = {
    id: true,
    fullName: true,
    avatarUrl: true,
    avatarColor: true,
};
const STATUS_BRIEF_SELECT = {
    id: true,
    name: true,
    color: true,
    group: true,
};
const ASSIGNEES_SELECT = {
    select: {
        user: { select: USER_BRIEF_SELECT },
        assignedBy: true,
    },
};
const TAGS_SELECT = {
    select: {
        tag: { select: { id: true, name: true, color: true } },
    },
};
const LIST_WITH_PROJECT_SELECT = {
    select: {
        id: true,
        name: true,
        project: {
            select: { id: true, name: true, taskIdPrefix: true },
        },
    },
};
exports.TASK_LIST_ITEM_SELECT = {
    id: true,
    taskNumber: true,
    title: true,
    priority: true,
    startDate: true,
    dueDate: true,
    position: true,
    boardPosition: true,
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
};
exports.TASK_DETAIL_SELECT = {
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
    boardPosition: true,
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
        orderBy: { position: 'asc' },
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
        orderBy: { startTime: 'desc' },
    },
};
//# sourceMappingURL=task.constants.js.map