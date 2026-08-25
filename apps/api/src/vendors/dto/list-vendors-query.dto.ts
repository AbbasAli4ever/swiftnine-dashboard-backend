import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { optionalLimit, optionalPage } from '../../common/query/query.schemas';
import { VENDORS_SORT_FIELDS } from '../vendors.constants';

export const ListVendorsQuerySchema = z.object({
  q: z.string().trim().min(1).max(200).optional(),
  page: optionalPage,
  limit: optionalLimit,
  sortBy: z.enum(VENDORS_SORT_FIELDS).default('name'),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
});

export class ListVendorsQueryDto extends createZodDto(ListVendorsQuerySchema) {}

export type ListVendorsQuery = z.output<typeof ListVendorsQuerySchema>;
