"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.defineExtension = exports.NullsOrder = exports.JsonNullValueFilter = exports.QueryMode = exports.JsonNullValueInput = exports.SortOrder = exports.ActivityLogScalarFieldEnum = exports.TimeEntryScalarFieldEnum = exports.AttachmentScalarFieldEnum = exports.NotificationScalarFieldEnum = exports.MentionScalarFieldEnum = exports.CommentScalarFieldEnum = exports.TaskTagScalarFieldEnum = exports.TaskAssigneeScalarFieldEnum = exports.TaskScalarFieldEnum = exports.TagScalarFieldEnum = exports.StatusScalarFieldEnum = exports.TaskListScalarFieldEnum = exports.ProjectScalarFieldEnum = exports.WorkspaceInviteScalarFieldEnum = exports.WorkspaceMemberScalarFieldEnum = exports.WorkspaceScalarFieldEnum = exports.EmailVerificationTokenScalarFieldEnum = exports.PasswordResetTokenScalarFieldEnum = exports.RefreshTokenScalarFieldEnum = exports.UserScalarFieldEnum = exports.TransactionIsolationLevel = exports.ModelName = exports.AnyNull = exports.JsonNull = exports.DbNull = exports.NullTypes = exports.prismaVersion = exports.getExtensionContext = exports.Decimal = exports.Sql = exports.raw = exports.join = exports.empty = exports.sql = exports.PrismaClientValidationError = exports.PrismaClientInitializationError = exports.PrismaClientRustPanicError = exports.PrismaClientUnknownRequestError = exports.PrismaClientKnownRequestError = void 0;
const runtime = __importStar(require("@prisma/client/runtime/client"));
exports.PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError;
exports.PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError;
exports.PrismaClientRustPanicError = runtime.PrismaClientRustPanicError;
exports.PrismaClientInitializationError = runtime.PrismaClientInitializationError;
exports.PrismaClientValidationError = runtime.PrismaClientValidationError;
exports.sql = runtime.sqltag;
exports.empty = runtime.empty;
exports.join = runtime.join;
exports.raw = runtime.raw;
exports.Sql = runtime.Sql;
exports.Decimal = runtime.Decimal;
exports.getExtensionContext = runtime.Extensions.getExtensionContext;
exports.prismaVersion = {
    client: "7.7.0",
    engine: "75cbdc1eb7150937890ad5465d861175c6624711"
};
exports.NullTypes = {
    DbNull: runtime.NullTypes.DbNull,
    JsonNull: runtime.NullTypes.JsonNull,
    AnyNull: runtime.NullTypes.AnyNull,
};
exports.DbNull = runtime.DbNull;
exports.JsonNull = runtime.JsonNull;
exports.AnyNull = runtime.AnyNull;
exports.ModelName = {
    User: 'User',
    RefreshToken: 'RefreshToken',
    PasswordResetToken: 'PasswordResetToken',
    EmailVerificationToken: 'EmailVerificationToken',
    Workspace: 'Workspace',
    WorkspaceMember: 'WorkspaceMember',
    WorkspaceInvite: 'WorkspaceInvite',
    Project: 'Project',
    TaskList: 'TaskList',
    Status: 'Status',
    Tag: 'Tag',
    Task: 'Task',
    TaskAssignee: 'TaskAssignee',
    TaskTag: 'TaskTag',
    Comment: 'Comment',
    Mention: 'Mention',
    Notification: 'Notification',
    Attachment: 'Attachment',
    TimeEntry: 'TimeEntry',
    ActivityLog: 'ActivityLog'
};
exports.TransactionIsolationLevel = runtime.makeStrictEnum({
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
});
exports.UserScalarFieldEnum = {
    id: 'id',
    fullName: 'fullName',
    email: 'email',
    passwordHash: 'passwordHash',
    googleId: 'googleId',
    avatarUrl: 'avatarUrl',
    avatarColor: 'avatarColor',
    designation: 'designation',
    bio: 'bio',
    isOnline: 'isOnline',
    lastSeenAt: 'lastSeenAt',
    timezone: 'timezone',
    notificationPreferences: 'notificationPreferences',
    isEmailVerified: 'isEmailVerified',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    deletedAt: 'deletedAt'
};
exports.RefreshTokenScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    tokenHash: 'tokenHash',
    deviceInfo: 'deviceInfo',
    ipAddress: 'ipAddress',
    expiresAt: 'expiresAt',
    isRevoked: 'isRevoked',
    createdAt: 'createdAt'
};
exports.PasswordResetTokenScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    tokenHash: 'tokenHash',
    expiresAt: 'expiresAt',
    createdAt: 'createdAt'
};
exports.EmailVerificationTokenScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    otpHash: 'otpHash',
    expiresAt: 'expiresAt',
    createdAt: 'createdAt'
};
exports.WorkspaceScalarFieldEnum = {
    id: 'id',
    name: 'name',
    logoUrl: 'logoUrl',
    createdBy: 'createdBy',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    deletedAt: 'deletedAt'
};
exports.WorkspaceMemberScalarFieldEnum = {
    id: 'id',
    workspaceId: 'workspaceId',
    userId: 'userId',
    role: 'role',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    deletedAt: 'deletedAt'
};
exports.WorkspaceInviteScalarFieldEnum = {
    id: 'id',
    workspaceId: 'workspaceId',
    email: 'email',
    role: 'role',
    inviteToken: 'inviteToken',
    invitedBy: 'invitedBy',
    status: 'status',
    expiresAt: 'expiresAt',
    acceptedAt: 'acceptedAt',
    createdAt: 'createdAt'
};
exports.ProjectScalarFieldEnum = {
    id: 'id',
    workspaceId: 'workspaceId',
    name: 'name',
    description: 'description',
    color: 'color',
    icon: 'icon',
    taskIdPrefix: 'taskIdPrefix',
    taskCounter: 'taskCounter',
    isArchived: 'isArchived',
    createdBy: 'createdBy',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    deletedAt: 'deletedAt'
};
exports.TaskListScalarFieldEnum = {
    id: 'id',
    projectId: 'projectId',
    name: 'name',
    position: 'position',
    isArchived: 'isArchived',
    createdBy: 'createdBy',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    deletedAt: 'deletedAt'
};
exports.StatusScalarFieldEnum = {
    id: 'id',
    projectId: 'projectId',
    name: 'name',
    color: 'color',
    position: 'position',
    isDefault: 'isDefault',
    isClosed: 'isClosed',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    deletedAt: 'deletedAt'
};
exports.TagScalarFieldEnum = {
    id: 'id',
    workspaceId: 'workspaceId',
    name: 'name',
    color: 'color',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    deletedAt: 'deletedAt'
};
exports.TaskScalarFieldEnum = {
    id: 'id',
    listId: 'listId',
    parentId: 'parentId',
    depth: 'depth',
    title: 'title',
    description: 'description',
    statusId: 'statusId',
    priority: 'priority',
    taskNumber: 'taskNumber',
    startDate: 'startDate',
    dueDate: 'dueDate',
    position: 'position',
    isCompleted: 'isCompleted',
    completedAt: 'completedAt',
    createdBy: 'createdBy',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    deletedAt: 'deletedAt'
};
exports.TaskAssigneeScalarFieldEnum = {
    id: 'id',
    taskId: 'taskId',
    userId: 'userId',
    assignedBy: 'assignedBy',
    createdAt: 'createdAt'
};
exports.TaskTagScalarFieldEnum = {
    id: 'id',
    taskId: 'taskId',
    tagId: 'tagId',
    createdAt: 'createdAt'
};
exports.CommentScalarFieldEnum = {
    id: 'id',
    taskId: 'taskId',
    userId: 'userId',
    parentId: 'parentId',
    content: 'content',
    isEdited: 'isEdited',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    deletedAt: 'deletedAt'
};
exports.MentionScalarFieldEnum = {
    id: 'id',
    commentId: 'commentId',
    mentionedUserId: 'mentionedUserId',
    createdAt: 'createdAt'
};
exports.NotificationScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    type: 'type',
    title: 'title',
    message: 'message',
    referenceType: 'referenceType',
    referenceId: 'referenceId',
    actorId: 'actorId',
    isRead: 'isRead',
    readAt: 'readAt',
    createdAt: 'createdAt'
};
exports.AttachmentScalarFieldEnum = {
    id: 'id',
    taskId: 'taskId',
    uploadedBy: 'uploadedBy',
    fileName: 'fileName',
    s3Key: 's3Key',
    mimeType: 'mimeType',
    fileSize: 'fileSize',
    createdAt: 'createdAt',
    deletedAt: 'deletedAt'
};
exports.TimeEntryScalarFieldEnum = {
    id: 'id',
    taskId: 'taskId',
    userId: 'userId',
    description: 'description',
    startTime: 'startTime',
    endTime: 'endTime',
    duration: 'duration',
    isManual: 'isManual',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    deletedAt: 'deletedAt'
};
exports.ActivityLogScalarFieldEnum = {
    id: 'id',
    workspaceId: 'workspaceId',
    entityType: 'entityType',
    entityId: 'entityId',
    action: 'action',
    fieldName: 'fieldName',
    oldValue: 'oldValue',
    newValue: 'newValue',
    metadata: 'metadata',
    performedBy: 'performedBy',
    createdAt: 'createdAt'
};
exports.SortOrder = {
    asc: 'asc',
    desc: 'desc'
};
exports.JsonNullValueInput = {
    JsonNull: exports.JsonNull
};
exports.QueryMode = {
    default: 'default',
    insensitive: 'insensitive'
};
exports.JsonNullValueFilter = {
    DbNull: exports.DbNull,
    JsonNull: exports.JsonNull,
    AnyNull: exports.AnyNull
};
exports.NullsOrder = {
    first: 'first',
    last: 'last'
};
exports.defineExtension = runtime.Extensions.defineExtension;
//# sourceMappingURL=prismaNamespace.js.map