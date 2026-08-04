import { Module } from '@nestjs/common';
import { AccountingDashboardService } from './accounting-dashboard.service';
import { AccountingDashboardController } from './accounting-dashboard.controller';

@Module({
  controllers: [AccountingDashboardController],
  providers: [AccountingDashboardService],
  exports: [AccountingDashboardService],
})
export class AccountingDashboardModule {}
