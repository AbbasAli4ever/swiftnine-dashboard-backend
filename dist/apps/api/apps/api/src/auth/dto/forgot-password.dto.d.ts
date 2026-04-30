import { z } from 'zod';
declare const ForgotPasswordDto_base: import("nestjs-zod").ZodDto<z.ZodObject<{
    email: z.ZodString;
}, z.core.$strip>, false>;
export declare class ForgotPasswordDto extends ForgotPasswordDto_base {
}
export {};
