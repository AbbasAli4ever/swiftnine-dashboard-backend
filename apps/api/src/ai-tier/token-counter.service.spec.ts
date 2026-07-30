import { TokenCounterService } from './token-counter.service';

type Msg = Parameters<TokenCounterService['countPromptTokens']>[1][number];

const text = (content: string): Msg => ({ role: 'user', content } as Msg);

describe('TokenCounterService', () => {
  let service: TokenCounterService;

  beforeEach(() => {
    service = new TokenCounterService();
  });

  it('counts prompt tokens for the premium model without throwing', () => {
    // Regression: js-tiktoken's encodingForModel() throws "Unknown model" for
    // gpt-5.6-luna. The explicit encoding map must avoid that on the premium
    // (most expensive) path.
    const result = service.countPromptTokens('gpt-5.6-luna', [text('Hello world')]);

    expect(result.source).toBe('TOKENIZED_PROMPT');
    expect(result.tokens).toBeGreaterThan(0);
  });

  it('counts tokens for the standard model', () => {
    const result = service.countPromptTokens('gpt-4o-mini', [text('Hello world')]);

    expect(result.source).toBe('TOKENIZED_PROMPT');
    expect(result.tokens).toBeGreaterThan(0);
  });

  it('falls back to the default encoding for an unrecognised model', () => {
    const result = service.countPromptTokens('some-future-model', [text('Hello world')]);

    expect(result.source).toBe('TOKENIZED_PROMPT');
    expect(result.tokens).toBeGreaterThan(0);
  });

  it('sums text across the whole message array', () => {
    const one = service.countPromptTokens('gpt-4o-mini', [text('a '.repeat(100))]);
    const many = service.countPromptTokens('gpt-4o-mini', [
      text('a '.repeat(100)),
      text('a '.repeat(100)),
    ]);

    expect(many.tokens).toBeGreaterThan(one.tokens);
  });

  it('counts image parts separately from text', () => {
    const result = service.countPromptTokens('gpt-4o-mini', [
      {
        role: 'user',
        content: [
          { type: 'text', text: 'what is this' },
          { type: 'image_url', image_url: { url: 'https://s3/a.png' } },
          { type: 'image_url', image_url: { url: 'https://s3/b.png' } },
        ],
      } as Msg,
    ]);

    expect(result.imageCount).toBe(2);
    // The URLs must not be tokenized as text — a long signed URL would inflate
    // the count while contributing nothing to what OpenAI bills.
    expect(result.tokens).toBeLessThan(20);
  });

  it('never throws when the encoder fails — degrades to the heuristic', () => {
    jest
      .spyOn(service as never as { getEncoding: () => unknown }, 'getEncoding')
      .mockImplementation(() => {
        throw new Error('rank table unavailable');
      });

    const result = service.countPromptTokens('gpt-4o-mini', [text('x'.repeat(400))]);

    expect(result.source).toBe('HEURISTIC');
    expect(result.tokens).toBe(100); // 400 chars / 4
  });

  it('under-counts rather than over-counts on the heuristic path', () => {
    // Over-counting would wrongly block users, which is worse than a leak.
    jest
      .spyOn(service as never as { getEncoding: () => unknown }, 'getEncoding')
      .mockImplementation(() => {
        throw new Error('unavailable');
      });

    const heuristic = service.countPromptTokens('gpt-4o-mini', [text('hello world '.repeat(50))]);
    const real = new TokenCounterService().countPromptTokens('gpt-4o-mini', [
      text('hello world '.repeat(50)),
    ]);

    expect(heuristic.tokens).toBeLessThanOrEqual(real.tokens * 2);
  });

  it('counts generated text for the abort path', () => {
    expect(service.countTextTokens('gpt-5.6-luna', 'a partial reply')).toBeGreaterThan(0);
    expect(service.countTextTokens('gpt-5.6-luna', '')).toBe(0);
  });

  it('reuses a cached encoding across calls', () => {
    const first = service.countPromptTokens('gpt-4o-mini', [text('one')]);
    const second = service.countPromptTokens('gpt-5.6-luna', [text('one')]);

    // Both map to o200k_base, so the counts must agree exactly.
    expect(first.tokens).toBe(second.tokens);
  });
});
