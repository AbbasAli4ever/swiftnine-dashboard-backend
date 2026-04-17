import { Module } from '@nestjs/common';
import { StatusController } from './status.controller';
import { StatusService } from './status.service';
import { WorkspaceModule } from '../workspace/workspace.module';

@Module({
  imports: [WorkspaceModule],
  controllers: [StatusController],
  providers: [StatusService],
})
export class StatusModule {}
