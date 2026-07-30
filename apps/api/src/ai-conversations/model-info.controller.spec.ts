import { AiConversationsController } from './ai-conversations.controller';

jest.mock('@app/database', () => ({ PrismaService: class PrismaService {} }));

const WORKSPACE_ID = 'ws-1';
const USER_ID = 'user-1';

function build(
  tier: 'PREMIUM' | 'STANDARD',
  quotaOverride: Partial<Record<string, unknown>> = {},
) {
  const tiers = { getTier: jest.fn().mockResolvedValue(tier) };
  const models = {
    resolve: jest
      .fn()
      .mockImplementation((t: string) => (t === 'PREMIUM' ? 'gpt-5.6-luna' : 'gpt-4o-mini')),
  };
  const quotas = {
    getStatus: jest.fn().mockResolvedValue({
      metered: false,
      exhausted: false,
      fallbackOptIn: false,
      ...quotaOverride,
    }),
    setFallbackOptIn: jest.fn().mockResolvedValue(undefined),
  };
  const controller = new AiConversationsController(
    {} as never,
    {} as never,
    tiers as never,
    models as never,
    quotas as never,
  );
  return { controller, tiers, models, quotas };
}

const req = { workspaceContext: { workspaceId: WORKSPACE_ID }, user: { id: USER_ID } } as never;

describe('AiConversationsController — GET model-info', () => {
  it('reports the premium model for a premium member', async () => {
    const { controller } = build('PREMIUM');

    const res = await controller.getModelInfo(req);

    expect(res.data.tier).toBe('PREMIUM');
    expect(res.data.model).toBe('gpt-5.6-luna');
  });

  it('reports the standard model for a standard member', async () => {
    const { controller } = build('STANDARD');

    const res = await controller.getModelInfo(req);

    expect(res.data.tier).toBe('STANDARD');
    expect(res.data.model).toBe('gpt-4o-mini');
  });

  it('resolves the tier for the calling user in the active workspace', async () => {
    const { controller, tiers } = build('STANDARD');

    await controller.getModelInfo(req);

    expect(tiers.getTier).toHaveBeenCalledWith(WORKSPACE_ID, USER_ID);
  });

  it('delegates the model id to ModelResolverService rather than hardcoding it', async () => {
    // Guards against a second copy of the tier->model mapping drifting from the
    // resolver, which honours the OPENAI_PREMIUM_MODEL override.
    const { controller, models } = build('PREMIUM');
    models.resolve.mockReturnValue('gpt-5.6-overridden');

    const res = await controller.getModelInfo(req);

    expect(models.resolve).toHaveBeenCalledWith('PREMIUM');
    expect(res.data.model).toBe('gpt-5.6-overridden');
  });
});

describe('AiConversationsController — model-info with quota', () => {
  it('includes quota state so the composer needs one request', async () => {
    const { controller } = build('PREMIUM', {
      metered: true,
      consumedTokens: 400,
      tokenLimit: 1000,
      band: 'ok',
    });

    const res = await controller.getModelInfo(req);

    expect(res.data.quota).toEqual(
      expect.objectContaining({ metered: true, consumedTokens: 400, tokenLimit: 1000 }),
    );
  });

  it('reports the standard model once an exhausted member opts into fallback', async () => {
    // The member is entitled to premium but is really talking to the standard
    // model, so the badge must not claim otherwise.
    const { controller } = build('PREMIUM', {
      metered: true,
      exhausted: true,
      fallbackOptIn: true,
    });

    const res = await controller.getModelInfo(req);

    expect(res.data.model).toBe('gpt-4o-mini');
    expect(res.data.tier).toBe('PREMIUM');
  });

  it('still reports premium when exhausted but not opted in', async () => {
    const { controller } = build('PREMIUM', {
      metered: true,
      exhausted: true,
      fallbackOptIn: false,
    });

    expect((await controller.getModelInfo(req)).data.model).toBe('gpt-5.6-luna');
  });

  it('records the opt-in for the calling member', async () => {
    const { controller, quotas } = build('PREMIUM');

    await controller.optIntoFallback(req);

    expect(quotas.setFallbackOptIn).toHaveBeenCalledWith(WORKSPACE_ID, USER_ID, true);
  });
});
