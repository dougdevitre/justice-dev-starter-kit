/**
 * @module billing
 * @description Stripe billing helpers for subscription management,
 * checkout session creation, and webhook handling.
 */

import Stripe from 'stripe';
import type { Subscription, SubscriptionTier, SubscriptionStatus } from '../types';

/** Stripe instance (lazy-initialized) */
let stripeInstance: Stripe | null = null;

/**
 * Get the Stripe client instance.
 */
function getStripe(): Stripe {
  if (!stripeInstance) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error('STRIPE_SECRET_KEY is not configured');
    stripeInstance = new Stripe(key, { apiVersion: '2024-12-18.acacia' });
  }
  return stripeInstance;
}

/**
 * Create a Stripe checkout session for a subscription upgrade.
 *
 * @param customerId - Stripe customer ID
 * @param tier - Target subscription tier
 * @param successUrl - URL to redirect after successful payment
 * @param cancelUrl - URL to redirect if cancelled
 * @returns The checkout session URL
 */
export async function createCheckoutSession(
  customerId: string,
  tier: SubscriptionTier,
  successUrl: string,
  cancelUrl: string
): Promise<string> {
  const stripe = getStripe();

  const priceId = getPriceId(tier);
  if (!priceId) throw new Error(`No price configured for tier: ${tier}`);

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: { tier },
  });

  if (!session.url) throw new Error('Failed to create checkout session');
  return session.url;
}

/**
 * Get the current subscription for a customer.
 *
 * @param customerId - Stripe customer ID
 * @returns Subscription details or null
 */
export async function getSubscription(
  customerId: string
): Promise<Subscription | null> {
  const stripe = getStripe();

  const subscriptions = await stripe.subscriptions.list({
    customer: customerId,
    status: 'all',
    limit: 1,
  });

  const sub = subscriptions.data[0];
  if (!sub) return null;

  return {
    id: sub.id,
    userId: '', // Resolved by caller
    stripeSubscriptionId: sub.id,
    tier: (sub.metadata.tier as SubscriptionTier) ?? 'free',
    status: mapStripeStatus(sub.status),
    currentPeriodStart: new Date(sub.current_period_start * 1000).toISOString(),
    currentPeriodEnd: new Date(sub.current_period_end * 1000).toISOString(),
    cancelledAt: sub.canceled_at
      ? new Date(sub.canceled_at * 1000).toISOString()
      : undefined,
  };
}

/**
 * Create a Stripe customer portal session for managing subscriptions.
 *
 * @param customerId - Stripe customer ID
 * @param returnUrl - URL to return to after portal
 * @returns Portal session URL
 */
export async function createPortalSession(
  customerId: string,
  returnUrl: string
): Promise<string> {
  const stripe = getStripe();

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });

  return session.url;
}

/**
 * Verify a Stripe webhook signature.
 *
 * @param payload - Raw request body
 * @param signature - Stripe-Signature header
 * @returns Verified Stripe event
 */
export function verifyWebhookSignature(
  payload: string | Buffer,
  signature: string
): Stripe.Event {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) throw new Error('STRIPE_WEBHOOK_SECRET is not configured');

  return stripe.webhooks.constructEvent(payload, signature, secret);
}

/**
 * Get the Stripe price ID for a subscription tier.
 */
function getPriceId(tier: SubscriptionTier): string | undefined {
  const map: Record<SubscriptionTier, string | undefined> = {
    free: process.env.STRIPE_PRICE_ID_FREE,
    starter: process.env.STRIPE_PRICE_ID_STARTER,
    professional: process.env.STRIPE_PRICE_ID_PRO,
  };
  return map[tier];
}

/**
 * Map Stripe subscription status to our internal status.
 */
function mapStripeStatus(status: Stripe.Subscription.Status): SubscriptionStatus {
  switch (status) {
    case 'active':
      return 'active';
    case 'past_due':
      return 'past_due';
    case 'canceled':
      return 'cancelled';
    case 'trialing':
      return 'trialing';
    case 'unpaid':
      return 'unpaid';
    default:
      return 'active';
  }
}
