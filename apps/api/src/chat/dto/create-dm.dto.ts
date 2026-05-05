import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';

const CreateDmSchema = z.object({
  targetUserId: z.string().uuid(),
});

export class CreateDmDto extends createZodDto(CreateDmSchema) {
  @ApiProperty({ format: 'uuid' })
  targetUserId: string = '';
}
