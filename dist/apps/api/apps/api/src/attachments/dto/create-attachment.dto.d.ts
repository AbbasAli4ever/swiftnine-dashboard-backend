export declare class CreateAttachmentDto {
    taskId: string;
    memberId: string;
    s3Key: string;
    fileName?: string;
    mimeType?: string;
    fileSize?: number;
}
