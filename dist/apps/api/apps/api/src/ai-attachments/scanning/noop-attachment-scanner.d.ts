import type { AttachmentScanner, AttachmentScanResult, AttachmentScanTarget } from './attachment-scanner';
export declare class NoopAttachmentScanner implements AttachmentScanner {
    scan(_target: AttachmentScanTarget): Promise<AttachmentScanResult>;
}
