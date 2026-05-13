import { z } from 'zod';
export declare const PresignProjectAttachmentSchema: z.ZodObject<{
    fileName: z.ZodOptional<z.ZodString>;
    mimeType: z.ZodString;
    fileSize: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
declare const PresignProjectAttachmentDto_base: import("nestjs-zod").ZodDto<z.ZodObject<{
    fileName: z.ZodOptional<z.ZodString>;
    mimeType: z.ZodString;
    fileSize: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>, false>;
export declare class PresignProjectAttachmentDto extends PresignProjectAttachmentDto_base {
    fileName?: string;
    mimeType: string;
    fileSize?: number;
}
export type PresignProjectAttachmentInput = z.output<typeof PresignProjectAttachmentSchema>;
export {};
