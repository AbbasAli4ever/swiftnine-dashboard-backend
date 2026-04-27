import { z } from 'zod';
declare const UpdateTaskDto_base: import("nestjs-zod").ZodDto<z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    statusId: z.ZodOptional<z.ZodString>;
    priority: z.ZodOptional<z.ZodEnum<{
        URGENT: "URGENT";
        HIGH: "HIGH";
        NORMAL: "NORMAL";
        LOW: "LOW";
        NONE: "NONE";
    }>>;
    startDate: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    dueDate: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    listId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, false>;
export declare class UpdateTaskDto extends UpdateTaskDto_base {
}
export {};
