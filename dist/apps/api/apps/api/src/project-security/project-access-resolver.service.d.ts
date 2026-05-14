import { PrismaService } from "../../../../libs/database/src";
type ProjectRef = {
    projectId: string | null;
    workspaceId: string;
};
export declare class ProjectAccessResolverService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    resolveProjectIdFromTaskId(workspaceId: string, taskId: string): Promise<string>;
    resolveProjectIdFromListId(workspaceId: string, listId: string): Promise<string>;
    resolveProjectIdFromStatusId(workspaceId: string, statusId: string): Promise<string>;
    resolveProjectIdFromCommentId(workspaceId: string, commentId: string): Promise<string>;
    resolveProjectIdFromTimeEntryId(workspaceId: string, timeEntryId: string): Promise<string>;
    resolveProjectIdFromChannelId(workspaceId: string, channelId: string): Promise<string | null>;
    resolveProjectIdFromMessageId(workspaceId: string, messageId: string): Promise<string | null>;
    resolveProjectIdFromDocId(workspaceId: string, docId: string): Promise<string | null>;
    resolveProjectRefFromAttachmentId(workspaceId: string, attachmentId: string): Promise<ProjectRef>;
}
export {};
