import { z } from 'zod';
declare const RegisterDto_base: import("nestjs-zod").ZodDto<z.ZodObject<{
    fullName: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>, false>;
export declare class RegisterDto extends RegisterDto_base {
}
export {};
