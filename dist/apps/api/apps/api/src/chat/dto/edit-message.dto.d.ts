import { z } from 'zod';
declare const EditMessageDto_base: import("nestjs-zod").ZodDto<z.ZodPipe<z.ZodObject<{
    contentJson: z.ZodObject<{}, z.core.$loose>;
    mentionedUserIds: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString>>>;
}, z.core.$strip>, z.ZodTransform<{
    mentionedUserIds: string[];
    contentJson: {
        [x: string]: unknown;
    };
}, {
    contentJson: {
        [x: string]: unknown;
    };
    mentionedUserIds: string[];
}>>, false>;
export declare class EditMessageDto extends EditMessageDto_base {
    contentJson: Record<string, unknown>;
    mentionedUserIds: string[];
}
export {};
