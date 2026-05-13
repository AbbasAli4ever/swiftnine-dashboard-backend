declare class ProjectAttachmentSearchUploaderDto {
    id: string;
    name: string | null;
    avatarUrl: string | null;
}
export declare class ProjectAttachmentSearchResponseDto {
    id: string;
    entityType: 'project_attachment';
    projectId: string;
    kind: 'FILE' | 'LINK';
    title: string | null;
    fileName: string | null;
    description: string | null;
    linkUrl: string | null;
    createdAt: Date;
    uploadedBy: ProjectAttachmentSearchUploaderDto;
}
export {};
