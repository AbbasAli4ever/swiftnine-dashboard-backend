import { Module } from '@nestjs/common';
import { WorkspaceModule } from '../workspace/workspace.module';
import { ExchangeRateModule } from '../exchange-rate/exchange-rate.module';
import { AccountingDashboardService } from './accounting-dashboard.service';
import { AccountingDashboardController } from './accounting-dashboard.controller';
import { ReportExportService } from './report-export.service';
import { ReportPdfService } from './report-pdf.service';

@Module({
  imports: [WorkspaceModule, ExchangeRateModule],
  controllers: [AccountingDashboardController],
  providers: [
    AccountingDashboardService,
    ReportExportService,
    ReportPdfService,
  ],
  exports: [AccountingDashboardService],
})
export class AccountingDashboardModule {}
