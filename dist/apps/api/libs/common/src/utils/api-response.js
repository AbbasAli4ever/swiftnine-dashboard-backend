"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ok = ok;
exports.paginated = paginated;
function ok(data, message = null) {
    return { success: true, data, message };
}
function paginated(data, total, page, limit, message = null) {
    const total_pages = Math.ceil(total / limit);
    return {
        success: true,
        data,
        meta: {
            page,
            limit,
            total,
            total_pages,
            has_next: page < total_pages,
            has_prev: page > 1,
        },
        message,
    };
}
//# sourceMappingURL=api-response.js.map