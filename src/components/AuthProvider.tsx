/**
 * @module AuthProvider
 * @description Authentication context provider that wraps the app with user session state.
 * Supports both Clerk and Cognito auth providers.
 */

'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import type { AuthUser } from '../types';

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  signOut: async () => {},
});

/**
 * AuthProvider wraps the app with authentication context.
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In production, fetch user session from auth provider
    setLoading(false);
  }, []);

  const signOut = async () => {
    setUser(null);
    // In production, call auth provider sign-out
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook to access the authenticated user.
 */
export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}
