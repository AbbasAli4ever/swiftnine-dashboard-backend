import { z } from 'zod';
export declare const UnlockProjectSchema: z.ZodObject<{
    password: z.ZodString;
}, z.core.$strip>;
declare const UnlockProjectDto_base: import("nestjs-zod").ZodDto<z.ZodObject<{
    password: z.ZodString;
}, z.core.$strip>, false>;
export declare class UnlockProjectDto extends UnlockProjectDto_base {
}
export {};
