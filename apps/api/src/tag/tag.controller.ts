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
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WorkspaceGuard } from '../workspace/workspace.guard';
import { TagService, type TagData } from './tag.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import type { WorkspaceRequest } from '../workspace/workspace.types';
import { ok, type ApiResponse as ApiRes } from '@app/common';

@ApiTags('tags')
@ApiBearerAuth()
@Controller('tags')
@UseGuards(JwtAuthGuard, WorkspaceGuard)
@ApiHeader({ name: 'x-workspace-id', required: true, description: 'Active workspace ID' })
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new tag in the workspace' })
  @ApiResponse({ status: 201, description: 'Tag created' })
  @ApiResponse({ status: 409, description: 'Tag name already taken in this workspace' })
  async create(
    @Req() req: WorkspaceRequest,
    @Body() dto: CreateTagDto,
  ): Promise<ApiRes<TagData>> {
    const tag = await this.tagService.create(req.workspaceContext.workspaceId, req.user.id, dto);
    return ok(tag, 'Tag created successfully');
  }

  @Get()
  @ApiOperation({ summary: 'List all tags in the workspace' })
  @ApiResponse({ status: 200, description: 'Tags returned' })
  async findAll(@Req() req: WorkspaceRequest): Promise<ApiRes<TagData[]>> {
    const tags = await this.tagService.findAll(req.workspaceContext.workspaceId);
    return ok(tags);
  }

  @Patch(':tagId')
  @ApiOperation({ summary: 'Update tag name or color' })
  @ApiResponse({ status: 200, description: 'Tag updated' })
  @ApiResponse({ status: 404, description: 'Tag not found' })
  async update(
    @Req() req: WorkspaceRequest,
    @Param('tagId') tagId: string,
    @Body() dto: UpdateTagDto,
  ): Promise<ApiRes<TagData>> {
    const tag = await this.tagService.update(req.workspaceContext.workspaceId, req.user.id, tagId, dto);
    return ok(tag, 'Tag updated successfully');
  }

  @Delete(':tagId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a tag (cascades off all tasks)' })
  @ApiResponse({ status: 200, description: 'Tag deleted' })
  @ApiResponse({ status: 404, description: 'Tag not found' })
  async remove(
    @Req() req: WorkspaceRequest,
    @Param('tagId') tagId: string,
  ): Promise<ApiRes<null>> {
    await this.tagService.remove(req.workspaceContext.workspaceId, req.user.id, tagId);
    return ok(null, 'Tag deleted successfully');
  }
}
