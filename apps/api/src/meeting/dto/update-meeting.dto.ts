import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const UpdateMeetingSchema = z
  .object({
    title: z.string().min(1, 'Title is required').max(300).optional(),
    meetingDate: z.string().datetime('Invalid meeting date').optional(),
    participantIds: z
      .array(z.string().uuid('Invalid user ID'))
      .min(1, 'At least one participant is required')
      .optional(),
    summary: z.string().max(20000).nullable().optional(),
    decisions: z.array(z.string().min(1).max(1000)).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided',
  });

export class UpdateMeetingDto extends createZodDto(UpdateMeetingSchema) {}
