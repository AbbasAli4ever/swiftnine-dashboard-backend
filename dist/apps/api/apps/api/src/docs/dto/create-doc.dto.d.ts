import { z } from 'zod';
export declare const CreateDocSchema: z.ZodObject<{
    title: z.ZodString;
    scope: z.ZodEnum<{
        PERSONAL: "PERSONAL";
        WORKSPACE: "WORKSPACE";
        PROJECT: "PROJECT";
    }>;
    workspaceId: z.ZodString;
    projectId: z.ZodOptional<z.ZodString>;
    contentJson: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strip>;
declare const CreateDocDto_base: import("nestjs-zod").ZodDto<z.ZodObject<{
    title: z.ZodString;
    scope: z.ZodEnum<{
        PERSONAL: "PERSONAL";
        WORKSPACE: "WORKSPACE";
        PROJECT: "PROJECT";
    }>;
    workspaceId: z.ZodString;
    projectId: z.ZodOptional<z.ZodString>;
    contentJson: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strip>, false>;
export declare class CreateDocDto extends CreateDocDto_base {
}
export type CreateDocInput = z.infer<typeof CreateDocSchema>;
export {};
