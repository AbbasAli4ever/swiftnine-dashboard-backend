"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AI_ATTACHMENT_SELECT = exports.AI_ATTACHMENT_PRESIGN_EXPIRES_IN_SECONDS = exports.MAX_FILE_SIZE_BY_CONTENT_TYPE = exports.ALLOWED_MIME_TYPES_BY_CONTENT_TYPE = exports.CONTENT_TYPE_TO_WIRE = exports.WIRE_TO_CONTENT_TYPE = exports.WIRE_ATTACHMENT_TYPES = exports.AI_ATTACHMENT_KEY_PREFIX = exports.AI_ATTACHMENT_NOT_FOUND = void 0;
const client_1 = require("../../../../libs/database/src/generated/prisma/client");
exports.AI_ATTACHMENT_NOT_FOUND = 'Attachment not found';
exports.AI_ATTACHMENT_KEY_PREFIX = 'ai-attachments';
exports.WIRE_ATTACHMENT_TYPES = [
    'image',
    'pdf',
    'ppt',
    'excel',
    'csv',
    'document',
    'code',
    'text',
    'generated-image',
    'generated-pdf',
    'generated-ppt',
];
exports.WIRE_TO_CONTENT_TYPE = {
    image: client_1.AttachmentContentType.IMAGE,
    pdf: client_1.AttachmentContentType.PDF,
    ppt: client_1.AttachmentContentType.PPT,
    excel: client_1.AttachmentContentType.EXCEL,
    csv: client_1.AttachmentContentType.CSV,
    document: client_1.AttachmentContentType.DOCUMENT,
    code: client_1.AttachmentContentType.CODE,
    text: client_1.AttachmentContentType.TEXT,
    'generated-image': client_1.AttachmentContentType.GENERATED_IMAGE,
    'generated-pdf': client_1.AttachmentContentType.GENERATED_PDF,
    'generated-ppt': client_1.AttachmentContentType.GENERATED_PPT,
};
exports.CONTENT_TYPE_TO_WIRE = Object.fromEntries(Object.entries(exports.WIRE_TO_CONTENT_TYPE).map(([wire, contentType]) => [contentType, wire]));
const MB = 1024 * 1024;
exports.ALLOWED_MIME_TYPES_BY_CONTENT_TYPE = {
    [client_1.AttachmentContentType.IMAGE]: [
        'image/png',
        'image/jpeg',
        'image/gif',
        'image/webp',
        'image/svg+xml',
    ],
    [client_1.AttachmentContentType.GENERATED_IMAGE]: [
        'image/png',
        'image/jpeg',
        'image/gif',
        'image/webp',
        'image/svg+xml',
    ],
    [client_1.AttachmentContentType.PDF]: ['application/pdf'],
    [client_1.AttachmentContentType.GENERATED_PDF]: ['application/pdf'],
    [client_1.AttachmentContentType.PPT]: [
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    ],
    [client_1.AttachmentContentType.GENERATED_PPT]: [
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    ],
    [client_1.AttachmentContentType.EXCEL]: [
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ],
    [client_1.AttachmentContentType.CSV]: ['text/csv', 'application/csv'],
    [client_1.AttachmentContentType.DOCUMENT]: [
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/rtf',
    ],
    [client_1.AttachmentContentType.CODE]: [
        'text/plain',
        'text/x-python',
        'text/x-c',
        'text/x-java-source',
        'application/json',
        'application/javascript',
        'text/javascript',
        'application/x-typescript',
        'application/zip',
        'application/x-zip-compressed',
    ],
    [client_1.AttachmentContentType.TEXT]: ['text/plain', 'text/markdown'],
};
exports.MAX_FILE_SIZE_BY_CONTENT_TYPE = {
    [client_1.AttachmentContentType.IMAGE]: 20 * MB,
    [client_1.AttachmentContentType.GENERATED_IMAGE]: 20 * MB,
    [client_1.AttachmentContentType.PDF]: 50 * MB,
    [client_1.AttachmentContentType.GENERATED_PDF]: 50 * MB,
    [client_1.AttachmentContentType.PPT]: 50 * MB,
    [client_1.AttachmentContentType.GENERATED_PPT]: 50 * MB,
    [client_1.AttachmentContentType.EXCEL]: 50 * MB,
    [client_1.AttachmentContentType.CSV]: 10 * MB,
    [client_1.AttachmentContentType.DOCUMENT]: 25 * MB,
    [client_1.AttachmentContentType.CODE]: 5 * MB,
    [client_1.AttachmentContentType.TEXT]: 5 * MB,
};
exports.AI_ATTACHMENT_PRESIGN_EXPIRES_IN_SECONDS = 60 * 15;
exports.AI_ATTACHMENT_SELECT = {
    id: true,
    aiConversationId: true,
    aiConversationMessageId: true,
    fileName: true,
    mimeType: true,
    fileSize: true,
    s3Key: true,
    contentType: true,
    uploadStatus: true,
    createdAt: true,
};
//# sourceMappingURL=ai-attachments.constants.js.map