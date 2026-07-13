import { ApiProperty } from '@nestjs/swagger';

export class PresignAiAttachmentResponseDto {
  @ApiProperty({ example: '2f9c1b8a-3b4a-4f3d-9b2a-1234567890ab' })
  attachmentId!: string;

  @ApiProperty({ example: 'https://s3.amazonaws.com/bucket/...' })
  uploadUrl!: string;

  @ApiProperty({ example: 'swiftnine/docs/app/ai-attachments/conversation-uuid/abc123-file.pdf' })
  s3Key!: string;

  @ApiProperty({ example: 900 })
  expiresIn!: number;
}
