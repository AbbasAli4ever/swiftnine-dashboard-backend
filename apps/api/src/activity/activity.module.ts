import { Module } from '@nestjs/common';
import { DatabaseModule } from '@app/database';
import { ActivityController } from './activity.controller';
import { ActivityService } from './activity.service';
import { ProjectSecurityModule } from '../project-security/project-security.module';

@Module({
  imports: [DatabaseModule, ProjectSecurityModule],
  controllers: [ActivityController],
  providers: [ActivityService],
  exports: [ActivityService],
})
export class ActivityModule {}
