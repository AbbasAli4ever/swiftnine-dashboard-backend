import { z } from 'zod';
declare const UpdateTimeEntryDto_base: import("nestjs-zod").ZodDto<z.ZodObject<{
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    startTime: z.ZodOptional<z.ZodString>;
    endTime: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, false>;
export declare class UpdateTimeEntryDto extends UpdateTimeEntryDto_base {
}
export {};
