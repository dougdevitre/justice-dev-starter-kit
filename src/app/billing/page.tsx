/**
 * @module BillingPage
 * @description Pricing and subscription management page.
 * Shows available tiers and handles upgrade flows.
 */

import React from 'react';
import { TIER_LIMITS } from '../../types';

/**
 * Billing page with pricing tiers and upgrade options.
 */
export default function BillingPage() {
  const tiers = [
    { name: 'Free', tier: 'free' as const, price: '$0', description: 'Get started' },
    { name: 'Starter', tier: 'starter' as const, price: '$29/mo', description: 'For individuals' },
    { name: 'Professional', tier: 'professional' as const, price: '$99/mo', description: 'For organizations' },
  ];

  return (
    <div className="py-8">
      <h1 className="text-2xl font-bold text-center">Choose Your Plan</h1>
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {tiers.map(({ name, tier, price, description }) => {
          const limits = TIER_LIMITS[tier];
          return (
            <div key={tier} className="rounded-lg border bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold">{name}</h3>
              <p className="text-3xl font-bold mt-2">{price}</p>
              <p className="text-gray-500 mt-1">{description}</p>
              <ul className="mt-4 space-y-2 text-sm">
                <li>AI Queries: {limits.maxAIQueriesPerMonth === -1 ? 'Unlimited' : limits.maxAIQueriesPerMonth}/mo</li>
                <li>Documents: {limits.maxDocuments === -1 ? 'Unlimited' : limits.maxDocuments}</li>
                <li>Storage: {limits.maxStorageMB}MB</li>
                {limits.apiAccess && <li>API Access</li>}
                {limits.prioritySupport && <li>Priority Support</li>}
              </ul>
              <button className="mt-6 w-full rounded-md bg-justice-600 px-4 py-2 text-white hover:bg-justice-500">
                {tier === 'free' ? 'Current Plan' : 'Upgrade'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
