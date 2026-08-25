import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// Pending payment is always PKR — no currency field, matching Employee's
// commission figures. It is a manual entry; there is no purchase record for
// it to be derived from.
const CreateVendorSchema = z.object({
  name: z.string().trim().min(1, 'Vendor name is required').max(255),
  pendingPayment: z.coerce
    .number()
    .nonnegative('Pending payment cannot be negative')
    .default(0),
});

export class CreateVendorDto extends createZodDto(CreateVendorSchema) {
  @ApiProperty({
    type: String,
    description: 'Vendor name',
    example: 'Karachi Print House',
  })
  name: string = '';

  @ApiPropertyOptional({
    type: Number,
    description: 'Amount owed to this vendor but not yet paid, in PKR',
    default: 0,
    example: 45000,
  })
  pendingPayment: number = 0;
}
