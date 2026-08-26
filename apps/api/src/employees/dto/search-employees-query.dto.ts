import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const SearchEmployeesQuerySchema = z.object({
  // Optional — empty/omitted returns every employee in the workspace
  // (alphabetical), for populating a picker/dropdown. Matches the
  // /clients/search convention.
  q: z.string().trim().max(200).optional(),
});

export class SearchEmployeesQueryDto extends createZodDto(
  SearchEmployeesQuerySchema,
) {}

export type SearchEmployeesQuery = z.output<typeof SearchEmployeesQuerySchema>;
