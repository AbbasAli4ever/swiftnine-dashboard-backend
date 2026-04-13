import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { UserPresenceStatus } from './profile-status.enum';

const PROFILE_PICTURE_PATTERN =
  /^(https?:\/\/\S+|initials:[A-Za-z]{1,4}|[A-Za-z]{1,4})$/;

export class CreateProfileDto {
  @ApiPropertyOptional({
    example: 'Senior Backend Engineer',
    description: 'Current designation or job title.',
    maxLength: 120,
  })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  designation?: string;

  @ApiPropertyOptional({
    example: 'initials:SA',
    description:
      'Profile picture URL or initials value (e.g. initials:JD or JD).',
  })
  @IsOptional()
  @IsString()
  @Matches(PROFILE_PICTURE_PATTERN, {
    message:
      'profilePicture must be a valid URL or initials (e.g. JD or initials:JD)',
  })
  profilePicture?: string;

  @ApiPropertyOptional({
    enum: UserPresenceStatus,
    example: UserPresenceStatus.ONLINE,
    description: 'Current online presence status.',
  })
  @IsOptional()
  @IsEnum(UserPresenceStatus)
  status?: UserPresenceStatus;

  @ApiPropertyOptional({
    example: 'Building secure and scalable APIs.',
    maxLength: 300,
  })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  bio?: string;

  @ApiPropertyOptional({
    example: 'Asia/Karachi',
    description: 'IANA timezone to compute local time in profile response.',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  timezone?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Controls whether local time should be returned in profile.',
  })
  @IsOptional()
  @IsBoolean()
  showLocalTime?: boolean;
}
