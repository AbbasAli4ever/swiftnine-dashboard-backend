import { z } from 'zod';
export declare const UpdateDocSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    contentJson: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strip>;
declare const UpdateDocDto_base: import("nestjs-zod").ZodDto<z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    contentJson: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strip>, false>;
export declare class UpdateDocDto extends UpdateDocDto_base {
}
export type UpdateDocInput = z.infer<typeof UpdateDocSchema>;
export {};
