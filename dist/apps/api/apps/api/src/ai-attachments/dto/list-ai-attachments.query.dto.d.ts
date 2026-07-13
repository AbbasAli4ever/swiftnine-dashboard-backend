import { z } from 'zod';
export declare const ListAiAttachmentsQuerySchema: z.ZodObject<{
    conversationId: z.ZodOptional<z.ZodString>;
    cursor: z.ZodOptional<z.ZodString>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
declare const ListAiAttachmentsQueryDto_base: import("nestjs-zod").ZodDto<z.ZodObject<{
    conversationId: z.ZodOptional<z.ZodString>;
    cursor: z.ZodOptional<z.ZodString>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>, false>;
export declare class ListAiAttachmentsQueryDto extends ListAiAttachmentsQueryDto_base {
    conversationId?: string;
    cursor?: string;
    limit: number;
}
export type ListAiAttachmentsQuery = z.output<typeof ListAiAttachmentsQuerySchema>;
export {};
