import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';

const CreateClientSchema = z.object({
  clientName: z.string().trim().min(1, 'Client name is required').max(255),
});

export class CreateClientDto extends createZodDto(CreateClientSchema) {
  @ApiProperty({
    type: String,
    description: 'Client name',
    example: 'Acme Corp',
  })
  clientName: string = '';
}
