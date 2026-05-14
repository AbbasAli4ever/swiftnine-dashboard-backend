import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class ProjectAttachmentUploaderDto {
  @ApiProperty({ example: 'cc6c4f04-6cae-4d0a-a3cb-864d53f92f29' })
  id!: string;

  @ApiPropertyOptional({ example: 'Jane Doe', nullable: true })
  name!: string | null;

  @ApiPropertyOptional({
    example: 'https://cdn.example.com/avatar.png',
    nullable: true,
  })
  avatarUrl!: string | null;
}

export class ProjectAttachmentResponseDto {
  @ApiProperty({ example: '2f9c1b8a-3b4a-4f3d-9b2a-1234567890ab' })
  id!: string;

  @ApiProperty({ enum: ['FILE', 'LINK'], example: 'FILE' })
  kind!: 'FILE' | 'LINK';

  @ApiPropertyOptional({ example: 'Project requirements', nullable: true })
  title!: string | null;

  @ApiPropertyOptional({
    example: 'Reference material for the project kickoff.',
    nullable: true,
  })
  description!: string | null;

  @ApiProperty({ type: ProjectAttachmentUploaderDto })
  uploadedBy!: ProjectAttachmentUploaderDto;

  @ApiProperty({ example: '2026-05-13T10:30:00.000Z', format: 'date-time' })
  createdAt!: Date;

  @ApiPropertyOptional({ example: 'requirements.pdf' })
  fileName?: string;

  @ApiPropertyOptional({ example: 'application/pdf' })
  mimeType?: string;

  @ApiPropertyOptional({ example: 245000 })
  fileSize?: number;

  @ApiPropertyOptional({ example: 'https://s3.example.com/signed-view-url' })
  viewUrl?: string;

  @ApiPropertyOptional({ example: 'https://www.figma.com/file/example' })
  linkUrl?: string;
}

export class ProjectAttachmentListResponseDto {
  @ApiProperty({ type: [ProjectAttachmentResponseDto] })
  items!: ProjectAttachmentResponseDto[];

  @ApiPropertyOptional({
    example: '2026-05-13T10:30:00.000Z:2f9c1b8a-3b4a-4f3d-9b2a-1234567890ab',
    nullable: true,
  })
  nextCursor!: string | null;

  @ApiProperty({ example: 50 })
  limit!: number;
}
