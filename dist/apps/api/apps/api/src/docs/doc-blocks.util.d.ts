export type DocBlockMap = Map<string, unknown>;
export type NormalizedBlocksResult = {
    contentJson: unknown;
    blocks: DocBlockMap;
};
export declare function normalizeDocBlockIds(value: unknown): NormalizedBlocksResult;
export declare function extractDocBlocks(value: unknown): DocBlockMap;
export declare function diffDocBlocks(before: DocBlockMap, after: DocBlockMap): Set<string>;
export declare function intersectBlockIds(left: Iterable<string>, right: Iterable<string>): string[];
export declare function mergeDocBlocks(currentContent: unknown, incomingContent: unknown, changedBlockIds: Iterable<string>): unknown;
