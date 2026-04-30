"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PROJECT_WITH_STATUSES_SELECT = exports.PROJECT_SELECT = exports.DEFAULT_STATUSES = exports.PROJECT_NOT_ARCHIVED = exports.PROJECT_ALREADY_ARCHIVED = exports.OWNER_ONLY = exports.PROJECT_PREFIX_TAKEN = exports.PROJECT_NOT_FOUND = void 0;
exports.PROJECT_NOT_FOUND = 'Project not found';
exports.PROJECT_PREFIX_TAKEN = 'A project with this task ID prefix already exists in this workspace';
exports.OWNER_ONLY = 'Only the workspace owner can perform this action';
exports.PROJECT_ALREADY_ARCHIVED = 'Project is already archived';
exports.PROJECT_NOT_ARCHIVED = 'Project is not archived';
exports.DEFAULT_STATUSES = [
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
};
//# sourceMappingURL=project.constants.js.map