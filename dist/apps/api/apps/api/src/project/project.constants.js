"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PROJECT_WITH_STATUSES_SELECT = exports.PROJECT_SELECT = exports.DEFAULT_STATUSES = exports.OWNER_ONLY = exports.PROJECT_PREFIX_TAKEN = exports.PROJECT_NOT_FOUND = void 0;
exports.PROJECT_NOT_FOUND = 'Project not found';
exports.PROJECT_PREFIX_TAKEN = 'A project with this task ID prefix already exists in this workspace';
exports.OWNER_ONLY = 'Only the workspace owner can perform this action';
exports.DEFAULT_STATUSES = [
    { name: 'To Do', color: '#94a3b8', position: 1000, isDefault: true, isClosed: false },
    { name: 'In Progress', color: '#3b82f6', position: 2000, isDefault: true, isClosed: false },
    { name: 'Review', color: '#f59e0b', position: 3000, isDefault: true, isClosed: false },
    { name: 'Completed', color: '#22c55e', position: 4000, isDefault: true, isClosed: true },
];
exports.PROJECT_SELECT = {
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
};
exports.PROJECT_WITH_STATUSES_SELECT = {
    ...exports.PROJECT_SELECT,
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
        orderBy: { position: 'asc' },
    },
    _count: {
        select: { taskLists: true },
    },
};
//# sourceMappingURL=project.constants.js.map