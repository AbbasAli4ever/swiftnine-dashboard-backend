import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, IsOptional, IsNumber } from 'class-validator';

export class CreateAttachmentDto {
  @ApiProperty({ example: '2f9c1b8a-3b4a-4f3d-9b2a-1234567890ab' })
  @IsUUID()
  taskId!: string;

  @ApiProperty({ example: 'cc6c4f04-6cae-4d0a-a3cb-864d53f92f29' })
  @IsUUID()
  memberId!: string;

  @ApiProperty({ example: 'attachments/task-uuid/abc123-screenshot.png' })
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
