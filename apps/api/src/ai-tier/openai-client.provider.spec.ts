import { InternalServerErrorException } from '@nestjs/common';
import { OpenAiClientProvider } from './openai-client.provider';

const ctorSpy = jest.fn();
jest.mock('openai', () => ({
  __esModule: true,
  default: class OpenAI {
    constructor(opts: { apiKey: string }) {
      ctorSpy(opts);
      // Mirrors the real SDK, which throws on an empty key.
      if (!opts.apiKey) throw new Error('Missing credentials');
    }
  },
}));

const withKey = (key?: string) =>
  new OpenAiClientProvider({ get: jest.fn().mockReturnValue(key) } as never);

describe('OpenAiClientProvider', () => {
  beforeEach(() => ctorSpy.mockClear());

  it('does not construct the SDK client at injection time', () => {
    withKey('sk-test');
    // Deferred: constructing here would crash app boot when the key is missing.
    expect(ctorSpy).not.toHaveBeenCalled();
  });

  it('constructs on first get() and passes the key through', () => {
    const client = withKey('sk-test').get();

    expect(ctorSpy).toHaveBeenCalledWith({ apiKey: 'sk-test' });
    expect(client).toBeDefined();
  });

  it('reuses the same client across calls', () => {
    const provider = withKey('sk-test');

    expect(provider.get()).toBe(provider.get());
    expect(ctorSpy).toHaveBeenCalledTimes(1);
  });

  it('constructs without throwing when the key is absent', () => {
    expect(() => withKey(undefined)).not.toThrow();
  });

  it('throws a 500 from get() when the key is absent', () => {
    expect(() => withKey(undefined).get()).toThrow(InternalServerErrorException);
    expect(ctorSpy).not.toHaveBeenCalled();
  });
});
