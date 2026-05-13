import { z } from 'zod';
export declare const ChangeProjectPasswordSchema: z.ZodObject<{
    currentPassword: z.ZodString;
    newPassword: z.ZodString;
}, z.core.$strip>;
declare const ChangeProjectPasswordDto_base: import("nestjs-zod").ZodDto<z.ZodObject<{
    currentPassword: z.ZodString;
    newPassword: z.ZodString;
}, z.core.$strip>, false>;
export declare class ChangeProjectPasswordDto extends ChangeProjectPasswordDto_base {
}
export {};
