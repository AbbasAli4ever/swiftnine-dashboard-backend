import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { optionalLimit, optionalPage } from '../../common/query/query.schemas';
import { EMPLOYEES_SORT_FIELDS } from '../employees.constants';

export const ListEmployeesQuerySchema = z.object({
  q: z.string().trim().min(1).max(200).optional(),
  page: optionalPage,
  limit: optionalLimit,
  sortBy: z.enum(EMPLOYEES_SORT_FIELDS).default('name'),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
});

export class ListEmployeesQueryDto extends createZodDto(
  ListEmployeesQuerySchema,
) {}

export type ListEmployeesQuery = z.output<typeof ListEmployeesQuerySchema>;
