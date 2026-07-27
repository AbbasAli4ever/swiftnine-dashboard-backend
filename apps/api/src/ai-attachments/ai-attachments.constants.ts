import { AttachmentContentType } from '@app/database/generated/prisma/client';

export const AI_ATTACHMENT_NOT_FOUND = 'Attachment not found';
export const AI_ATTACHMENT_KEY_PREFIX = 'ai-attachments';

export const WIRE_ATTACHMENT_TYPES = [
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
] as const;

export type WireAttachmentType = (typeof WIRE_ATTACHMENT_TYPES)[number];

export const WIRE_TO_CONTENT_TYPE: Record<WireAttachmentType, AttachmentContentType> = {
  image: AttachmentContentType.IMAGE,
  pdf: AttachmentContentType.PDF,
  ppt: AttachmentContentType.PPT,
  excel: AttachmentContentType.EXCEL,
  csv: AttachmentContentType.CSV,
  document: AttachmentContentType.DOCUMENT,
  code: AttachmentContentType.CODE,
  text: AttachmentContentType.TEXT,
  'generated-image': AttachmentContentType.GENERATED_IMAGE,
  'generated-pdf': AttachmentContentType.GENERATED_PDF,
  'generated-ppt': AttachmentContentType.GENERATED_PPT,
};

export const CONTENT_TYPE_TO_WIRE: Record<AttachmentContentType, WireAttachmentType> =
  Object.fromEntries(
    Object.entries(WIRE_TO_CONTENT_TYPE).map(([wire, contentType]) => [contentType, wire]),
  ) as Record<AttachmentContentType, WireAttachmentType>;

const MB = 1024 * 1024;

export const ALLOWED_MIME_TYPES_BY_CONTENT_TYPE: Record<AttachmentContentType, readonly string[]> = {
  [AttachmentContentType.IMAGE]: [
    'image/png',
    'image/jpeg',
    'image/gif',
    'image/webp',
    'image/svg+xml',
  ],
  [AttachmentContentType.GENERATED_IMAGE]: [
    'image/png',
    'image/jpeg',
    'image/gif',
    'image/webp',
    'image/svg+xml',
  ],
  [AttachmentContentType.PDF]: ['application/pdf'],
  [AttachmentContentType.GENERATED_PDF]: ['application/pdf'],
  [AttachmentContentType.PPT]: [
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  ],
  [AttachmentContentType.GENERATED_PPT]: [
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  ],
  [AttachmentContentType.EXCEL]: [
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ],
  [AttachmentContentType.CSV]: ['text/csv', 'application/csv'],
  [AttachmentContentType.DOCUMENT]: [
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/rtf',
  ],
  [AttachmentContentType.CODE]: [
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
  [AttachmentContentType.TEXT]: ['text/plain', 'text/markdown'],
};

export const MAX_FILE_SIZE_BY_CONTENT_TYPE: Record<AttachmentContentType, number> = {
  [AttachmentContentType.IMAGE]: 20 * MB,
  [AttachmentContentType.GENERATED_IMAGE]: 20 * MB,
  [AttachmentContentType.PDF]: 50 * MB,
  [AttachmentContentType.GENERATED_PDF]: 50 * MB,
  [AttachmentContentType.PPT]: 50 * MB,
  [AttachmentContentType.GENERATED_PPT]: 50 * MB,
  [AttachmentContentType.EXCEL]: 50 * MB,
  [AttachmentContentType.CSV]: 10 * MB,
  [AttachmentContentType.DOCUMENT]: 25 * MB,
  [AttachmentContentType.CODE]: 5 * MB,
  [AttachmentContentType.TEXT]: 5 * MB,
};

export const AI_ATTACHMENT_PRESIGN_EXPIRES_IN_SECONDS = 60 * 15;

export const AI_ATTACHMENT_MAX_EXTRACTED_TEXT_CHARS = 20_000;
export const AI_ATTACHMENT_EXTRACTION_TIMEOUT_MS = 10_000;

// Types with no text-extraction strategy — either genuinely non-textual
// (images) or not yet supported (Excel/PPT), or the backend already
// generated them (their content originated as structured input, not a file
// to parse).
export const NON_EXTRACTABLE_CONTENT_TYPES = new Set<AttachmentContentType>([
  AttachmentContentType.IMAGE,
  AttachmentContentType.EXCEL,
  AttachmentContentType.PPT,
  AttachmentContentType.GENERATED_IMAGE,
  AttachmentContentType.GENERATED_PDF,
  AttachmentContentType.GENERATED_PPT,
]);

export const AI_ATTACHMENT_SELECT = {
  id: true,
  aiConversationId: true,
  aiConversationMessageId: true,
  fileName: true,
  mimeType: true,
  fileSize: true,
  s3Key: true,
  contentType: true,
  uploadStatus: true,
  metadata: true,
  createdAt: true,
} as const;
