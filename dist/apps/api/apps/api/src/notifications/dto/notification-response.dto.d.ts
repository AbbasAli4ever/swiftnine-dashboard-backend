export declare class NotificationResponseDto {
    id: string;
    type: string;
    title: string;
    message?: string | null;
    referenceType?: string | null;
    referenceId?: string | null;
    taskId?: string | null;
    taskName?: string | null;
    commentId?: string | null;
    commentName?: string | null;
    actorId?: string | null;
    isRead: boolean;
    isCleared: boolean;
    isSnoozed: boolean;
    snoozedAt?: Date | null;
    createdAt: Date;
}
