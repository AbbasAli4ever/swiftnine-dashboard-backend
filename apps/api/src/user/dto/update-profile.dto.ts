import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { UserPresenceStatus } from './profile-status.enum';

const PROFILE_PICTURE_PATTERN =
  /^(https?:\/\/\S+|initials:[A-Za-z]{1,4}|[A-Za-z]{1,4})$/;

export class UpdateProfileDto {
  @ApiPropertyOptional({
    example: 'Shoaib Ahmed',
    description: 'Updated display name for the user profile.',
    minLength: 2,
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  fullName?: string;

  @ApiPropertyOptional({
    example: 'Lead Backend Engineer',
    maxLength: 120,
  })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  designation?: string;

  @ApiPropertyOptional({
    example: 'https://cdn.example.com/avatar/shoaib.png',
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
  })
  @IsOptional()
  @IsEnum(UserPresenceStatus)
  status?: UserPresenceStatus;

  @ApiPropertyOptional({
    example: 'I like to work on distributed systems and clean architecture.',
    maxLength: 300,
  })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  bio?: string;

  @ApiPropertyOptional({
    example: 'Europe/London',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  timezone?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Whether to include computed localTime in profile response.',
  })
  @IsOptional()
  @IsBoolean()
  showLocalTime?: boolean;
}
