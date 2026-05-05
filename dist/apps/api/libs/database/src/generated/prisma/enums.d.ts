export declare const Role: {
    readonly OWNER: "OWNER";
    readonly ADMIN: "ADMIN";
    readonly MEMBER: "MEMBER";
};
export type Role = (typeof Role)[keyof typeof Role];
export declare const WorkspaceUse: {
    readonly WORK: "WORK";
    readonly PERSONAL: "PERSONAL";
    readonly SCHOOL: "SCHOOL";
};
export type WorkspaceUse = (typeof WorkspaceUse)[keyof typeof WorkspaceUse];
export declare const WorkspaceManagementType: {
    readonly HR_RECRUITING: "HR_RECRUITING";
    readonly CREATIVE_DESIGN: "CREATIVE_DESIGN";
    readonly PROFESSIONAL_SERVICES: "PROFESSIONAL_SERVICES";
    readonly FINANCE_ACCOUNTING: "FINANCE_ACCOUNTING";
    readonly OPERATIONS: "OPERATIONS";
    readonly SOFTWARE_DEVELOPMENT: "SOFTWARE_DEVELOPMENT";
    readonly IT: "IT";
    readonly SALES_CRM: "SALES_CRM";
    readonly PERSONAL_USE: "PERSONAL_USE";
    readonly SUPPORT: "SUPPORT";
    readonly STARTUP: "STARTUP";
    readonly PMO: "PMO";
    readonly MARKETING: "MARKETING";
    readonly OTHER: "OTHER";
};
export type WorkspaceManagementType = (typeof WorkspaceManagementType)[keyof typeof WorkspaceManagementType];
export declare const InviteStatus: {
    readonly PENDING: "PENDING";
    readonly ACCEPTED: "ACCEPTED";
    readonly EXPIRED: "EXPIRED";
    readonly REVOKED: "REVOKED";
};
export type InviteStatus = (typeof InviteStatus)[keyof typeof InviteStatus];
export declare const Priority: {
    readonly URGENT: "URGENT";
    readonly HIGH: "HIGH";
    readonly NORMAL: "NORMAL";
    readonly LOW: "LOW";
    readonly NONE: "NONE";
};
export type Priority = (typeof Priority)[keyof typeof Priority];
export declare const StatusGroup: {
    readonly NOT_STARTED: "NOT_STARTED";
    readonly ACTIVE: "ACTIVE";
    readonly DONE: "DONE";
    readonly CLOSED: "CLOSED";
};
export type StatusGroup = (typeof StatusGroup)[keyof typeof StatusGroup];
export declare const ChannelPrivacy: {
    readonly PUBLIC: "PUBLIC";
    readonly PRIVATE: "PRIVATE";
};
export type ChannelPrivacy = (typeof ChannelPrivacy)[keyof typeof ChannelPrivacy];
export declare const ChannelKind: {
    readonly CHANNEL: "CHANNEL";
    readonly DM: "DM";
};
export type ChannelKind = (typeof ChannelKind)[keyof typeof ChannelKind];
export declare const ChannelMessageKind: {
    readonly USER: "USER";
    readonly SYSTEM: "SYSTEM";
};
export type ChannelMessageKind = (typeof ChannelMessageKind)[keyof typeof ChannelMessageKind];
export declare const ChannelJoinRequestStatus: {
    readonly PENDING: "PENDING";
    readonly APPROVED: "APPROVED";
    readonly REJECTED: "REJECTED";
};
export type ChannelJoinRequestStatus = (typeof ChannelJoinRequestStatus)[keyof typeof ChannelJoinRequestStatus];
export declare const DocScope: {
    readonly WORKSPACE: "WORKSPACE";
    readonly PROJECT: "PROJECT";
    readonly PERSONAL: "PERSONAL";
};
export type DocScope = (typeof DocScope)[keyof typeof DocScope];
export declare const DocRole: {
    readonly VIEWER: "VIEWER";
    readonly COMMENTER: "COMMENTER";
    readonly EDITOR: "EDITOR";
    readonly OWNER: "OWNER";
};
export type DocRole = (typeof DocRole)[keyof typeof DocRole];
export declare const DocVersionType: {
    readonly AUTO: "AUTO";
    readonly MANUAL: "MANUAL";
    readonly RESTORE_SAFETY: "RESTORE_SAFETY";
};
export type DocVersionType = (typeof DocVersionType)[keyof typeof DocVersionType];
