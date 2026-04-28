import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class DeleteDocAttachmentDto {
  @ApiProperty({ example: '2f9c1b8a-3b4a-4f3d-9b2a-1234567890ab' })
  @IsUUID()
  docId!: string;

  @ApiProperty({ example: 'attachments/doc-uuid/abc123-screenshot.png' })
  @IsString()
  s3Key!: string;
}
