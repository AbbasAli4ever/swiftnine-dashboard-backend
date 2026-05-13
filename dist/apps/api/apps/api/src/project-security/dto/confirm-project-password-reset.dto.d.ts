import { z } from 'zod';
export declare const ConfirmProjectPasswordResetSchema: z.ZodObject<{
    token: z.ZodString;
    newPassword: z.ZodString;
}, z.core.$strip>;
declare const ConfirmProjectPasswordResetDto_base: import("nestjs-zod").ZodDto<z.ZodObject<{
    token: z.ZodString;
    newPassword: z.ZodString;
}, z.core.$strip>, false>;
export declare class ConfirmProjectPasswordResetDto extends ConfirmProjectPasswordResetDto_base {
}
export {};
