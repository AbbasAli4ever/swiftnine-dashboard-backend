import { z } from 'zod';
declare const CreateProjectDto_base: import("nestjs-zod").ZodDto<z.ZodObject<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    color: z.ZodDefault<z.ZodString>;
    icon: z.ZodOptional<z.ZodString>;
    taskIdPrefix: z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>;
}, z.core.$strip>, false>;
export declare class CreateProjectDto extends CreateProjectDto_base {
}
export {};
