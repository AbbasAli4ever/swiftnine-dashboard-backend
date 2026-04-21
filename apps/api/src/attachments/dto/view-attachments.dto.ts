import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class ViewAttachmentsDto {
  @ApiProperty({ example: '2f9c1b8a-3b4a-4f3d-9b2a-1234567890ab' })
  @IsUUID()
  taskId!: string;

  @ApiProperty({ example: 'cc6c4f04-6cae-4d0a-a3cb-864d53f92f29' })
  @IsUUID()
  memberId!: string;
}
