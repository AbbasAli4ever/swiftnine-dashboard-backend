import { z } from 'zod';
declare const DecideJoinRequestDto_base: import("nestjs-zod").ZodDto<z.ZodObject<{
    decision: z.ZodEnum<{
        approve: "approve";
        reject: "reject";
    }>;
}, z.core.$strip>, false>;
export declare class DecideJoinRequestDto extends DecideJoinRequestDto_base {
    decision: 'approve' | 'reject';
}
export {};
