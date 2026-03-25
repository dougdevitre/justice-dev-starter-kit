/**
 * @module BillingRoute
 * @description Stripe webhook handler and billing API endpoints.
 * Processes subscription changes, payment events, and checkout completions.
 */

import { NextResponse } from 'next/server';
import { verifyWebhookSignature } from '../../../lib/billing';
import { logAudit } from '../../../lib/audit';

/**
 * POST /api/billing — Handle Stripe webhooks.
 */
export async function POST(request: Request): Promise<Response> {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    const event = verifyWebhookSignature(body, signature);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as any;
        await logAudit({
          action: 'subscription_changed',
          userId: session.metadata?.userId ?? 'unknown',
          metadata: { tier: session.metadata?.tier, event: 'checkout_completed' },
        });
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as any;
        await logAudit({
          action: 'subscription_changed',
          userId: subscription.metadata?.userId ?? 'unknown',
          metadata: { status: subscription.status, event: 'subscription_updated' },
        });
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as any;
        await logAudit({
          action: 'subscription_changed',
          userId: invoice.metadata?.userId ?? 'unknown',
          metadata: { event: 'payment_failed' },
        });
        break;
      }

      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 400 }
    );
  }
}
