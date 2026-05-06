import { z } from 'zod';
declare const SearchMessagesSchema: z.ZodObject<{
    q: z.ZodString;
    channelId: z.ZodOptional<z.ZodString>;
    cursor: z.ZodOptional<z.ZodString>;
    limit: z.ZodDefault<z.ZodPipe<z.ZodPipe<z.ZodOptional<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>>, z.ZodTransform<number, string | number | undefined>>, z.ZodTransform<number, number>>>;
}, z.core.$strip>;
declare const SearchMessagesDto_base: import("nestjs-zod").ZodDto<z.ZodObject<{
    q: z.ZodString;
    channelId: z.ZodOptional<z.ZodString>;
    cursor: z.ZodOptional<z.ZodString>;
    limit: z.ZodDefault<z.ZodPipe<z.ZodPipe<z.ZodOptional<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>>, z.ZodTransform<number, string | number | undefined>>, z.ZodTransform<number, number>>>;
}, z.core.$strip>, false>;
export declare class SearchMessagesDto extends SearchMessagesDto_base {
}
export type SearchMessagesQuery = z.output<typeof SearchMessagesSchema>;
export {};
