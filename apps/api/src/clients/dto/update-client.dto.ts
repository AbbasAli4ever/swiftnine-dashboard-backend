import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';

const UpdateClientSchema = z.object({
  clientName: z.string().trim().min(1, 'Client name is required').max(255),
});

export class UpdateClientDto extends createZodDto(UpdateClientSchema) {
  @ApiProperty({
    type: String,
    description: 'New client name',
    example: 'Acme Corp',
  })
  clientName: string = '';
}
