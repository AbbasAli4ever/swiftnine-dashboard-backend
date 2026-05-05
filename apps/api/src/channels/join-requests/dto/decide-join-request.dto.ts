import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';

const DecideJoinRequestSchema = z.object({
  decision: z.enum(['approve', 'reject']),
});

export class DecideJoinRequestDto extends createZodDto(
  DecideJoinRequestSchema,
) {
  @ApiProperty({ enum: ['approve', 'reject'] })
  decision: 'approve' | 'reject' = 'approve';
}
