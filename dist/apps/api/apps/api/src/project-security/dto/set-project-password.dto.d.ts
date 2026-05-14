import { z } from 'zod';
export declare const SetProjectPasswordSchema: z.ZodObject<{
    password: z.ZodString;
}, z.core.$strip>;
declare const SetProjectPasswordDto_base: import("nestjs-zod").ZodDto<z.ZodObject<{
    password: z.ZodString;
}, z.core.$strip>, false>;
export declare class SetProjectPasswordDto extends SetProjectPasswordDto_base {
}
export {};
