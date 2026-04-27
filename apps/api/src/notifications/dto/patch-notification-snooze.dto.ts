import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PatchNotificationSnoozeDto {
  @ApiProperty({ type: Boolean, description: 'Set true to snooze notification, false to unsnooze it' })
  isSnoozed!: boolean;

  @ApiPropertyOptional({
    type: String,
    format: 'date-time',
    description:
      'ISO datetime when snooze expires. Only allowed when isSnoozed=true. If omitted, snooze stays active until manually unset.',
  })
  snoozeUntil?: string;
}