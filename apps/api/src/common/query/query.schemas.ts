import { z } from 'zod';

export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 20;
export const MAX_LIMIT = 100;

export const csvOrArray = z
  .union([z.string(), z.array(z.string())])
  .optional()
  .transform((value) => {
    if (!value) return undefined;
    const values = Array.isArray(value) ? value : value.split(',');
    const cleaned = values.map((item) => item.trim()).filter(Boolean);
    return cleaned.length ? cleaned : undefined;
  });

export const optionalBoolean = z
  .union([z.boolean(), z.string()])
  .optional()
  .transform((value) => {
    if (value === undefined || value === '') return undefined;
    if (typeof value === 'boolean') return value;
    return ['true', '1', 'yes', 'on'].includes(value.toLowerCase());
  });

export const optionalPage = z
  .union([z.number(), z.string()])
  .optional()
  .transform((value) => {
    if (value === undefined || value === '') return DEFAULT_PAGE;
    const parsed = typeof value === 'number' ? value : Number.parseInt(value, 10);
    if (Number.isNaN(parsed)) return DEFAULT_PAGE;
    return Math.max(parsed, 1);
  });

export const optionalLimit = z
  .union([z.number(), z.string()])
  .optional()
  .transform((value) => {
    if (value === undefined || value === '') return DEFAULT_LIMIT;
    const parsed = typeof value === 'number' ? value : Number.parseInt(value, 10);
    if (Number.isNaN(parsed)) return DEFAULT_LIMIT;
    return Math.min(Math.max(parsed, 1), MAX_LIMIT);
  });

export const optionalDate = z
  .string()
  .refine((value) => !Number.isNaN(Date.parse(value)), 'Invalid date')
  .optional();

export const SortOrderSchema = z.enum(['asc', 'desc']).default('asc');

export const uuidCsvOrArray = (message: string) =>
  csvOrArray.transform((values, ctx) => {
    if (!values) return undefined;
    const invalid = values.find((value) => !z.string().uuid().safeParse(value).success);
    if (invalid) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message });
      return z.NEVER;
    }
    return values;
  });

export const enumCsvOrArray = <T extends readonly [string, ...string[]]>(
  values: T,
  message: string,
) =>
  csvOrArray.transform((items, ctx) => {
    if (!items) return undefined;
    const allowed = new Set(values);
    const invalid = items.find((item) => !allowed.has(item));
    if (invalid) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: `${message}: ${invalid}` });
      return z.NEVER;
    }
    return items as Array<T[number]>;
  });
