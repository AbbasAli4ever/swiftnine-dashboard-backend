import { z } from 'zod';
export declare const CreateTaskListLinkSchema: z.ZodObject<{
    linkUrl: z.ZodString;
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
declare const CreateTaskListLinkDto_base: import("nestjs-zod").ZodDto<z.ZodObject<{
    linkUrl: z.ZodString;
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, false>;
export declare class CreateTaskListLinkDto extends CreateTaskListLinkDto_base {
    linkUrl: string;
    title: string;
    description?: string;
}
export type CreateTaskListLinkInput = z.output<typeof CreateTaskListLinkSchema>;
export {};
