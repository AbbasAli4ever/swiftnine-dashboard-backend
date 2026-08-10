import { ApiProperty } from '@nestjs/swagger';

export class LogoPresignResponseDto {
  @ApiProperty({
    example:
      'https://public-data-swiftnine.s3.us-east-1.amazonaws.com/accounts_dashboard_assets/bank-logos/abc123-hbl-logo.png?X-Amz-Signature=...',
    description:
      'PUT the file bytes to this URL directly — it expires shortly.',
  })
  uploadUrl!: string;

  @ApiProperty({
    example:
      'https://public-data-swiftnine.s3.us-east-1.amazonaws.com/accounts_dashboard_assets/bank-logos/abc123-hbl-logo.png',
    description:
      'Permanent public URL — pass this as logoUrl on POST/PATCH /bank-accounts once the upload completes.',
  })
  logoUrl!: string;

  @ApiProperty({ example: 900, description: 'Seconds until uploadUrl expires' })
  expiresIn!: number;
}
