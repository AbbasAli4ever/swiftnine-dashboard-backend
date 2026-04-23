import { Module } from '@nestjs/common';
import { DatabaseModule } from '@app/database';
import { ActivityController } from './activity.controller';
import { ActivityService } from './activity.service';

@Module({
  imports: [DatabaseModule],
  controllers: [ActivityController],
  providers: [ActivityService],
  exports: [ActivityService],
})
export class ActivityModule {}
