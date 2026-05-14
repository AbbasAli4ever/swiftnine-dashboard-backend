import { Module } from '@nestjs/common';
import { TimeEntryService } from './time-entry.service';
import { TimeEntryController } from './time-entry.controller';
import { TimeEntryManageController } from './time-entry-manage.controller';
import { ProjectSecurityModule } from '../project-security/project-security.module';

@Module({
  imports: [ProjectSecurityModule],
  controllers: [TimeEntryController, TimeEntryManageController],
  providers: [TimeEntryService],
})
export class TimeEntryModule {}
