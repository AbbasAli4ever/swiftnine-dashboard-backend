import { z } from 'zod';
declare const ReorderTaskListsDto_base: import("nestjs-zod").ZodDto<z.ZodObject<{
    listIds: z.ZodArray<z.ZodString>;
}, z.core.$strip>, false>;
export declare class ReorderTaskListsDto extends ReorderTaskListsDto_base {
}
export {};
