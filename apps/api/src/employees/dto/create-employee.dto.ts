import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';

const CreateEmployeeSchema = z.object({
  name: z.string().trim().min(1, 'Employee name is required').max(255),
});

export class CreateEmployeeDto extends createZodDto(CreateEmployeeSchema) {
  @ApiProperty({
    type: String,
    description: 'Employee name',
    example: 'Sara Khan',
  })
  name: string = '';
}
