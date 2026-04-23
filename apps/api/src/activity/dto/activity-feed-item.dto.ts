import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class ActivityActorDto {
  @ApiProperty({ example: '3f6c6c5e-4a8f-4f55-8f49-f6e2d15e7f24' })
  id!: string;

  @ApiProperty({ example: 'Ayesha Khan' })
  fullName!: string;

  @ApiPropertyOptional({ nullable: true, example: 'ayesha@example.com' })
  email?: string | null;

  @ApiPropertyOptional({ nullable: true, example: 'https://cdn.example.com/avatar.png' })
  avatarUrl?: string | null;

  @ApiPropertyOptional({ example: '#6366f1' })
  avatarColor?: string;
}

export class ActivityFeedItemDto {
  @ApiProperty({
    description: 'Activity log row ID. Use the last returned ID as `cursor` to load older activity.',
    example: '4650c5ff-b89e-4988-9b51-2f6a184c2eba',
  })
  id!: string;

  @ApiProperty({
    enum: ['activity', 'comment'],
    description: '`comment` is reserved for comment timeline rows once comment CRUD is enabled.',
    example: 'activity',
  })
  kind!: 'activity' | 'comment';

  @ApiProperty({
    description: 'ClickUp-style activity filter category.',
    example: 'status',
  })
  category!: string;

  @ApiProperty({
    description: 'Entity type that produced the activity.',
    example: 'task',
  })
  entityType!: string;

  @ApiProperty({
    description: 'ID of the entity that produced the activity.',
    example: 'd766605b-7082-4680-b817-d8e4ea5b40fd',
  })
  entityId!: string;

  @ApiProperty({
    description: 'Normalized activity action.',
    example: 'status_changed',
  })
  action!: string;

  @ApiPropertyOptional({
    nullable: true,
    description: 'Field name when this row represents a field-level change.',
    example: 'status',
  })
  fieldName?: string | null;

  @ApiPropertyOptional({
    nullable: true,
    description: 'Previous value, stringified for display/filtering.',
    example: 'To Do',
  })
  oldValue?: string | null;

  @ApiPropertyOptional({
    nullable: true,
    description: 'New value, stringified for display/filtering.',
    example: 'In Progress',
  })
  newValue?: string | null;

  @ApiProperty({
    type: Object,
    description: 'Denormalized context for rendering without extra lookups.',
    example: {
      taskTitle: 'Build activity feed',
      taskNumber: 42,
      projectName: 'Backend',
      listName: 'Sprint',
      oldStatusId: '0cfb5a62-6db7-4203-8391-e82ad3f6ed22',
      newStatusId: '76024116-3fa6-4c8f-8ec6-f8b8561a9757',
    },
  })
  metadata!: Record<string, unknown>;

  @ApiProperty({ type: ActivityActorDto, description: 'User who performed the activity.' })
  actor!: ActivityActorDto;

  @ApiProperty({
    description: 'Human-readable fallback text. Frontend can render richer UI from structured fields.',
    example: 'Ayesha Khan changed status from To Do to In Progress',
  })
  displayText!: string;

  @ApiProperty({ example: '2026-04-23T09:30:00.000Z' })
  createdAt!: Date;
}

export class ActivityFeedResponseDto {
  @ApiProperty({ type: ActivityFeedItemDto, isArray: true })
  items!: ActivityFeedItemDto[];

  @ApiPropertyOptional({
    nullable: true,
    description: 'Pass this value as `cursor` to fetch the next page of older activity.',
    example: '4650c5ff-b89e-4988-9b51-2f6a184c2eba',
  })
  nextCursor!: string | null;
}
