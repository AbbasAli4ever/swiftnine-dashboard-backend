import { z } from 'zod';
export declare const SearchDocsQuerySchema: z.ZodObject<{
    q: z.ZodString;
    workspaceId: z.ZodString;
    projectId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
declare const SearchDocsQueryDto_base: import("nestjs-zod").ZodDto<z.ZodObject<{
    q: z.ZodString;
    workspaceId: z.ZodString;
    projectId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, false>;
export declare class SearchDocsQueryDto extends SearchDocsQueryDto_base {
}
export type SearchDocsQuery = z.infer<typeof SearchDocsQuerySchema>;
export {};
