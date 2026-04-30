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
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const common_2 = require("../../../../libs/common/src");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const docs_service_1 = require("./docs.service");
const doc_search_service_1 = require("./doc-search.service");
const create_doc_dto_1 = require("./dto/create-doc.dto");
const update_doc_dto_1 = require("./dto/update-doc.dto");
const list_docs_query_dto_1 = require("./dto/list-docs-query.dto");
const search_docs_query_dto_1 = require("./dto/search-docs-query.dto");
class DocResponse {
    id;
    workspaceId;
    projectId;
    ownerId;
    scope;
    title;
    contentJson;
    plaintext;
    version;
    createdAt;
    updatedAt;
    deletedAt;
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], DocResponse.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], DocResponse.prototype, "workspaceId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ nullable: true, type: String }),
    __metadata("design:type", Object)
], DocResponse.prototype, "projectId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], DocResponse.prototype, "ownerId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['WORKSPACE', 'PROJECT', 'PERSONAL'] }),
    __metadata("design:type", String)
], DocResponse.prototype, "scope", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], DocResponse.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'TipTap JSON document' }),
    __metadata("design:type", Object)
], DocResponse.prototype, "contentJson", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], DocResponse.prototype, "plaintext", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Monotonically increasing save counter' }),
    __metadata("design:type", Number)
], DocResponse.prototype, "version", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], DocResponse.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], DocResponse.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ nullable: true, type: String }),
    __metadata("design:type", Object)
], DocResponse.prototype, "deletedAt", void 0);
class DocSearchResultResponse {
    id;
    title;
    scope;
    workspaceId;
    projectId;
    ownerId;
    updatedAt;
    snippet;
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], DocSearchResultResponse.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], DocSearchResultResponse.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['WORKSPACE', 'PROJECT', 'PERSONAL'] }),
    __metadata("design:type", String)
], DocSearchResultResponse.prototype, "scope", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], DocSearchResultResponse.prototype, "workspaceId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ nullable: true, type: String }),
    __metadata("design:type", Object)
], DocSearchResultResponse.prototype, "projectId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], DocSearchResultResponse.prototype, "ownerId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], DocSearchResultResponse.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ nullable: true, type: String, description: 'Highlighted excerpt matching the query' }),
    __metadata("design:type", Object)
], DocSearchResultResponse.prototype, "snippet", void 0);
let DocsController = class DocsController {
    docsService;
    searchService;
    constructor(docsService, searchService) {
        this.docsService = docsService;
        this.searchService = searchService;
    }
    async create(req, dto) {
        const doc = await this.docsService.create(req.user.id, dto);
        return (0, common_2.ok)(doc, 'Document created successfully');
    }
    async findAll(req, query) {
        const docs = await this.docsService.findAll(req.user.id, query);
        return (0, common_2.ok)(docs);
    }
    async search(req, query) {
        const results = await this.searchService.search({
            userId: req.user.id,
            workspaceId: query.workspaceId,
            projectId: query.projectId,
            query: query.q,
        });
        return (0, common_2.ok)(results);
    }
    async findOne(req, docId) {
        const doc = await this.docsService.findOne(req.user.id, docId);
        return (0, common_2.ok)(doc);
    }
    async update(req, docId, dto) {
        const doc = await this.docsService.update(req.user.id, docId, dto);
        return (0, common_2.ok)(doc, 'Document updated successfully');
    }
    async remove(req, docId) {
        await this.docsService.remove(req.user.id, docId);
        return (0, common_2.ok)(null, 'Document deleted successfully');
    }
};
exports.DocsController = DocsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create a document' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Document created', type: DocResponse }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_a = typeof AuthenticatedRequest !== "undefined" && AuthenticatedRequest) === "function" ? _a : Object, create_doc_dto_1.CreateDocDto]),
    __metadata("design:returntype", Promise)
], DocsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List documents in a workspace or project' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Documents returned', type: [DocResponse] }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof AuthenticatedRequest !== "undefined" && AuthenticatedRequest) === "function" ? _b : Object, list_docs_query_dto_1.ListDocsQueryDto]),
    __metadata("design:returntype", Promise)
], DocsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('search'),
    (0, swagger_1.ApiOperation)({ summary: 'Search documents by title and plaintext content' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Search results returned', type: [DocSearchResultResponse] }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof AuthenticatedRequest !== "undefined" && AuthenticatedRequest) === "function" ? _c : Object, search_docs_query_dto_1.SearchDocsQueryDto]),
    __metadata("design:returntype", Promise)
], DocsController.prototype, "search", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a document' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Document returned', type: DocResponse }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Document access denied' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Document not found' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_d = typeof AuthenticatedRequest !== "undefined" && AuthenticatedRequest) === "function" ? _d : Object, String]),
    __metadata("design:returntype", Promise)
], DocsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a document — prefer WebSocket doc:autosave for content edits' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Document updated', type: DocResponse }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_e = typeof AuthenticatedRequest !== "undefined" && AuthenticatedRequest) === "function" ? _e : Object, String, update_doc_dto_1.UpdateDocDto]),
    __metadata("design:returntype", Promise)
], DocsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Soft delete a document' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Document deleted' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_f = typeof AuthenticatedRequest !== "undefined" && AuthenticatedRequest) === "function" ? _f : Object, String]),
    __metadata("design:returntype", Promise)
], DocsController.prototype, "remove", null);
exports.DocsController = DocsController = __decorate([
    (0, swagger_1.ApiTags)('docs'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('docs'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [docs_service_1.DocsService,
        doc_search_service_1.DocSearchService])
], DocsController);
//# sourceMappingURL=docs.controller.js.map