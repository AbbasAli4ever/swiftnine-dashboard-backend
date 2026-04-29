import { randomUUID } from 'node:crypto';

type JsonRecord = Record<string, unknown>;

export type DocBlockMap = Map<string, unknown>;

export type NormalizedBlocksResult = {
  contentJson: unknown;
  blocks: DocBlockMap;
};

export function normalizeDocBlockIds(value: unknown): NormalizedBlocksResult {
  const seen = new Set<string>();
  const contentJson = normalizeNode(value, seen);
  const blocks = extractDocBlocks(contentJson);
  return { contentJson, blocks };
}

export function extractDocBlocks(value: unknown): DocBlockMap {
  const blocks: DocBlockMap = new Map();
  collectBlocks(value, blocks);
  return blocks;
}

export function diffDocBlocks(
  before: DocBlockMap,
  after: DocBlockMap,
): Set<string> {
  const changed = new Set<string>();

  for (const [blockId, beforeBlock] of before) {
    const afterBlock = after.get(blockId);
    if (afterBlock === undefined || stableStringify(beforeBlock) !== stableStringify(afterBlock)) {
      changed.add(blockId);
    }
  }

  for (const blockId of after.keys()) {
    if (!before.has(blockId)) changed.add(blockId);
  }

  return changed;
}

export function intersectBlockIds(
  left: Iterable<string>,
  right: Iterable<string>,
): string[] {
  const rightSet = right instanceof Set ? right : new Set(right);
  return Array.from(new Set(left)).filter((blockId) => rightSet.has(blockId));
}

export function mergeDocBlocks(
  currentContent: unknown,
  incomingContent: unknown,
  changedBlockIds: Iterable<string>,
): unknown {
  const replacements = new Map<string, unknown>();
  const removals = new Set<string>();
  const incomingBlocks = extractDocBlocks(incomingContent);

  for (const blockId of changedBlockIds) {
    const replacement = incomingBlocks.get(blockId);
    if (replacement === undefined) {
      removals.add(blockId);
    } else {
      replacements.set(blockId, replacement);
    }
  }

  return replaceBlocks(currentContent, replacements, removals);
}

function normalizeNode(value: unknown, seen: Set<string>): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => normalizeNode(item, seen));
  }

  if (!isPlainObject(value)) return value;

  const node: JsonRecord = {};
  for (const [key, child] of Object.entries(value)) {
    node[key] = normalizeNode(child, seen);
  }

  if (typeof node['type'] === 'string' && isBlockNode(node)) {
    const attrs = isPlainObject(node['attrs'])
      ? { ...(node['attrs'] as JsonRecord) }
      : {};
    const rawId = typeof attrs['id'] === 'string' ? attrs['id'].trim() : '';
    attrs['id'] = rawId && !seen.has(rawId) ? rawId : uniqueBlockId(seen);
    seen.add(String(attrs['id']));
    node['attrs'] = attrs;
  }

  return node;
}

function collectBlocks(value: unknown, blocks: DocBlockMap): void {
  if (Array.isArray(value)) {
    value.forEach((item) => collectBlocks(item, blocks));
    return;
  }

  if (!isPlainObject(value)) return;

  const attrs = value['attrs'];
  if (
    typeof value['type'] === 'string' &&
    isPlainObject(attrs) &&
    typeof attrs['id'] === 'string' &&
    attrs['id'].trim()
  ) {
    blocks.set(attrs['id'], value);
  }

  collectBlocks(value['content'], blocks);
}

function replaceBlocks(
  value: unknown,
  replacements: Map<string, unknown>,
  removals: Set<string>,
): unknown {
  if (Array.isArray(value)) {
    return value
      .map((item) => replaceBlocks(item, replacements, removals))
      .filter((item) => item !== undefined);
  }

  if (!isPlainObject(value)) return value;

  const attrs = value['attrs'];
  if (
    isPlainObject(attrs) &&
    typeof attrs['id'] === 'string' &&
    attrs['id'].trim()
  ) {
    if (removals.has(attrs['id'])) return undefined;
    const replacement = replacements.get(attrs['id']);
    if (replacement !== undefined) return replacement;
  }

  const next: JsonRecord = {};
  for (const [key, child] of Object.entries(value)) {
    const replaced = replaceBlocks(child, replacements, removals);
    if (replaced !== undefined) next[key] = replaced;
  }
  return next;
}

function stableStringify(value: unknown): string {
  return JSON.stringify(sortForStableStringify(value));
}

function sortForStableStringify(value: unknown): unknown {
  if (Array.isArray(value)) return value.map((item) => sortForStableStringify(item));
  if (!isPlainObject(value)) return value;

  return Object.keys(value)
    .sort()
    .reduce<JsonRecord>((acc, key) => {
      acc[key] = sortForStableStringify(value[key]);
      return acc;
    }, {});
}

function isPlainObject(value: unknown): value is JsonRecord {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function uniqueBlockId(seen: Set<string>): string {
  const baseId = randomUUID();
  if (!seen.has(baseId)) return baseId;

  let suffix = 1;
  while (seen.has(`${baseId}-${suffix}`)) suffix += 1;
  return `${baseId}-${suffix}`;
}

function isBlockNode(node: JsonRecord): boolean {
  if (node['type'] === 'doc') return false;

  return (
    Array.isArray(node['content']) ||
    [
      'paragraph',
      'heading',
      'blockquote',
      'codeBlock',
      'bulletList',
      'orderedList',
      'listItem',
      'taskList',
      'taskItem',
      'table',
      'tableRow',
      'tableCell',
      'tableHeader',
      'image',
      'horizontalRule',
      'taskCard',
      'embed',
    ].includes(String(node['type']))
  );
}
