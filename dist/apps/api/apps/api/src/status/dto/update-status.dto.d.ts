import { z } from 'zod';
declare const UpdateStatusDto_base: import("nestjs-zod").ZodDto<z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    color: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, false>;
export declare class UpdateStatusDto extends UpdateStatusDto_base {
}
export {};
