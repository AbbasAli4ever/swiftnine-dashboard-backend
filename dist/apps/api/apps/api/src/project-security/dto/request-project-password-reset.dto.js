"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestProjectPasswordResetDto = exports.RequestProjectPasswordResetSchema = void 0;
const nestjs_zod_1 = require("nestjs-zod");
const zod_1 = require("zod");
exports.RequestProjectPasswordResetSchema = zod_1.z.object({});
class RequestProjectPasswordResetDto extends (0, nestjs_zod_1.createZodDto)(exports.RequestProjectPasswordResetSchema) {
}
exports.RequestProjectPasswordResetDto = RequestProjectPasswordResetDto;
//# sourceMappingURL=request-project-password-reset.dto.js.map