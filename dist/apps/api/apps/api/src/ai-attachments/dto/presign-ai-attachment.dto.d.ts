import { z } from 'zod';
import { WIRE_ATTACHMENT_TYPES } from '../ai-attachments.constants';
export declare const PresignAiAttachmentSchema: z.ZodObject<{
    conversationId: z.ZodString;
    fileName: z.ZodString;
    mimeType: z.ZodString;
    fileSize: z.ZodCoercedNumber<unknown>;
    attachmentType: z.ZodEnum<{
        text: "text";
        code: "code";
        image: "image";
        pdf: "pdf";
        ppt: "ppt";
        excel: "excel";
        csv: "csv";
        document: "document";
        "generated-image": "generated-image";
        "generated-pdf": "generated-pdf";
        "generated-ppt": "generated-ppt";
    }>;
}, z.core.$strip>;
declare const PresignAiAttachmentDto_base: import("nestjs-zod").ZodDto<z.ZodObject<{
    conversationId: z.ZodString;
    fileName: z.ZodString;
    mimeType: z.ZodString;
    fileSize: z.ZodCoercedNumber<unknown>;
    attachmentType: z.ZodEnum<{
        text: "text";
        code: "code";
        image: "image";
        pdf: "pdf";
        ppt: "ppt";
        excel: "excel";
        csv: "csv";
        document: "document";
        "generated-image": "generated-image";
        "generated-pdf": "generated-pdf";
        "generated-ppt": "generated-ppt";
    }>;
}, z.core.$strip>, false>;
export declare class PresignAiAttachmentDto extends PresignAiAttachmentDto_base {
    conversationId: string;
    fileName: string;
    mimeType: string;
    fileSize: number;
    attachmentType: (typeof WIRE_ATTACHMENT_TYPES)[number];
}
export type PresignAiAttachmentInput = z.output<typeof PresignAiAttachmentSchema>;
export {};
