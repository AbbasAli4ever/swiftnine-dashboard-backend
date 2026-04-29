import { BadRequestException, PayloadTooLargeException } from '@nestjs/common';
import type { Prisma } from '@app/database/generated/prisma/client';
import {
  DOC_CONTENT_MAX_BYTES,
  DOC_CONTENT_TOO_LARGE,
} from './doc-permissions.constants';
import { normalizeDocBlockIds } from './doc-blocks.util';

type JsonRecord = Record<string, unknown>;

export type NormalizedDocContent = {
  contentJson: Prisma.InputJsonValue;
  plaintext: string;
};

export function normalizeDocContent(value: unknown): NormalizedDocContent {
  assertPlainObject(value);
  const { contentJson } = normalizeDocBlockIds(value as JsonRecord);
  assertContentSize(contentJson);

  return {
    contentJson: contentJson as Prisma.InputJsonValue,
    plaintext: extractPlaintext(contentJson),
  };
}

export function defaultDocContent(): NormalizedDocContent {
  return normalizeDocContent({});
}

export function extractPlaintext(value: unknown): string {
  const parts: string[] = [];
  collectText(value, parts);
  return parts
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function assertContentSize(value: unknown): void {
  const bytes = Buffer.byteLength(JSON.stringify(value), 'utf8');
  if (bytes > DOC_CONTENT_MAX_BYTES) {
    throw new PayloadTooLargeException(DOC_CONTENT_TOO_LARGE);
  }
}

function collectText(value: unknown, parts: string[]): void {
  if (Array.isArray(value)) {
    value.forEach((item) => collectText(item, parts));
    return;
  }

  if (!isPlainObject(value)) return;

  if (typeof value['text'] === 'string') {
    parts.push(value['text']);
  }

  const attrs = value['attrs'];
  if (
    value['type'] === 'mention' &&
    isPlainObject(attrs) &&
    typeof attrs['label'] === 'string'
  ) {
    parts.push(attrs['label']);
  }

  collectText(value['content'], parts);
}

function assertPlainObject(value: unknown): asserts value is JsonRecord {
  if (!isPlainObject(value)) {
    throw new BadRequestException('Document content must be a JSON object');
  }
}

function isPlainObject(value: unknown): value is JsonRecord {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}
