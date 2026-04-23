import { Module } from '@nestjs/common';
import { DatabaseModule } from '@app/database';
import { RolesGuard } from './roles.guard';

@Module({
  imports: [DatabaseModule],
  providers: [RolesGuard],
  exports: [RolesGuard],
})
export class RolesModule {}
