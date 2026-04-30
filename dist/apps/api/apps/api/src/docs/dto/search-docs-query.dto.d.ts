import { z } from 'zod';
export declare const SearchDocsQuerySchema: any;
declare const SearchDocsQueryDto_base: any;
export declare class SearchDocsQueryDto extends SearchDocsQueryDto_base {
}
export type SearchDocsQuery = z.infer<typeof SearchDocsQuerySchema>;
export {};
