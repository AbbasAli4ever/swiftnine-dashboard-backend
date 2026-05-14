declare class ProjectAttachmentUploaderDto {
    id: string;
    name: string | null;
    avatarUrl: string | null;
}
export declare class ProjectAttachmentResponseDto {
    id: string;
    kind: 'FILE' | 'LINK';
    title: string | null;
    description: string | null;
    uploadedBy: ProjectAttachmentUploaderDto;
    createdAt: Date;
    fileName?: string;
    mimeType?: string;
    fileSize?: number;
    viewUrl?: string;
    linkUrl?: string;
}
export declare class ProjectAttachmentListResponseDto {
    items: ProjectAttachmentResponseDto[];
    nextCursor: string | null;
    limit: number;
}
export {};
