import type { DocRole, Role } from '@app/database/generated/prisma/client';
import type { Prisma } from '@app/database/generated/prisma/client';

// Numeric rank — higher number = more access. Used by resolveEffectiveRole to take the max.
export const DOC_ROLE_RANK: Record<DocRole, number> = {
  VIEWER: 1,
  COMMENTER: 2,
  EDITOR: 3,
  OWNER: 4,
};

// Maps workspace/project membership Role to the doc role a member inherits by default.
export const WORKSPACE_ROLE_TO_DOC_ROLE: Record<Role, DocRole> = {
  OWNER: 'OWNER',
  MEMBER: 'EDITOR',
};

// Error messages
export const DOC_NOT_FOUND = 'Document not found';
export const DOC_FORBIDDEN = 'You do not have permission to perform this action on this document';
export const DOC_TITLE_REQUIRED = 'Title is required';
export const DOC_TITLE_TOO_LONG = 'Title must be 256 characters or fewer';
export const DOC_CONTENT_TOO_LARGE = 'Document content exceeds the 1 MB limit';
export const DOC_SHARE_LINK_NOT_FOUND = 'Share link not found or has been revoked';
export const DOC_VERSION_NOT_FOUND = 'Version not found';
export const DOC_THREAD_NOT_FOUND = 'Comment thread not found';
export const DOC_COMMENT_NOT_FOUND = 'Comment not found';

// Block locks
export const BLOCK_LOCK_TTL_MS = 30_000;
export const BLOCK_LOCK_HEARTBEAT_MS = 10_000;

// Autosave throttle
export const AUTOSAVE_MAX_RATE_MS = 1_000; // max 1 save/sec/user/doc

// Versioning
export const CHECKPOINT_INTERVAL_MS = 20 * 60 * 1_000; // 20 minutes

// Content limits
export const DOC_CONTENT_MAX_BYTES = 1 * 1024 * 1024; // 1 MB
export const DOC_TITLE_MAX_LENGTH = 256;

export const DOC_SELECT = {
  id: true,
  workspaceId: true,
  projectId: true,
  ownerId: true,
  scope: true,
  title: true,
  contentJson: true,
  plaintext: true,
  version: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
} satisfies Prisma.DocSelect;
