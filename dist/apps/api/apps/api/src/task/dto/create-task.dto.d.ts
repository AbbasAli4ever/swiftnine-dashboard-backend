import { z } from 'zod';
declare const CreateTaskDto_base: import("nestjs-zod").ZodDto<z.ZodObject<{
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
    startDate: z.ZodOptional<z.ZodString>;
    dueDate: z.ZodOptional<z.ZodString>;
    assigneeIds: z.ZodOptional<z.ZodArray<z.ZodString>>;
    tagIds: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strip>, false>;
export declare class CreateTaskDto extends CreateTaskDto_base {
}
export {};
