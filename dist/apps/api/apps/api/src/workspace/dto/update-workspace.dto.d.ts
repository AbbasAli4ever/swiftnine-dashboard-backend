import { z } from 'zod';
declare const UpdateWorkspaceDto_base: import("nestjs-zod").ZodDto<z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    logoUrl: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>, false>;
export declare class UpdateWorkspaceDto extends UpdateWorkspaceDto_base {
}
export {};
