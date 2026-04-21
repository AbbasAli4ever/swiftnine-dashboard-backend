import { ApiProperty } from '@nestjs/swagger';

export class DeleteAttachmentResponseDto {
  @ApiProperty({ example: '2f9c1b8a-3b4a-4f3d-9b2a-1234567890ab' })
  id!: string;

  @ApiProperty({ example: 'attachments/task-uuid/abc123-screenshot.png' })
  s3Key!: string;
}
