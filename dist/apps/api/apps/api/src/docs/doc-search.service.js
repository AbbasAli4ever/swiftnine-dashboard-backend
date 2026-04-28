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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocSearchService = void 0;
const common_1 = require("@nestjs/common");
const database_1 = require("../../../../libs/database/src");
const doc_permissions_service_1 = require("./doc-permissions.service");
let DocSearchService = class DocSearchService {
    prisma;
    permissions;
    constructor(prisma, permissions) {
        this.prisma = prisma;
        this.permissions = permissions;
    }
    async search(params) {
        const query = params.query.trim();
        if (!query)
            return [];
        const rows = params.projectId
            ? await this.searchProject(query, params.workspaceId, params.projectId, params.userId)
            : await this.searchWorkspace(query, params.workspaceId, params.userId);
        const results = [];
        for (const row of rows) {
            const role = await this.permissions.resolveEffectiveRole(params.userId, {
                id: row.id,
                scope: row.scope,
                workspaceId: row.workspaceId,
                projectId: row.projectId,
                ownerId: row.ownerId,
            });
            if (role)
                results.push(row);
        }
        return results;
    }
    searchWorkspace(query, workspaceId, userId) {
        return this.prisma.$queryRawUnsafe(`
      SELECT
        id,
        title,
        scope::text AS scope,
        workspace_id AS "workspaceId",
        project_id AS "projectId",
        owner_id AS "ownerId",
        updated_at AS "updatedAt",
        ts_headline(
          'english',
          plaintext,
          websearch_to_tsquery('english', $1),
          'MaxWords=24, MinWords=8, ShortWord=3'
        ) AS snippet
      FROM docs
      WHERE deleted_at IS NULL
        AND workspace_id = $2
        AND (
          owner_id = $3
          OR (
            scope = 'PERSONAL'
            AND EXISTS (
              SELECT 1 FROM doc_permissions
              WHERE doc_permissions.doc_id = docs.id
                AND doc_permissions.user_id = $3
            )
          )
          OR (
            scope <> 'PERSONAL'
            AND EXISTS (
              SELECT 1 FROM workspace_members
              WHERE workspace_members.workspace_id = docs.workspace_id
                AND workspace_members.user_id = $3
                AND workspace_members.deleted_at IS NULL
            )
          )
        )
        AND (
          to_tsvector('english', title) @@ websearch_to_tsquery('english', $1)
          OR to_tsvector('english', plaintext) @@ websearch_to_tsquery('english', $1)
        )
      ORDER BY
        ts_rank(
          setweight(to_tsvector('english', title), 'A') ||
          setweight(to_tsvector('english', plaintext), 'B'),
          websearch_to_tsquery('english', $1)
        ) DESC,
        updated_at DESC
      LIMIT 50
    `, query, workspaceId, userId);
    }
    searchProject(query, workspaceId, projectId, userId) {
        return this.prisma.$queryRawUnsafe(`
      SELECT
        id,
        title,
        scope::text AS scope,
        workspace_id AS "workspaceId",
        project_id AS "projectId",
        owner_id AS "ownerId",
        updated_at AS "updatedAt",
        ts_headline(
          'english',
          plaintext,
          websearch_to_tsquery('english', $1),
          'MaxWords=24, MinWords=8, ShortWord=3'
        ) AS snippet
      FROM docs
      WHERE deleted_at IS NULL
        AND workspace_id = $2
        AND project_id = $3
        AND (
          owner_id = $4
          OR EXISTS (
            SELECT 1 FROM workspace_members
            WHERE workspace_members.workspace_id = docs.workspace_id
              AND workspace_members.user_id = $4
              AND workspace_members.deleted_at IS NULL
          )
        )
        AND (
          to_tsvector('english', title) @@ websearch_to_tsquery('english', $1)
          OR to_tsvector('english', plaintext) @@ websearch_to_tsquery('english', $1)
        )
      ORDER BY
        ts_rank(
          setweight(to_tsvector('english', title), 'A') ||
          setweight(to_tsvector('english', plaintext), 'B'),
          websearch_to_tsquery('english', $1)
        ) DESC,
        updated_at DESC
      LIMIT 50
    `, query, workspaceId, projectId, userId);
    }
};
exports.DocSearchService = DocSearchService;
exports.DocSearchService = DocSearchService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_1.PrismaService,
        doc_permissions_service_1.DocPermissionsService])
], DocSearchService);
//# sourceMappingURL=doc-search.service.js.map