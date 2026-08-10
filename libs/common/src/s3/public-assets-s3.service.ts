import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const DEFAULT_PRESIGN_EXPIRES_IN_SECONDS = 60 * 15;

/**
 * S3 boundary for the separate, publicly-readable assets bucket (bank
 * logos, etc.) — distinct bucket and credentials from `S3Service`, which
 * is scoped to the private attachments/docs bucket. Objects here are
 * expected to be served back via a permanent public URL, not a signed one.
 */
@Injectable()
export class PublicAssetsS3Service {
  private readonly client: S3Client;

  constructor(private readonly config: ConfigService) {
    this.client = new S3Client({
      region: this.config.get<string>('PUBLIC_ASSETS_AWS_REGION'),
      credentials: {
        accessKeyId:
          this.config.get<string>('PUBLIC_ASSETS_AWS_ACCESS_KEY_ID') ?? '',
        secretAccessKey:
          this.config.get<string>('PUBLIC_ASSETS_AWS_SECRET_ACCESS_KEY') ?? '',
      },
      requestChecksumCalculation: 'WHEN_REQUIRED',
      responseChecksumValidation: 'WHEN_REQUIRED',
    });
  }

  get bucket(): string {
    const bucket = this.config.get<string>('PUBLIC_ASSETS_AWS_S3_BUCKET');
    if (!bucket) {
      throw new InternalServerErrorException(
        'Public assets S3 bucket is not configured',
      );
    }
    return bucket;
  }

  get region(): string {
    const region = this.config.get<string>('PUBLIC_ASSETS_AWS_REGION');
    if (!region) {
      throw new InternalServerErrorException(
        'Public assets S3 region is not configured',
      );
    }
    return region;
  }

  basePrefix(): string {
    const raw =
      this.config.get<string>('PUBLIC_ASSETS_AWS_S3_PREFIX') ??
      'accounts_dashboard_assets';
    return raw.replace(/^\/+|\/+$/g, '');
  }

  buildKey(...segments: string[]): string {
    return segments
      .map((segment) => segment.replace(/^\/+|\/+$/g, ''))
      .filter(Boolean)
      .join('/');
  }

  async createPresignedPutUrl(
    key: string,
    expiresInSeconds: number = DEFAULT_PRESIGN_EXPIRES_IN_SECONDS,
  ): Promise<string> {
    const command = new PutObjectCommand({ Bucket: this.bucket, Key: key });
    return getSignedUrl(this.client, command, { expiresIn: expiresInSeconds });
  }

  /** Permanent public URL for an object in this bucket — relies on the
   * bucket itself being configured for public read access (bucket policy),
   * not on a signed URL, since these assets don't expire. */
  getPublicUrl(key: string): string {
    return `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`;
  }
}
