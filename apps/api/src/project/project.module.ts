import { Module } from '@nestjs/common';
import { ProjectController } from './project.controller';
import { ProjectPasswordController } from './project-password.controller';
import { ProjectService } from './project.service';
import { WorkspaceModule } from '../workspace/workspace.module';
import { RolesModule } from '../roles/roles.module';
import { FavoritesModule } from '../favorites/favorites.module';
import { ProjectSecurityModule } from '../project-security/project-security.module';

@Module({
  imports: [WorkspaceModule, RolesModule, FavoritesModule, ProjectSecurityModule],
  controllers: [ProjectController, ProjectPasswordController],
  providers: [ProjectService],
})
export class ProjectModule {}
