import { PayloadTooLargeException } from '@nestjs/common';
import {
  assertContentSize,
  extractPlaintext,
  normalizeDocContent,
} from './doc-content';

jest.mock('node:crypto', () => ({
  randomUUID: jest.fn(() => 'generated-block-id'),
}));

describe('doc content helpers', () => {
  it('extracts plaintext from TipTap JSON', () => {
    const text = extractPlaintext({
      type: 'doc',
      content: [
        {
          type: 'heading',
          content: [{ type: 'text', text: 'Launch plan' }],
        },
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: 'Ship docs' },
            { type: 'mention', attrs: { label: 'Ayesha' } },
          ],
        },
      ],
    });

    expect(text).toBe('Launch plan Ship docs Ayesha');
  });

  it('normalizes missing block IDs', () => {
    const normalized = normalizeDocContent({
      type: 'doc',
      content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Hello' }] }],
    });

    expect(normalized.contentJson).toEqual({
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          attrs: { id: 'generated-block-id' },
          content: [{ type: 'text', text: 'Hello' }],
        },
      ],
    });
    expect(normalized.plaintext).toBe('Hello');
  });

  it('rejects content larger than 1 MB', () => {
    expect(() => assertContentSize({ text: 'x'.repeat(1024 * 1024) })).toThrow(
      PayloadTooLargeException,
    );
  });
});
