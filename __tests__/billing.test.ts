/**
 * @jest-environment node
 */

import * as billing from '../src/lib/billing';

describe('Billing Helpers', () => {
  describe('createCheckoutSession()', () => {
    it('should throw if STRIPE_SECRET_KEY is not set', async () => {
      // Without env vars, Stripe client should throw
      const originalKey = process.env.STRIPE_SECRET_KEY;
      delete process.env.STRIPE_SECRET_KEY;

      await expect(
        billing.createCheckoutSession(
          'cus_123',
          'starter',
          'http://localhost/success',
          'http://localhost/cancel'
        )
      ).rejects.toThrow();

      process.env.STRIPE_SECRET_KEY = originalKey;
    });
  });

  describe('getSubscription()', () => {
    it('should throw if STRIPE_SECRET_KEY is not set', async () => {
      const originalKey = process.env.STRIPE_SECRET_KEY;
      delete process.env.STRIPE_SECRET_KEY;

      await expect(
        billing.getSubscription('cus_123')
      ).rejects.toThrow();

      process.env.STRIPE_SECRET_KEY = originalKey;
    });
  });

  describe('verifyWebhookSignature()', () => {
    it('should throw if STRIPE_WEBHOOK_SECRET is not set', () => {
      const originalSecret = process.env.STRIPE_WEBHOOK_SECRET;
      delete process.env.STRIPE_WEBHOOK_SECRET;

      expect(() =>
        billing.verifyWebhookSignature('payload', 'sig')
      ).toThrow('STRIPE_WEBHOOK_SECRET');

      process.env.STRIPE_WEBHOOK_SECRET = originalSecret;
    });

    it('should throw if signature is invalid', () => {
      process.env.STRIPE_SECRET_KEY = 'sk_test_fake';
      process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test_fake';

      expect(() =>
        billing.verifyWebhookSignature('invalid_payload', 'invalid_sig')
      ).toThrow();

      delete process.env.STRIPE_SECRET_KEY;
      delete process.env.STRIPE_WEBHOOK_SECRET;
    });
  });

  describe('createPortalSession()', () => {
    it('should throw if STRIPE_SECRET_KEY is not set', async () => {
      const originalKey = process.env.STRIPE_SECRET_KEY;
      delete process.env.STRIPE_SECRET_KEY;

      await expect(
        billing.createPortalSession('cus_123', 'http://localhost/dashboard')
      ).rejects.toThrow();

      process.env.STRIPE_SECRET_KEY = originalKey;
    });
  });
});
