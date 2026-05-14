import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const RequestProjectPasswordResetSchema = z.object({});

export class RequestProjectPasswordResetDto extends createZodDto(
  RequestProjectPasswordResetSchema,
) {}
