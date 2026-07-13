export declare const ATTACHMENT_SCANNER: unique symbol;
export interface AttachmentScanTarget {
    bucket: string;
    key: string;
}
export interface AttachmentScanResult {
    clean: boolean;
}
export interface AttachmentScanner {
    scan(target: AttachmentScanTarget): Promise<AttachmentScanResult>;
}
