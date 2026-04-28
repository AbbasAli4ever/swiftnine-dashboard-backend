import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ok, type ApiResponse as ApiRes } from '@app/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { AuthUser } from '../auth/auth.service';
import { DocsService, type DocData } from './docs.service';
import { DocSearchService, type DocSearchResult } from './doc-search.service';
import { CreateDocDto } from './dto/create-doc.dto';
import { UpdateDocDto } from './dto/update-doc.dto';
import { ListDocsQueryDto } from './dto/list-docs-query.dto';
import { SearchDocsQueryDto } from './dto/search-docs-query.dto';
import type { Request } from 'express';

type AuthenticatedRequest = Request & { user: AuthUser };

@ApiTags('docs')
@ApiBearerAuth()
@Controller('docs')
@UseGuards(JwtAuthGuard)
export class DocsController {
  constructor(
    private readonly docsService: DocsService,
    private readonly searchService: DocSearchService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a document' })
  @ApiResponse({ status: 201, description: 'Document created' })
  async create(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateDocDto,
  ): Promise<ApiRes<DocData>> {
    const doc = await this.docsService.create(req.user.id, dto);
    return ok(doc, 'Document created successfully');
  }

  @Get()
  @ApiOperation({ summary: 'List documents in a workspace or project' })
  @ApiResponse({ status: 200, description: 'Documents returned' })
  async findAll(
    @Req() req: AuthenticatedRequest,
    @Query() query: ListDocsQueryDto,
  ): Promise<ApiRes<DocData[]>> {
    const docs = await this.docsService.findAll(req.user.id, query);
    return ok(docs);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search documents by title and plaintext content' })
  @ApiResponse({ status: 200, description: 'Search results returned' })
  async search(
    @Req() req: AuthenticatedRequest,
    @Query() query: SearchDocsQueryDto,
  ): Promise<ApiRes<DocSearchResult[]>> {
    const results = await this.searchService.search({
      userId: req.user.id,
      workspaceId: query.workspaceId,
      projectId: query.projectId,
      query: query.q,
    });
    return ok(results);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a document' })
  @ApiResponse({ status: 200, description: 'Document returned' })
  @ApiResponse({ status: 403, description: 'Document access denied' })
  @ApiResponse({ status: 404, description: 'Document not found' })
  async findOne(
    @Req() req: AuthenticatedRequest,
    @Param('id') docId: string,
  ): Promise<ApiRes<DocData>> {
    const doc = await this.docsService.findOne(req.user.id, docId);
    return ok(doc);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a document' })
  @ApiResponse({ status: 200, description: 'Document updated' })
  async update(
    @Req() req: AuthenticatedRequest,
    @Param('id') docId: string,
    @Body() dto: UpdateDocDto,
  ): Promise<ApiRes<DocData>> {
    const doc = await this.docsService.update(req.user.id, docId, dto);
    return ok(doc, 'Document updated successfully');
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Soft delete a document' })
  @ApiResponse({ status: 200, description: 'Document deleted' })
  async remove(
    @Req() req: AuthenticatedRequest,
    @Param('id') docId: string,
  ): Promise<ApiRes<null>> {
    await this.docsService.remove(req.user.id, docId);
    return ok(null, 'Document deleted successfully');
  }
}
