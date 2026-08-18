import { Module } from '@nestjs/common';
import { WorkspaceModule } from '../workspace/workspace.module';
import { AccountingDashboardService } from './accounting-dashboard.service';
import { AccountingDashboardController } from './accounting-dashboard.controller';
import { ReportExportService } from './report-export.service';

@Module({
  imports: [WorkspaceModule],
  controllers: [AccountingDashboardController],
  providers: [AccountingDashboardService, ReportExportService],
  exports: [AccountingDashboardService],
})
export class AccountingDashboardModule {}
