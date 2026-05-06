import { z } from 'zod';
declare const ListMessagesSchema: z.ZodObject<{
    cursor: z.ZodOptional<z.ZodString>;
    limit: z.ZodDefault<z.ZodPipe<z.ZodPipe<z.ZodOptional<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>>, z.ZodTransform<number, string | number | undefined>>, z.ZodTransform<number, number>>>;
}, z.core.$strip>;
declare const ListMessagesDto_base: import("nestjs-zod").ZodDto<z.ZodObject<{
    cursor: z.ZodOptional<z.ZodString>;
    limit: z.ZodDefault<z.ZodPipe<z.ZodPipe<z.ZodOptional<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>>, z.ZodTransform<number, string | number | undefined>>, z.ZodTransform<number, number>>>;
}, z.core.$strip>, false>;
export declare class ListMessagesDto extends ListMessagesDto_base {
}
export type ListMessagesQuery = z.output<typeof ListMessagesSchema>;
export {};
