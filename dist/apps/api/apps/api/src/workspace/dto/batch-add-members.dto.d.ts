declare const BatchAddMembersDto_base: any;
export declare class BatchAddMembersDto extends BatchAddMembersDto_base {
}
export declare class BatchAddMemberResultDto {
    userId: string;
    status: 'added' | 'already_member' | 'failed';
    message: string | null;
}
export declare class BatchAddSummaryDto {
    total: number;
    added: number;
    alreadyMember: number;
    failed: number;
}
export declare class BatchAddResponseDto {
    results: BatchAddMemberResultDto[];
    summary: BatchAddSummaryDto;
}
export {};
