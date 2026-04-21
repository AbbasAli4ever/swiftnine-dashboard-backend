import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const UpdateTimeEntrySchema = z
  .object({
    description: z.string().max(500).nullable().optional(),
    startTime: z.string().datetime().optional(),
    endTime: z.string().datetime().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.startTime !== undefined && data.endTime !== undefined) {
      if (new Date(data.endTime) <= new Date(data.startTime)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'End time must be after start time',
          path: ['endTime'],
        });
      }
    }
  });

export class UpdateTimeEntryDto extends createZodDto(UpdateTimeEntrySchema) {}
