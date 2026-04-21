import { ApiProperty } from '@nestjs/swagger';

export class PresignResponseDto {
  @ApiProperty({ example: 'https://s3.amazonaws.com/bucket/...' })
  uploadUrl!: string;

  @ApiProperty({ example: 'attachments/task-uuid/abc123-screenshot.png' })
  s3Key!: string;

  @ApiProperty({ example: '2026-04-21T12:00:00.000Z', format: 'date-time' })
  expiresAt!: Date;
}
