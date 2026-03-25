/**
 * @module AuthWebhookRoute
 * @description Handles authentication webhooks from Clerk/Cognito.
 * Syncs user creation, updates, and deletion events.
 */

import { NextResponse } from 'next/server';
import { logAudit } from '../../../lib/audit';

/**
 * POST /api/auth — Handle auth provider webhooks.
 * Processes user.created, user.updated, user.deleted events.
 */
export async function POST(request: Request): Promise<Response> {
  try {
    const body = await request.json();
    const eventType = body.type;

    switch (eventType) {
      case 'user.created':
        await logAudit({
          action: 'login',
          userId: body.data.id,
          metadata: { event: 'user_created', email: body.data.email },
        });
        break;

      case 'user.updated':
        await logAudit({
          action: 'settings_updated',
          userId: body.data.id,
          metadata: { event: 'user_updated' },
        });
        break;

      case 'user.deleted':
        await logAudit({
          action: 'settings_updated',
          userId: body.data.id,
          metadata: { event: 'user_deleted' },
        });
        break;

      default:
        return NextResponse.json({ received: true, handled: false });
    }

    return NextResponse.json({ received: true, handled: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 400 }
    );
  }
}
