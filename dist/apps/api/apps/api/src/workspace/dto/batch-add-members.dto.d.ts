import { z } from 'zod';
declare const BatchAddMembersDto_base: import("nestjs-zod").ZodDto<z.ZodObject<{
    userIds: z.ZodArray<z.ZodString>;
    role: z.ZodDefault<z.ZodEnum<{
        OWNER: "OWNER";
        MEMBER: "MEMBER";
    }>>;
}, z.core.$strip>, false>;
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
