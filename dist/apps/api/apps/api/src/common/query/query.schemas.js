"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enumCsvOrArray = exports.uuidCsvOrArray = exports.SortOrderSchema = exports.optionalDate = exports.optionalLimit = exports.optionalPage = exports.optionalBoolean = exports.csvOrArray = exports.MAX_LIMIT = exports.DEFAULT_LIMIT = exports.DEFAULT_PAGE = void 0;
const zod_1 = require("zod");
exports.DEFAULT_PAGE = 1;
exports.DEFAULT_LIMIT = 20;
exports.MAX_LIMIT = 100;
exports.csvOrArray = zod_1.z
    .union([zod_1.z.string(), zod_1.z.array(zod_1.z.string())])
    .optional()
    .transform((value) => {
    if (!value)
        return undefined;
    const values = Array.isArray(value) ? value : value.split(',');
    const cleaned = values.map((item) => item.trim()).filter(Boolean);
    return cleaned.length ? cleaned : undefined;
});
exports.optionalBoolean = zod_1.z
    .union([zod_1.z.boolean(), zod_1.z.string()])
    .optional()
    .transform((value) => {
    if (value === undefined || value === '')
        return undefined;
    if (typeof value === 'boolean')
        return value;
    return ['true', '1', 'yes', 'on'].includes(value.toLowerCase());
});
exports.optionalPage = zod_1.z
    .union([zod_1.z.number(), zod_1.z.string()])
    .optional()
    .transform((value) => {
    if (value === undefined || value === '')
        return exports.DEFAULT_PAGE;
    const parsed = typeof value === 'number' ? value : Number.parseInt(value, 10);
    if (Number.isNaN(parsed))
        return exports.DEFAULT_PAGE;
    return Math.max(parsed, 1);
});
exports.optionalLimit = zod_1.z
    .union([zod_1.z.number(), zod_1.z.string()])
    .optional()
    .transform((value) => {
    if (value === undefined || value === '')
        return exports.DEFAULT_LIMIT;
    const parsed = typeof value === 'number' ? value : Number.parseInt(value, 10);
    if (Number.isNaN(parsed))
        return exports.DEFAULT_LIMIT;
    return Math.min(Math.max(parsed, 1), exports.MAX_LIMIT);
});
exports.optionalDate = zod_1.z
    .string()
    .refine((value) => !Number.isNaN(Date.parse(value)), 'Invalid date')
    .optional();
exports.SortOrderSchema = zod_1.z.enum(['asc', 'desc']).default('asc');
const uuidCsvOrArray = (message) => exports.csvOrArray.transform((values, ctx) => {
    if (!values)
        return undefined;
    const invalid = values.find((value) => !zod_1.z.string().uuid().safeParse(value).success);
    if (invalid) {
        ctx.addIssue({ code: zod_1.z.ZodIssueCode.custom, message });
        return zod_1.z.NEVER;
    }
    return values;
});
exports.uuidCsvOrArray = uuidCsvOrArray;
const enumCsvOrArray = (values, message) => exports.csvOrArray.transform((items, ctx) => {
    if (!items)
        return undefined;
    const allowed = new Set(values);
    const invalid = items.find((item) => !allowed.has(item));
    if (invalid) {
        ctx.addIssue({ code: zod_1.z.ZodIssueCode.custom, message: `${message}: ${invalid}` });
        return zod_1.z.NEVER;
    }
    return items;
});
exports.enumCsvOrArray = enumCsvOrArray;
//# sourceMappingURL=query.schemas.js.map