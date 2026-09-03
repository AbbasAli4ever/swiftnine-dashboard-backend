import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { optionalBoolean } from '../../common/query/query.schemas';

export const ListDmsQuerySchema = z.object({
  // false (default): the caller's normal DM list, everything they haven't
  // archived. true: only the ones they have.
  archived: optionalBoolean.transform((value) => value ?? false),
  // Unset (default): no filtering by favourite. true/false: narrow to only
  // the caller's starred / unstarred DMs, combined with the archived filter
  // above.
  favourite: optionalBoolean,
});

export class ListDmsQueryDto extends createZodDto(ListDmsQuerySchema) {
  @ApiPropertyOptional({
    type: Boolean,
    default: false,
    description: 'true to list only DMs the caller has archived',
  })
  archived: boolean = false;

  @ApiPropertyOptional({
    type: Boolean,
    description:
      "true to list only the caller's favourited DMs, false to exclude them. Omit for no filtering.",
  })
  favourite: boolean | undefined = undefined;
}

export type ListDmsQuery = z.output<typeof ListDmsQuerySchema>;
