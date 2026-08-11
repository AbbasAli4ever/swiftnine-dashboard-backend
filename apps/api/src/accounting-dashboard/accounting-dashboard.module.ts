import { Module } from '@nestjs/common';
import { WorkspaceModule } from '../workspace/workspace.module';
import { AccountingDashboardService } from './accounting-dashboard.service';
import { AccountingDashboardController } from './accounting-dashboard.controller';

@Module({
  imports: [WorkspaceModule],
  controllers: [AccountingDashboardController],
  providers: [AccountingDashboardService],
  exports: [AccountingDashboardService],
})
export class AccountingDashboardModule {}
