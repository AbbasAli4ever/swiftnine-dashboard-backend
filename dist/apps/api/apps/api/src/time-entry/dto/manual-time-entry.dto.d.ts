import { z } from 'zod';
declare const ManualTimeEntryDto_base: import("nestjs-zod").ZodDto<z.ZodObject<{
    description: z.ZodOptional<z.ZodString>;
    startTime: z.ZodOptional<z.ZodString>;
    endTime: z.ZodOptional<z.ZodString>;
    durationMinutes: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>, false>;
export declare class ManualTimeEntryDto extends ManualTimeEntryDto_base {
}
export {};
