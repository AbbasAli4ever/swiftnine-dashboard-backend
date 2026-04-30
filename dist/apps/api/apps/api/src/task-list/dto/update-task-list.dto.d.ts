import { z } from 'zod';
declare const UpdateTaskListDto_base: import("nestjs-zod").ZodDto<z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    startDate: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    endDate: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    ownerId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    priority: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
        URGENT: "URGENT";
        HIGH: "HIGH";
        NORMAL: "NORMAL";
        LOW: "LOW";
        NONE: "NONE";
    }>>>;
}, z.core.$strip>, false>;
export declare class UpdateTaskListDto extends UpdateTaskListDto_base {
}
export {};
