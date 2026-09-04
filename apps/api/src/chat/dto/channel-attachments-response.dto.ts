import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ChannelAttachmentItemDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ example: 'attachments/channel-uuid/abc123-screenshot.png' })
  s3Key!: string;

  @ApiProperty({ example: 'screenshot.png' })
  fileName!: string;

  @ApiProperty({ example: 'image/png' })
  mimeType!: string;

  @ApiProperty({ example: 245000 })
  fileSize!: number;

  @ApiProperty({
    description:
      'Freshly-signed S3 GET URL, generated at request time — expires 15 minutes after this response, same as every other attachment view in this app. Re-call this endpoint to get a live one; do not cache/store this value.',
  })
  url!: string;

  @ApiProperty({
    description: 'When url stops working (15 minutes from issuance).',
  })
  expiresAt!: Date;

  @ApiPropertyOptional()
  createdAt?: Date;
}

export class ChannelAttachmentsResponseDto {
  @ApiProperty({ type: ChannelAttachmentItemDto, isArray: true })
  images!: ChannelAttachmentItemDto[];

  @ApiProperty({ type: ChannelAttachmentItemDto, isArray: true })
  videos!: ChannelAttachmentItemDto[];

  @ApiProperty({
    type: ChannelAttachmentItemDto,
    isArray: true,
    description:
      'Everything that is not an image or a video — PDFs, docs, spreadsheets, archives (zip/rar), anything else.',
  })
  files!: ChannelAttachmentItemDto[];
}
