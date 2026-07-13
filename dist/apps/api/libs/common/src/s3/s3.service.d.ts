import { ConfigService } from '@nestjs/config';
export interface ResolvedFileMetadata {
    fileName: string;
    mimeType: string;
    fileSize: bigint;
}
export declare class S3Service {
    private readonly config;
    private readonly client;
    constructor(config: ConfigService);
    get bucket(): string;
    basePrefix(): string;
    buildKey(...segments: string[]): string;
    createPresignedPutUrl(key: string, expiresInSeconds?: number): Promise<string>;
    createPresignedGetUrl(key: string, expiresInSeconds?: number): Promise<string>;
    headObject(key: string): Promise<{
        contentLength: number | undefined;
        contentType: string | undefined;
        metadata: Record<string, string> | undefined;
    }>;
    deleteObject(key: string): Promise<void>;
    putObject(key: string, body: Buffer, contentType: string): Promise<void>;
    getPublicUrl(key: string): string | null;
    validateMimeType(mimeType: string, allowed: readonly string[]): void;
    validateFileSize(fileSize: number, maxBytes: number): void;
    assertKeyWithinPrefix(key: string, expectedPrefix: string): void;
    resolveUploadedFileMetadata(key: string, fileName?: string, mimeType?: string, fileSize?: number): Promise<ResolvedFileMetadata>;
}
