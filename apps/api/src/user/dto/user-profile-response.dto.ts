import { ApiProperty } from '@nestjs/swagger';
import { UserPresenceStatus } from './profile-status.enum';

export class UserProfileResponseDto {
  @ApiProperty({
    example: 'cc6c4f04-6cae-4d0a-a3cb-864d53f92f29',
  })
  id!: string;

  @ApiProperty({
    example: 'Shoaib Ahmed',
  })
  fullName!: string;

  @ApiProperty({
    example: 'Lead Backend Engineer',
    nullable: true,
  })
  designation!: string | null;

  @ApiProperty({
    example: 'shoaib@example.com',
  })
  email!: string;

  @ApiProperty({
    example: 'initials:SA',
  })
  profilePicture!: string;

  @ApiProperty({
    enum: UserPresenceStatus,
    example: UserPresenceStatus.ONLINE,
  })
  status!: UserPresenceStatus;

  @ApiProperty({
    example: 'Building secure and scalable APIs.',
    nullable: true,
  })
  bio!: string | null;

  @ApiProperty({
    example: 'Asia/Karachi',
    nullable: true,
  })
  timezone!: string | null;

  @ApiProperty({
    example: true,
  })
  showLocalTime!: boolean;

  @ApiProperty({
    example: '13/04/2026, 21:20:59',
    nullable: true,
  })
  localTime!: string | null;

  @ApiProperty({
    example: '2026-04-10T12:35:41.000Z',
    format: 'date-time',
  })
  createdAt!: Date;

  @ApiProperty({
    example: '2026-04-13T16:20:59.000Z',
    format: 'date-time',
  })
  updatedAt!: Date;
}
