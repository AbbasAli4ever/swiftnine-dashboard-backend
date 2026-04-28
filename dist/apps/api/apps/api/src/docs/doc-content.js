"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeDocContent = normalizeDocContent;
exports.defaultDocContent = defaultDocContent;
exports.extractPlaintext = extractPlaintext;
exports.assertContentSize = assertContentSize;
const node_crypto_1 = require("node:crypto");
const common_1 = require("@nestjs/common");
const doc_permissions_constants_1 = require("./doc-permissions.constants");
function normalizeDocContent(value) {
    assertPlainObject(value);
    const contentJson = normalizeNode(value);
    assertContentSize(contentJson);
    return {
        contentJson: contentJson,
        plaintext: extractPlaintext(contentJson),
    };
}
function defaultDocContent() {
    return normalizeDocContent({});
}
function extractPlaintext(value) {
    const parts = [];
    collectText(value, parts);
    return parts
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();
}
function assertContentSize(value) {
    const bytes = Buffer.byteLength(JSON.stringify(value), 'utf8');
    if (bytes > doc_permissions_constants_1.DOC_CONTENT_MAX_BYTES) {
        throw new common_1.PayloadTooLargeException(doc_permissions_constants_1.DOC_CONTENT_TOO_LARGE);
    }
}
function normalizeNode(value) {
    if (Array.isArray(value)) {
        return value.map((item) => normalizeNode(item));
    }
    if (!isPlainObject(value))
        return value;
    const node = {};
    for (const [key, child] of Object.entries(value)) {
        node[key] = normalizeNode(child);
    }
    if (typeof node['type'] === 'string' && isBlockNode(node)) {
        const attrs = isPlainObject(node['attrs'])
            ? { ...node['attrs'] }
            : {};
        if (typeof attrs['id'] !== 'string' || !attrs['id'].trim()) {
            attrs['id'] = (0, node_crypto_1.randomUUID)();
        }
        node['attrs'] = attrs;
    }
    return node;
}
function collectText(value, parts) {
    if (Array.isArray(value)) {
        value.forEach((item) => collectText(item, parts));
        return;
    }
    if (!isPlainObject(value))
        return;
    if (typeof value['text'] === 'string') {
        parts.push(value['text']);
    }
    const attrs = value['attrs'];
    if (value['type'] === 'mention' &&
        isPlainObject(attrs) &&
        typeof attrs['label'] === 'string') {
        parts.push(attrs['label']);
    }
    collectText(value['content'], parts);
}
function assertPlainObject(value) {
    if (!isPlainObject(value)) {
        throw new common_1.BadRequestException('Document content must be a JSON object');
    }
}
function isPlainObject(value) {
    return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
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
//# sourceMappingURL=doc-content.js.map