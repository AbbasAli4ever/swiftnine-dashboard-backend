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
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const auth_module_1 = require("../auth/auth.module");
const presence_module_1 = require("../presence/presence.module");
const realtime_metrics_module_1 = require("../realtime/realtime-metrics.module");
const docs_gateway_1 = require("./docs.gateway");
const docs_controller_1 = require("./docs.controller");
const docs_service_1 = require("./docs.service");
const doc_locks_service_1 = require("./doc-locks.service");
const doc_permissions_service_1 = require("./doc-permissions.service");
const doc_presence_service_1 = require("./doc-presence.service");
const doc_search_service_1 = require("./doc-search.service");
const doc_roles_guard_1 = require("./guards/doc-roles.guard");
let DocsModule = class DocsModule {
};
exports.DocsModule = DocsModule;
exports.DocsModule = DocsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            auth_module_1.AuthModule,
            presence_module_1.PresenceModule,
            realtime_metrics_module_1.RealtimeMetricsModule,
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    secret: config.getOrThrow('JWT_ACCESS_SECRET'),
                }),
            }),
        ],
        controllers: [docs_controller_1.DocsController],
        providers: [
            docs_gateway_1.DocsGateway,
            docs_service_1.DocsService,
            doc_locks_service_1.DocLocksService,
            doc_permissions_service_1.DocPermissionsService,
            doc_presence_service_1.DocPresenceService,
            doc_search_service_1.DocSearchService,
            doc_roles_guard_1.DocRolesGuard,
        ],
        exports: [doc_permissions_service_1.DocPermissionsService, doc_roles_guard_1.DocRolesGuard, doc_locks_service_1.DocLocksService, doc_presence_service_1.DocPresenceService],
    })
], DocsModule);
//# sourceMappingURL=docs.module.js.map