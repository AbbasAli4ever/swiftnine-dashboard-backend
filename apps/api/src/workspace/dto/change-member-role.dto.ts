import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsUUID } from 'class-validator';

export enum MemberRole {
  OWNER = 'OWNER',
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
