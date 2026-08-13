import { ApiProperty } from '@nestjs/swagger';
import { RevenueOverviewPointDto } from './dashboard-overview-response.dto';

export class MonthlyBreakdownResponseDto {
  @ApiProperty({ example: 2026 })
  year!: number;

  @ApiProperty({
    type: [RevenueOverviewPointDto],
    description: 'Exactly 12 points, January through December of `year`',
  })
  points!: RevenueOverviewPointDto[];
}
