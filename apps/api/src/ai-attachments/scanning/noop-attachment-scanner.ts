import { Injectable } from '@nestjs/common';
import type {
  AttachmentScanner,
  AttachmentScanResult,
  AttachmentScanTarget,
} from './attachment-scanner';

/**
 * Placeholder virus-scan hook — always reports clean. Swap the binding in
 * `AiAttachmentsModule` for a real scanner (e.g. S3 Object Lambda / ClamAV
 * sidecar) later; no controller/service changes needed.
 */
@Injectable()
export class NoopAttachmentScanner implements AttachmentScanner {
  async scan(_target: AttachmentScanTarget): Promise<AttachmentScanResult> {
    return { clean: true };
  }
}
