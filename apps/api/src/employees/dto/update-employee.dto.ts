import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';

const UpdateEmployeeSchema = z.object({
  name: z.string().trim().min(1, 'Employee name is required').max(255),
});

export class UpdateEmployeeDto extends createZodDto(UpdateEmployeeSchema) {
  @ApiProperty({
    type: String,
    description: 'New employee name',
    example: 'Sara Khan',
  })
  name: string = '';
}
