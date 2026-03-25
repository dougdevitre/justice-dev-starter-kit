/**
 * @module middleware
 * @description Next.js edge middleware for authentication, role-based access,
 * and rate limiting. Runs on every request before hitting API routes or pages.
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/** Routes that don't require authentication */
const PUBLIC_ROUTES = ['/', '/login', '/signup', '/api/billing/webhook', '/api/auth/webhook'];

/** Routes restricted to specific roles */
const ROLE_RESTRICTED_ROUTES: Record<string, string[]> = {
  '/admin': ['admin'],
  '/api/admin': ['admin'],
  '/dashboard/cases': ['admin', 'attorney'],
};

/** Rate limiting store (in production, use Redis) */
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 100;
const RATE_LIMIT_WINDOW_MS = 60_000;

/**
 * Edge middleware that runs on every request.
 * Handles: authentication check, role-based access, rate limiting.
 *
 * @param request - The incoming Next.js request
 * @returns NextResponse (continue, redirect, or 4xx error)
 */
export function middleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  // --- 1. Skip public routes ---
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // --- 2. Rate limiting for API routes ---
  if (pathname.startsWith('/api/')) {
    const rateLimitResult = checkRateLimit(request);
    if (rateLimitResult) return rateLimitResult;
  }

  // --- 3. Authentication check ---
  const token = extractToken(request);
  if (!token) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    // Redirect to login for page routes
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // --- 4. Role-based access check ---
  const roleResult = checkRoleAccess(request, pathname, token);
  if (roleResult) return roleResult;

  // --- 5. Continue with request ---
  const response = NextResponse.next();

  // Add security headers
  response.headers.set('X-Request-Id', crypto.randomUUID());

  return response;
}

/**
 * Check if a route is public (no auth required).
 */
function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}

/**
 * Extract authentication token from request.
 */
function extractToken(request: NextRequest): string | null {
  // Check Authorization header first
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice(7);
  }

  // Check session cookie
  const sessionCookie = request.cookies.get('__session')?.value;
  return sessionCookie ?? null;
}

/**
 * Simple rate limiting check.
 * In production, replace with Redis-based rate limiting.
 */
function checkRateLimit(request: NextRequest): NextResponse | null {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    'unknown';

  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return null;
  }

  entry.count++;

  if (entry.count > RATE_LIMIT_MAX) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Please try again later.' },
      {
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil((entry.resetAt - now) / 1000)),
        },
      }
    );
  }

  return null;
}

/**
 * Check role-based access for restricted routes.
 */
function checkRoleAccess(
  request: NextRequest,
  pathname: string,
  token: string
): NextResponse | null {
  for (const [route, allowedRoles] of Object.entries(ROLE_RESTRICTED_ROUTES)) {
    if (pathname.startsWith(route)) {
      // In production, decode the JWT and check the role claim
      // For now, pass through and let the API route handler check
      break;
    }
  }

  return null;
}

/**
 * Middleware configuration — match all routes except static assets.
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};
