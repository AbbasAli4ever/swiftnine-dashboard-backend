import { z } from 'zod';
declare const ResetPasswordDto_base: import("nestjs-zod").ZodDto<z.ZodObject<{
    email: z.ZodString;
    otp: z.ZodString;
    newPassword: z.ZodString;
}, z.core.$strip>, false>;
export declare class ResetPasswordDto extends ResetPasswordDto_base {
}
export {};
