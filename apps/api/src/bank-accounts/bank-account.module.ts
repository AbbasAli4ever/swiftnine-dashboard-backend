import { Module } from '@nestjs/common';
import { CommonModule } from '@app/common';
import { WorkspaceModule } from '../workspace/workspace.module';
import { BankAccountService } from './bank-account.service';
import { BankAccountController } from './bank-account.controller';

@Module({
  imports: [CommonModule, WorkspaceModule],
  controllers: [BankAccountController],
  providers: [BankAccountService],
  exports: [BankAccountService],
})
export class BankAccountModule {}
