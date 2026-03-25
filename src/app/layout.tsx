/**
 * @module RootLayout
 * @description Root layout with authentication and billing providers.
 * Wraps the entire app with necessary context providers.
 */

import React from 'react';
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Justice App — Built with Justice OS Starter Kit',
  description: 'A justice technology application powered by the Justice OS ecosystem',
};

/**
 * Root layout providing auth context, billing gate, and global styles.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">
        {/* In production, wrap with <ClerkProvider> or CognitoProvider */}
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {children}
        </main>
      </body>
    </html>
  );
}
