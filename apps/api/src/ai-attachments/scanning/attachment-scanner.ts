export const ATTACHMENT_SCANNER = Symbol('ATTACHMENT_SCANNER');

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
