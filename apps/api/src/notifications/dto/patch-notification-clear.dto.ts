import { ApiProperty } from '@nestjs/swagger';

export class PatchNotificationClearDto {
  @ApiProperty({ type: Boolean, description: 'Set true to clear notification, false to un-clear it' })
  isCleared!: boolean;
}