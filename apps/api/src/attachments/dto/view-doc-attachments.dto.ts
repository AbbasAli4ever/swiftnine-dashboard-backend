import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class ViewDocAttachmentsDto {
  @ApiProperty({ example: '2f9c1b8a-3b4a-4f3d-9b2a-1234567890ab' })
  @IsUUID()
  docId!: string;
}
