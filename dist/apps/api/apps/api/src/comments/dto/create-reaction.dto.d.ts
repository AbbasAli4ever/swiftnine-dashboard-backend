import { z } from 'zod';
declare const CreateReactionDto_base: import("nestjs-zod").ZodDto<z.ZodObject<{
    reactFace: z.ZodString;
}, z.core.$strip>, false>;
export declare class CreateReactionDto extends CreateReactionDto_base {
    reactFace: string;
}
export {};
