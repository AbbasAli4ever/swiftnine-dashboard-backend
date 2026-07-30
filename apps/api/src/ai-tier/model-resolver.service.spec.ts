import {
  LONG_CONTEXT_THRESHOLD_TOKENS,
  ModelResolverService,
  PREMIUM_CHAT_MODEL_DEFAULT,
  PREMIUM_IMAGE_MODEL_DEFAULT,
  STANDARD_CHAT_MODEL,
  STANDARD_IMAGE_MODEL,
} from './model-resolver.service';

function makeService(premiumOverride?: string, premiumImageOverride?: string) {
  const config = {
    get: jest.fn((key: string) => {
      if (key === 'OPENAI_PREMIUM_MODEL') return premiumOverride;
      if (key === 'OPENAI_PREMIUM_IMAGE_MODEL') return premiumImageOverride;
      return undefined;
    }),
  };
  return new ModelResolverService(config as never);
}

describe('ModelResolverService', () => {
  it('maps STANDARD to gpt-4o-mini', () => {
    expect(makeService().resolve('STANDARD' as never)).toBe(STANDARD_CHAT_MODEL);
    expect(STANDARD_CHAT_MODEL).toBe('gpt-4o-mini');
  });

  it('maps PREMIUM to the configured premium model', () => {
    expect(makeService().resolve('PREMIUM' as never)).toBe(PREMIUM_CHAT_MODEL_DEFAULT);
  });

  // Regression: a bare "gpt-5.6" is NOT a valid OpenAI model id (404
  // model_not_found) — the 5.6 generation only ships as luna/sol/terra.
  it('defaults to a real, variant-qualified 5.6 model id', () => {
    expect(PREMIUM_CHAT_MODEL_DEFAULT).toBe('gpt-5.6-luna');
    expect(PREMIUM_CHAT_MODEL_DEFAULT).not.toBe('gpt-5.6');
  });

  it('has a cost rate for every 5.6 variant it might be pointed at', () => {
    for (const variant of ['gpt-5.6-luna', 'gpt-5.6-sol', 'gpt-5.6-terra']) {
      expect(makeService(variant).isPremiumRateMissing()).toBe(false);
    }
  });

  it('honours OPENAI_PREMIUM_MODEL over the default', () => {
    expect(makeService('gpt-5.6-sol').resolve('PREMIUM' as never)).toBe('gpt-5.6-sol');
  });

  it('falls back to the default when the override is blank', () => {
    expect(makeService('   ').resolve('PREMIUM' as never)).toBe(PREMIUM_CHAT_MODEL_DEFAULT);
  });

  it('computes cost from per-million rates', () => {
    // 1M input @ $0.15 + 1M output @ $0.60
    expect(makeService().estimateCostUsd('gpt-4o-mini', 1_000_000, 1_000_000)).toBeCloseTo(0.75, 6);
  });

  describe('long-context pricing', () => {
    const svc = () => makeService();

    // Expectations are derived from the constant rather than hardcoded, so a
    // corrected threshold does not need the arithmetic redone by hand.
    const perMillion = (tokens: number, rate: number) => (tokens / 1_000_000) * rate;

    it('bills the short-context rate at and below the threshold', () => {
      const at = LONG_CONTEXT_THRESHOLD_TOKENS;
      expect(svc().estimateCostUsd('gpt-5.6-luna', at, 0)).toBeCloseTo(perMillion(at, 1.0), 6);
      expect(svc().estimateCostUsd('gpt-5.6-luna', at - 1, 0)).toBeCloseTo(
        perMillion(at - 1, 1.0),
        6,
      );
    });

    it('switches to the long-context rate one token past the threshold', () => {
      const past = LONG_CONTEXT_THRESHOLD_TOKENS + 1;
      // Input rate doubles ($1 -> $2) the moment the threshold is crossed.
      expect(svc().estimateCostUsd('gpt-5.6-luna', past, 0)).toBeCloseTo(
        perMillion(past, 2.0),
        6,
      );
    });

    it('applies the surcharge to output as well as input', () => {
      // Long context: 300k in @ $2 = $0.60, 10k out @ $9 = $0.09
      expect(svc().estimateCostUsd('gpt-5.6-luna', 300_000, 10_000)).toBeCloseTo(0.69, 6);
      // Short context: 10k in @ $1 = $0.01, 10k out @ $6 = $0.06
      expect(svc().estimateCostUsd('gpt-5.6-luna', 10_000, 10_000)).toBeCloseTo(0.07, 6);
    });

    it('ignores prompt size for models with flat pricing', () => {
      // gpt-4o-mini has no long tier — 1M input stays at $0.15/M.
      expect(svc().estimateCostUsd('gpt-4o-mini', 1_000_000, 0)).toBeCloseTo(0.15, 6);
    });

    it('uses the real supplied rates for gpt-5.6-luna', () => {
      // Short context ($1 in / $6 out). Scaled from 100k so the prompt stays
      // under the 200k threshold: 100k @ $1/M = $0.10.
      expect(svc().estimateCostUsd('gpt-5.6-luna', 100_000, 0)).toBeCloseTo(0.1, 6);
      // Output rate is independent of prompt size when the prompt is short.
      expect(svc().estimateCostUsd('gpt-5.6-luna', 0, 1_000_000)).toBeCloseTo(6.0, 6);
      // Long context ($2 in / $9 out): 1M input past the threshold.
      expect(svc().estimateCostUsd('gpt-5.6-luna', 1_000_000, 0)).toBeCloseTo(2.0, 6);
    });
  });

  describe('cached and cache-write input pricing', () => {
    const svc = () => makeService();

    it('bills a cache-miss the same as before (no cacheUsage argument)', () => {
      // Regression: existing callers that don't pass cacheUsage must keep
      // getting the plain input rate, unchanged.
      expect(svc().estimateCostUsd('gpt-5.6-luna', 100_000, 0)).toBeCloseTo(0.1, 6);
    });

    it('splits promptTokens into fresh/cached/cache-write and prices each separately', () => {
      // Live-captured real pair: a 1807-token prompt written to cache on the
      // first call, then served entirely from cache on the identical retry.
      const writeCall = svc().estimateCostUsd('gpt-5.6-luna', 1807, 5, {
        cacheWriteTokens: 1804,
      })!;
      const readCall = svc().estimateCostUsd('gpt-5.6-luna', 1807, 5, {
        cachedTokens: 1804,
      })!;

      // Write: 1804 @ $1.25/M (cache-write) + 3 fresh @ $1/M + 5 out @ $6/M
      const expectedWrite =
        (1804 / 1_000_000) * 1.25 + (3 / 1_000_000) * 1.0 + (5 / 1_000_000) * 6.0;
      // Read: 1804 @ $0.10/M (cached) + 3 fresh @ $1/M + 5 out @ $6/M
      const expectedRead =
        (1804 / 1_000_000) * 0.1 + (3 / 1_000_000) * 1.0 + (5 / 1_000_000) * 6.0;

      expect(writeCall).toBeCloseTo(expectedWrite, 8);
      expect(readCall).toBeCloseTo(expectedRead, 8);
      // The whole point: a cache hit must cost meaningfully less than a
      // cache-miss/write for an identical prompt.
      expect(readCall).toBeLessThan(writeCall);
    });

    it('uses the real supplied cache rates for gpt-5.6-luna short context', () => {
      // 100k stays under the 272k long-context threshold.
      const cached = svc().estimateCostUsd('gpt-5.6-luna', 100_000, 0, {
        cachedTokens: 100_000,
      });
      const written = svc().estimateCostUsd('gpt-5.6-luna', 100_000, 0, {
        cacheWriteTokens: 100_000,
      });
      expect(cached).toBeCloseTo((100_000 / 1_000_000) * 0.1, 6); // $0.10/M cached-input
      expect(written).toBeCloseTo((100_000 / 1_000_000) * 1.25, 6); // $1.25/M cache-write
    });

    it('uses the real supplied cache rates for gpt-5.6-luna long context', () => {
      const past = LONG_CONTEXT_THRESHOLD_TOKENS + 1_000_000;
      const cached = svc().estimateCostUsd('gpt-5.6-luna', past, 0, {
        cachedTokens: 1_000_000,
      })!;
      const freshTokens = past - 1_000_000;
      const expected = (1_000_000 / 1_000_000) * 0.2 + (freshTokens / 1_000_000) * 2.0;
      expect(cached).toBeCloseTo(expected, 6); // $0.20/M cached-input, long context
    });

    it('uses the real supplied cached rate for gpt-4o-mini', () => {
      const cached = svc().estimateCostUsd('gpt-4o-mini', 1_000_000, 0, {
        cachedTokens: 1_000_000,
      });
      expect(cached).toBeCloseTo(0.075, 6); // $0.075/M cached-input
    });

    it('gpt-4o-mini has no cache-write tier — falls back to the plain input rate', () => {
      // Matches reality: gpt-4o-mini's usage response never includes
      // cache_write_tokens, so this rate is never actually exercised, but the
      // fallback must still be sane if ever called.
      const withWrite = svc().estimateCostUsd('gpt-4o-mini', 1_000_000, 0, {
        cacheWriteTokens: 1_000_000,
      });
      expect(withWrite).toBeCloseTo(0.15, 6); // plain input rate, not a cache discount
    });

    it('never produces a negative fresh-token count when cache figures exceed promptTokens', () => {
      // Defensive: a malformed/inconsistent usage response must not go negative.
      const cost = svc().estimateCostUsd('gpt-5.6-luna', 100, 0, { cachedTokens: 500 });
      expect(cost).toBeCloseTo((500 / 1_000_000) * 0.1, 8);
      expect(cost).toBeGreaterThanOrEqual(0);
    });
  });

  describe('quoteTokenCost', () => {
    it('brackets an allowance by all-input vs all-output spend', () => {
      // 1M exceeds the 200k threshold, so the ceiling uses the long-context
      // output rate ($9) while the floor stays at the short input rate ($1).
      const quote = makeService().quoteTokenCost('gpt-5.6-luna', 1_000_000)!;

      expect(quote.minCostUsd).toBeCloseTo(1.0, 6);
      expect(quote.maxCostUsd).toBeCloseTo(9.0, 6);
    });

    it('quotes the short-context ceiling for allowances under the threshold', () => {
      // 100k can never trigger the long-context tier in one request.
      const quote = makeService().quoteTokenCost('gpt-5.6-luna', 100_000)!;

      expect(quote.minCostUsd).toBeCloseTo(0.1, 6);
      expect(quote.maxCostUsd).toBeCloseTo(0.6, 6);
    });

    it('returns null for an unknown model', () => {
      expect(makeService().quoteTokenCost('nonexistent', 1_000)).toBeNull();
    });
  });

  it('returns null — not 0 — for an unknown model so unmeasured spend is visible', () => {
    expect(makeService().estimateCostUsd('nonexistent-model', 1000, 1000)).toBeNull();
  });

  it('flags a premium model that has no rate entry', () => {
    expect(makeService('model-with-no-rate').isPremiumRateMissing()).toBe(true);
    expect(makeService().isPremiumRateMissing()).toBe(false);
  });

  describe('image model resolution', () => {
    it('maps STANDARD to gpt-image-1-mini', () => {
      expect(makeService().resolveImage('STANDARD' as never)).toBe(STANDARD_IMAGE_MODEL);
      expect(STANDARD_IMAGE_MODEL).toBe('gpt-image-1-mini');
    });

    it('maps PREMIUM to the configured premium image model', () => {
      expect(makeService().resolveImage('PREMIUM' as never)).toBe(PREMIUM_IMAGE_MODEL_DEFAULT);
      expect(PREMIUM_IMAGE_MODEL_DEFAULT).toBe('gpt-image-2');
    });

    it('honours OPENAI_PREMIUM_IMAGE_MODEL over the default', () => {
      expect(makeService(undefined, 'gpt-image-1.5').resolveImage('PREMIUM' as never)).toBe(
        'gpt-image-1.5',
      );
    });

    it('falls back to the default when the image override is blank', () => {
      expect(makeService(undefined, '   ').resolveImage('PREMIUM' as never)).toBe(
        PREMIUM_IMAGE_MODEL_DEFAULT,
      );
    });

    it('the chat and image premium overrides are independent', () => {
      // Regression: a single shared override key would leak the chat model
      // choice into image resolution or vice versa.
      const svc = makeService('gpt-5.6-sol', 'gpt-image-1.5');
      expect(svc.resolve('PREMIUM' as never)).toBe('gpt-5.6-sol');
      expect(svc.resolveImage('PREMIUM' as never)).toBe('gpt-image-1.5');
    });
  });

  describe('estimateImageCostUsd', () => {
    it('computes cost from real per-token usage, split by text vs image', () => {
      // Live-verified shape from gpt-image-1-mini: 13 text input tokens, 272
      // image output tokens, 0 image input tokens.
      const cost = makeService().estimateImageCostUsd('gpt-image-1-mini', {
        textInputTokens: 13,
        imageInputTokens: 0,
        imageOutputTokens: 272,
      })!;

      const expected = (13 / 1_000_000) * 2.0 + (272 / 1_000_000) * 8.0;
      expect(cost).toBeCloseTo(expected, 8);
    });

    it('uses the real supplied rates for gpt-image-1-mini', () => {
      const svc = makeService();
      expect(
        svc.estimateImageCostUsd('gpt-image-1-mini', {
          textInputTokens: 1_000_000,
          imageInputTokens: 0,
          imageOutputTokens: 0,
        }),
      ).toBeCloseTo(2.0, 6);
      expect(
        svc.estimateImageCostUsd('gpt-image-1-mini', {
          textInputTokens: 0,
          imageInputTokens: 1_000_000,
          imageOutputTokens: 0,
        }),
      ).toBeCloseTo(2.5, 6);
      expect(
        svc.estimateImageCostUsd('gpt-image-1-mini', {
          textInputTokens: 0,
          imageInputTokens: 0,
          imageOutputTokens: 1_000_000,
        }),
      ).toBeCloseTo(8.0, 6);
    });

    it('uses the real supplied rates for gpt-image-2', () => {
      const svc = makeService();
      expect(
        svc.estimateImageCostUsd('gpt-image-2', {
          textInputTokens: 1_000_000,
          imageInputTokens: 0,
          imageOutputTokens: 0,
        }),
      ).toBeCloseTo(5.0, 6);
      expect(
        svc.estimateImageCostUsd('gpt-image-2', {
          textInputTokens: 0,
          imageInputTokens: 1_000_000,
          imageOutputTokens: 0,
        }),
      ).toBeCloseTo(8.0, 6);
      expect(
        svc.estimateImageCostUsd('gpt-image-2', {
          textInputTokens: 0,
          imageInputTokens: 0,
          imageOutputTokens: 1_000_000,
        }),
      ).toBeCloseTo(30.0, 6);
    });

    it('returns null — not 0 — for an unknown image model', () => {
      expect(
        makeService().estimateImageCostUsd('nonexistent-image-model', {
          textInputTokens: 100,
          imageInputTokens: 0,
          imageOutputTokens: 100,
        }),
      ).toBeNull();
    });
  });

  it('flags a premium image model that has no rate entry', () => {
    expect(makeService(undefined, 'model-with-no-rate').isPremiumImageRateMissing()).toBe(true);
    expect(makeService().isPremiumImageRateMissing()).toBe(false);
  });
});
