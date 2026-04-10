export declare const Role: {
    readonly OWNER: "OWNER";
    readonly MEMBER: "MEMBER";
};
export type Role = (typeof Role)[keyof typeof Role];
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
