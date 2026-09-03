import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsNumber, IsOptional, IsString } from 'class-validator';
import { AVATAR_ALLOWED_MIME_TYPES } from '../user.constants';

export class PresignAvatarDto {
  @ApiProperty({ enum: AVATAR_ALLOWED_MIME_TYPES, example: 'image/png' })
  @IsIn(AVATAR_ALLOWED_MIME_TYPES)
  mimeType!: string;

  @ApiPropertyOptional({ example: 'profile.png' })
  @IsOptional()
  @IsString()
  fileName?: string;

  @ApiPropertyOptional({
    example: 245000,
    description:
      'Client-reported size in bytes, advisory only — not enforced by the presigned URL itself.',
  })
  @IsOptional()
  @IsNumber()
  fileSize?: number;
}
