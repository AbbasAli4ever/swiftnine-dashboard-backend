import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';

const MarkReadSchema = z.object({
  lastReadMessageId: z.string().uuid(),
});

export class MarkReadDto extends createZodDto(MarkReadSchema) {
  @ApiProperty({ format: 'uuid' })
  lastReadMessageId: string = '';
}
