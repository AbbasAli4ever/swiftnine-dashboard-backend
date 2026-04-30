import { Module } from '@nestjs/common';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { WorkspaceModule } from '../workspace/workspace.module';
import { RolesModule } from '../roles/roles.module';
import { FavoritesModule } from '../favorites/favorites.module';

@Module({
  imports: [WorkspaceModule, RolesModule, FavoritesModule],
  controllers: [ProjectController],
  providers: [ProjectService],
})
export class ProjectModule {}
