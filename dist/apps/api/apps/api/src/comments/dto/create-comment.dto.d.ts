import { z } from 'zod';
declare const CreateCommentDto_base: import("nestjs-zod").ZodDto<z.ZodObject<{
    content: z.ZodString;
    parentId: z.ZodOptional<z.ZodString>;
    mentions: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strip>, false>;
export declare class CreateCommentDto extends CreateCommentDto_base {
    content: string;
    parentId?: string;
    mentions?: string[];
}
export {};
