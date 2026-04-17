import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { MUTABLE_STATUS_GROUP_VALUES } from '../status-options';

const HEX_COLOR_REGEX = /^#(?:[0-9a-fA-F]{3}){1,2}$/;

const CreateStatusSchema = z.object({
  projectId: z.string().uuid('Invalid project id'),
  name: z.string().min(1, 'Name is required').max(100),
  color: z
    .string()
    .regex(HEX_COLOR_REGEX, 'Color must be a valid hex code')
    .optional(),
  group: z.enum(MUTABLE_STATUS_GROUP_VALUES),
});

export class CreateStatusDto extends createZodDto(CreateStatusSchema) {}
