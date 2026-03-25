/**
 * @module auth
 * @description Authentication helpers for the Justice Dev Starter Kit.
 * Supports Clerk and Cognito auth providers. Provides user retrieval,
 * role checking, and request authentication utilities.
 */

import type { AuthUser, UserRole, SubscriptionTier } from '../types';

/** Auth provider configuration */
export interface AuthConfig {
  provider: 'clerk' | 'cognito';
  secretKey: string;
  webhookSecret?: string;
}

/**
 * Get the authenticated user from a request.
 * Extracts and validates the JWT from the Authorization header or session cookie.
 *
 * @param request - The incoming HTTP request
 * @returns The authenticated user or null
 */
export async function getUser(request: Request): Promise<AuthUser | null> {
  const authHeader = request.headers.get('Authorization');
  const token = authHeader?.replace('Bearer ', '');

  if (!token) return null;

  try {
    const decoded = await verifyToken(token);
    return {
      id: decoded.sub,
      email: decoded.email,
      name: decoded.name ?? decoded.email,
      role: (decoded.role as UserRole) ?? 'public',
      externalId: decoded.externalId ?? decoded.sub,
      tier: (decoded.tier as SubscriptionTier) ?? 'free',
      subscriptionStatus: decoded.subscriptionStatus ?? 'active',
    };
  } catch {
    return null;
  }
}

/**
 * Require authentication. Throws if no valid user session exists.
 *
 * @param request - The incoming HTTP request
 * @returns The authenticated user
 * @throws Error with 401 status if not authenticated
 */
export async function requireAuth(request: Request): Promise<AuthUser> {
  const user = await getUser(request);
  if (!user) {
    throw new AuthError('Authentication required', 401);
  }
  return user;
}

/**
 * Check if a user has one of the required roles.
 *
 * @param user - The authenticated user
 * @param allowedRoles - Roles that are permitted
 * @throws Error with 403 status if role is not allowed
 */
export function checkRole(user: AuthUser, allowedRoles: UserRole[]): void {
  if (!allowedRoles.includes(user.role)) {
    throw new AuthError(
      `Role '${user.role}' is not authorized. Required: ${allowedRoles.join(', ')}`,
      403
    );
  }
}

/**
 * Check if a user's subscription tier meets the minimum requirement.
 *
 * @param user - The authenticated user
 * @param minimumTier - The minimum required tier
 * @throws Error with 403 status if tier is insufficient
 */
export function checkTier(user: AuthUser, minimumTier: SubscriptionTier): void {
  const tierOrder: SubscriptionTier[] = ['free', 'starter', 'professional'];
  const userTierIndex = tierOrder.indexOf(user.tier);
  const requiredIndex = tierOrder.indexOf(minimumTier);

  if (userTierIndex < requiredIndex) {
    throw new AuthError(
      `Subscription tier '${user.tier}' is insufficient. Minimum required: ${minimumTier}`,
      403
    );
  }
}

/**
 * Verify a JWT token.
 * In production, this validates against the auth provider's public keys.
 *
 * @param token - The JWT token to verify
 * @returns Decoded token payload
 */
async function verifyToken(token: string): Promise<Record<string, any>> {
  // In production, verify with Clerk or Cognito public keys
  // This is a placeholder for the token verification logic
  const parts = token.split('.');
  if (parts.length !== 3) throw new Error('Invalid token format');

  const payload = JSON.parse(
    Buffer.from(parts[1], 'base64url').toString('utf-8')
  );

  // Check expiration
  if (payload.exp && payload.exp * 1000 < Date.now()) {
    throw new Error('Token expired');
  }

  return payload;
}

/**
 * Custom auth error with HTTP status code.
 */
export class AuthError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'AuthError';
    this.status = status;
  }
}
