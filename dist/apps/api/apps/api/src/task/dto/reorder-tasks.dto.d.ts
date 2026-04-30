import { z } from 'zod';
declare const ReorderTasksDto_base: import("nestjs-zod").ZodDto<z.ZodObject<{
    taskIds: z.ZodArray<z.ZodString>;
}, z.core.$strip>, false>;
export declare class ReorderTasksDto extends ReorderTasksDto_base {
}
export {};
