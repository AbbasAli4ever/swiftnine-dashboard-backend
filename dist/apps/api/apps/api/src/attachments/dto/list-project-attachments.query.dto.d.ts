import { z } from 'zod';
export declare const ListProjectAttachmentsQuerySchema: z.ZodObject<{
    kind: z.ZodOptional<z.ZodEnum<{
        FILE: "FILE";
        LINK: "LINK";
    }>>;
    uploadedBy: z.ZodOptional<z.ZodString>;
    q: z.ZodOptional<z.ZodString>;
    cursor: z.ZodOptional<z.ZodString>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
declare const ListProjectAttachmentsQueryDto_base: import("nestjs-zod").ZodDto<z.ZodObject<{
    kind: z.ZodOptional<z.ZodEnum<{
        FILE: "FILE";
        LINK: "LINK";
    }>>;
    uploadedBy: z.ZodOptional<z.ZodString>;
    q: z.ZodOptional<z.ZodString>;
    cursor: z.ZodOptional<z.ZodString>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>, false>;
export declare class ListProjectAttachmentsQueryDto extends ListProjectAttachmentsQueryDto_base {
    kind?: 'FILE' | 'LINK';
    uploadedBy?: string;
    q?: string;
    cursor?: string;
    limit: number;
}
export type ListProjectAttachmentsQuery = z.output<typeof ListProjectAttachmentsQuerySchema>;
export {};
