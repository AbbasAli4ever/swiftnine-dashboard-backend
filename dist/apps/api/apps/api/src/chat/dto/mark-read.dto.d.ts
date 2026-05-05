import { z } from 'zod';
declare const MarkReadDto_base: import("nestjs-zod").ZodDto<z.ZodObject<{
    lastReadMessageId: z.ZodString;
}, z.core.$strip>, false>;
export declare class MarkReadDto extends MarkReadDto_base {
    lastReadMessageId: string;
}
export {};
