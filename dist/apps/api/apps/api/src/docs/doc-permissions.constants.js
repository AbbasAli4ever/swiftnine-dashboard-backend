"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DOC_SELECT = exports.DOC_TITLE_MAX_LENGTH = exports.DOC_CONTENT_MAX_BYTES = exports.CHECKPOINT_INTERVAL_MS = exports.AUTOSAVE_MAX_RATE_MS = exports.BLOCK_LOCK_HEARTBEAT_MS = exports.BLOCK_LOCK_TTL_MS = exports.DOC_COMMENT_NOT_FOUND = exports.DOC_THREAD_NOT_FOUND = exports.DOC_VERSION_NOT_FOUND = exports.DOC_SHARE_LINK_NOT_FOUND = exports.DOC_CONTENT_TOO_LARGE = exports.DOC_TITLE_TOO_LONG = exports.DOC_TITLE_REQUIRED = exports.DOC_FORBIDDEN = exports.DOC_NOT_FOUND = exports.WORKSPACE_ROLE_TO_DOC_ROLE = exports.DOC_ROLE_RANK = void 0;
exports.DOC_ROLE_RANK = {
    VIEWER: 1,
    COMMENTER: 2,
    EDITOR: 3,
    OWNER: 4,
};
exports.WORKSPACE_ROLE_TO_DOC_ROLE = {
    OWNER: 'OWNER',
    MEMBER: 'EDITOR',
};
exports.DOC_NOT_FOUND = 'Document not found';
exports.DOC_FORBIDDEN = 'You do not have permission to perform this action on this document';
exports.DOC_TITLE_REQUIRED = 'Title is required';
exports.DOC_TITLE_TOO_LONG = 'Title must be 256 characters or fewer';
exports.DOC_CONTENT_TOO_LARGE = 'Document content exceeds the 1 MB limit';
exports.DOC_SHARE_LINK_NOT_FOUND = 'Share link not found or has been revoked';
exports.DOC_VERSION_NOT_FOUND = 'Version not found';
exports.DOC_THREAD_NOT_FOUND = 'Comment thread not found';
exports.DOC_COMMENT_NOT_FOUND = 'Comment not found';
exports.BLOCK_LOCK_TTL_MS = 30_000;
exports.BLOCK_LOCK_HEARTBEAT_MS = 10_000;
exports.AUTOSAVE_MAX_RATE_MS = 1_000;
exports.CHECKPOINT_INTERVAL_MS = 20 * 60 * 1_000;
exports.DOC_CONTENT_MAX_BYTES = 1 * 1024 * 1024;
exports.DOC_TITLE_MAX_LENGTH = 256;
exports.DOC_SELECT = {
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
};
//# sourceMappingURL=doc-permissions.constants.js.map