import { z } from 'zod';
declare const CreateTagDto_base: import("nestjs-zod").ZodDto<z.ZodObject<{
    name: z.ZodString;
    color: z.ZodDefault<z.ZodString>;
}, z.core.$strip>, false>;
export declare class CreateTagDto extends CreateTagDto_base {
}
export {};
