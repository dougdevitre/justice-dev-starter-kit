/**
 * @example Configuring Roles and Permissions
 * @description Shows how to set up custom roles, tier gating, and
 * route protection in the Justice Dev Starter Kit.
 */

import type { UserRole, SubscriptionTier } from '../src/types';

// --- 1. Define role permissions ---

interface RolePermission {
  canViewCases: boolean;
  canEditCases: boolean;
  canQueryAI: boolean;
  canGenerateDocuments: boolean;
  canViewAuditLogs: boolean;
  canManageUsers: boolean;
}

const ROLE_PERMISSIONS: Record<UserRole, RolePermission> = {
  admin: {
    canViewCases: true,
    canEditCases: true,
    canQueryAI: true,
    canGenerateDocuments: true,
    canViewAuditLogs: true,
    canManageUsers: true,
  },
  attorney: {
    canViewCases: true,
    canEditCases: true,
    canQueryAI: true,
    canGenerateDocuments: true,
    canViewAuditLogs: false,
    canManageUsers: false,
  },
  litigant: {
    canViewCases: true,
    canEditCases: false,
    canQueryAI: true,
    canGenerateDocuments: true,
    canViewAuditLogs: false,
    canManageUsers: false,
  },
  public: {
    canViewCases: false,
    canEditCases: false,
    canQueryAI: false,
    canGenerateDocuments: false,
    canViewAuditLogs: false,
    canManageUsers: false,
  },
};

// --- 2. Use in API routes ---

function checkPermission(role: UserRole, permission: keyof RolePermission): boolean {
  return ROLE_PERMISSIONS[role]?.[permission] ?? false;
}

// Example usage in an API route:
// const user = await requireAuth(request);
// if (!checkPermission(user.role, 'canQueryAI')) {
//   return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
// }

// --- 3. Use in React components ---

// <RoleGuard allowedRoles={['admin', 'attorney']} currentRole={user.role}>
//   <AdminPanel />
// </RoleGuard>

// --- 4. Combine with tier gating ---

// <BillingGate minimumTier="starter" currentTier={user.tier}>
//   <RoleGuard allowedRoles={['attorney']} currentRole={user.role}>
//     <AdvancedAITools />
//   </RoleGuard>
// </BillingGate>

console.log('Role permissions configured.');
console.log('Admin permissions:', ROLE_PERMISSIONS.admin);
console.log('Litigant permissions:', ROLE_PERMISSIONS.litigant);
