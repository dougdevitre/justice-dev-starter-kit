/**
 * @module AIRoute
 * @description AI query endpoint with built-in guardrails.
 * Requires authentication and logs all queries to the audit trail.
 */

import { NextResponse } from 'next/server';
import { requireAuth, checkRole } from '../../../lib/auth';
import { queryAI } from '../../../lib/ai';
import { logAudit, getClientIP } from '../../../lib/audit';

/**
 * POST /api/ai — Query the AI with guardrails.
 * Requires authentication. Logs query to audit trail.
 */
export async function POST(request: Request): Promise<Response> {
  try {
    const user = await requireAuth(request);
    checkRole(user, ['admin', 'attorney', 'litigant']);

    const { query, jurisdiction } = await request.json();

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      );
    }

    const result = await queryAI(query, {
      jurisdiction,
      userId: user.id,
      guardrails: {
        requireCitations: true,
        maxConfidenceWithoutSource: 0.3,
        prohibitLegalAdvice: true,
      },
    });

    await logAudit({
      action: 'ai_query',
      userId: user.id,
      resource: 'ai_query',
      resourceId: result.id,
      ipAddress: getClientIP(request),
      metadata: {
        query,
        jurisdiction,
        confidence: result.confidence,
        citationCount: result.citations.length,
        guardrailFlags: result.guardrailFlags,
      },
    });

    return NextResponse.json(result);
  } catch (error: any) {
    const status = error.status ?? 500;
    return NextResponse.json(
      { error: error.message ?? 'Internal server error' },
      { status }
    );
  }
}
