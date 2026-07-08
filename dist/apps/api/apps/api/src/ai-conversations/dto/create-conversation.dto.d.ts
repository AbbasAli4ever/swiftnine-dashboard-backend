import { z } from 'zod';
declare const CreateConversationDto_base: import("nestjs-zod").ZodDto<z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, false>;
export declare class CreateConversationDto extends CreateConversationDto_base {
}
export {};
