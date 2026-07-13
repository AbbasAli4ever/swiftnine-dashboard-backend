"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3Service = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const DEFAULT_PRESIGN_EXPIRES_IN_SECONDS = 60 * 15;
let S3Service = class S3Service {
    config;
    client;
    constructor(config) {
        this.config = config;
        this.client = new client_s3_1.S3Client({
            region: this.config.get('AWS_REGION'),
            credentials: {
                accessKeyId: this.config.get('AWS_ACCESS_KEY_ID') ?? '',
                secretAccessKey: this.config.get('AWS_SECRET_ACCESS_KEY') ?? '',
            },
            requestChecksumCalculation: 'WHEN_REQUIRED',
            responseChecksumValidation: 'WHEN_REQUIRED',
        });
    }
    get bucket() {
        const bucket = this.config.get('AWS_S3_BUCKET');
        if (!bucket)
            throw new common_1.InternalServerErrorException('S3 bucket is not configured');
        return bucket;
    }
    basePrefix() {
        const raw = this.config.get('AWS_S3_PREFIX') ?? 'swiftnine/docs/app';
        return raw.replace(/^\/+|\/+$/g, '');
    }
    buildKey(...segments) {
        return segments
            .map((segment) => segment.replace(/^\/+|\/+$/g, ''))
            .filter(Boolean)
            .join('/');
    }
    async createPresignedPutUrl(key, expiresInSeconds = DEFAULT_PRESIGN_EXPIRES_IN_SECONDS) {
        const command = new client_s3_1.PutObjectCommand({ Bucket: this.bucket, Key: key });
        return (0, s3_request_presigner_1.getSignedUrl)(this.client, command, { expiresIn: expiresInSeconds });
    }
    async createPresignedGetUrl(key, expiresInSeconds = DEFAULT_PRESIGN_EXPIRES_IN_SECONDS) {
        const command = new client_s3_1.GetObjectCommand({ Bucket: this.bucket, Key: key });
        return (0, s3_request_presigner_1.getSignedUrl)(this.client, command, { expiresIn: expiresInSeconds });
    }
    async headObject(key) {
        try {
            const result = await this.client.send(new client_s3_1.HeadObjectCommand({ Bucket: this.bucket, Key: key }));
            return {
                contentLength: result.ContentLength ?? undefined,
                contentType: result.ContentType ?? undefined,
                metadata: result.Metadata,
            };
        }
        catch {
            throw new common_1.InternalServerErrorException('Failed to fetch S3 object metadata');
        }
    }
    async deleteObject(key) {
        await this.client.send(new client_s3_1.DeleteObjectCommand({ Bucket: this.bucket, Key: key }));
    }
    async putObject(key, body, contentType) {
        await this.client.send(new client_s3_1.PutObjectCommand({ Bucket: this.bucket, Key: key, Body: body, ContentType: contentType }));
    }
    getPublicUrl(key) {
        const publicBase = this.config.get('AWS_S3_PUBLIC_BASE_URL');
        if (!publicBase)
            return null;
        return `${publicBase.replace(/\/+$/, '')}/${key}`;
    }
    validateMimeType(mimeType, allowed) {
        if (!allowed.includes(mimeType)) {
            throw new common_1.BadRequestException(`Unsupported file type: ${mimeType}`);
        }
    }
    validateFileSize(fileSize, maxBytes) {
        if (fileSize > maxBytes) {
            throw new common_1.BadRequestException(`File is too large: ${fileSize} bytes exceeds the ${maxBytes} byte limit`);
        }
    }
    assertKeyWithinPrefix(key, expectedPrefix) {
        const normalizedPrefix = expectedPrefix.endsWith('/')
            ? expectedPrefix
            : `${expectedPrefix}/`;
        if (!key.startsWith(normalizedPrefix)) {
            throw new common_1.BadRequestException('S3 key does not belong to the expected scope');
        }
    }
    async resolveUploadedFileMetadata(key, fileName, mimeType, fileSize) {
        let resolvedFileName = fileName ?? key.split('/').pop() ?? key;
        let resolvedMimeType = mimeType ?? 'application/octet-stream';
        let resolvedFileSize;
        if (fileSize !== undefined) {
            resolvedFileSize = BigInt(fileSize);
        }
        else {
            const head = await this.headObject(key);
            if (head.contentLength === undefined) {
                throw new common_1.InternalServerErrorException('Unable to determine file size from S3 metadata');
            }
            resolvedFileSize = BigInt(head.contentLength);
            resolvedMimeType = head.contentType ?? resolvedMimeType;
            if (!fileName && head.metadata && Object.keys(head.metadata).length > 0) {
                const possibleName = head.metadata['filename'] || head.metadata['file-name'] || head.metadata['originalname'];
                if (possibleName)
                    resolvedFileName = possibleName;
            }
        }
        return {
            fileName: resolvedFileName,
            mimeType: resolvedMimeType,
            fileSize: resolvedFileSize,
        };
    }
};
exports.S3Service = S3Service;
exports.S3Service = S3Service = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], S3Service);
//# sourceMappingURL=s3.service.js.map