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
} from './accounting-dashboard.service';
import {
  DashboardOverviewQueryDto,
  type DashboardOverviewQuery,
} from './dto/dashboard-overview-query.dto';
import { DashboardOverviewResponseDto } from './dto/dashboard-overview-response.dto';

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



  // @Get('/search')
  // async searchData(@Query query: string): <Promise>() {
  //   return await this.dashboardService.searchQueryData(query)
  // }


}
