export const AVATAR_ALLOWED_MIME_TYPES = [
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/gif',
] as const;

export const AVATAR_MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB, advisory only

export const AVATAR_UPLOAD_URL_EXPIRY_SECONDS = 60 * 15; // 15 minutes

// Key prefix inside the PUBLIC_ASSETS bucket (see PublicAssetsS3Service) —
// sibling to bank-logos' own prefix, namespaced per-user underneath it.
export const AVATAR_KEY_PREFIX = 'avatars';
