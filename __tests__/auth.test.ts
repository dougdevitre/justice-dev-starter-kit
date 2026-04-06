/**
 * @jest-environment node
 */

import { getUser, requireAuth, checkRole, checkTier, AuthError } from '../src/lib/auth';
import type { AuthUser } from '../src/types';

// Helper to create a mock JWT
function createMockToken(payload: Record<string, any>): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(JSON.stringify({
    exp: Math.floor(Date.now() / 1000) + 3600, // default: 1 hour from now
    ...payload, // allow caller to override exp (e.g., for expired token tests)
  })).toString('base64url');
  const signature = 'mock_signature';
  return `${header}.${body}.${signature}`;
}

function createMockRequest(token?: string): Request {
  const headers: Record<string, string> = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return new Request('http://localhost/api/test', { headers });
}

describe('Auth Helpers', () => {
  describe('getUser()', () => {
    it('should return null when no Authorization header', async () => {
      const request = createMockRequest();
      const user = await getUser(request);
      expect(user).toBeNull();
    });

    it('should return user from valid token', async () => {
      const token = createMockToken({
        sub: 'user_123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'attorney',
        tier: 'starter',
        subscriptionStatus: 'active',
      });
      const request = createMockRequest(token);
      const user = await getUser(request);

      expect(user).not.toBeNull();
      expect(user!.id).toBe('user_123');
      expect(user!.email).toBe('test@example.com');
      expect(user!.role).toBe('attorney');
      expect(user!.tier).toBe('starter');
    });

    it('should return null for expired token', async () => {
      const token = createMockToken({
        sub: 'user_123',
        email: 'test@example.com',
        exp: Math.floor(Date.now() / 1000) - 3600, // 1 hour ago
      });
      const request = createMockRequest(token);
      const user = await getUser(request);
      expect(user).toBeNull();
    });

    it('should default role to public when not specified', async () => {
      const token = createMockToken({
        sub: 'user_456',
        email: 'public@example.com',
      });
      const request = createMockRequest(token);
      const user = await getUser(request);
      expect(user!.role).toBe('public');
    });
  });

  describe('requireAuth()', () => {
    it('should throw AuthError with 401 when not authenticated', async () => {
      const request = createMockRequest();
      await expect(requireAuth(request)).rejects.toThrow(AuthError);
      await expect(requireAuth(request)).rejects.toMatchObject({ status: 401 });
    });

    it('should return user when authenticated', async () => {
      const token = createMockToken({
        sub: 'user_789',
        email: 'auth@example.com',
      });
      const request = createMockRequest(token);
      const user = await requireAuth(request);
      expect(user.id).toBe('user_789');
    });
  });

  describe('checkRole()', () => {
    const mockUser: AuthUser = {
      id: '1', email: 'test@example.com', name: 'Test',
      role: 'attorney', externalId: 'ext_1',
      tier: 'starter', subscriptionStatus: 'active',
    };

    it('should pass when user has an allowed role', () => {
      expect(() => checkRole(mockUser, ['attorney', 'admin'])).not.toThrow();
    });

    it('should throw 403 when role is not allowed', () => {
      expect(() => checkRole(mockUser, ['admin'])).toThrow(AuthError);
    });
  });

  describe('checkTier()', () => {
    const freeUser: AuthUser = {
      id: '1', email: 'test@example.com', name: 'Test',
      role: 'litigant', externalId: 'ext_1',
      tier: 'free', subscriptionStatus: 'active',
    };

    const proUser: AuthUser = {
      ...freeUser, tier: 'professional',
    };

    it('should pass when tier is sufficient', () => {
      expect(() => checkTier(proUser, 'starter')).not.toThrow();
      expect(() => checkTier(proUser, 'professional')).not.toThrow();
    });

    it('should throw when tier is insufficient', () => {
      expect(() => checkTier(freeUser, 'starter')).toThrow(AuthError);
      expect(() => checkTier(freeUser, 'professional')).toThrow(AuthError);
    });
  });
});
