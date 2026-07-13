import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { WIRE_ATTACHMENT_TYPES } from '../ai-attachments.constants';

export class AiAttachmentResponseDto {
  @ApiProperty({ example: '2f9c1b8a-3b4a-4f3d-9b2a-1234567890ab' })
  id!: string;

  @ApiProperty({ format: 'uuid' })
  conversationId!: string;

  @ApiPropertyOptional({ format: 'uuid', nullable: true })
  messageId!: string | null;

  @ApiProperty({ example: 'requirements.pdf' })
  fileName!: string;

  @ApiProperty({ example: 'application/pdf' })
  mimeType!: string;

  @ApiProperty({ example: 245000 })
  fileSize!: number;

  @ApiProperty({ enum: WIRE_ATTACHMENT_TYPES })
  attachmentType!: (typeof WIRE_ATTACHMENT_TYPES)[number];

  @ApiPropertyOptional({ example: 'https://s3.example.com/signed-view-url', nullable: true })
  url!: string | null;

  @ApiProperty({ example: '2026-05-13T10:30:00.000Z', format: 'date-time' })
  createdAt!: Date;
}

export class AiAttachmentListResponseDto {
  @ApiProperty({ type: [AiAttachmentResponseDto] })
  items!: AiAttachmentResponseDto[];

  @ApiPropertyOptional({ nullable: true })
  nextCursor!: string | null;

  @ApiProperty({ example: 50 })
  limit!: number;
}
