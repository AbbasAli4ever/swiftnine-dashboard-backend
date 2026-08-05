import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { optionalLimit, optionalPage } from '../../common/query/query.schemas';
import { CLIENTS_SORT_FIELDS } from '../clients.constants';

export const ListClientsQuerySchema = z.object({
  q: z.string().trim().min(1).max(200).optional(),
  page: optionalPage,
  limit: optionalLimit,
  sortBy: z.enum(CLIENTS_SORT_FIELDS).default('clientName'),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
});

export class ListClientsQueryDto extends createZodDto(ListClientsQuerySchema) {}

export type ListClientsQuery = z.output<typeof ListClientsQuerySchema>;
