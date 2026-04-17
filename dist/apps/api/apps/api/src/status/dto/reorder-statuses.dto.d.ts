import { z } from 'zod';
declare const ReorderStatusesDto_base: import("nestjs-zod").ZodDto<z.ZodObject<{
    projectId: z.ZodString;
    groups: z.ZodObject<{
        notStarted: z.ZodArray<z.ZodString>;
        active: z.ZodArray<z.ZodString>;
        done: z.ZodArray<z.ZodString>;
        closed: z.ZodArray<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>, false>;
export declare class ReorderStatusesDto extends ReorderStatusesDto_base {
}
export {};
