import { ApiProperty } from '@nestjs/swagger';

export class PresignAvatarResponseDto {
  @ApiProperty({
    description:
      'PUT the file bytes directly to this URL. No special headers are required (no ACL header), but set Content-Type to the same mimeType you presigned with — it is not part of the signed request, so it can be anything, but S3 stores whatever you send and serves it back on read; omit it and the object serves as a generic binary/octet-stream. This goes to the public-assets bucket (same one bank-account logos use), which is configured for public read at the bucket-policy level, not per-object.',
    example:
      'https://bucket.s3.region.amazonaws.com/accounts_dashboard_assets/avatars/...',
  })
  uploadUrl!: string;

  @ApiProperty({
    description: 'The object key the file was written to, for reference only.',
    example: 'accounts_dashboard_assets/avatars/<userId>/<uuid>.png',
  })
  s3Key!: string;

  @ApiProperty({
    description:
      "The permanent, publicly-readable URL the uploaded image will be reachable at once the PUT completes. Pass this straight into PATCH /user/profile's profilePicture field to actually set it as the avatar.",
    example:
      'https://bucket.s3.region.amazonaws.com/accounts_dashboard_assets/avatars/<userId>/<uuid>.png',
  })
  publicUrl!: string;

  @ApiProperty({
    description:
      'When uploadUrl stops accepting uploads (15 minutes from issuance).',
  })
  expiresAt!: Date;
}
