import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AdminSetPasswordDto {
  @ApiProperty({
    example: 'NewPass456!',
    description: 'New password to set for the target user (minimum 8 characters).',
    minLength: 8,
  })
  @IsString()
  @MinLength(8)
  newPassword!: string;
}
