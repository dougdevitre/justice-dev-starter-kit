/**
 * @module DashboardPage
 * @description Authenticated dashboard showing user's cases, documents,
 * and AI query history. Gated by authentication middleware.
 */

import React from 'react';

/**
 * Main dashboard page (requires authentication).
 */
export default function DashboardPage() {
  return (
    <div className="py-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <DashboardCard title="My Cases" count={0} href="/dashboard/cases" />
        <DashboardCard title="Documents" count={0} href="/dashboard/documents" />
        <DashboardCard title="AI Queries" count={0} href="/dashboard/queries" />
      </div>
    </div>
  );
}

function DashboardCard({ title, count, href }: { title: string; count: number; href: string }) {
  return (
    <a href={href} className="block rounded-lg border bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-3xl font-bold text-justice-600">{count}</p>
    </a>
  );
}
