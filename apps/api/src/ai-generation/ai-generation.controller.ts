import { Body, Controller, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ok, type ApiResponse as ApiRes } from '@app/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WorkspaceGuard } from '../workspace/workspace.guard';
import type { WorkspaceRequest } from '../workspace/workspace.types';
import {
  AiGenerationService,
  type DraftedDocument,
  type DraftedPresentation,
  type GeneratedImage,
} from './ai-generation.service';
import { GeneratePromptDto } from './dto/generate-prompt.dto';

@ApiTags('ai-generation')
@ApiBearerAuth()
@ApiHeader({ name: 'x-workspace-id', required: true, description: 'Active workspace ID' })
@Controller('ai-generation')
@UseGuards(JwtAuthGuard, WorkspaceGuard)
export class AiGenerationController {
  constructor(private readonly service: AiGenerationService) {}

  @Post('document-draft')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Draft structured document content from a prompt',
    description:
      "Step 1 of document generation. The drafting model follows the caller's workspace AI tier. Pass the result to /document-generation/pdf or /ppt to render it.",
  })
  @ApiResponse({ status: 200, description: 'Draft produced' })
  @ApiResponse({ status: 502, description: 'Model returned no or malformed content' })
  async draftDocument(
    @Req() req: WorkspaceRequest,
    @Body() dto: GeneratePromptDto,
  ): Promise<ApiRes<DraftedDocument | DraftedPresentation>> {
    const draft = await this.service.draftDocument(
      req.workspaceContext.workspaceId,
      req.user.id,
      dto.prompt,
      dto.format ?? 'pdf',
    );
    return ok(draft);
  }

  @Post('image')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Generate a 1024x1024 PNG from a prompt',
    description:
      "The model follows the caller's workspace AI tier (standard -> gpt-image-1-mini, premium -> gpt-image-2) and is metered on the same weekly token allowance as chat and document drafting.",
  })
  @ApiResponse({ status: 200, description: 'Image generated (base64)' })
  @ApiResponse({ status: 502, description: 'No image returned' })
  async generateImage(
    @Req() req: WorkspaceRequest,
    @Body() dto: GeneratePromptDto,
  ): Promise<ApiRes<GeneratedImage>> {
    const image = await this.service.generateImage(
      req.workspaceContext.workspaceId,
      req.user.id,
      dto.prompt,
    );
    return ok(image);
  }
}
