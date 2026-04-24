import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TaskListItemResponseDto } from './task-list-item-response.dto';

class BoardStatusDto {
  @ApiProperty({ example: '9fa46c52-c13a-4088-89f8-1c321016862f' })
  id!: string;

  @ApiProperty({ example: 'In Progress' })
  name!: string;

  @ApiProperty({ example: '#3b82f6' })
  color!: string;

  @ApiProperty({ enum: ['NOT_STARTED', 'ACTIVE', 'DONE', 'CLOSED'], example: 'ACTIVE' })
  group!: 'NOT_STARTED' | 'ACTIVE' | 'DONE' | 'CLOSED';

  @ApiProperty({ example: 2000 })
  position!: number;

  @ApiProperty({ example: false })
  isDefault!: boolean;

  @ApiProperty({ example: false })
  isProtected!: boolean;

  @ApiProperty({ example: false })
  isClosed!: boolean;
}

class ProjectBoardColumnDto {
  @ApiProperty({ type: BoardStatusDto })
  status!: BoardStatusDto;

  @ApiProperty({ type: [TaskListItemResponseDto] })
  tasks!: TaskListItemResponseDto[];

  @ApiProperty({ example: 12 })
  total!: number;
}

export class ProjectBoardDto {
  @ApiProperty({ example: 'status' })
  groupBy!: 'status';

  @ApiProperty({ example: '294cb5ed-807d-49f6-ae4a-b672a82707b8' })
  projectId!: string;

  @ApiProperty({ type: [ProjectBoardColumnDto] })
  columns!: ProjectBoardColumnDto[];

  @ApiProperty({ example: 47 })
  total!: number;
}

export class ProjectBoardResponseDto {
  @ApiProperty({ example: true })
  success!: true;

  @ApiProperty({ type: ProjectBoardDto })
  data!: ProjectBoardDto;

  @ApiPropertyOptional({ example: null, nullable: true })
  message!: string | null;
}
