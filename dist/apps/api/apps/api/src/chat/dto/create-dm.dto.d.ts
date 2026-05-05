import { z } from 'zod';
declare const CreateDmDto_base: import("nestjs-zod").ZodDto<z.ZodObject<{
    targetUserId: z.ZodString;
}, z.core.$strip>, false>;
export declare class CreateDmDto extends CreateDmDto_base {
    targetUserId: string;
}
export {};
