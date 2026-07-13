import { z } from 'zod';
export declare const ConfirmAiAttachmentSchema: z.ZodObject<{
    messageId: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strip>;
declare const ConfirmAiAttachmentDto_base: import("nestjs-zod").ZodDto<z.ZodObject<{
    messageId: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strip>, false>;
export declare class ConfirmAiAttachmentDto extends ConfirmAiAttachmentDto_base {
    messageId?: string;
    metadata?: Record<string, unknown>;
}
export type ConfirmAiAttachmentInput = z.output<typeof ConfirmAiAttachmentSchema>;
export {};
