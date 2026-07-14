import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const DEFAULT_PRESIGN_EXPIRES_IN_SECONDS = 60 * 15;

export interface ResolvedFileMetadata {
  fileName: string;
  mimeType: string;
  fileSize: bigint;
}

/**
 * Shared S3 boundary for presigned upload/download flows across the app.
 * Generalizes the key/prefix/HEAD-fallback helpers that were previously
 * duplicated inline inside `AttachmentsService`.
 */
@Injectable()
export class S3Service {
  private readonly client: S3Client;

  constructor(private readonly config: ConfigService) {
    this.client = new S3Client({
      region: this.config.get<string>('AWS_REGION'),
      credentials: {
        accessKeyId: this.config.get<string>('AWS_ACCESS_KEY_ID') ?? '',
        secretAccessKey: this.config.get<string>('AWS_SECRET_ACCESS_KEY') ?? '',
      },
      // Keep presigned URLs free of optional checksum query params. Some HTTP
      // clients rewrite these params and invalidate signatures.
      requestChecksumCalculation: 'WHEN_REQUIRED',
      responseChecksumValidation: 'WHEN_REQUIRED',
    });
  }

  get bucket(): string {
    const bucket = this.config.get<string>('AWS_S3_BUCKET');
    if (!bucket) throw new InternalServerErrorException('S3 bucket is not configured');
    return bucket;
  }

  basePrefix(): string {
    const raw = this.config.get<string>('AWS_S3_PREFIX') ?? 'swiftnine/docs/app';
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
    // ContentType is deliberately omitted from the signed request to avoid
    // signature mismatches caused by the client sending a different
    // Content-Type header than what was signed.
    const command = new PutObjectCommand({ Bucket: this.bucket, Key: key });
    return getSignedUrl(this.client, command, { expiresIn: expiresInSeconds });
  }

  async createPresignedGetUrl(
    key: string,
    expiresInSeconds: number = DEFAULT_PRESIGN_EXPIRES_IN_SECONDS,
  ): Promise<string> {
    const command = new GetObjectCommand({ Bucket: this.bucket, Key: key });
    return getSignedUrl(this.client, command, { expiresIn: expiresInSeconds });
  }

  async headObject(key: string) {
    try {
      const result = await this.client.send(
        new HeadObjectCommand({ Bucket: this.bucket, Key: key }),
      );
      return {
        contentLength: result.ContentLength ?? undefined,
        contentType: result.ContentType ?? undefined,
        metadata: result.Metadata,
      };
    } catch {
      throw new InternalServerErrorException('Failed to fetch S3 object metadata');
    }
  }

  async getObjectBody(key: string): Promise<Buffer> {
    const result = await this.client.send(new GetObjectCommand({ Bucket: this.bucket, Key: key }));
    if (!result.Body) throw new InternalServerErrorException('S3 object has no body');
    return Buffer.from(await result.Body.transformToByteArray());
  }

  async deleteObject(key: string): Promise<void> {
    await this.client.send(new DeleteObjectCommand({ Bucket: this.bucket, Key: key }));
  }

  /** Direct upload for content the backend already holds in-process (e.g. a
   * rendered PDF/PPT buffer) — as opposed to the presigned-PUT methods above,
   * which are for a client to upload against. */
  async putObject(key: string, body: Buffer, contentType: string): Promise<void> {
    await this.client.send(
      new PutObjectCommand({ Bucket: this.bucket, Key: key, Body: body, ContentType: contentType })
    );
  }

  /**
   * No public bucket/CDN is configured today — every read path in this app
   * uses short-lived signed GET URLs. Reserved for a future
   * AWS_S3_PUBLIC_BASE_URL-backed setup.
   */
  getPublicUrl(key: string): string | null {
    const publicBase = this.config.get<string>('AWS_S3_PUBLIC_BASE_URL');
    if (!publicBase) return null;
    return `${publicBase.replace(/\/+$/, '')}/${key}`;
  }

  validateMimeType(mimeType: string, allowed: readonly string[]): void {
    if (!allowed.includes(mimeType)) {
      throw new BadRequestException(`Unsupported file type: ${mimeType}`);
    }
  }

  validateFileSize(fileSize: number, maxBytes: number): void {
    if (fileSize > maxBytes) {
      throw new BadRequestException(
        `File is too large: ${fileSize} bytes exceeds the ${maxBytes} byte limit`,
      );
    }
  }

  assertKeyWithinPrefix(key: string, expectedPrefix: string): void {
    const normalizedPrefix = expectedPrefix.endsWith('/')
      ? expectedPrefix
      : `${expectedPrefix}/`;
    if (!key.startsWith(normalizedPrefix)) {
      throw new BadRequestException('S3 key does not belong to the expected scope');
    }
  }

  async resolveUploadedFileMetadata(
    key: string,
    fileName?: string,
    mimeType?: string,
    fileSize?: number,
  ): Promise<ResolvedFileMetadata> {
    let resolvedFileName = fileName ?? key.split('/').pop() ?? key;
    let resolvedMimeType = mimeType ?? 'application/octet-stream';
    let resolvedFileSize: bigint;

    if (fileSize !== undefined) {
      resolvedFileSize = BigInt(fileSize);
    } else {
      const head = await this.headObject(key);
      if (head.contentLength === undefined) {
        throw new InternalServerErrorException('Unable to determine file size from S3 metadata');
      }
      resolvedFileSize = BigInt(head.contentLength);
      resolvedMimeType = head.contentType ?? resolvedMimeType;
      if (!fileName && head.metadata && Object.keys(head.metadata).length > 0) {
        const possibleName =
          head.metadata['filename'] || head.metadata['file-name'] || head.metadata['originalname'];
        if (possibleName) resolvedFileName = possibleName;
      }
    }

    return {
      fileName: resolvedFileName,
      mimeType: resolvedMimeType,
      fileSize: resolvedFileSize,
    };
  }
}
