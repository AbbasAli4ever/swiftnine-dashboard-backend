import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';

const BulkDeleteMessagesSchema = z.object({
  messageIds: z.array(z.string().uuid()).min(1).max(100),
});

export class BulkDeleteMessagesDto extends createZodDto(BulkDeleteMessagesSchema) {
  @ApiProperty({ type: [String], format: 'uuid', minItems: 1, maxItems: 100 })
  messageIds!: string[];
}
