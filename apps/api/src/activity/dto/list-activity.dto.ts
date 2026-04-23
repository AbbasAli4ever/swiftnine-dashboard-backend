import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import {
  ACTIVITY_CATEGORIES,
  ACTIVITY_ENTITY_TYPES,
  DEFAULT_ACTIVITY_LIMIT,
  MAX_ACTIVITY_LIMIT,
} from '../activity.constants';

const csvOrArray = z
  .union([z.string(), z.array(z.string())])
  .optional()
  .transform((value) => {
    if (!value) return undefined;
    const values = Array.isArray(value) ? value : value.split(',');
    const cleaned = values.map((item) => item.trim()).filter(Boolean);
    return cleaned.length ? cleaned : undefined;
  });

const optionalBoolean = z
  .union([z.boolean(), z.string()])
  .optional()
  .transform((value) => {
    if (value === undefined || value === '') return undefined;
    if (typeof value === 'boolean') return value;
    return ['true', '1', 'yes', 'on'].includes(value.toLowerCase());
  });

const optionalLimit = z
  .union([z.number(), z.string()])
  .optional()
  .transform((value) => {
    if (value === undefined || value === '') return DEFAULT_ACTIVITY_LIMIT;
    const parsed = typeof value === 'number' ? value : Number.parseInt(value, 10);
    if (Number.isNaN(parsed)) return DEFAULT_ACTIVITY_LIMIT;
    return Math.min(Math.max(parsed, 1), MAX_ACTIVITY_LIMIT);
  });

const optionalDate = z
  .string()
  .datetime()
  .optional();

const ActivityEntityTypeSchema = z.enum(ACTIVITY_ENTITY_TYPES);
const ActivityCategorySchema = z.enum(ACTIVITY_CATEGORIES);

export const ListActivitySchema = z.object({
  q: z.string().trim().min(1).max(200).optional(),
  cursor: z.string().uuid('Invalid cursor').optional(),
  limit: optionalLimit,
  entityType: ActivityEntityTypeSchema.optional(),
  entityId: z.string().uuid('Invalid entity id').optional(),
  projectId: z.string().uuid('Invalid project id').optional(),
  listId: z.string().uuid('Invalid list id').optional(),
  taskId: z.string().uuid('Invalid task id').optional(),
  actorIds: csvOrArray,
  actions: csvOrArray,
  categories: csvOrArray.transform((values, ctx) => {
    if (!values) return undefined;
    const invalid = values.find((value) => !ACTIVITY_CATEGORIES.includes(value as any));
    if (invalid) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Invalid activity category: ${invalid}`,
      });
      return z.NEVER;
    }
    return values as Array<(typeof ACTIVITY_CATEGORIES)[number]>;
  }),
  includeSubtasks: optionalBoolean,
  me: optionalBoolean,
  from: optionalDate,
  to: optionalDate,
});

export class ListActivityDto extends createZodDto(ListActivitySchema) {}
