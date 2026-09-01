import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { ApiPropertyOptional } from '@nestjs/swagger';

// Both fields optional and independent, so a caller can correct just the
// amount without resending the name (and vice versa) — same partial-update
// shape as UpdateEmployeeDto.
const UpdateVendorSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, 'Vendor name is required')
      .max(255)
      .optional(),
    pendingPayment: z.coerce
      .number()
      .nonnegative('Pending payment cannot be negative')
      .optional(),
    dueDate: z.string().datetime().nullable().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field is required',
  });

export class UpdateVendorDto extends createZodDto(UpdateVendorSchema) {
  @ApiPropertyOptional({
    type: String,
    description: 'New vendor name',
    example: 'Karachi Print House',
  })
  name?: string;

  @ApiPropertyOptional({
    type: Number,
    description: 'Correct the amount owed but not yet paid, in PKR',
    example: 45000,
  })
  pendingPayment?: number;

  @ApiPropertyOptional({
    type: String,
    format: 'date-time',
    description:
      'Correct when the pendingPayment is due, or clear it entirely with null.',
    example: '2026-09-30T00:00:00.000Z',
    nullable: true,
  })
  dueDate?: string | null;
}
