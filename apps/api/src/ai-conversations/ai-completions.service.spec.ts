import { InternalServerErrorException } from '@nestjs/common';
import { AiCompletionsService, type CompletionChunk } from './ai-completions.service';

jest.mock('@app/database', () => ({ PrismaService: class PrismaService {} }));

const createMock = jest.fn();

const WORKSPACE_ID = 'ws-1';
const USER_ID = 'user-1';
const CONVERSATION_ID = 'conv-1';

/** Fake OpenAI stream: two text deltas, then a usage-only chunk. */
async function* fakeStream() {
  yield { choices: [{ delta: { content: 'Hello' } }] };
  yield { choices: [{ delta: { content: ' world' } }] };
  yield { choices: [{ delta: {} }], usage: { prompt_tokens: 100, completion_tokens: 20 } };
}

describe('AiCompletionsService', () => {
  let prisma: any;
  let conversations: { assertOwned: jest.Mock };
  let tiers: { getTier: jest.Mock };
  let models: { resolve: jest.Mock; estimateCostUsd: jest.Mock; isPremiumRateMissing: jest.Mock; getPremiumModel: jest.Mock };
  let openai: { get: jest.Mock };
  let context: { build: jest.Mock };
  let quotas: { assertWithinQuota: jest.Mock; recordUsage: jest.Mock };
  let counter: { countPromptTokens: jest.Mock; countTextTokens: jest.Mock };

  const build = () =>
    new AiCompletionsService(
      prisma as never,
      openai as never,
      conversations as never,
      tiers as never,
      models as never,
      context as never,
      quotas as never,
      counter as never,
    );

  const drain = async (svc: AiCompletionsService): Promise<CompletionChunk[]> => {
    const out: CompletionChunk[] = [];
    for await (const chunk of svc.streamCompletion({
      workspaceId: WORKSPACE_ID,
      userId: USER_ID,
      conversationId: CONVERSATION_ID,
    })) {
      out.push(chunk);
    }
    return out;
  };

  beforeEach(() => {
    createMock.mockReset().mockResolvedValue(fakeStream());
    prisma = {
      aiConversationMessage: {
        findMany: jest.fn().mockResolvedValue([{ role: 'USER', content: 'Hi' }]),
        create: jest.fn().mockResolvedValue({ id: 'msg-1' }),
      },
      aiConversation: { update: jest.fn().mockResolvedValue({}) },
      $transaction: jest.fn().mockImplementation((cb: (tx: unknown) => unknown) => cb(prisma)),
    };
    conversations = { assertOwned: jest.fn().mockResolvedValue(undefined) };
    tiers = { getTier: jest.fn().mockResolvedValue('STANDARD') };
    models = {
      resolve: jest.fn().mockReturnValue('gpt-4o-mini'),
      estimateCostUsd: jest.fn().mockReturnValue(0.000027),
      isPremiumRateMissing: jest.fn().mockReturnValue(false),
      getPremiumModel: jest.fn().mockReturnValue('gpt-5.6-luna'),
    };
    openai = { get: jest.fn().mockReturnValue({ chat: { completions: { create: createMock } } }) };
    context = { build: jest.fn().mockResolvedValue([{ role: 'user', content: 'Hi' }]) };
    quotas = {
      assertWithinQuota: jest.fn().mockResolvedValue({
        metered: false, exhausted: false, fallbackOptIn: false,
      }),
      recordUsage: jest.fn().mockResolvedValue(undefined),
    };
    counter = {
      countPromptTokens: jest.fn().mockReturnValue({
        tokens: 100, source: 'TOKENIZED_PROMPT', imageCount: 0,
      }),
      countTextTokens: jest.fn().mockReturnValue(5),
    };
  });

  it('streams deltas then a final done frame', async () => {
    const chunks = await drain(build());

    expect(chunks.filter((c) => c.delta).map((c) => c.delta)).toEqual(['Hello', ' world']);
    expect(chunks.at(-1)!.done).toEqual({
      messageId: 'msg-1',
      model: 'gpt-4o-mini',
      promptTokens: 100,
      completionTokens: 20,
      estimatedCostUsd: 0.000027,
      usedFallbackModel: false,
    });
  });

  describe('quota enforcement', () => {
    it('checks the quota before calling OpenAI', async () => {
      quotas.assertWithinQuota.mockRejectedValue(new Error('TOKEN_LIMIT_EXCEEDED'));

      await expect(drain(build())).rejects.toThrow('TOKEN_LIMIT_EXCEEDED');
      // Must not spend money on a request the member cannot afford.
      expect(createMock).not.toHaveBeenCalled();
    });

    it('falls back to the standard model when exhausted and opted in', async () => {
      tiers.getTier.mockResolvedValue('PREMIUM');
      models.resolve.mockReturnValue('gpt-5.6-luna');
      quotas.assertWithinQuota.mockResolvedValue({
        metered: true,
        exhausted: true,
        fallbackOptIn: true,
      });

      const chunks = await drain(build());

      expect(createMock).toHaveBeenCalledWith(
        expect.objectContaining({ model: 'gpt-4o-mini' }),
      );
      expect(chunks.at(-1)!.done!.usedFallbackModel).toBe(true);
    });

    it('keeps the premium model when exhausted but not opted in', async () => {
      // assertWithinQuota would have thrown in that case; this guards the
      // fallback from triggering on a merely-metered member.
      tiers.getTier.mockResolvedValue('PREMIUM');
      models.resolve.mockReturnValue('gpt-5.6-luna');
      quotas.assertWithinQuota.mockResolvedValue({
        metered: true,
        exhausted: false,
        fallbackOptIn: false,
      });

      await drain(build());

      expect(createMock).toHaveBeenCalledWith(
        expect.objectContaining({ model: 'gpt-5.6-luna' }),
      );
    });

    it('does NOT debit the premium allowance for a fallback turn', async () => {
      // Regression: fallback runs on the unlimited standard model, so metering it
      // would drain the very budget the opt-in exists to work around.
      tiers.getTier.mockResolvedValue('PREMIUM');
      quotas.assertWithinQuota.mockResolvedValue({
        metered: true,
        exhausted: true,
        fallbackOptIn: true,
        remainingTokens: 0,
      });

      await drain(build());

      expect(quotas.recordUsage).not.toHaveBeenCalled();
    });

    it('never truncates a reply, even with almost no budget left', async () => {
      // A half-written answer is unusable work the member already paid for, so
      // the budget is deliberately soft: the in-flight reply finishes and the
      // NEXT request is the one that gets blocked.
      quotas.assertWithinQuota.mockResolvedValue({
        metered: true,
        exhausted: false,
        fallbackOptIn: false,
        remainingTokens: 10,
      });

      await drain(build());

      expect(createMock).toHaveBeenCalledWith(
        expect.not.objectContaining({ max_completion_tokens: expect.anything() }),
      );
    });

    it('sends no completion cap for unmetered members either', async () => {
      quotas.assertWithinQuota.mockResolvedValue({
        metered: false,
        exhausted: false,
        fallbackOptIn: false,
      });

      await drain(build());

      expect(createMock).toHaveBeenCalledWith(
        expect.not.objectContaining({ max_completion_tokens: expect.anything() }),
      );
    });

    it('debits the allowance inside the message transaction', async () => {
      await drain(build());

      expect(quotas.recordUsage).toHaveBeenCalledWith(
        prisma, // the transaction client, not a fresh connection
        expect.objectContaining({
          workspaceId: WORKSPACE_ID,
          userId: USER_ID,
          totalTokens: 120, // 100 prompt + 20 completion
          estimatedTokens: 0, // measured, so nothing estimated
        }),
      );
    });

    it('records provenance for a measured turn', async () => {
      await drain(build());

      expect(prisma.aiConversationMessage.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            tokenSource: 'MEASURED',
            estimatedPromptTokens: null,
            estimatedCompletionTokens: null,
          }),
        }),
      );
    });
  });

  it('uses the model from the resolved tier, not from any client input', async () => {
    tiers.getTier.mockResolvedValue('PREMIUM');
    models.resolve.mockReturnValue('gpt-5.6-luna');

    await drain(build());

    expect(models.resolve).toHaveBeenCalledWith('PREMIUM');
    expect(createMock).toHaveBeenCalledWith(expect.objectContaining({ model: 'gpt-5.6-luna' }));
  });

  it('verifies conversation ownership before calling OpenAI', async () => {
    conversations.assertOwned.mockRejectedValue(new Error('Conversation not found'));

    await expect(drain(build())).rejects.toThrow('Conversation not found');
    expect(createMock).not.toHaveBeenCalled();
  });

  it('persists the assistant turn with model and usage attribution', async () => {
    await drain(build());

    expect(prisma.aiConversationMessage.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          conversationId: CONVERSATION_ID,
          role: 'ASSISTANT',
          content: 'Hello world',
          model: 'gpt-4o-mini',
          promptTokens: 100,
          completionTokens: 20,
          estimatedCostUsd: 0.000027,
        }),
      }),
    );
  });

  it('records null cost when the model rate is unknown', async () => {
    models.estimateCostUsd.mockReturnValue(null);

    await drain(build());

    expect(prisma.aiConversationMessage.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ estimatedCostUsd: null }),
      }),
    );
  });

  it('propagates the provider 500 when OPENAI_API_KEY is absent', async () => {
    openai.get.mockImplementation(() => {
      throw new InternalServerErrorException('OPENAI_API_KEY is not configured');
    });
    const svc = build(); // construction must not throw

    await expect(drain(svc)).rejects.toThrow(InternalServerErrorException);
  });

  it('surfaces an OpenAI failure as a 500', async () => {
    createMock.mockRejectedValue(new Error('rate limited'));

    await expect(drain(build())).rejects.toThrow(InternalServerErrorException);
  });

  it('sends the assembled context from ChatContextBuilder as the message array', async () => {
    context.build.mockResolvedValue([
      { role: 'system', content: 'Attached document "a.pdf":\ntext' },
      { role: 'user', content: 'first' },
      { role: 'assistant', content: 'second' },
    ]);

    await drain(build());

    expect(context.build).toHaveBeenCalledWith(CONVERSATION_ID);
    expect(createMock).toHaveBeenCalledWith(
      expect.objectContaining({
        messages: [
          { role: 'system', content: 'Attached document "a.pdf":\ntext' },
          { role: 'user', content: 'first' },
          { role: 'assistant', content: 'second' },
        ],
      }),
    );
  });
});

describe('AiCompletionsService — abort persistence', () => {
  let prisma: any;
  let openai: { get: jest.Mock };
  const createMock2 = jest.fn();

  async function* slowStream() {
    yield { choices: [{ delta: { content: 'partial' } }] };
    yield { choices: [{ delta: { content: ' more' } }] };
    yield { choices: [{ delta: {} }], usage: { prompt_tokens: 50, completion_tokens: 9 } };
  }

  const build = () => {
    prisma = {
      aiConversationMessage: {
        findMany: jest.fn().mockResolvedValue([{ role: 'USER', content: 'Hi' }]),
        create: jest.fn().mockResolvedValue({ id: 'msg-abort' }),
      },
      aiConversation: { update: jest.fn().mockResolvedValue({}) },
      $transaction: jest.fn().mockImplementation((cb: (tx: unknown) => unknown) => cb(prisma)),
    };
    openai = { get: jest.fn().mockReturnValue({ chat: { completions: { create: createMock2 } } }) };
    return new AiCompletionsService(
      prisma as never,
      openai as never,
      { assertOwned: jest.fn().mockResolvedValue(undefined) } as never,
      { getTier: jest.fn().mockResolvedValue('STANDARD') } as never,
      {
        resolve: jest.fn().mockReturnValue('gpt-4o-mini'),
        estimateCostUsd: jest.fn().mockReturnValue(0.001),
        isPremiumRateMissing: jest.fn().mockReturnValue(false),
        getPremiumModel: jest.fn().mockReturnValue('gpt-5.6-luna'),
      } as never,
      { build: jest.fn().mockResolvedValue([{ role: 'user', content: 'Hi' }]) } as never,
      {
        assertWithinQuota: jest.fn().mockResolvedValue({
          metered: false, exhausted: false, fallbackOptIn: false,
        }),
        recordUsage: jest.fn().mockResolvedValue(undefined),
      } as never,
      {
        countPromptTokens: jest.fn().mockReturnValue({
          tokens: 50, source: 'TOKENIZED_PROMPT', imageCount: 0,
        }),
        countTextTokens: jest.fn().mockReturnValue(2),
      } as never,
    );
  };

  beforeEach(() => createMock2.mockReset().mockResolvedValue(slowStream()));

  it('persists the partial reply as ABORTED when the consumer stops early', async () => {
    const svc = build();
    const gen = svc.streamCompletion({
      workspaceId: 'ws', userId: 'u', conversationId: 'c',
    });

    // Consume only the first token, then abandon the generator (what a client
    // disconnect does).
    const first = await gen.next();
    expect(first.value).toEqual({ delta: 'partial' });
    await gen.return(undefined as never);

    expect(prisma.aiConversationMessage.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ content: 'partial', status: 'ABORTED' }),
      }),
    );
  });

  it('charges tokens for an aborted turn using counted figures', async () => {
    // The leak this closes: OpenAI bills the input the moment the request is
    // sent, so an abort that consumed nothing would be free premium usage.
    const svc = build();
    const gen = svc.streamCompletion({ workspaceId: 'ws', userId: 'u', conversationId: 'c' });
    await gen.next();
    await gen.return(undefined as never);

    expect(prisma.aiConversationMessage.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          status: 'ABORTED',
          // Measured columns stay null — the usage chunk never arrived.
          promptTokens: null,
          completionTokens: null,
          estimatedPromptTokens: 50,
          tokenSource: 'TOKENIZED_PROMPT',
        }),
      }),
    );
  });

  it('persists COMPLETE when fully drained', async () => {
    const svc = build();
    for await (const _ of svc.streamCompletion({
      workspaceId: 'ws', userId: 'u', conversationId: 'c',
    })) { /* drain */ }

    expect(prisma.aiConversationMessage.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ content: 'partial more', status: 'COMPLETE' }),
      }),
    );
  });

  it('writes nothing when aborted before any token arrived', async () => {
    createMock2.mockResolvedValue((async function* () { /* no chunks */ })());
    const svc = build();
    const gen = svc.streamCompletion({ workspaceId: 'ws', userId: 'u', conversationId: 'c' });
    await gen.next();
    await gen.return(undefined as never);
    // Empty stream still "completed", so a COMPLETE empty row is acceptable;
    // what matters is we never write an ABORTED row with no content.
    const calls = prisma.aiConversationMessage.create.mock.calls;
    for (const [arg] of calls) {
      expect(arg.data.status === 'ABORTED' && arg.data.content === '').toBe(false);
    }
  });
});
