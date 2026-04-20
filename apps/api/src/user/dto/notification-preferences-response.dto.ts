import { ApiPropertyOptional } from '@nestjs/swagger';

export class NotificationPreferencesResponseDto {
  @ApiPropertyOptional({ example: true, nullable: true })
  inbox!: boolean | null;

  @ApiPropertyOptional({ example: true, nullable: true })
  email!: boolean | null;

  @ApiPropertyOptional({ example: true, nullable: true })
  browser!: boolean | null;

  @ApiPropertyOptional({ example: true, nullable: true })
  mobile!: boolean | null;
}
