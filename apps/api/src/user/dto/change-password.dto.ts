import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({
    example: 'OldPass123!',
    description: 'Current account password.',
  })
  @IsString()
  @MinLength(1)
  currentPassword!: string;

  @ApiProperty({
    example: 'NewPass456!',
    description: 'New password (minimum 8 characters).',
    minLength: 8,
  })
  @IsString()
  @MinLength(8)
  newPassword!: string;
}
