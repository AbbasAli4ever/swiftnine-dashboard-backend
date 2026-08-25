import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { ApiPropertyOptional } from '@nestjs/swagger';

const UpdateEmployeeSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, 'Employee name is required')
      .max(255)
      .optional(),
    paidCommission: z.coerce
      .number()
      .nonnegative('Paid commission cannot be negative')
      .optional(),
    pendingCommission: z.coerce
      .number()
      .nonnegative('Pending commission cannot be negative')
      .optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field is required',
  });

export class UpdateEmployeeDto extends createZodDto(UpdateEmployeeSchema) {
  @ApiPropertyOptional({
    type: String,
    description: 'New employee name',
    example: 'Sara Khan',
  })
  name?: string;

  @ApiPropertyOptional({
    type: Number,
    description: 'Correct the commission already paid out, in PKR',
    example: 15000,
  })
  paidCommission?: number;

  @ApiPropertyOptional({
    type: Number,
    description: 'Correct the commission owed but not yet paid, in PKR',
    example: 5000,
  })
  pendingCommission?: number;
}
