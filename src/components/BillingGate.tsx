/**
 * @module BillingGate
 * @description Tier-based feature gating component. Shows content only
 * if the user's subscription tier meets the minimum requirement.
 */

'use client';

import React from 'react';
import type { SubscriptionTier } from '../types';

interface BillingGateProps {
  /** Minimum tier required to see the content */
  minimumTier: SubscriptionTier;
  /** Current user's tier */
  currentTier: SubscriptionTier;
  /** Content to show when tier is sufficient */
  children: React.ReactNode;
  /** Optional fallback when tier is insufficient */
  fallback?: React.ReactNode;
}

const TIER_ORDER: SubscriptionTier[] = ['free', 'starter', 'professional'];

/**
 * BillingGate conditionally renders content based on subscription tier.
 */
export const BillingGate: React.FC<BillingGateProps> = ({
  minimumTier,
  currentTier,
  children,
  fallback,
}) => {
  const currentIndex = TIER_ORDER.indexOf(currentTier);
  const requiredIndex = TIER_ORDER.indexOf(minimumTier);

  if (currentIndex >= requiredIndex) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-6 text-center">
      <h3 className="text-lg font-semibold text-yellow-800">Upgrade Required</h3>
      <p className="mt-2 text-yellow-700">
        This feature requires the {minimumTier} plan or higher.
      </p>
      <a href="/billing" className="mt-4 inline-block rounded bg-justice-600 px-4 py-2 text-white hover:bg-justice-500">
        View Plans
      </a>
    </div>
  );
};
