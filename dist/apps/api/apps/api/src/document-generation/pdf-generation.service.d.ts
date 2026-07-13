import type { GenerateDocumentInput } from './dto/generate-document.dto';
type DocumentContent = Pick<GenerateDocumentInput, 'title' | 'sections'>;
export declare class PdfGenerationService {
    render(input: DocumentContent): Promise<Buffer>;
}
export {};
