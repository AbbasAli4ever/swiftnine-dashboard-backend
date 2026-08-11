import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsUUID } from 'class-validator';

export enum MemberAccountingRole {
  ACCOUNTANT = 'ACCOUNTANT',
  CEO = 'CEO',
}

const ACCOUNTING_ROLE_VALUES: Array<MemberAccountingRole | null> = [
  ...Object.values(MemberAccountingRole),
  null,
];

export class ChangeMemberAccountingRoleDto {
  @ApiProperty({ example: 'cc6c4f04-6cae-4d0a-a3cb-864d53f92f29' })
  @IsUUID()
  workspaceId!: string;

  @ApiProperty({
    example: 'ACCOUNTANT',
    enum: ['ACCOUNTANT', 'CEO', null],
    nullable: true,
    description:
      'Set to null to remove accounting access entirely. Independent of the workspace role (OWNER/ADMIN/MEMBER).',
  })
  @IsIn(ACCOUNTING_ROLE_VALUES)
  accountingRole!: MemberAccountingRole | null;
}
