import { Module } from '@nestjs/common';
import { TimeEntryService } from './time-entry.service';
import { TimeEntryController } from './time-entry.controller';
import { TimeEntryManageController } from './time-entry-manage.controller';

@Module({
  controllers: [TimeEntryController, TimeEntryManageController],
  providers: [TimeEntryService],
})
export class TimeEntryModule {}
