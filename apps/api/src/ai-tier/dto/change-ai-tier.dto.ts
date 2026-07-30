import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, MinLength } from 'class-validator';

export enum AiTier {
  PREMIUM = 'PREMIUM',
  STANDARD = 'STANDARD',
}

export class ChangeAiTierDto {
  @ApiProperty({ example: 'PREMIUM', enum: AiTier })
  @IsEnum(AiTier)
  tier!: AiTier;

  @ApiProperty({
    example: 'the-office-admin-secret',
    description: 'Secret key authorising the tier change',
  })
  @IsString()
  @MinLength(1)
  secret!: string;
}
