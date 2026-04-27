import { PrismaService } from "../../../../libs/database/src";
import type { Prisma } from "../../../../libs/database/src/generated/prisma/client";
import { type ActivityCategory } from './activity.constants';
import type { ListActivityDto } from './dto/list-activity.dto';
type ActivityLogClient = Pick<PrismaService, 'activityLog'> | Prisma.TransactionClient;
type ActivityLogInput = {
    workspaceId: string;
    entityType: string;
    entityId: string;
    action: string;
    performedBy: string;
    fieldName?: string | null;
    oldValue?: unknown;
    newValue?: unknown;
    metadata?: Prisma.InputJsonValue;
};
declare const ACTIVITY_SELECT: {
    id: true;
    workspaceId: true;
    entityType: true;
    entityId: true;
    action: true;
    fieldName: true;
    oldValue: true;
    newValue: true;
    metadata: true;
    performedBy: true;
    createdAt: true;
    performer: {
        select: {
            id: true;
            fullName: true;
            email: true;
            avatarUrl: true;
            avatarColor: true;
        };
    };
};
type RawActivity = Prisma.ActivityLogGetPayload<{
    select: typeof ACTIVITY_SELECT;
}>;
export type ActivityFeedItem = {
    id: string;
    kind: 'activity' | 'comment';
    category: ActivityCategory | string;
    entityType: string;
    entityId: string;
    action: string;
    fieldName: string | null;
    oldValue: string | null;
    newValue: string | null;
    metadata: Record<string, unknown>;
    actor: RawActivity['performer'];
    displayText: string;
    createdAt: Date;
};
export type ActivityFeedResult = {
    items: ActivityFeedItem[];
    nextCursor: string | null;
};
export declare class ActivityService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    log(input: ActivityLogInput, client?: ActivityLogClient): Promise<void>;
    logMany(inputs: ActivityLogInput[], client?: ActivityLogClient): Promise<void>;
    listWorkspaceActivity(workspaceId: string, actorId: string, dto: ListActivityDto): Promise<ActivityFeedResult>;
    listTaskActivity(workspaceId: string, taskId: string, actorId: string, dto: ListActivityDto): Promise<ActivityFeedResult>;
    getCategory(action: string, entityType: string, fieldName?: string | null): ActivityCategory | string;
    private buildCategoryWhere;
    private entityTypesForCategories;
    private buildWorkspaceWhere;
    private buildBaseWhere;
    private buildScopeConditions;
    private getListScopeConditions;
    private getTaskRelatedActivityIds;
    private getProjectStatusIds;
    private toFeedResult;
    private toFeedItem;
    private formatDisplayText;
    private getTargetLabel;
    private humanize;
    private toRecord;
    private toCreateInput;
    private stringifyValue;
}
export {};
