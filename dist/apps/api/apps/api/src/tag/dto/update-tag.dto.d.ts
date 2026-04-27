import { z } from 'zod';
declare const UpdateTagDto_base: import("nestjs-zod").ZodDto<z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    color: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, false>;
export declare class UpdateTagDto extends UpdateTagDto_base {
}
export {};
