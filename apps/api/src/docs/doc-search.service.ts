import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/database';
import type { DocScope } from '@app/database/generated/prisma/client';
import { DocPermissionsService } from './doc-permissions.service';
import { ProjectSecurityService } from '../project-security/project-security.service';

export interface DocSearchResult {
  id: string;
  title: string;
  scope: DocScope;
  workspaceId: string;
  projectId: string | null;
  ownerId: string;
  updatedAt: Date;
  snippet: string | null;
}

@Injectable()
export class DocSearchService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly permissions: DocPermissionsService,
    private readonly projectSecurity: ProjectSecurityService,
  ) {}

  async search(params: {
    query: string;
    workspaceId: string;
    projectId?: string;
    userId: string;
  }): Promise<DocSearchResult[]> {
    const query = params.query.trim();
    if (!query) return [];
    if (params.projectId) {
      await this.projectSecurity.assertUnlocked(params.workspaceId, params.projectId, params.userId);
    }

    const rows = params.projectId
      ? await this.searchProject(query, params.workspaceId, params.projectId, params.userId)
      : await this.searchWorkspace(query, params.workspaceId, params.userId);

    const results: DocSearchResult[] = [];
    const lockedProjectIds = Array.from(
      new Set(rows.map((row) => row.projectId).filter((id): id is string => Boolean(id))),
    );
    const projects = lockedProjectIds.length
      ? await this.prisma.project.findMany({
          where: { id: { in: lockedProjectIds } },
          select: { id: true, passwordHash: true },
        })
      : [];
    const unlockedByDefaultIds = new Set(
      projects.filter((project) => !project.passwordHash).map((project) => project.id),
    );
    const passwordProtectedProjectIds = projects
      .filter((project) => Boolean(project.passwordHash))
      .map((project) => project.id);
    const unlockedProjectIds = await this.projectSecurity.activeUnlockedProjectIds(
      passwordProtectedProjectIds,
      params.userId,
    );

    for (const row of rows) {
      if (
        row.projectId &&
        !unlockedByDefaultIds.has(row.projectId) &&
        !unlockedProjectIds.has(row.projectId)
      ) {
        continue;
      }

      const role = await this.permissions.resolveEffectiveRole(params.userId, {
        id: row.id,
        scope: row.scope,
        workspaceId: row.workspaceId,
        projectId: row.projectId,
        ownerId: row.ownerId,
      });
      if (role) results.push(row);
    }

    return results;
  }

  private searchWorkspace(
    query: string,
    workspaceId: string,
    userId: string,
  ): Promise<DocSearchResult[]> {
    return this.prisma.$queryRawUnsafe<DocSearchResult[]>(
      `
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
    `,
      query,
      workspaceId,
      userId,
    );
  }

  private searchProject(
    query: string,
    workspaceId: string,
    projectId: string,
    userId: string,
  ): Promise<DocSearchResult[]> {
    return this.prisma.$queryRawUnsafe<DocSearchResult[]>(
      `
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
    `,
      query,
      workspaceId,
      projectId,
      userId,
    );
  }
}
