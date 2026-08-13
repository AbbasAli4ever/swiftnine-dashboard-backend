import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ok, type ApiResponse as ApiRes } from '@app/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  AccountingRoleGuard,
  RequireAccountingRole,
} from '../auth/guards/accounting-role.guard';
import { WorkspaceGuard } from '../workspace/workspace.guard';
import type { WorkspaceRequest } from '../workspace/workspace.types';
import {
  AccountingDashboardService,
  type DailyReport,
  type DashboardOverview,
  type DashboardSearchResult,
  type MonthlyBreakdown,
} from './accounting-dashboard.service';
import {
  DashboardOverviewQueryDto,
  type DashboardOverviewQuery,
} from './dto/dashboard-overview-query.dto';
import { DashboardOverviewResponseDto } from './dto/dashboard-overview-response.dto';
import {
  DashboardSearchQueryDto,
  type DashboardSearchQuery,
} from './dto/dashboard-search-query.dto';
import { DashboardSearchResponseDto } from './dto/dashboard-search-response.dto';
import {
  DailyReportQueryDto,
  type DailyReportQuery,
} from './dto/daily-report-query.dto';
import { DailyReportResponseDto } from './dto/daily-report-response.dto';
import {
  MonthlyBreakdownQueryDto,
  type MonthlyBreakdownQuery,
} from './dto/monthly-breakdown-query.dto';
import { MonthlyBreakdownResponseDto } from './dto/monthly-breakdown-response.dto';

@ApiTags('accounting-dashboard')
@ApiBearerAuth()
@Controller('accounting-dashboard')
@UseGuards(JwtAuthGuard, WorkspaceGuard, AccountingRoleGuard)
@RequireAccountingRole('CEO', 'ACCOUNTANT')
@ApiHeader({
  name: 'x-workspace-id',
  required: true,
  description: 'Active workspace ID',
})
export class AccountingDashboardController {
  constructor(private readonly dashboardService: AccountingDashboardService) {}

  @Get('overview')
  @ApiOperation({
    summary: 'Get the accounting dashboard overview',
    description:
      'Balances by account type, revenue summary (today/month/year), a revenue time series, account balances ranked descending and balances by currency, top bank accounts by type, and top clients by revenue.',
  })
  @ApiQuery({
    name: 'period',
    required: false,
    description: 'Granularity for the revenue time series. Defaults to daily.',
    example: 'daily',
  })
  @ApiOkResponse({
    description: 'Dashboard overview returned',
    type: DashboardOverviewResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Authentication required' })
  @ApiResponse({ status: 403, description: 'CEO or ACCOUNTANT role required' })
  async getOverview(
    @Req() req: WorkspaceRequest,
    @Query() query: DashboardOverviewQueryDto,
  ): Promise<ApiRes<DashboardOverview>> {
    const overview = await this.dashboardService.getOverview(
      req.workspaceContext.workspaceId,
      (query as DashboardOverviewQuery).period,
    );
    return ok(overview);
  }

  @Get('daily-report')
  @ApiOperation({
    summary: 'Get a live-computed report for a single date',
    description:
      "Revenue and sales count for that date, current account balances, and that date's client payments. Not a frozen snapshot — recomputed live every time.",
  })
  @ApiQuery({
    name: 'date',
    required: true,
    description: 'YYYY-MM-DD',
    example: '2026-07-28',
  })
  @ApiOkResponse({
    description: 'Daily report returned',
    type: DailyReportResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Authentication required' })
  @ApiResponse({ status: 403, description: 'CEO or ACCOUNTANT role required' })
  async getDailyReport(
    @Req() req: WorkspaceRequest,
    @Query() query: DailyReportQueryDto,
  ): Promise<ApiRes<DailyReport>> {
    const report = await this.dashboardService.getDailyReport(
      req.workspaceContext.workspaceId,
      (query as DailyReportQuery).date,
    );
    return ok(report);
  }

  @Get('monthly-breakdown')
  @ApiOperation({
    summary: 'Get a month-by-month revenue breakdown for one calendar year',
    description:
      'Exactly 12 points, January through December of the given year — unlike /overview?period=yearly, which buckets by year, not by month.',
  })
  @ApiQuery({
    name: 'year',
    required: true,
    description: 'Calendar year',
    example: 2026,
  })
  @ApiOkResponse({
    description: 'Monthly breakdown returned',
    type: MonthlyBreakdownResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Authentication required' })
  @ApiResponse({ status: 403, description: 'CEO or ACCOUNTANT role required' })
  async getMonthlyBreakdown(
    @Req() req: WorkspaceRequest,
    @Query() query: MonthlyBreakdownQueryDto,
  ): Promise<ApiRes<MonthlyBreakdown>> {
    const breakdown = await this.dashboardService.getMonthlyBreakdownForYear(
      req.workspaceContext.workspaceId,
      (query as MonthlyBreakdownQuery).year,
    );
    return ok(breakdown);
  }

  @Get('search')
  @ApiOperation({
    summary: 'Global search across clients and transactions',
    description:
      'Matches client name, and transaction reference ID/client name/description. Returns up to 5 of each — for the dashboard search bar, not paginated.',
  })
  @ApiQuery({
    name: 'q',
    required: true,
    description: 'Search text',
    example: 'Acme',
  })
  @ApiOkResponse({
    description: 'Matching clients and transactions returned',
    type: DashboardSearchResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Authentication required' })
  @ApiResponse({ status: 403, description: 'CEO or ACCOUNTANT role required' })
  async search(
    @Req() req: WorkspaceRequest,
    @Query() query: DashboardSearchQueryDto,
  ): Promise<ApiRes<DashboardSearchResult>> {
    const result = await this.dashboardService.search(
      req.workspaceContext.workspaceId,
      (query as DashboardSearchQuery).q,
    );
    return ok(result);
  }
}
