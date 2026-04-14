import { z } from 'zod';
declare const CreateWorkspaceDto_base: import("nestjs-zod").ZodDto<z.ZodObject<{
    name: z.ZodString;
    logoUrl: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, false>;
export declare class CreateWorkspaceDto extends CreateWorkspaceDto_base {
}
export {};
