import { z } from 'zod';
export declare const CreateProjectLinkSchema: z.ZodObject<{
    linkUrl: z.ZodString;
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
declare const CreateProjectLinkDto_base: import("nestjs-zod").ZodDto<z.ZodObject<{
    linkUrl: z.ZodString;
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, false>;
export declare class CreateProjectLinkDto extends CreateProjectLinkDto_base {
    linkUrl: string;
    title: string;
    description?: string;
}
export type CreateProjectLinkInput = z.output<typeof CreateProjectLinkSchema>;
export {};
