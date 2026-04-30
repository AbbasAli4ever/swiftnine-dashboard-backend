import { z } from 'zod';
export declare const ListDocsQuerySchema: any;
declare const ListDocsQueryDto_base: any;
export declare class ListDocsQueryDto extends ListDocsQueryDto_base {
}
export type ListDocsQuery = z.infer<typeof ListDocsQuerySchema>;
export {};
