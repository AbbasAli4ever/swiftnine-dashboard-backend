import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordResponseDto {
  @ApiProperty({
    example: 'Password changed successfully. Please login again.',
  })
  message!: string;
}
