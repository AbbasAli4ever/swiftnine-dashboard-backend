"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.slugifyFileName = slugifyFileName;
function slugifyFileName(title) {
    const slug = title
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    return slug || 'document';
}
//# sourceMappingURL=document-generation.utils.js.map