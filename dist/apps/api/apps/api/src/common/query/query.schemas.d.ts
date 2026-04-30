import { z } from 'zod';
export declare const DEFAULT_PAGE = 1;
export declare const DEFAULT_LIMIT = 20;
export declare const MAX_LIMIT = 100;
export declare const csvOrArray: z.ZodPipe<z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodArray<z.ZodString>]>>, z.ZodTransform<string[] | undefined, string | string[] | undefined>>;
export declare const optionalBoolean: z.ZodPipe<z.ZodOptional<z.ZodUnion<readonly [z.ZodBoolean, z.ZodString]>>, z.ZodTransform<boolean | undefined, string | boolean | undefined>>;
export declare const optionalPage: z.ZodPipe<z.ZodOptional<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>>, z.ZodTransform<number, string | number | undefined>>;
export declare const optionalLimit: z.ZodPipe<z.ZodOptional<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>>, z.ZodTransform<number, string | number | undefined>>;
export declare const optionalDate: z.ZodOptional<z.ZodString>;
export declare const SortOrderSchema: z.ZodDefault<z.ZodEnum<{
    asc: "asc";
    desc: "desc";
}>>;
export declare const uuidCsvOrArray: (message: string) => z.ZodPipe<z.ZodPipe<z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodArray<z.ZodString>]>>, z.ZodTransform<string[] | undefined, string | string[] | undefined>>, z.ZodTransform<string[] | undefined, string[] | undefined>>;
export declare const enumCsvOrArray: <T extends readonly [string, ...string[]]>(values: T, message: string) => z.ZodPipe<z.ZodPipe<z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodArray<z.ZodString>]>>, z.ZodTransform<string[] | undefined, string | string[] | undefined>>, z.ZodTransform<T[number][] | undefined, string[] | undefined>>;
