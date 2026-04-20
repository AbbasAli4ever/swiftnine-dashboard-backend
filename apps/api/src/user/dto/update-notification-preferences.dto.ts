import { IsBoolean, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateNotificationPreferencesDto {
  @ApiPropertyOptional({ example: true, description: 'Enable or disable inbox notifications' })
  @IsOptional()
  @IsBoolean()
  inbox?: boolean;

  @ApiPropertyOptional({ example: true, description: 'Enable or disable email notifications' })
  @IsOptional()
  @IsBoolean()
  email?: boolean;

  @ApiPropertyOptional({ example: true, description: 'Enable or disable browser (web) notifications' })
  @IsOptional()
  @IsBoolean()
  browser?: boolean;

  @ApiPropertyOptional({ example: true, description: 'Enable or disable mobile push notifications' })
  @IsOptional()
  @IsBoolean()
  mobile?: boolean;
}
