import { z } from 'zod';
declare const UpdateProjectDto_base: import("nestjs-zod").ZodDto<z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    color: z.ZodOptional<z.ZodString>;
    icon: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>, false>;
export declare class UpdateProjectDto extends UpdateProjectDto_base {
}
export {};
