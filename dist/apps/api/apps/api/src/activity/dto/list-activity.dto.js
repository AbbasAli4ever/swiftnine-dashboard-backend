"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListActivityDto = exports.ListActivitySchema = void 0;
const nestjs_zod_1 = require("nestjs-zod");
const zod_1 = require("zod");
const activity_constants_1 = require("../activity.constants");
const csvOrArray = zod_1.z
    .union([zod_1.z.string(), zod_1.z.array(zod_1.z.string())])
    .optional()
    .transform((value) => {
    if (!value)
        return undefined;
    const values = Array.isArray(value) ? value : value.split(',');
    const cleaned = values.map((item) => item.trim()).filter(Boolean);
    return cleaned.length ? cleaned : undefined;
});
const optionalBoolean = zod_1.z
    .union([zod_1.z.boolean(), zod_1.z.string()])
    .optional()
    .transform((value) => {
    if (value === undefined || value === '')
        return undefined;
    if (typeof value === 'boolean')
        return value;
    return ['true', '1', 'yes', 'on'].includes(value.toLowerCase());
});
const optionalLimit = zod_1.z
    .union([zod_1.z.number(), zod_1.z.string()])
    .optional()
    .transform((value) => {
    if (value === undefined || value === '')
        return activity_constants_1.DEFAULT_ACTIVITY_LIMIT;
    const parsed = typeof value === 'number' ? value : Number.parseInt(value, 10);
    if (Number.isNaN(parsed))
        return activity_constants_1.DEFAULT_ACTIVITY_LIMIT;
    return Math.min(Math.max(parsed, 1), activity_constants_1.MAX_ACTIVITY_LIMIT);
});
const optionalDate = zod_1.z
    .string()
    .datetime()
    .optional();
const ActivityEntityTypeSchema = zod_1.z.enum(activity_constants_1.ACTIVITY_ENTITY_TYPES);
const ActivityCategorySchema = zod_1.z.enum(activity_constants_1.ACTIVITY_CATEGORIES);
exports.ListActivitySchema = zod_1.z.object({
    q: zod_1.z.string().trim().min(1).max(200).optional(),
    cursor: zod_1.z.string().uuid('Invalid cursor').optional(),
    limit: optionalLimit,
    entityType: ActivityEntityTypeSchema.optional(),
    entityId: zod_1.z.string().uuid('Invalid entity id').optional(),
    projectId: zod_1.z.string().uuid('Invalid project id').optional(),
    listId: zod_1.z.string().uuid('Invalid list id').optional(),
    taskId: zod_1.z.string().uuid('Invalid task id').optional(),
    actorIds: csvOrArray,
    actions: csvOrArray,
    categories: csvOrArray.transform((values, ctx) => {
        if (!values)
            return undefined;
        const invalid = values.find((value) => !activity_constants_1.ACTIVITY_CATEGORIES.includes(value));
        if (invalid) {
            ctx.addIssue({
                code: zod_1.z.ZodIssueCode.custom,
                message: `Invalid activity category: ${invalid}`,
            });
            return zod_1.z.NEVER;
        }
        return values;
    }),
    includeSubtasks: optionalBoolean,
    me: optionalBoolean,
    from: optionalDate,
    to: optionalDate,
});
class ListActivityDto extends (0, nestjs_zod_1.createZodDto)(exports.ListActivitySchema) {
}
exports.ListActivityDto = ListActivityDto;
//# sourceMappingURL=list-activity.dto.js.map