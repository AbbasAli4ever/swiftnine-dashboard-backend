declare class TaskListAttachmentUploaderDto {
    id: string;
    name: string | null;
    avatarUrl: string | null;
}
export declare class TaskListAttachmentResponseDto {
    id: string;
    kind: 'FILE' | 'LINK';
    title: string | null;
    description: string | null;
    uploadedBy: TaskListAttachmentUploaderDto;
    createdAt: Date;
    fileName?: string;
    mimeType?: string;
    fileSize?: number;
    viewUrl?: string;
    linkUrl?: string;
}
export declare class TaskListAttachmentListResponseDto {
    items: TaskListAttachmentResponseDto[];
    nextCursor: string | null;
    limit: number;
}
export {};
