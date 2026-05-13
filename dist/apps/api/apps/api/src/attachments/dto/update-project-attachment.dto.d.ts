import { z } from 'zod';
export declare const UpdateProjectAttachmentSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
declare const UpdateProjectAttachmentDto_base: import("nestjs-zod").ZodDto<z.ZodObject<{
    title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>, false>;
export declare class UpdateProjectAttachmentDto extends UpdateProjectAttachmentDto_base {
    title?: string | null;
    description?: string | null;
}
export type UpdateProjectAttachmentInput = z.output<typeof UpdateProjectAttachmentSchema>;
export {};
