import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';

const ChannelMemberSchema = z.object({
  userId: z.string().uuid('Invalid userId'),
  role: z.enum(['admin', 'member']),
});

const BulkChannelMembersSchema = z.object({
  members: z.array(ChannelMemberSchema).min(1),
});

export class AddChannelMemberDto extends createZodDto(ChannelMemberSchema) {
  @ApiProperty({ format: 'uuid', description: 'User id to add to channel' })
  userId = '';

  @ApiProperty({ enum: ['admin', 'member'], description: 'Role to assign in channel' })
  role: 'admin' | 'member' = 'member';
}

export class BulkAddChannelMembersDto extends createZodDto(BulkChannelMembersSchema) {
  @ApiProperty({ type: AddChannelMemberDto, isArray: true })
  members: AddChannelMemberDto[] = [];
}
