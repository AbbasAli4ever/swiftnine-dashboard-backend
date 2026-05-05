import { z } from 'zod';
declare const SendMessageDto_base: import("nestjs-zod").ZodDto<z.ZodPipe<z.ZodObject<{
    contentJson: z.ZodObject<{}, z.core.$loose>;
    replyToMessageId: z.ZodOptional<z.ZodString>;
    mentionedUserIds: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString>>>;
    attachmentIds: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString>>>;
}, z.core.$strip>, z.ZodTransform<{
    mentionedUserIds: string[];
    attachmentIds: string[];
    contentJson: {
        [x: string]: unknown;
    };
    replyToMessageId?: string | undefined;
}, {
    contentJson: {
        [x: string]: unknown;
    };
    mentionedUserIds: string[];
    attachmentIds: string[];
    replyToMessageId?: string | undefined;
}>>, false>;
export declare class SendMessageDto extends SendMessageDto_base {
    contentJson: Record<string, unknown>;
    replyToMessageId?: string;
    mentionedUserIds: string[];
    attachmentIds: string[];
}
export {};
