import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, Max, Min, MinLength } from 'class-validator';
import { TOKEN_LIMIT_MAX, TOKEN_LIMIT_MIN } from '../ai-tier.constants';

export class SetTokenAllowanceDto {
  @ApiProperty({
    example: 1_000_000,
    description: 'Weekly token budget (prompt + completion tokens combined)',
    minimum: TOKEN_LIMIT_MIN,
    maximum: TOKEN_LIMIT_MAX,
  })
  @IsInt()
  @Min(TOKEN_LIMIT_MIN)
  @Max(TOKEN_LIMIT_MAX)
  tokenLimit!: number;

  @ApiProperty({ description: 'Secret key authorising the change' })
  @IsString()
  @MinLength(1)
  secret!: string;
}

export class ResetTokenAllowanceDto {
  @ApiProperty({ description: 'Secret key authorising the reset' })
  @IsString()
  @MinLength(1)
  secret!: string;
}
