import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { UserPresenceStatus } from './profile-status.enum';

export class SetStatusDto {
  @ApiProperty({
    enum: UserPresenceStatus,
    example: UserPresenceStatus.ONLINE,
    description: 'Presence status to set for the current user.',
  })
  @IsEnum(UserPresenceStatus)
  status!: UserPresenceStatus;
}
