import { Module } from '@nestjs/common';
import { WorkspaceModule } from '../workspace/workspace.module';
import { EmployeesService } from './employees.service';
import { EmployeesController } from './employees.controller';
import { ExchangeRateModule } from '../exchange-rate/exchange-rate.module';

@Module({
  imports: [WorkspaceModule, ExchangeRateModule],
  controllers: [EmployeesController],
  providers: [EmployeesService],
  exports: [EmployeesService],
})
export class EmployeesModule {}
