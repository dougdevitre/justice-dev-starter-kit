/**
 * @module LandingPage
 * @description Public landing page for the justice application.
 * Showcases features and provides sign-up CTA.
 */

import React from 'react';

/**
 * Landing page component.
 */
export default function HomePage() {
  return (
    <div className="py-16">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          Justice Made Accessible
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600">
          Built with the Justice OS Starter Kit. Secure, accessible, and
          designed for people navigating the legal system.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <a
            href="/signup"
            className="rounded-md bg-justice-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-justice-500"
          >
            Get Started
          </a>
          <a href="/login" className="text-sm font-semibold text-gray-900">
            Sign In &rarr;
          </a>
        </div>
      </div>
    </div>
  );
}
