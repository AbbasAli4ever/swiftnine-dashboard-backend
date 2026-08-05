import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { DASHBOARD_PERIOD_VALUES } from '../accounting-dashboard.constants';

export const DashboardOverviewQuerySchema = z.object({
  period: z.enum(DASHBOARD_PERIOD_VALUES).default('daily'),
});

export class DashboardOverviewQueryDto extends createZodDto(
  DashboardOverviewQuerySchema,
) {}

export type DashboardOverviewQuery = z.output<
  typeof DashboardOverviewQuerySchema
>;
export type DashboardPeriod = DashboardOverviewQuery['period'];
