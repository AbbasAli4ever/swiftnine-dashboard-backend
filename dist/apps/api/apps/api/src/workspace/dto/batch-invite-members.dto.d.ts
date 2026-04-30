declare const BatchInviteMembersDto_base: any;
export declare class BatchInviteMembersDto extends BatchInviteMembersDto_base {
}
export declare class BatchInviteMemberResultDto {
    email: string;
    status: 'invited' | 'already_member' | 'failed';
    message: string | null;
}
export declare class BatchInviteSummaryDto {
    total: number;
    invited: number;
    alreadyMember: number;
    failed: number;
}
export declare class BatchInviteResponseDto {
    results: BatchInviteMemberResultDto[];
    summary: BatchInviteSummaryDto;
}
export {};
