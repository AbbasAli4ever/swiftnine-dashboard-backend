import { z } from 'zod';
declare const BatchInviteMembersDto_base: import("nestjs-zod").ZodDto<z.ZodObject<{
    emails: z.ZodArray<z.ZodString>;
    role: z.ZodDefault<z.ZodEnum<{
        OWNER: "OWNER";
        MEMBER: "MEMBER";
    }>>;
}, z.core.$strip>, false>;
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
