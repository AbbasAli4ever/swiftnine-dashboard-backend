import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@app/database';
import { AttachmentUploadStatus } from '@app/database/generated/prisma/client';
import { S3Service } from '@app/common';
import type OpenAI from 'openai';

/**
 * Cumulative cap across the whole request — once exceeded, older documents
 * degrade to a placeholder note instead of their full extracted text.
 */
export const MAX_TOTAL_ATTACHMENT_CONTEXT_CHARS = 60_000;

/**
 * Older images beyond this count degrade to a text placeholder — keeps a long
 * conversation from re-sending dozens of full images on every turn.
 */
export const MAX_IMAGES_PER_REQUEST = 6;

type ContentPart =
  | { type: 'text'; text: string }
  | { type: 'image_url'; image_url: { url: string } };

type ExtractionStatus = 'ok' | 'unsupported' | 'failed' | null;

interface AttachmentContext {
  id: string;
  fileName: string;
  mimeType: string | null;
  s3Key: string | null;
  uploadStatus: AttachmentUploadStatus;
  contentType: string | null;
  extractedText: string | null;
  extractionStatus: ExtractionStatus;
}

interface MessageContext {
  role: 'user' | 'assistant' | 'system';
  content: string;
  attachments: AttachmentContext[];
}

function isImageAttachment(attachment: AttachmentContext): boolean {
  return (
    (attachment.mimeType?.startsWith('image/') ?? false) ||
    attachment.contentType === 'IMAGE' ||
    attachment.contentType === 'GENERATED_IMAGE'
  );
}

function docContextNote(attachment: AttachmentContext): string {
  if (attachment.extractionStatus === 'unsupported') {
    return `Attached document "${attachment.fileName}": I can see you attached this file, but I can't read its contents (unsupported file type).`;
  }
  if (attachment.extractionStatus === 'failed') {
    return `Attached document "${attachment.fileName}": I can see you attached this file, but couldn't read its contents.`;
  }
  if (!attachment.extractedText) {
    return `Attached document "${attachment.fileName}": (content not available).`;
  }
  return `Attached document "${attachment.fileName}":\n${attachment.extractedText}`;
}

/**
 * Assembles the OpenAI message array for a conversation, including
 * attachment context.
 *
 * Ported from the frontend's buildApiMessages so history assembly lives next to
 * the data. Budget and cap semantics are deliberately identical — changing them
 * changes what the model sees.
 */
@Injectable()
export class ChatContextBuilder {
  private readonly logger = new Logger(ChatContextBuilder.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly s3: S3Service,
  ) {}

  async build(conversationId: string): Promise<OpenAI.Chat.ChatCompletionMessageParam[]> {
    const messages = await this.loadMessages(conversationId);

    let remainingCharBudget = MAX_TOTAL_ATTACHMENT_CONTEXT_CHARS;
    let remainingImageBudget = MAX_IMAGES_PER_REQUEST;
    const built: OpenAI.Chat.ChatCompletionMessageParam[] = [];

    // Walk newest-first so the caps are spent on the most recent context first,
    // then reverse back into chronological order before returning.
    for (const message of [...messages].reverse()) {
      const images = message.attachments.filter(isImageAttachment);
      const docs = message.attachments.filter((a) => !isImageAttachment(a));

      for (const doc of docs) {
        if (remainingCharBudget <= 0) {
          built.push({
            role: 'system',
            content: `Attached document "${doc.fileName}": (omitted — conversation context limit reached).`,
          });
          continue;
        }
        const note = docContextNote(doc);
        const clipped =
          note.length > remainingCharBudget ? note.slice(0, remainingCharBudget) : note;
        remainingCharBudget -= clipped.length;
        built.push({ role: 'system', content: clipped });
      }

      const imageParts: ContentPart[] = [];
      for (const image of images) {
        if (remainingImageBudget <= 0) {
          imageParts.push({
            type: 'text',
            text: `[Image attachment "${image.fileName}" omitted — too many images in this conversation]`,
          });
          continue;
        }
        const url = await this.resolveImageUrl(image);
        if (!url) {
          imageParts.push({
            type: 'text',
            text: `[Image attachment "${image.fileName}" could not be loaded]`,
          });
          continue;
        }
        imageParts.push({ type: 'image_url', image_url: { url } });
        remainingImageBudget -= 1;
      }

      if (imageParts.length > 0) {
        built.push({
          role: message.role,
          content: [{ type: 'text', text: message.content }, ...imageParts],
        } as OpenAI.Chat.ChatCompletionMessageParam);
      } else {
        built.push({
          role: message.role,
          content: message.content,
        } as OpenAI.Chat.ChatCompletionMessageParam);
      }
    }

    return built.reverse();
  }

  private async loadMessages(conversationId: string): Promise<MessageContext[]> {
    const rows = await this.prisma.aiConversationMessage.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
      select: {
        role: true,
        content: true,
        attachments: {
          where: { deletedAt: null, uploadStatus: AttachmentUploadStatus.CONFIRMED },
          select: {
            id: true,
            fileName: true,
            mimeType: true,
            s3Key: true,
            uploadStatus: true,
            contentType: true,
            metadata: true,
          },
        },
      },
    });

    return rows.map((row) => ({
      role: row.role.toLowerCase() as 'user' | 'assistant' | 'system',
      content: row.content,
      attachments: row.attachments.map((attachment) => {
        const metadata = (attachment.metadata ?? {}) as Record<string, unknown>;
        return {
          id: attachment.id,
          fileName: attachment.fileName,
          mimeType: attachment.mimeType,
          s3Key: attachment.s3Key,
          uploadStatus: attachment.uploadStatus,
          contentType: attachment.contentType,
          extractedText:
            typeof metadata.extractedText === 'string' ? metadata.extractedText : null,
          extractionStatus: (typeof metadata.extractionStatus === 'string'
            ? metadata.extractionStatus
            : null) as ExtractionStatus,
        };
      }),
    }));
  }

  /**
   * Images need a URL OpenAI's servers can fetch. Signed S3 URLs expire, so one
   * is minted per request rather than reusing anything stored.
   */
  private async resolveImageUrl(attachment: AttachmentContext): Promise<string | null> {
    if (!attachment.s3Key) return null;
    try {
      return await this.s3.createPresignedGetUrl(attachment.s3Key);
    } catch (err) {
      this.logger.warn(
        `Could not sign URL for attachment ${attachment.id}: ${(err as Error).message}`,
      );
      return null;
    }
  }
}
