import { z } from 'zod';
declare const ReorderBoardTasksDto_base: import("nestjs-zod").ZodDto<z.ZodObject<{
    mode: z.ZodDefault<z.ZodLiteral<"manual">>;
    taskId: z.ZodString;
    toStatusId: z.ZodString;
    toListId: z.ZodOptional<z.ZodString>;
    orderedTaskIds: z.ZodArray<z.ZodString>;
}, z.core.$strip>, false>;
export declare class ReorderBoardTasksDto extends ReorderBoardTasksDto_base {
}
export {};
