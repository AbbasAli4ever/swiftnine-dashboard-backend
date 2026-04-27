"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateWorkspaceDto = void 0;
const nestjs_zod_1 = require("nestjs-zod");
const zod_1 = require("zod");
const workspace_options_1 = require("../workspace-options");
const UpdateWorkspaceSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(100).optional(),
    logoUrl: zod_1.z.string().url('Must be a valid URL').nullable().optional(),
    workspaceUse: zod_1.z.enum(workspace_options_1.WORKSPACE_USE_VALUES).optional(),
    managementType: zod_1.z.enum(workspace_options_1.WORKSPACE_MANAGEMENT_TYPE_VALUES).optional(),
});
class UpdateWorkspaceDto extends (0, nestjs_zod_1.createZodDto)(UpdateWorkspaceSchema) {
}
exports.UpdateWorkspaceDto = UpdateWorkspaceDto;
//# sourceMappingURL=update-workspace.dto.js.map