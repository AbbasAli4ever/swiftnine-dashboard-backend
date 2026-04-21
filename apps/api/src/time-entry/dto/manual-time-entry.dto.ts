import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const ManualTimeEntrySchema = z
  .object({
    description: z.string().max(500).optional(),
    startTime: z.string().datetime().optional(),
    endTime: z.string().datetime().optional(),
    durationMinutes: z.number().int().positive().max(1440).optional(),
  })
  .superRefine((data, ctx) => {
    const hasTimeRange = data.startTime !== undefined && data.endTime !== undefined;
    const hasDuration = data.durationMinutes !== undefined;

    if (!hasTimeRange && !hasDuration) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Provide either startTime + endTime, or durationMinutes',
        path: ['startTime'],
      });
    }

    if (hasTimeRange && new Date(data.endTime!) <= new Date(data.startTime!)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'End time must be after start time',
        path: ['endTime'],
      });
    }
  });

export class ManualTimeEntryDto extends createZodDto(ManualTimeEntrySchema) {}
