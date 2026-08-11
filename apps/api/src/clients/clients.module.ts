import { Module } from '@nestjs/common';
import { WorkspaceModule } from '../workspace/workspace.module';
import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';

@Module({
  imports: [WorkspaceModule],
  controllers: [ClientsController],
  providers: [ClientsService],
  exports: [ClientsService],
})
export class ClientsModule {}
