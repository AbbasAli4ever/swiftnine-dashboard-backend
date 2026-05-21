import { z } from 'zod';
export declare const ListTaskListAttachmentsQuerySchema: z.ZodObject<{
    kind: z.ZodOptional<z.ZodEnum<{
        FILE: "FILE";
        LINK: "LINK";
    }>>;
    uploadedBy: z.ZodOptional<z.ZodString>;
    q: z.ZodOptional<z.ZodString>;
    cursor: z.ZodOptional<z.ZodString>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
declare const ListTaskListAttachmentsQueryDto_base: import("nestjs-zod").ZodDto<z.ZodObject<{
    kind: z.ZodOptional<z.ZodEnum<{
        FILE: "FILE";
        LINK: "LINK";
    }>>;
    uploadedBy: z.ZodOptional<z.ZodString>;
    q: z.ZodOptional<z.ZodString>;
    cursor: z.ZodOptional<z.ZodString>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>, false>;
export declare class ListTaskListAttachmentsQueryDto extends ListTaskListAttachmentsQueryDto_base {
    kind?: 'FILE' | 'LINK';
    uploadedBy?: string;
    q?: string;
    cursor?: string;
    limit: number;
}
export type ListTaskListAttachmentsQuery = z.output<typeof ListTaskListAttachmentsQuerySchema>;
export {};
