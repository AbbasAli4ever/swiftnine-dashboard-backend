import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

const TASK_RESPONSE_PRIORITY_VALUES = ['URGENT', 'HIGH', 'NORMAL', 'LOW', 'NONE'] as const;
const TASK_RESPONSE_STATUS_GROUP_VALUES = ['NOT_STARTED', 'ACTIVE', 'DONE', 'CLOSED'] as const;

type TaskResponsePriority = (typeof TASK_RESPONSE_PRIORITY_VALUES)[number];
type TaskResponseStatusGroup = (typeof TASK_RESPONSE_STATUS_GROUP_VALUES)[number];

class TaskUserBriefDto {
  @ApiProperty({ example: 'f3387da6-3af5-4d9e-a004-6cc67b586b8a' })
  id!: string;

  @ApiProperty({ example: 'Ayesha Khan' })
  fullName!: string;

  @ApiPropertyOptional({ example: 'https://cdn.example.com/avatar.png', nullable: true })
  avatarUrl!: string | null;

  @ApiProperty({ example: '#6366f1' })
  avatarColor!: string;
}

class TaskAssigneeResponseDto {
  @ApiProperty({ type: TaskUserBriefDto })
  user!: TaskUserBriefDto;

  @ApiProperty({
    description: 'User ID that assigned this member to the task.',
    example: '6c186a98-9ce2-4ddf-91ec-1184139a0f44',
  })
  assignedBy!: string;
}

class TaskStatusBriefDto {
  @ApiProperty({ example: '9fa46c52-c13a-4088-89f8-1c321016862f' })
  id!: string;

  @ApiProperty({ example: 'In Progress' })
  name!: string;

  @ApiProperty({ example: '#3b82f6' })
  color!: string;

  @ApiProperty({ enum: TASK_RESPONSE_STATUS_GROUP_VALUES, example: 'ACTIVE' })
  group!: TaskResponseStatusGroup;
}

class TaskTagBriefDto {
  @ApiProperty({ example: 'e0aa9215-1d22-4724-9ef2-c69fa92698f6' })
  id!: string;

  @ApiProperty({ example: 'Backend' })
  name!: string;

  @ApiProperty({ example: '#10b981' })
  color!: string;
}

class TaskTagResponseDto {
  @ApiProperty({ type: TaskTagBriefDto })
  tag!: TaskTagBriefDto;
}

class TaskProjectBriefDto {
  @ApiProperty({ example: '294cb5ed-807d-49f6-ae4a-b672a82707b8' })
  id!: string;

  @ApiProperty({ example: 'ClickUp Clone' })
  name!: string;

  @ApiProperty({ example: 'CU' })
  taskIdPrefix!: string;
}

class TaskListBriefDto {
  @ApiProperty({ example: 'f34f824e-9d99-40ec-b8f8-a9777c7ed3d6' })
  id!: string;

  @ApiProperty({ example: 'Sprint Backlog' })
  name!: string;

  @ApiProperty({ type: TaskProjectBriefDto })
  project!: TaskProjectBriefDto;
}

class TaskChildrenCountDto {
  @ApiProperty({ example: 3 })
  children!: number;
}

export class TaskListItemResponseDto {
  @ApiProperty({ example: 'a843cde2-f8c4-49a1-916b-308941b56f34' })
  id!: string;

  @ApiProperty({
    description: 'Human-readable task key composed from the project prefix and task number.',
    example: 'CU-104',
  })
  taskId!: string;

  @ApiProperty({ example: 104 })
  taskNumber!: number;

  @ApiProperty({ example: 'Implement task search and filters' })
  title!: string;

  @ApiProperty({ enum: TASK_RESPONSE_PRIORITY_VALUES, example: 'HIGH' })
  priority!: TaskResponsePriority;

  @ApiPropertyOptional({ example: '2026-04-23T00:00:00.000Z', nullable: true })
  startDate!: Date | null;

  @ApiPropertyOptional({ example: '2026-04-30T18:00:00.000Z', nullable: true })
  dueDate!: Date | null;

  @ApiProperty({ example: 2000 })
  position!: number;

  @ApiProperty({ example: 0, description: '0 for top-level tasks; greater than 0 for subtasks.' })
  depth!: number;

  @ApiProperty({ example: false })
  isCompleted!: boolean;

  @ApiPropertyOptional({ example: null, nullable: true })
  completedAt!: Date | null;

  @ApiProperty({ example: '2026-04-23T10:00:00.000Z' })
  createdAt!: Date;

  @ApiProperty({ example: '2026-04-23T11:30:00.000Z' })
  updatedAt!: Date;

  @ApiProperty({ type: TaskStatusBriefDto })
  status!: TaskStatusBriefDto;

  @ApiProperty({ type: [TaskAssigneeResponseDto] })
  assignees!: TaskAssigneeResponseDto[];

  @ApiProperty({ type: [TaskTagResponseDto] })
  tags!: TaskTagResponseDto[];

  @ApiProperty({ type: TaskListBriefDto })
  list!: TaskListBriefDto;

  @ApiProperty({ type: TaskChildrenCountDto })
  _count!: TaskChildrenCountDto;
}

class PaginationMetaDto {
  @ApiProperty({ example: 1 })
  page!: number;

  @ApiProperty({ example: 20 })
  limit!: number;

  @ApiProperty({ example: 57 })
  total!: number;

  @ApiProperty({ example: 3 })
  total_pages!: number;

  @ApiProperty({ example: true })
  has_next!: boolean;

  @ApiProperty({ example: false })
  has_prev!: boolean;
}

export class PaginatedTasksResponseDto {
  @ApiProperty({ example: true })
  success!: true;

  @ApiProperty({ type: [TaskListItemResponseDto] })
  data!: TaskListItemResponseDto[];

  @ApiProperty({ type: PaginationMetaDto })
  meta!: PaginationMetaDto;

  @ApiPropertyOptional({ example: null, nullable: true })
  message!: string | null;
}
