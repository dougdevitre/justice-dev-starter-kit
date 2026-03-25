/**
 * @module RoleGuard
 * @description Role-based component rendering. Shows content only
 * if the user has one of the allowed roles.
 */

'use client';

import React from 'react';
import type { UserRole } from '../types';

interface RoleGuardProps {
  /** Roles allowed to see the content */
  allowedRoles: UserRole[];
  /** Current user's role */
  currentRole: UserRole;
  /** Content to show when role is allowed */
  children: React.ReactNode;
  /** Optional fallback when role is not allowed */
  fallback?: React.ReactNode;
}

/**
 * RoleGuard conditionally renders content based on user role.
 */
export const RoleGuard: React.FC<RoleGuardProps> = ({
  allowedRoles,
  currentRole,
  children,
  fallback,
}) => {
  if (allowedRoles.includes(currentRole)) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return null;
};
