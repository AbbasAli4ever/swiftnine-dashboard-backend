import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateDocAttachmentDto {
  @ApiProperty({ example: '2f9c1b8a-3b4a-4f3d-9b2a-1234567890ab' })
  @IsUUID()
  docId!: string;

  @ApiProperty({ example: 'attachments/doc-uuid/abc123-screenshot.png' })
  @IsString()
  s3Key!: string;

  @ApiProperty({ example: 'screenshot.png', required: false })
  @IsOptional()
  @IsString()
  fileName?: string;

  @ApiProperty({ example: 'image/png', required: false })
  @IsOptional()
  @IsString()
  mimeType?: string;

  @ApiProperty({ example: 245000, required: false })
  @IsOptional()
  @IsNumber()
  fileSize?: number;
}
