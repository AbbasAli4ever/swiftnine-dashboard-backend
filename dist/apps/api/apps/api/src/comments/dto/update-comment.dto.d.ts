import { z } from 'zod';
declare const UpdateCommentDto_base: import("nestjs-zod").ZodDto<z.ZodObject<{
    content: z.ZodString;
    mentionedUserIds: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strip>, false>;
export declare class UpdateCommentDto extends UpdateCommentDto_base {
    content: string;
    mentionedUserIds?: string[];
}
export {};
