"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_STATUS_TEMPLATE = exports.STATUS_SELECT = exports.CLOSED_GROUP_REORDER_FORBIDDEN = exports.INVALID_REORDER_PAYLOAD = exports.INVALID_REPLACEMENT_STATUS = exports.DELETE_REPLACEMENT_REQUIRED = exports.PROTECTED_STATUS_UPDATE_FORBIDDEN = exports.PROTECTED_STATUS_DELETE_FORBIDDEN = exports.CLOSED_STATUS_CREATE_FORBIDDEN = exports.OWNER_ONLY = exports.PROJECT_NOT_FOUND = exports.STATUS_NOT_FOUND = void 0;
exports.STATUS_NOT_FOUND = 'Status not found';
exports.PROJECT_NOT_FOUND = 'Project not found';
exports.OWNER_ONLY = 'Only the workspace owner can perform this action';
exports.CLOSED_STATUS_CREATE_FORBIDDEN = 'Closed statuses cannot be created manually';
exports.PROTECTED_STATUS_DELETE_FORBIDDEN = 'The protected closed status cannot be deleted';
exports.PROTECTED_STATUS_UPDATE_FORBIDDEN = 'The protected closed status can only be renamed';
exports.DELETE_REPLACEMENT_REQUIRED = 'A replacement status is required when tasks use this status';
exports.INVALID_REPLACEMENT_STATUS = 'Replacement status must belong to the same project and be active';
exports.INVALID_REORDER_PAYLOAD = 'Reorder payload must include every active status exactly once';
exports.CLOSED_GROUP_REORDER_FORBIDDEN = 'Closed group must contain exactly one protected closed status';
exports.STATUS_SELECT = {
    id: true,
    projectId: true,
    name: true,
    color: true,
    group: true,
    position: true,
    isDefault: true,
    isProtected: true,
    isClosed: true,
    createdAt: true,
    updatedAt: true,
};
exports.DEFAULT_STATUS_TEMPLATE = [
    {
        name: 'To Do',
        color: '#94a3b8',
        group: 'NOT_STARTED',
        position: 1000,
        isDefault: true,
        isProtected: false,
        isClosed: false,
    },
    {
        name: 'In Progress',
        color: '#3b82f6',
        group: 'ACTIVE',
        position: 1000,
        isDefault: true,
        isProtected: false,
        isClosed: false,
    },
    {
        name: 'Complete',
        color: '#22c55e',
        group: 'CLOSED',
        position: 1000,
        isDefault: true,
        isProtected: true,
        isClosed: true,
    },
];
//# sourceMappingURL=status.constants.js.map