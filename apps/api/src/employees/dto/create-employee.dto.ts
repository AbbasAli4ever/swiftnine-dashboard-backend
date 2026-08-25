import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// Commission is always PKR — no currency field, unlike Clients/Transaction.
// Both figures are independent manual entries; there's no sale for either to
// derive from.
const CreateEmployeeSchema = z.object({
  name: z.string().trim().min(1, 'Employee name is required').max(255),
  paidCommission: z.coerce
    .number()
    .nonnegative('Paid commission cannot be negative')
    .default(0),
  pendingCommission: z.coerce
    .number()
    .nonnegative('Pending commission cannot be negative')
    .default(0),
});

export class CreateEmployeeDto extends createZodDto(CreateEmployeeSchema) {
  @ApiProperty({
    type: String,
    description: 'Employee name',
    example: 'Sara Khan',
  })
  name: string = '';

  @ApiPropertyOptional({
    type: Number,
    description: 'Commission already paid out, in PKR',
    default: 0,
    example: 15000,
  })
  paidCommission: number = 0;

  @ApiPropertyOptional({
    type: Number,
    description: 'Commission owed but not yet paid, in PKR',
    default: 0,
    example: 5000,
  })
  pendingCommission: number = 0;
}
