import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { WorkspaceModule } from '../workspace/workspace.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { RolesModule } from '../roles/roles.module';

@Module({
  imports: [AuthModule, WorkspaceModule, RolesModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
