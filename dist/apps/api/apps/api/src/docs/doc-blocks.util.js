"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeDocBlockIds = normalizeDocBlockIds;
exports.extractDocBlocks = extractDocBlocks;
exports.diffDocBlocks = diffDocBlocks;
exports.intersectBlockIds = intersectBlockIds;
exports.mergeDocBlocks = mergeDocBlocks;
const node_crypto_1 = require("node:crypto");
function normalizeDocBlockIds(value) {
    const seen = new Set();
    const contentJson = normalizeNode(value, seen);
    const blocks = extractDocBlocks(contentJson);
    return { contentJson, blocks };
}
function extractDocBlocks(value) {
    const blocks = new Map();
    collectBlocks(value, blocks);
    return blocks;
}
function diffDocBlocks(before, after) {
    const changed = new Set();
    for (const [blockId, beforeBlock] of before) {
        const afterBlock = after.get(blockId);
        if (afterBlock === undefined || stableStringify(beforeBlock) !== stableStringify(afterBlock)) {
            changed.add(blockId);
        }
    }
    for (const blockId of after.keys()) {
        if (!before.has(blockId))
            changed.add(blockId);
    }
    return changed;
}
function intersectBlockIds(left, right) {
    const rightSet = right instanceof Set ? right : new Set(right);
    return Array.from(new Set(left)).filter((blockId) => rightSet.has(blockId));
}
function mergeDocBlocks(currentContent, incomingContent, changedBlockIds) {
    const replacements = new Map();
    const removals = new Set();
    const incomingBlocks = extractDocBlocks(incomingContent);
    for (const blockId of changedBlockIds) {
        const replacement = incomingBlocks.get(blockId);
        if (replacement === undefined) {
            removals.add(blockId);
        }
        else {
            replacements.set(blockId, replacement);
        }
    }
    return replaceBlocks(currentContent, replacements, removals);
}
function normalizeNode(value, seen) {
    if (Array.isArray(value)) {
        return value.map((item) => normalizeNode(item, seen));
    }
    if (!isPlainObject(value))
        return value;
    const node = {};
    for (const [key, child] of Object.entries(value)) {
        node[key] = normalizeNode(child, seen);
    }
    if (typeof node['type'] === 'string' && isBlockNode(node)) {
        const attrs = isPlainObject(node['attrs'])
            ? { ...node['attrs'] }
            : {};
        const rawId = typeof attrs['id'] === 'string' ? attrs['id'].trim() : '';
        attrs['id'] = rawId && !seen.has(rawId) ? rawId : uniqueBlockId(seen);
        seen.add(String(attrs['id']));
        node['attrs'] = attrs;
    }
    return node;
}
function collectBlocks(value, blocks) {
    if (Array.isArray(value)) {
        value.forEach((item) => collectBlocks(item, blocks));
        return;
    }
    if (!isPlainObject(value))
        return;
    const attrs = value['attrs'];
    if (typeof value['type'] === 'string' &&
        isPlainObject(attrs) &&
        typeof attrs['id'] === 'string' &&
        attrs['id'].trim()) {
        blocks.set(attrs['id'], value);
    }
    collectBlocks(value['content'], blocks);
}
function replaceBlocks(value, replacements, removals) {
    if (Array.isArray(value)) {
        return value
            .map((item) => replaceBlocks(item, replacements, removals))
            .filter((item) => item !== undefined);
    }
    if (!isPlainObject(value))
        return value;
    const attrs = value['attrs'];
    if (isPlainObject(attrs) &&
        typeof attrs['id'] === 'string' &&
        attrs['id'].trim()) {
        if (removals.has(attrs['id']))
            return undefined;
        const replacement = replacements.get(attrs['id']);
        if (replacement !== undefined)
            return replacement;
    }
    const next = {};
    for (const [key, child] of Object.entries(value)) {
        const replaced = replaceBlocks(child, replacements, removals);
        if (replaced !== undefined)
            next[key] = replaced;
    }
    return next;
}
function stableStringify(value) {
    return JSON.stringify(sortForStableStringify(value));
}
function sortForStableStringify(value) {
    if (Array.isArray(value))
        return value.map((item) => sortForStableStringify(item));
    if (!isPlainObject(value))
        return value;
    return Object.keys(value)
        .sort()
        .reduce((acc, key) => {
        acc[key] = sortForStableStringify(value[key]);
        return acc;
    }, {});
}
function isPlainObject(value) {
    return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}
function uniqueBlockId(seen) {
    const baseId = (0, node_crypto_1.randomUUID)();
    if (!seen.has(baseId))
        return baseId;
    let suffix = 1;
    while (seen.has(`${baseId}-${suffix}`))
        suffix += 1;
    return `${baseId}-${suffix}`;
}
function isBlockNode(node) {
    if (node['type'] === 'doc')
        return false;
    return (Array.isArray(node['content']) ||
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
        ].includes(String(node['type'])));
}
//# sourceMappingURL=doc-blocks.util.js.map