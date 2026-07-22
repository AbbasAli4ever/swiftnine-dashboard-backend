import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { uuidCsvOrArray } from '../../common/query/query.schemas';

// Query for GET /tasks/batch — fetch multiple tasks by id in one request.
// `ids` accepts a comma-separated string (?ids=a,b,c) or repeated params.
const ListTaskIdsSchema = z.object({
  ids: uuidCsvOrArray('ids must be valid task UUIDs'),
});

export class ListTaskIdsDto extends createZodDto(ListTaskIdsSchema) {}
