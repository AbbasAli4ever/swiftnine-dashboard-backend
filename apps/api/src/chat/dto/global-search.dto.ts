import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { optionalLimit } from '../../common/query/query.schemas';

const GlobalSearchSchema = z.object({
  q: z.string().trim().min(1).max(200),
  limit: optionalLimit.transform((value) => Math.min(value, 50)).default(20),
});

export class GlobalSearchDto extends createZodDto(GlobalSearchSchema) {}

export type GlobalSearchQuery = z.output<typeof GlobalSearchSchema>;
