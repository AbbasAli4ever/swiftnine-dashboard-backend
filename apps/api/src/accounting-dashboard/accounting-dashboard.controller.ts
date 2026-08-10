import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ok, type ApiResponse as ApiRes } from '@app/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RequireUserRole, UserRoleGuard } from '../auth/guards/user-role.guard';
import {
  AccountingDashboardService,
  type DashboardOverview,
  type DashboardSearchResult,
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

@ApiTags('accounting-dashboard')
@ApiBearerAuth()
@Controller('accounting-dashboard')
@UseGuards(JwtAuthGuard, UserRoleGuard)
@RequireUserRole('CEO', 'ACCOUNTANT')
export class AccountingDashboardController {
  constructor(private readonly dashboardService: AccountingDashboardService) {}

  @Get('overview')
  @ApiOperation({
    summary: 'Get the accounting dashboard overview',
    description:
      'Balances by account type, revenue summary (today/month/year), a revenue time series, revenue by payment platform and by currency, top bank accounts by type, and top clients by revenue.',
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
    @Query() query: DashboardOverviewQueryDto,
  ): Promise<ApiRes<DashboardOverview>> {
    const overview = await this.dashboardService.getOverview(
      (query as DashboardOverviewQuery).period,
    );
    return ok(overview);
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
    @Query() query: DashboardSearchQueryDto,
  ): Promise<ApiRes<DashboardSearchResult>> {
    const result = await this.dashboardService.search(
      (query as DashboardSearchQuery).q,
    );
    return ok(result);
  }
}
