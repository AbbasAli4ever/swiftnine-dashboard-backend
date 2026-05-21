import { z } from 'zod';
export declare const PresignTaskListAttachmentSchema: z.ZodObject<{
    fileName: z.ZodOptional<z.ZodString>;
    mimeType: z.ZodString;
    fileSize: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
declare const PresignTaskListAttachmentDto_base: import("nestjs-zod").ZodDto<z.ZodObject<{
    fileName: z.ZodOptional<z.ZodString>;
    mimeType: z.ZodString;
    fileSize: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>, false>;
export declare class PresignTaskListAttachmentDto extends PresignTaskListAttachmentDto_base {
    fileName?: string;
    mimeType: string;
    fileSize?: number;
}
export type PresignTaskListAttachmentInput = z.output<typeof PresignTaskListAttachmentSchema>;
export {};
