export declare class NotificationResponseDto {
    id: string;
    type: string;
    title: string;
    message?: string | null;
    referenceType?: string | null;
    referenceId?: string | null;
    actorId?: string | null;
    isRead: boolean;
    isCleared: boolean;
    isSnoozed: boolean;
    snoozedAt?: Date | null;
    createdAt: Date;
}
