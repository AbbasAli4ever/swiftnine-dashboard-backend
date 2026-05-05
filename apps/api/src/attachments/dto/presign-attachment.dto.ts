import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsUUID, IsIn, IsNumber } from 'class-validator';

export class PresignAttachmentDto {
  @ApiProperty({ example: 'channel-message', required: false })
  @IsOptional()
  @IsIn(['channel-message'])
  scope?: 'channel-message';

  @ApiProperty({ example: 'screenshot.png', required: false })
  @IsOptional()
  @IsString()
  fileName?: string;

  @ApiProperty({ example: 'image/png' })
  @IsString()
  mimeType!: string;

  @ApiProperty({
    example: '2f9c1b8a-3b4a-4f3d-9b2a-1234567890ab',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  taskId?: string;

  @ApiProperty({
    example: '2f9c1b8a-3b4a-4f3d-9b2a-1234567890ab',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  docId?: string;

  @ApiProperty({
    example: 'cc6c4f04-6cae-4d0a-a3cb-864d53f92f29',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  workspaceId?: string;

  @ApiProperty({
    example: 'cc6c4f04-6cae-4d0a-a3cb-864d53f92f29',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  channelId?: string;

  @ApiProperty({ example: 245000, required: false })
  @IsOptional()
  @IsNumber()
  fileSize?: number;
}
