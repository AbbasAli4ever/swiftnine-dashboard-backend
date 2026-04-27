import { ApiProperty } from '@nestjs/swagger';

export class NotificationResponseDto {
  @ApiProperty({ type: String, description: 'Notification id' })
  id!: string;

  @ApiProperty({ type: String, description: 'Notification type' })
  type!: string;

  @ApiProperty({ type: String, description: 'Notification title' })
  title!: string;

  @ApiProperty({
    type: String,
    description: 'Optional message',
    required: false,
  })
  message?: string | null;

  @ApiProperty({
    type: String,
    description: 'Reference entity type',
    required: false,
  })
  referenceType?: string | null;

  @ApiProperty({
    type: String,
    description: 'Reference entity id',
    required: false,
  })
  referenceId?: string | null;

  @ApiProperty({
    type: String,
    description:
      'Task id related to this notification, resolved from task or comment reference',
    required: false,
  })
  taskId?: string | null;

  @ApiProperty({
    type: String,
    description: 'Task title resolved from the related task (maps to task.title)',
    required: false,
  })
  taskName?: string | null;

  @ApiProperty({
    type: String,
    description: 'Comment id (only present when referenceType is comment)',
    required: false,
  })
  commentId?: string | null;

  @ApiProperty({
    type: String,
    description: 'Comment content preview (only present when referenceType is comment)',
    required: false,
  })
  commentName?: string | null;

  @ApiProperty({
    type: String,
    description: 'Actor user id performing the action',
    required: false,
  })
  actorId?: string | null;

  @ApiProperty({ type: Boolean, description: 'Read state' })
  isRead!: boolean;

  @ApiProperty({ type: Boolean, description: 'Cleared/archived state' })
  isCleared!: boolean;

  @ApiProperty({ type: Boolean, description: 'Snoozed state' })
  isSnoozed!: boolean;

  @ApiProperty({
    type: String,
    format: 'date-time',
    description: 'Snoozed until timestamp',
    required: false,
  })
  snoozedAt?: Date | null;

  @ApiProperty({
    type: String,
    format: 'date-time',
    description: 'Created at timestamp',
  })
  createdAt!: Date;
}
