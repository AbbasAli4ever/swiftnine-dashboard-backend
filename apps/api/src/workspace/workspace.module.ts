import { Module } from '@nestjs/common';
import { CommonModule } from '@app/common';
import { WorkspaceController } from './workspace.controller';
import { WorkspaceService } from './workspace.service';
import { WorkspaceGuard } from './workspace.guard';

@Module({
  imports: [CommonModule],
  controllers: [WorkspaceController],
  providers: [WorkspaceService, WorkspaceGuard],
  exports: [WorkspaceGuard],
})
export class WorkspaceModule {}
