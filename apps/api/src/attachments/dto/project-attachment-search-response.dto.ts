import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class ProjectAttachmentSearchUploaderDto {
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

export class ProjectAttachmentSearchResponseDto {
  @ApiProperty({ example: '2f9c1b8a-3b4a-4f3d-9b2a-1234567890ab' })
  id!: string;

  @ApiProperty({ example: 'project_attachment' })
  entityType!: 'project_attachment';

  @ApiProperty({ example: '6f9c1b8a-3b4a-4f3d-9b2a-1234567890ab' })
  projectId!: string;

  @ApiProperty({ enum: ['FILE', 'LINK'], example: 'LINK' })
  kind!: 'FILE' | 'LINK';

  @ApiPropertyOptional({ example: 'Design file', nullable: true })
  title!: string | null;

  @ApiPropertyOptional({ example: 'requirements.pdf', nullable: true })
  fileName!: string | null;

  @ApiPropertyOptional({ example: 'Project reference material', nullable: true })
  description!: string | null;

  @ApiPropertyOptional({
    example: 'https://www.figma.com/file/example',
    nullable: true,
  })
  linkUrl!: string | null;

  @ApiProperty({ example: '2026-05-13T10:30:00.000Z', format: 'date-time' })
  createdAt!: Date;

  @ApiProperty({ type: ProjectAttachmentSearchUploaderDto })
  uploadedBy!: ProjectAttachmentSearchUploaderDto;
}
