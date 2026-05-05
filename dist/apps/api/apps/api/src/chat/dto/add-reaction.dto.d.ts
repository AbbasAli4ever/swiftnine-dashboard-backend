import { z } from 'zod';
declare const AddReactionDto_base: import("nestjs-zod").ZodDto<z.ZodObject<{
    emoji: z.ZodString;
}, z.core.$strip>, false>;
export declare class AddReactionDto extends AddReactionDto_base {
    emoji: string;
}
export {};
