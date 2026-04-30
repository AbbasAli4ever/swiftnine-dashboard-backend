import { z } from 'zod';
declare const VerifyEmailDto_base: import("nestjs-zod").ZodDto<z.ZodObject<{
    email: z.ZodString;
    otp: z.ZodString;
}, z.core.$strip>, false>;
export declare class VerifyEmailDto extends VerifyEmailDto_base {
}
export {};
