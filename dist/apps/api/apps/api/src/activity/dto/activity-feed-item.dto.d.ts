declare class ActivityActorDto {
    id: string;
    fullName: string;
    email?: string | null;
    avatarUrl?: string | null;
    avatarColor?: string;
}
export declare class ActivityFeedItemDto {
    id: string;
    kind: 'activity' | 'comment';
    category: string;
    entityType: string;
    entityId: string;
    action: string;
    fieldName?: string | null;
    oldValue?: string | null;
    newValue?: string | null;
    metadata: Record<string, unknown>;
    actor: ActivityActorDto;
    displayText: string;
    createdAt: Date;
}
export declare class ActivityFeedResponseDto {
    items: ActivityFeedItemDto[];
    nextCursor: string | null;
}
export {};
