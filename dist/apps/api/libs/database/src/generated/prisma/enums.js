"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocVersionType = exports.DocRole = exports.DocScope = exports.ChannelPrivacy = exports.StatusGroup = exports.Priority = exports.InviteStatus = exports.WorkspaceManagementType = exports.WorkspaceUse = exports.Role = void 0;
exports.Role = {
    OWNER: 'OWNER',
    MEMBER: 'MEMBER'
};
exports.WorkspaceUse = {
    WORK: 'WORK',
    PERSONAL: 'PERSONAL',
    SCHOOL: 'SCHOOL'
};
exports.WorkspaceManagementType = {
    HR_RECRUITING: 'HR_RECRUITING',
    CREATIVE_DESIGN: 'CREATIVE_DESIGN',
    PROFESSIONAL_SERVICES: 'PROFESSIONAL_SERVICES',
    FINANCE_ACCOUNTING: 'FINANCE_ACCOUNTING',
    OPERATIONS: 'OPERATIONS',
    SOFTWARE_DEVELOPMENT: 'SOFTWARE_DEVELOPMENT',
    IT: 'IT',
    SALES_CRM: 'SALES_CRM',
    PERSONAL_USE: 'PERSONAL_USE',
    SUPPORT: 'SUPPORT',
    STARTUP: 'STARTUP',
    PMO: 'PMO',
    MARKETING: 'MARKETING',
    OTHER: 'OTHER'
};
exports.InviteStatus = {
    PENDING: 'PENDING',
    ACCEPTED: 'ACCEPTED',
    EXPIRED: 'EXPIRED',
    REVOKED: 'REVOKED'
};
exports.Priority = {
    URGENT: 'URGENT',
    HIGH: 'HIGH',
    NORMAL: 'NORMAL',
    LOW: 'LOW',
    NONE: 'NONE'
};
exports.StatusGroup = {
    NOT_STARTED: 'NOT_STARTED',
    ACTIVE: 'ACTIVE',
    DONE: 'DONE',
    CLOSED: 'CLOSED'
};
exports.ChannelPrivacy = {
    PUBLIC: 'PUBLIC',
    PRIVATE: 'PRIVATE'
};
exports.DocScope = {
    WORKSPACE: 'WORKSPACE',
    PROJECT: 'PROJECT',
    PERSONAL: 'PERSONAL'
};
exports.DocRole = {
    VIEWER: 'VIEWER',
    COMMENTER: 'COMMENTER',
    EDITOR: 'EDITOR',
    OWNER: 'OWNER'
};
exports.DocVersionType = {
    AUTO: 'AUTO',
    MANUAL: 'MANUAL',
    RESTORE_SAFETY: 'RESTORE_SAFETY'
};
//# sourceMappingURL=enums.js.map