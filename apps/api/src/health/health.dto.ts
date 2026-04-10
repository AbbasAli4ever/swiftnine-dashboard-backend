import { ApiProperty } from '@nestjs/swagger';

export class HealthResponseDto {
  @ApiProperty({ example: 'ok', enum: ['ok', 'error'] })
  status!: string;

  @ApiProperty({ example: 'connected', enum: ['connected', 'disconnected'] })
  database!: string;

  @ApiProperty({ example: 'Connection refused', required: false })
  message?: string;
}
