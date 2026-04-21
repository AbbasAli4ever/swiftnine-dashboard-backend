import { ApiProperty } from '@nestjs/swagger';

export class AttachmentDto {
  @ApiProperty({ example: '2f9c1b8a-3b4a-4f3d-9b2a-1234567890ab' })
  id!: string;

  @ApiProperty({ example: 'attachments/task-uuid/abc123-screenshot.png' })
  s3Key!: string;

  @ApiProperty({ example: 'screenshot.png', required: false })
  fileName?: string;

  @ApiProperty({ example: 'image/png', required: false })
  mimeType?: string;

  @ApiProperty({ example: 245000, required: false })
  fileSize?: number;

  @ApiProperty({ example: '2026-04-21T12:00:00.000Z', format: 'date-time' })
  createdAt!: Date;
}
