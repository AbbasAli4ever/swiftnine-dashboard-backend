"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const workspace_guard_1 = require("../workspace/workspace.guard");
const tag_service_1 = require("./tag.service");
const create_tag_dto_1 = require("./dto/create-tag.dto");
const update_tag_dto_1 = require("./dto/update-tag.dto");
const common_2 = require("../../../../libs/common/src");
let TagController = class TagController {
    tagService;
    constructor(tagService) {
        this.tagService = tagService;
    }
    async create(req, dto) {
        const tag = await this.tagService.create(req.workspaceContext.workspaceId, req.user.id, dto);
        return (0, common_2.ok)(tag, 'Tag created successfully');
    }
    async findAll(req) {
        const tags = await this.tagService.findAll(req.workspaceContext.workspaceId);
        return (0, common_2.ok)(tags);
    }
    async update(req, tagId, dto) {
        const tag = await this.tagService.update(req.workspaceContext.workspaceId, req.user.id, tagId, dto);
        return (0, common_2.ok)(tag, 'Tag updated successfully');
    }
    async remove(req, tagId) {
        await this.tagService.remove(req.workspaceContext.workspaceId, req.user.id, tagId);
        return (0, common_2.ok)(null, 'Tag deleted successfully');
    }
};
exports.TagController = TagController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new tag in the workspace' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Tag created' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Tag name already taken in this workspace' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_tag_dto_1.CreateTagDto]),
    __metadata("design:returntype", Promise)
], TagController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List all tags in the workspace' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Tags returned' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TagController.prototype, "findAll", null);
__decorate([
    (0, common_1.Patch)(':tagId'),
    (0, swagger_1.ApiOperation)({ summary: 'Update tag name or color' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Tag updated' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Tag not found' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('tagId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_tag_dto_1.UpdateTagDto]),
    __metadata("design:returntype", Promise)
], TagController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':tagId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a tag (cascades off all tasks)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Tag deleted' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Tag not found' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('tagId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], TagController.prototype, "remove", null);
exports.TagController = TagController = __decorate([
    (0, swagger_1.ApiTags)('tags'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('tags'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, workspace_guard_1.WorkspaceGuard),
    (0, swagger_1.ApiHeader)({ name: 'x-workspace-id', required: true, description: 'Active workspace ID' }),
    __metadata("design:paramtypes", [tag_service_1.TagService])
], TagController);
//# sourceMappingURL=tag.controller.js.map