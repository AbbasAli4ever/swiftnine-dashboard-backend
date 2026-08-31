import { Module } from '@nestjs/common';
import { WorkspaceModule } from '../workspace/workspace.module';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { ExchangeRateModule } from '../exchange-rate/exchange-rate.module';

@Module({
  imports: [WorkspaceModule, ExchangeRateModule],
  controllers: [TransactionController],
  providers: [TransactionService],
  exports: [TransactionService],
})
export class TransactionModule {}
