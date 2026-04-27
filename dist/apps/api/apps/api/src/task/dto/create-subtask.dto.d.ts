import { z } from 'zod';
declare const CreateSubtaskDto_base: import("nestjs-zod").ZodDto<z.ZodObject<{
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    statusId: z.ZodString;
    priority: z.ZodDefault<z.ZodEnum<{
        URGENT: "URGENT";
        HIGH: "HIGH";
        NORMAL: "NORMAL";
        LOW: "LOW";
        NONE: "NONE";
    }>>;
    startDate: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    dueDate: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>, false>;
export declare class CreateSubtaskDto extends CreateSubtaskDto_base {
}
export {};
