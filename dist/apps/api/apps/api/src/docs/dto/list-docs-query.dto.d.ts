import { z } from 'zod';
export declare const ListDocsQuerySchema: z.ZodObject<{
    workspaceId: z.ZodString;
    projectId: z.ZodOptional<z.ZodString>;
    scope: z.ZodOptional<z.ZodEnum<{
        PERSONAL: "PERSONAL";
        WORKSPACE: "WORKSPACE";
        PROJECT: "PROJECT";
    }>>;
}, z.core.$strip>;
declare const ListDocsQueryDto_base: import("nestjs-zod").ZodDto<z.ZodObject<{
    workspaceId: z.ZodString;
    projectId: z.ZodOptional<z.ZodString>;
    scope: z.ZodOptional<z.ZodEnum<{
        PERSONAL: "PERSONAL";
        WORKSPACE: "WORKSPACE";
        PROJECT: "PROJECT";
    }>>;
}, z.core.$strip>, false>;
export declare class ListDocsQueryDto extends ListDocsQueryDto_base {
}
export type ListDocsQuery = z.infer<typeof ListDocsQuerySchema>;
export {};
