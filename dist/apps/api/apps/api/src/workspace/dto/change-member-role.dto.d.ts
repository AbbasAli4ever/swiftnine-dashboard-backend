export declare enum MemberRole {
    OWNER = "OWNER",
    MEMBER = "MEMBER"
}
export declare class ChangeMemberRoleDto {
    workspaceId: string;
    role: MemberRole;
}
