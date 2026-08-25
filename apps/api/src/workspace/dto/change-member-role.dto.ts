import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsUUID } from 'class-validator';

// MANAGER or MEMBER only — never OWNER. An existing member can be promoted
// to MANAGER or demoted to MEMBER, but OWNER is set exactly once, at
// workspace creation, and is never granted again through any path (this was
// the last of three places that used to allow it — see the 2026-08-25
// workspace-role follow-up in docs/accounting-workspace-migration-changes.md).
export enum MemberRole {
  MANAGER = 'MANAGER',
  MEMBER = 'MEMBER',
}

export class ChangeMemberRoleDto {
  @ApiProperty({ example: 'cc6c4f04-6cae-4d0a-a3cb-864d53f92f29' })
  @IsUUID()
  workspaceId!: string;

  @ApiProperty({ example: 'MEMBER', enum: MemberRole })
  @IsEnum(MemberRole)
  role!: MemberRole;
}
