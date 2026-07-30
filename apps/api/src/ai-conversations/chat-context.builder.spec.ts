import {
  ChatContextBuilder,
  MAX_IMAGES_PER_REQUEST,
  MAX_TOTAL_ATTACHMENT_CONTEXT_CHARS,
} from './chat-context.builder';

jest.mock('@app/database', () => ({ PrismaService: class PrismaService {} }));
jest.mock('@app/common', () => ({ S3Service: class S3Service {} }));

const CONV = 'conv-1';

type Row = {
  role: 'USER' | 'ASSISTANT' | 'SYSTEM';
  content: string;
  attachments?: Array<Record<string, unknown>>;
};

function doc(fileName: string, extractedText: string | null, extractionStatus?: string) {
  return {
    id: `att-${fileName}`,
    fileName,
    mimeType: 'application/pdf',
    s3Key: `keys/${fileName}`,
    uploadStatus: 'CONFIRMED',
    contentType: 'PDF',
    metadata: { extractedText, extractionStatus },
  };
}

function image(fileName: string) {
  return {
    id: `att-${fileName}`,
    fileName,
    mimeType: 'image/png',
    s3Key: `keys/${fileName}`,
    uploadStatus: 'CONFIRMED',
    contentType: 'IMAGE',
    metadata: {},
  };
}

function makeBuilder(rows: Row[], signUrl?: jest.Mock) {
  const prisma = {
    aiConversationMessage: {
      findMany: jest
        .fn()
        .mockResolvedValue(rows.map((r) => ({ ...r, attachments: r.attachments ?? [] }))),
    },
  };
  const s3 = {
    createPresignedGetUrl:
      signUrl ?? jest.fn().mockImplementation((key: string) => Promise.resolve(`https://s3/${key}?sig=x`)),
  };
  return { builder: new ChatContextBuilder(prisma as never, s3 as never), prisma, s3 };
}

describe('ChatContextBuilder', () => {
  it('returns plain messages in chronological order', async () => {
    const { builder } = makeBuilder([
      { role: 'USER', content: 'first' },
      { role: 'ASSISTANT', content: 'second' },
    ]);

    await expect(builder.build(CONV)).resolves.toEqual([
      { role: 'user', content: 'first' },
      { role: 'assistant', content: 'second' },
    ]);
  });

  // Note: the doc system message lands AFTER its user turn. That is what the
  // frontend's buildApiMessages produced (docs are pushed before the message,
  // then the whole array is reversed), and this port preserves it deliberately.
  it('injects extracted document text as a system message', async () => {
    const { builder } = makeBuilder([
      { role: 'USER', content: 'summarise', attachments: [doc('a.pdf', 'DOC BODY', 'ok')] },
    ]);

    await expect(builder.build(CONV)).resolves.toEqual([
      { role: 'user', content: 'summarise' },
      { role: 'system', content: 'Attached document "a.pdf":\nDOC BODY' },
    ]);
  });

  it.each([
    ['unsupported', "can't read its contents (unsupported file type)"],
    ['failed', "couldn't read its contents"],
  ])('explains a %s extraction rather than dropping the file', async (status, expected) => {
    const { builder } = makeBuilder([
      { role: 'USER', content: 'read this', attachments: [doc('a.xyz', null, status)] },
    ]);

    const result = await builder.build(CONV);
    const systemMessage = result.find((m) => m.role === 'system')!;
    expect(systemMessage.content).toContain(expected);
  });

  it('notes missing content when extraction produced nothing', async () => {
    const { builder } = makeBuilder([
      { role: 'USER', content: 'x', attachments: [doc('a.pdf', null, 'ok')] },
    ]);

    const result = await builder.build(CONV);
    const systemMessage = result.find((m) => m.role === 'system')!;
    expect(systemMessage.content).toBe('Attached document "a.pdf": (content not available).');
  });

  it('clips document text at the cumulative character budget', async () => {
    const huge = 'x'.repeat(MAX_TOTAL_ATTACHMENT_CONTEXT_CHARS + 5_000);
    const { builder } = makeBuilder([
      { role: 'USER', content: 'a', attachments: [doc('big.pdf', huge, 'ok')] },
    ]);

    const result = await builder.build(CONV);
    const systemMessage = result.find((m) => m.role === 'system')!;
    expect((systemMessage.content as string).length).toBe(MAX_TOTAL_ATTACHMENT_CONTEXT_CHARS);
  });

  it('degrades older documents to a placeholder once the budget is spent', async () => {
    const huge = 'x'.repeat(MAX_TOTAL_ATTACHMENT_CONTEXT_CHARS);
    // Newest-first spending: the LATER message keeps its text, the older one degrades.
    const { builder } = makeBuilder([
      { role: 'USER', content: 'old', attachments: [doc('old.pdf', 'OLD TEXT', 'ok')] },
      { role: 'USER', content: 'new', attachments: [doc('new.pdf', huge, 'ok')] },
    ]);

    const result = await builder.build(CONV);
    const contents = result.map((m) => m.content as string);
    expect(contents.some((c) => c.includes('old.pdf') && c.includes('omitted'))).toBe(true);
    expect(contents.some((c) => c.startsWith('Attached document "new.pdf"'))).toBe(true);
  });

  it('attaches images as image_url parts alongside the text', async () => {
    const { builder } = makeBuilder([
      { role: 'USER', content: 'what is this', attachments: [image('p.png')] },
    ]);

    const [message] = await builder.build(CONV);
    expect(message.content).toEqual([
      { type: 'text', text: 'what is this' },
      { type: 'image_url', image_url: { url: 'https://s3/keys/p.png?sig=x' } },
    ]);
  });

  it('mints a fresh signed URL per image rather than reusing a stored one', async () => {
    const sign = jest.fn().mockResolvedValue('https://s3/fresh');
    const { builder } = makeBuilder(
      [{ role: 'USER', content: 'x', attachments: [image('p.png')] }],
      sign,
    );

    await builder.build(CONV);
    expect(sign).toHaveBeenCalledWith('keys/p.png');
  });

  it('replaces images beyond the per-request cap with a placeholder', async () => {
    const many = Array.from({ length: MAX_IMAGES_PER_REQUEST + 2 }, (_, i) => image(`i${i}.png`));
    const { builder } = makeBuilder([{ role: 'USER', content: 'x', attachments: many }]);

    const [message] = await builder.build(CONV);
    const parts = message.content as Array<{ type: string; text?: string }>;
    expect(parts.filter((p) => p.type === 'image_url')).toHaveLength(MAX_IMAGES_PER_REQUEST);
    expect(parts.filter((p) => p.text?.includes('too many images'))).toHaveLength(2);
  });

  it('degrades to a text note when signing fails', async () => {
    const sign = jest.fn().mockRejectedValue(new Error('s3 down'));
    const { builder } = makeBuilder(
      [{ role: 'USER', content: 'x', attachments: [image('p.png')] }],
      sign,
    );

    const [message] = await builder.build(CONV);
    expect(message.content).toEqual([
      { type: 'text', text: 'x' },
      { type: 'text', text: '[Image attachment "p.png" could not be loaded]' },
    ]);
  });

  it('only considers confirmed, non-deleted attachments', async () => {
    const { builder, prisma } = makeBuilder([{ role: 'USER', content: 'x' }]);
    await builder.build(CONV);

    const select = prisma.aiConversationMessage.findMany.mock.calls[0][0].select;
    expect(select.attachments.where).toEqual({
      deletedAt: null,
      uploadStatus: 'CONFIRMED',
    });
  });
});
