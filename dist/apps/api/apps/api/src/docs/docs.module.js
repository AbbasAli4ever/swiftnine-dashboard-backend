"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocsModule = void 0;
const common_1 = require("@nestjs/common");
const docs_controller_1 = require("./docs.controller");
const docs_service_1 = require("./docs.service");
const doc_permissions_service_1 = require("./doc-permissions.service");
const doc_search_service_1 = require("./doc-search.service");
const doc_roles_guard_1 = require("./guards/doc-roles.guard");
let DocsModule = class DocsModule {
};
exports.DocsModule = DocsModule;
exports.DocsModule = DocsModule = __decorate([
    (0, common_1.Module)({
        controllers: [docs_controller_1.DocsController],
        providers: [
            docs_service_1.DocsService,
            doc_permissions_service_1.DocPermissionsService,
            doc_search_service_1.DocSearchService,
            doc_roles_guard_1.DocRolesGuard,
        ],
        exports: [doc_permissions_service_1.DocPermissionsService, doc_roles_guard_1.DocRolesGuard],
    })
], DocsModule);
//# sourceMappingURL=docs.module.js.map