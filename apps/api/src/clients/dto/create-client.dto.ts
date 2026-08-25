import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';

// Name is the only input. totalRevenue/currencyType used to be accepted here
// as a hand-typed opening figure, but nothing kept them in sync with actual
// sales, so they read as a client's revenue while never moving as
// transactions came in — the source of the "USD 0 despite real sales" bug.
// The real figure is totalRevenueUsd on the response, computed from
// Transaction rows. The columns still exist (existing clients hold values
// entered before this change) and are still returned; they simply can no
// longer be set, and default to 0 / null on every new client.
const CreateClientSchema = z.object({
  clientName: z.string().trim().min(1, 'Client name is required').max(255),
});

export class CreateClientDto extends createZodDto(CreateClientSchema) {
  @ApiProperty({
    type: String,
    description: 'Client name — the only field accepted when creating a client',
    example: 'Acme Corp',
  })
  clientName: string = '';
}
