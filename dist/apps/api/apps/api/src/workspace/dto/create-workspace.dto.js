"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateWorkspaceDto = void 0;
const nestjs_zod_1 = require("nestjs-zod");
const zod_1 = require("zod");
const workspace_options_1 = require("../workspace-options");
const CreateWorkspaceSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Name is required').max(100),
    logoUrl: zod_1.z.string().url('Must be a valid URL').optional(),
    workspaceUse: zod_1.z.enum(workspace_options_1.WORKSPACE_USE_VALUES),
    managementType: zod_1.z.enum(workspace_options_1.WORKSPACE_MANAGEMENT_TYPE_VALUES),
});
class CreateWorkspaceDto extends (0, nestjs_zod_1.createZodDto)(CreateWorkspaceSchema) {
}
exports.CreateWorkspaceDto = CreateWorkspaceDto;
//# sourceMappingURL=create-workspace.dto.js.map