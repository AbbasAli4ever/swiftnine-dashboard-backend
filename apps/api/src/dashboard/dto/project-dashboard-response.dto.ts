import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class DashboardProjectDto {
  @ApiProperty({ example: '294cb5ed-807d-49f6-ae4a-b672a82707b8' })
  id!: string;

  @ApiProperty({ example: 'ClickUp Clone' })
  name!: string;

  @ApiProperty({ example: '#2563eb' })
  color!: string;

  @ApiPropertyOptional({ example: 'rocket', nullable: true })
  icon!: string | null;
}

class DashboardStatusSummaryDto {
  @ApiProperty({ example: '9fa46c52-c13a-4088-89f8-1c321016862f' })
  statusId!: string;

  @ApiProperty({ example: 'In Progress' })
  name!: string;

  @ApiProperty({ example: '#3b82f6' })
  color!: string;

  @ApiProperty({ enum: ['NOT_STARTED', 'ACTIVE', 'DONE', 'CLOSED'], example: 'ACTIVE' })
  group!: 'NOT_STARTED' | 'ACTIVE' | 'DONE' | 'CLOSED';

  @ApiProperty({ example: 1000 })
  position!: number;

  @ApiProperty({ example: 12 })
  count!: number;
}

class DashboardListSummaryDto {
  @ApiProperty({ example: 'f34f824e-9d99-40ec-b8f8-a9777c7ed3d6' })
  id!: string;

  @ApiProperty({ example: 'Sprint Backlog' })
  name!: string;

  @ApiProperty({ example: 1000 })
  position!: number;

  @ApiProperty({ example: 8 })
  taskCount!: number;

  @ApiProperty({ example: 3 })
  completedCount!: number;

  @ApiProperty({ example: 5 })
  openCount!: number;
}

class DashboardAttachmentUploaderDto {
  @ApiProperty({ example: 'f3387da6-3af5-4d9e-a004-6cc67b586b8a' })
  id!: string;

  @ApiProperty({ example: 'Ayesha Khan' })
  fullName!: string;

  @ApiPropertyOptional({ example: 'https://cdn.example.com/avatar.png', nullable: true })
  avatarUrl!: string | null;

  @ApiProperty({ example: '#6366f1' })
  avatarColor!: string;
}

class DashboardAttachmentDto {
  @ApiProperty({ example: '1a685ded-8e4f-42c5-96de-c1df9cd1a7ff' })
  id!: string;

  @ApiProperty({ example: 'a843cde2-f8c4-49a1-916b-308941b56f34' })
  taskId!: string;

  @ApiProperty({ example: 'CU-104' })
  taskKey!: string;

  @ApiProperty({ example: 'Implement task search and filters' })
  taskTitle!: string;

  @ApiProperty({ example: 'f34f824e-9d99-40ec-b8f8-a9777c7ed3d6' })
  listId!: string;

  @ApiProperty({ example: 'Sprint Backlog' })
  listName!: string;

  @ApiProperty({ example: 'api-contract.pdf' })
  fileName!: string;

  @ApiProperty({ example: 'application/pdf' })
  mimeType!: string;

  @ApiProperty({ example: 245760 })
  fileSize!: number;

  @ApiProperty({ example: '2026-04-24T09:30:00.000Z' })
  createdAt!: Date;

  @ApiProperty({ type: DashboardAttachmentUploaderDto })
  uploadedBy!: DashboardAttachmentUploaderDto;
}

export class ProjectDashboardDto {
  @ApiProperty({ type: DashboardProjectDto })
  project!: DashboardProjectDto;

  @ApiProperty({ type: [DashboardStatusSummaryDto] })
  statusSummary!: DashboardStatusSummaryDto[];

  @ApiProperty({ type: [DashboardListSummaryDto] })
  lists!: DashboardListSummaryDto[];

  @ApiProperty({ type: [DashboardAttachmentDto] })
  attachments!: DashboardAttachmentDto[];

  @ApiProperty({
    type: 'array',
    items: { type: 'object' },
    example: [],
    description: 'Reserved for future project docs in the overview section.',
  })
  docs!: Record<string, never>[];
}

export class ProjectDashboardResponseDto {
  @ApiProperty({ example: true })
  success!: true;

  @ApiProperty({ type: ProjectDashboardDto })
  data!: ProjectDashboardDto;

  @ApiPropertyOptional({ example: null, nullable: true })
  message!: string | null;
}
