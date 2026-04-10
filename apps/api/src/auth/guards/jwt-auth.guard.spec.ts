import { UnauthorizedException } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;

  beforeEach(() => {
    guard = new JwtAuthGuard();
  });

  it('returns the authenticated user when present', () => {
    const user = { id: 'user-1' };

    expect(guard.handleRequest(null, user)).toBe(user);
  });

  it('maps missing-token failures to a clear unauthorized message', () => {
    expect(() =>
      guard.handleRequest(null, false, {
        message: 'No auth token',
      }),
    ).toThrow(new UnauthorizedException('Authentication token is required'));
  });

  it('maps expired-token failures to a clear unauthorized message', () => {
    expect(() =>
      guard.handleRequest(null, false, {
        name: 'TokenExpiredError',
      }),
    ).toThrow(new UnauthorizedException('Access token has expired'));
  });

  it('maps other token failures to a generic unauthorized message', () => {
    expect(() =>
      guard.handleRequest(null, false, {
        name: 'JsonWebTokenError',
        message: 'jwt malformed',
      }),
    ).toThrow(new UnauthorizedException('Invalid or expired access token'));
  });
});
