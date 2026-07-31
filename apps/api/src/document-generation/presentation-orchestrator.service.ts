import { Injectable, Logger } from '@nestjs/common';
import { AiGenerationService } from '../ai-generation/ai-generation.service';
import { MAX_DECK_IMAGES_SAFETY_CEILING } from '../ai-generation/ai-generation.constants';
import type { GeneratePresentationInput, PresentationSlide } from './dto/generate-presentation.dto';

export interface ResolvedImageSlide {
  imageData?: { b64Json: string; mimeType: string };
}

export type ResolvedPresentationSlide = PresentationSlide & ResolvedImageSlide;

export interface ResolvedPresentation
  extends Omit<GeneratePresentationInput, 'slides'> {
  slides: ResolvedPresentationSlide[];
}

@Injectable()
export class PresentationOrchestratorService {
  private readonly logger = new Logger(PresentationOrchestratorService.name);

  constructor(private readonly aiGeneration: AiGenerationService) {}

  /**
   * Resolves every slide's `imagePrompt` (image-left/image-right layouts) into
   * real image bytes via the existing image-generation call, then returns the
   * deck with `imageData` spliced back in by slide index. The number of images
   * is entirely content-driven (however many slides the drafted deck actually
   * carries an `imagePrompt` for) — `MAX_DECK_IMAGES_SAFETY_CEILING` only trims
   * a pathological/malformed response, it is not a target to design toward.
   */
  async resolveImages(
    workspaceId: string,
    userId: string,
    input: GeneratePresentationInput,
  ): Promise<ResolvedPresentation> {
    const candidateIndexes = input.slides
      .map((slide, index) => ({ slide, index }))
      .filter(
        (
          entry,
        ): entry is { slide: Extract<PresentationSlide, { imagePrompt: string }>; index: number } =>
          (entry.slide.type === 'image-left' || entry.slide.type === 'image-right') &&
          Boolean(entry.slide.imagePrompt),
      );

    const trimmed = candidateIndexes.slice(0, MAX_DECK_IMAGES_SAFETY_CEILING);
    if (candidateIndexes.length > MAX_DECK_IMAGES_SAFETY_CEILING) {
      this.logger.warn(
        `Presentation requested ${candidateIndexes.length} images, exceeding the safety ceiling of ${MAX_DECK_IMAGES_SAFETY_CEILING}; only the first ${MAX_DECK_IMAGES_SAFETY_CEILING} will be generated.`,
      );
    }

    const results = await Promise.all(
      trimmed.map(({ slide, index }) =>
        this.aiGeneration
          .generateImage(workspaceId, userId, slide.imagePrompt)
          .then((image) => ({ index, image }))
          .catch((err) => {
            this.logger.warn(
              `Image generation failed for slide ${index}, rendering without an image: ${(err as Error).message}`,
            );
            return null;
          }),
      ),
    );

    const slides: ResolvedPresentationSlide[] = input.slides.map((slide) => ({ ...slide }));
    for (const result of results) {
      if (!result) continue;
      slides[result.index] = {
        ...slides[result.index],
        imageData: { b64Json: result.image.b64Json, mimeType: result.image.mimeType },
      };
    }

    return { ...input, slides };
  }
}
