import {
  Controller,
  Get,
  Query,
  Req,
  StreamableFile,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiProduces,
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
  type ReportsBreakdown,
} from './accounting-dashboard.service';
import { ReportExportService } from './report-export.service';
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
import {
  ReportsBreakdownQueryDto,
  type ReportsBreakdownQuery,
} from './dto/reports-breakdown-query.dto';
import { ReportsBreakdownResponseDto } from './dto/reports-breakdown-response.dto';
import {
  ExportReportQueryDto,
  type ExportReportQuery,
} from './dto/export-report-query.dto';

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
  constructor(
    private readonly dashboardService: AccountingDashboardService,
    private readonly reportExport: ReportExportService,
  ) {}

  @Get('overview')
  @ApiOperation({
    summary: 'Get the accounting dashboard overview',
    description:
      'Balances by account type, revenue summary (today/month/year), a revenue time series, revenue by bank account and by currency (both scoped to `period` — see below), current balances by account, and top clients by all-time revenue.',
  })
  @ApiQuery({
    name: 'period',
    required: false,
    description:
      'Controls two things: the bucket granularity of the revenue time series, and the window revenueByBankAccount and revenueByCurrency are scoped to — today (daily), the trailing 7 days (weekly), month-to-date (monthly), or year-to-date (yearly). Defaults to daily.',
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

  @Get('reports/breakdown')
  @ApiOperation({
    summary: 'Get revenue breakdowns scoped to a date range',
    description:
      'Revenue by bank account, by currency, and top clients — all scoped to [dateFrom, dateTo] instead of all-time. Pass the same date for both to get a single day; a full month or year covers Monthly/Yearly Reports.',
  })
  @ApiQuery({
    name: 'dateFrom',
    required: true,
    description: 'YYYY-MM-DD',
    example: '2026-07-01',
  })
  @ApiQuery({
    name: 'dateTo',
    required: true,
    description: 'YYYY-MM-DD',
    example: '2026-07-31',
  })
  @ApiOkResponse({
    description: 'Reports breakdown returned',
    type: ReportsBreakdownResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Authentication required' })
  @ApiResponse({ status: 403, description: 'CEO or ACCOUNTANT role required' })
  async getReportsBreakdown(
    @Req() req: WorkspaceRequest,
    @Query() query: ReportsBreakdownQueryDto,
  ): Promise<ApiRes<ReportsBreakdown>> {
    const { dateFrom, dateTo } = query as ReportsBreakdownQuery;
    const breakdown = await this.dashboardService.getReportsBreakdown(
      req.workspaceContext.workspaceId,
      dateFrom,
      dateTo,
    );
    return ok(breakdown);
  }

  @Get('reports/export')
  @ApiOperation({
    summary: 'Export an accounting report as an .xlsx workbook',
    description:
      'Pass a single `date` (defaults to today, UTC) for a one-day report, or `dateFrom`/`dateTo` together for a range — never both. Four sheets: Transactions, Sales Summary (one row per day for a range, plus a Total row), Balances by Account (current, not as of the period), and Revenue Breakdown by currency and bank account.',
  })
  @ApiQuery({
    name: 'date',
    required: false,
    description:
      'YYYY-MM-DD, defaults to today (UTC). Omit if using dateFrom/dateTo instead.',
    example: '2026-07-28',
  })
  @ApiQuery({
    name: 'dateFrom',
    required: false,
    description:
      'YYYY-MM-DD, start of a range. Must be paired with dateTo; capped at 400 days apart.',
    example: '2026-07-01',
  })
  @ApiQuery({
    name: 'dateTo',
    required: false,
    description: 'YYYY-MM-DD, end of a range. Must be paired with dateFrom.',
    example: '2026-07-31',
  })
  @ApiProduces(
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  )
  @ApiResponse({ status: 401, description: 'Authentication required' })
  @ApiResponse({ status: 403, description: 'CEO or ACCOUNTANT role required' })
  async exportReport(
    @Req() req: WorkspaceRequest,
    @Query() query: ExportReportQueryDto,
  ): Promise<StreamableFile> {
    const { date, dateFrom, dateTo } = query as ExportReportQuery;
    const today = new Date().toISOString().slice(0, 10);
    const resolvedFrom = dateFrom ?? date ?? today;
    const resolvedTo = dateTo ?? date ?? today;

    const data = await this.dashboardService.getExportData(
      req.workspaceContext.workspaceId,
      resolvedFrom,
      resolvedTo,
    );
    const buffer = await this.reportExport.buildReportWorkbook(data);
    const filenameDate =
      resolvedFrom === resolvedTo
        ? resolvedFrom
        : `${resolvedFrom}_to_${resolvedTo}`;
    return new StreamableFile(buffer, {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      disposition: `attachment; filename="accounting-report-${filenameDate}.xlsx"`,
    });
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
