import { Module } from '@nestjs/common';
import { CommonModule } from '@app/common';
import { AuthModule } from '../auth/auth.module';
import { WorkspaceController } from './workspace.controller';
import { OrganizationsController } from './organizations.controller';
import { WorkspaceService } from './workspace.service';
import { WorkspaceGuard } from './workspace.guard';
import { RolesModule } from '../roles/roles.module';

@Module({
  imports: [CommonModule, AuthModule, RolesModule],
  controllers: [WorkspaceController, OrganizationsController],
  providers: [WorkspaceService, WorkspaceGuard],
  exports: [WorkspaceGuard],
})
export class WorkspaceModule {}
