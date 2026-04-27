import { ApiProperty } from '@nestjs/swagger';

export class PatchNotificationReadDto {
  @ApiProperty({ type: Boolean, description: 'Set true to mark read, false to mark unread' })
  isRead!: boolean;
}