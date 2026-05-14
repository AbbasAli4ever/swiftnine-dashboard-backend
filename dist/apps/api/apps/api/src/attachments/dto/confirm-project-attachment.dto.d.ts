import { z } from 'zod';
export declare const ConfirmProjectAttachmentSchema: z.ZodObject<{
    s3Key: z.ZodString;
    fileName: z.ZodOptional<z.ZodString>;
    mimeType: z.ZodOptional<z.ZodString>;
    fileSize: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
declare const ConfirmProjectAttachmentDto_base: import("nestjs-zod").ZodDto<z.ZodObject<{
    s3Key: z.ZodString;
    fileName: z.ZodOptional<z.ZodString>;
    mimeType: z.ZodOptional<z.ZodString>;
    fileSize: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, false>;
export declare class ConfirmProjectAttachmentDto extends ConfirmProjectAttachmentDto_base {
    s3Key: string;
    fileName?: string;
    mimeType?: string;
    fileSize?: number;
    title?: string;
    description?: string;
}
export type ConfirmProjectAttachmentInput = z.output<typeof ConfirmProjectAttachmentSchema>;
export {};
