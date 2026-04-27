import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const TASK_LIST_PRIORITY_VALUES = ['URGENT', 'HIGH', 'NORMAL', 'LOW', 'NONE'] as const;
const dateOnlyPattern = /^\d{4}-\d{2}-\d{2}$/;
const dateOnlySchema = z
  .string()
  .regex(dateOnlyPattern, 'Date must be in YYYY-MM-DD format');

const UpdateTaskListSchema = z
  .object({
    name: z.string().trim().min(1, 'Name is required').max(255).optional(),
    startDate: dateOnlySchema.nullable().optional(),
    endDate: dateOnlySchema.nullable().optional(),
    ownerId: z.string().uuid('Owner must be a valid UUID').nullable().optional(),
    priority: z.enum(TASK_LIST_PRIORITY_VALUES).nullable().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field is required',
  })
  .superRefine((data, ctx) => {
    if (
      data.startDate &&
      data.endDate &&
      data.startDate.localeCompare(data.endDate) > 0
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'startDate cannot be after endDate',
        path: ['startDate'],
      });
    }
  });

export class UpdateTaskListDto extends createZodDto(UpdateTaskListSchema) {}
