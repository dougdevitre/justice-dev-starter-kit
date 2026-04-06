# Access Control Matrix — CoTrackPro

> **Status:** Production  
> **Applicability:** All CoTrackPro deployments  
> **Last Updated:** 2026-04-06  
> **Owner:** Security Engineering & Product Team

---

## Table of Contents

1. [Overview](#overview)
2. [Role Taxonomy](#role-taxonomy)
3. [Permission Definitions](#permission-definitions)
4. [Access Control Matrix (35+ Roles)](#access-control-matrix-35-roles)
5. [Principle of Least Privilege](#principle-of-least-privilege)
6. [Session Management](#session-management)
7. [Multi-Factor Authentication Requirements](#multi-factor-authentication-requirements)
8. [Permission Inheritance Rules](#permission-inheritance-rules)
9. [Privileged Access Management](#privileged-access-management)
10. [Access Review Procedures](#access-review-procedures)

---

## Overview

CoTrackPro serves **35+ distinct role types** across family law, child welfare, healthcare, education, and legal proceedings. Access control is implemented using **Role-Based Access Control (RBAC)** with attribute-based conditions (ABAC) for context-sensitive permissions.

### Design Principles

1. **Principle of least privilege** — every role has the minimum access required
2. **Need-to-know** — access scoped to specific cases, not platform-wide
3. **Separation of duties** — no single role can both create and approve critical actions
4. **Defense in depth** — multiple layers enforce access: middleware, service layer, database
5. **Auditability** — every access decision logged with justification

### Access Model

```
User ──► Role ──► Permissions ──► Case Scope ──► Data Classification
         │
         └──► Organization Scope (if multi-org deployment)
```

Access is the intersection of:
- **What role the user has** (role-based permissions)
- **What case they're associated with** (case-scoped access)
- **What data classification the resource is** (PHI, FERPA, child data)
- **What organizational context they're in** (if applicable)

---

## Role Taxonomy

### Role Categories

| Category | Description | Example Roles |
|---------|-------------|--------------|
| **Family Roles** | Parents and family members involved in co-parenting | Custodial Parent, Non-Custodial Parent, Grandparent |
| **Legal Roles** | Attorneys, judges, and court officers | Attorney, Judge, Guardian ad Litem, Court Clerk |
| **Professional Services** | Therapists, mediators, social workers | Family Therapist, Parenting Coordinator, DCFS Case Worker |
| **Education Roles** | School and educational professionals | School Counselor, IEP Coordinator, Teacher |
| **Healthcare Roles** | Medical and mental health providers | Pediatrician, Psychiatrist, Child Psychologist |
| **Law Enforcement** | Police, child protective services | Police Officer, CPS Investigator, Probation Officer |
| **Administrative Roles** | Platform and organization administrators | Platform Admin, Org Admin, Support Agent |
| **Observer Roles** | Read-only oversight roles | Supervisor, Ombudsperson, Compliance Auditor |

---

## Permission Definitions

### Core Permission Set

| Permission | Code | Description |
|-----------|------|-------------|
| View case summary | `case:read:summary` | Read case metadata, parties, status |
| View case documents | `case:read:documents` | Read non-PHI documents |
| View PHI documents | `case:read:phi` | Read HIPAA-classified health records |
| View FERPA records | `case:read:ferpa` | Read educational records |
| View child data | `case:read:child` | Read child-specific records and data |
| Create case | `case:create` | Initialize a new case |
| Edit case | `case:edit` | Modify case details |
| Close case | `case:close` | Mark case as closed |
| Delete case | `case:delete` | Permanently delete case (admin only) |
| Upload document | `doc:upload` | Add documents to a case |
| Download document | `doc:download` | Download case documents |
| Delete document | `doc:delete` | Remove a document from a case |
| Add communication | `comm:create` | Add communication record |
| View communications | `comm:read` | View communication log |
| Export data | `data:export` | Export case data |
| Manage users | `user:manage` | Create/edit/deactivate users |
| View audit log | `audit:read` | Access audit trail |
| Manage organization | `org:manage` | Configure organization settings |
| Submit court filing | `court:file` | Submit documents to court |
| Approve court filing | `court:approve` | Approve filing (requires separate from submitter) |
| View safety plan | `safety:read` | View child safety plan |
| Edit safety plan | `safety:edit` | Modify child safety plan |
| Issue emergency alert | `alert:emergency` | Trigger emergency notification |
| Manage roles | `role:manage` | Assign/revoke user roles |
| Access break-glass | `admin:break-glass` | Emergency elevated access |

---

## Access Control Matrix (35+ Roles)

**Legend:**
- ✅ Full access
- 👁️ Read only
- ✏️ Create/edit own records only
- 📋 View summary only
- ⚖️ Court-ordered or with explicit authorization
- 🚨 Emergency only (with audit)
- ❌ No access

### Family Roles

| Permission | Custodial Parent | Non-Custodial Parent | Stepparent | Grandparent (Legal) | Foster Parent | Adult Child (18+) |
|-----------|:---:|:---:|:---:|:---:|:---:|:---:|
| `case:read:summary` | ✅ | ✅ | 👁️ | ⚖️ | ✅ | ⚖️ |
| `case:read:documents` | ✅ | ✅ | 👁️ | ⚖️ | ✅ | ⚖️ |
| `case:read:phi` | ✅ | ✅ | ❌ | ❌ | ✅ | ✅ |
| `case:read:ferpa` | ✅ | ✅ | ❌ | ❌ | ✅ | ✅ |
| `case:read:child` | ✅ | ✅ | 👁️ | ⚖️ | ✅ | ❌ |
| `case:create` | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ |
| `case:edit` | ✅ | ✏️ | ❌ | ❌ | ✏️ | ❌ |
| `case:close` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `doc:upload` | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ |
| `doc:download` | ✅ | ✅ | ❌ | ❌ | ✅ | ⚖️ |
| `comm:create` | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ |
| `comm:read` | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ |
| `data:export` | ✅ | ✅ | ❌ | ❌ | ✅ | ⚖️ |
| `safety:read` | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ |
| `safety:edit` | ✅ | ❌ | ❌ | ❌ | ✏️ | ❌ |
| `alert:emergency` | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ |
| `court:file` | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| `audit:read` | 👁️ | 👁️ | ❌ | ❌ | 👁️ | ❌ |

### Legal Roles

| Permission | Attorney | Judge | Guardian ad Litem | Court Clerk | Mediator | Arbitrator |
|-----------|:---:|:---:|:---:|:---:|:---:|:---:|
| `case:read:summary` | ✅ | ✅ | ✅ | 👁️ | ✅ | ✅ |
| `case:read:documents` | ✅ | ✅ | ✅ | 👁️ | ✅ | ✅ |
| `case:read:phi` | ⚖️ | ⚖️ | ⚖️ | ❌ | ❌ | ❌ |
| `case:read:ferpa` | ⚖️ | ⚖️ | ⚖️ | ❌ | ❌ | ❌ |
| `case:read:child` | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| `case:create` | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ |
| `case:edit` | ✏️ | ❌ | ✏️ | ✏️ | ❌ | ❌ |
| `case:close` | ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |
| `doc:upload` | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ |
| `doc:download` | ✅ | ✅ | ✅ | 👁️ | ✅ | ✅ |
| `comm:create` | ✅ | ❌ | ✅ | ✅ | ✅ | ❌ |
| `comm:read` | ✅ | ✅ | ✅ | 👁️ | ✅ | ✅ |
| `data:export` | ✅ | ⚖️ | ✅ | ❌ | ❌ | ❌ |
| `safety:read` | ✅ | ✅ | ✅ | ❌ | 👁️ | ❌ |
| `safety:edit` | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| `alert:emergency` | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ |
| `court:file` | ✅ | ❌ | ✅ | ✅ | ❌ | ❌ |
| `court:approve` | ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |
| `audit:read` | 👁️ | ✅ | 👁️ | ❌ | ❌ | ❌ |

### Professional Services

| Permission | Family Therapist | Parenting Coordinator | DCFS Case Worker | Probation Officer | School Social Worker | Domestic Violence Advocate |
|-----------|:---:|:---:|:---:|:---:|:---:|:---:|
| `case:read:summary` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `case:read:documents` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `case:read:phi` | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| `case:read:ferpa` | ❌ | ❌ | ✅ | ❌ | ✅ | ❌ |
| `case:read:child` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `case:create` | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ |
| `case:edit` | ✏️ | ✏️ | ✅ | ✏️ | ✏️ | ✏️ |
| `doc:upload` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `doc:download` | ✅ | ✅ | ✅ | 👁️ | ✅ | ✅ |
| `comm:create` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `comm:read` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `data:export` | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| `safety:read` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `safety:edit` | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ |
| `alert:emergency` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `court:file` | ❌ | ✅ | ✅ | ✅ | ❌ | ❌ |
| `audit:read` | 👁️ | 👁️ | ✅ | 👁️ | ❌ | ❌ |

### Healthcare Roles

| Permission | Pediatrician | Child Psychiatrist | Child Psychologist | Occupational Therapist | Speech Therapist | Nurse Practitioner |
|-----------|:---:|:---:|:---:|:---:|:---:|:---:|
| `case:read:summary` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `case:read:documents` | 👁️ | ✅ | ✅ | 👁️ | 👁️ | 👁️ |
| `case:read:phi` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `case:read:ferpa` | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `case:read:child` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `doc:upload` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `doc:download` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `comm:create` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `comm:read` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `safety:read` | ✅ | ✅ | ✅ | 👁️ | 👁️ | ✅ |
| `safety:edit` | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ |
| `alert:emergency` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `court:file` | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `audit:read` | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

### Law Enforcement & CPS

| Permission | Police Officer | CPS Investigator | Child Crimes Detective | Probation Officer | Attorney General Investigator |
|-----------|:---:|:---:|:---:|:---:|:---:|
| `case:read:summary` | ⚖️ | ✅ | ✅ | ✅ | ⚖️ |
| `case:read:documents` | ⚖️ | ✅ | ✅ | ✅ | ⚖️ |
| `case:read:phi` | ⚖️ | ⚖️ | ⚖️ | ❌ | ⚖️ |
| `case:read:ferpa` | ⚖️ | ⚖️ | ⚖️ | ❌ | ⚖️ |
| `case:read:child` | ⚖️ | ✅ | ✅ | ✅ | ⚖️ |
| `case:create` | ❌ | ✅ | ✅ | ❌ | ❌ |
| `doc:upload` | ⚖️ | ✅ | ✅ | ✅ | ⚖️ |
| `doc:download` | ⚖️ | ✅ | ✅ | 👁️ | ⚖️ |
| `safety:read` | ⚖️ | ✅ | ✅ | 👁️ | ⚖️ |
| `alert:emergency` | 🚨 | ✅ | ✅ | ✅ | 🚨 |
| `court:file` | ⚖️ | ✅ | ✅ | ✅ | ⚖️ |
| `audit:read` | ❌ | ❌ | ❌ | ❌ | ⚖️ |

### Education Roles

| Permission | School Counselor | IEP Coordinator | Teacher | School Principal | Special Ed Coordinator |
|-----------|:---:|:---:|:---:|:---:|:---:|
| `case:read:summary` | ✅ | ✅ | 📋 | ✅ | ✅ |
| `case:read:documents` | 👁️ | 👁️ | ❌ | 👁️ | 👁️ |
| `case:read:phi` | ❌ | ❌ | ❌ | ❌ | ❌ |
| `case:read:ferpa` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `case:read:child` | ✅ | ✅ | 📋 | ✅ | ✅ |
| `doc:upload` | ✅ | ✅ | ❌ | ✅ | ✅ |
| `doc:download` | ✅ | ✅ | 👁️ | ✅ | ✅ |
| `comm:create` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `comm:read` | ✅ | ✅ | 📋 | ✅ | ✅ |
| `safety:read` | ✅ | 👁️ | 📋 | ✅ | 👁️ |
| `alert:emergency` | ✅ | ❌ | 🚨 | ✅ | ❌ |
| `audit:read` | ❌ | ❌ | ❌ | ❌ | ❌ |

### Administrative Roles

| Permission | Platform Admin | Org Admin | Support Agent | Compliance Auditor | Security Analyst |
|-----------|:---:|:---:|:---:|:---:|:---:|
| `case:read:summary` | 🚨 | ✅ | 🚨 | 👁️ | 👁️ |
| `case:read:documents` | 🚨 | ✅ | 🚨 | ❌ | ❌ |
| `case:read:phi` | 🚨 | ❌ | ❌ | ❌ | ❌ |
| `case:read:ferpa` | 🚨 | ❌ | ❌ | ❌ | ❌ |
| `case:create` | ✅ | ✅ | ❌ | ❌ | ❌ |
| `case:edit` | 🚨 | ✅ | ❌ | ❌ | ❌ |
| `case:delete` | ✅ | ❌ | ❌ | ❌ | ❌ |
| `user:manage` | ✅ | ✅ | 👁️ | ❌ | ❌ |
| `org:manage` | ✅ | ✅ | ❌ | ❌ | ❌ |
| `audit:read` | ✅ | ✅ | ❌ | ✅ | ✅ |
| `role:manage` | ✅ | ✅ | ❌ | ❌ | ❌ |
| `admin:break-glass` | ✅ | ❌ | ❌ | ❌ | ❌ |
| `data:export` | 🚨 | ✅ | ❌ | 👁️ | ❌ |

---

## Principle of Least Privilege

### Implementation Rules

1. **Default deny:** No permissions unless explicitly granted
2. **Role assignment requires justification:** Document business need for each role assignment
3. **Time-limited roles:** Temporary elevated roles expire automatically (7-day default)
4. **Case-scoped:** Permissions apply only to cases the user is associated with
5. **No permission creep:** Annual access reviews required; unused permissions removed

### Role Assignment Workflow

```
Request → Manager Approval → Security Review (elevated roles) → Assignment → Audit Log
```

**Elevated role review thresholds:**
- Family roles: Manager approval
- Professional roles: Manager + credential verification
- Legal roles: Manager + bar number / license verification
- Admin roles: Security team approval + dual authorization
- Break-glass: CISO approval + documented incident

---

## Session Management

### Session Configuration

| Parameter | Value | Notes |
|---------|-------|-------|
| Access token lifetime | 15 minutes | Short to limit exposure |
| Refresh token lifetime | 7 days | Sliding window; reset on activity |
| Idle timeout | 30 minutes | Session terminated after inactivity |
| Absolute timeout | 12 hours | Maximum session regardless of activity |
| Concurrent sessions | 3 maximum | Oldest session terminated when exceeded |
| Session token storage | httpOnly + Secure cookie | Not accessible to JavaScript |
| Session invalidation | Server-side revocation list | Immediate on logout/revocation |

### Session Security Controls

- **Token binding:** Session tokens bound to user agent + IP (soft binding; alert on mismatch)
- **Rotation:** Refresh token rotated on each use (prevents token replay)
- **Revocation:** All sessions can be revoked by user (logout all devices) or admin
- **Logout:** Explicitly clears token from server-side store (not just client-side)

### Privileged Session Rules

For sessions with elevated permissions (admin, break-glass):

- MFA required at session start (not just login)
- Session lifetime reduced to 4 hours absolute
- Actions within session logged at enhanced detail level
- Session cannot be extended; new authentication required

---

## Multi-Factor Authentication Requirements

### MFA Requirements by Role

| Role Category | MFA Required | MFA Type |
|--------------|-------------|---------|
| Custodial/Non-Custodial Parent | Recommended | TOTP or SMS |
| All legal roles | **Required** | TOTP preferred; SMS allowed |
| All professional services roles | **Required** | TOTP preferred; SMS allowed |
| All healthcare roles | **Required** | TOTP preferred |
| Law enforcement | **Required** | TOTP preferred |
| Education roles | **Required** | TOTP preferred |
| Org Admin | **Required** | TOTP only (no SMS) |
| Platform Admin | **Required** | TOTP + hardware key (FIDO2) |
| Security Analyst | **Required** | TOTP + hardware key (FIDO2) |
| Compliance Auditor | **Required** | TOTP only |
| Break-glass | **Required** | Hardware key (FIDO2) only |

### MFA Methods Supported

| Method | Security Level | Allowed For |
|-------|--------------|------------|
| Hardware security key (FIDO2/WebAuthn) | ⭐⭐⭐⭐⭐ | All roles; required for admin |
| TOTP authenticator app (Google Auth, Authy) | ⭐⭐⭐⭐ | All roles |
| SMS OTP | ⭐⭐⭐ | Family roles only; deprecated for professional roles |
| Email OTP | ⭐⭐ | Password reset only; not session MFA |
| Push notification (Duo) | ⭐⭐⭐⭐ | Enterprise deployments |

**SMS OTP Deprecation:** SMS OTP will be deprecated for all roles within 12 months. SIM swap attacks make SMS insufficient for sensitive roles.

---

## Permission Inheritance Rules

### Role Hierarchy

```
Platform Admin
    └── Org Admin
         ├── Case Manager
         │    └── Case Participant (scoped)
         └── Read-Only Observer
```

**Rules:**
1. Child roles do **not** automatically inherit parent permissions (explicit assignment only)
2. Org Admin cannot assign permissions they do not themselves hold
3. Platform Admin cannot assign break-glass without Security Officer co-signature

### Case-Scoped Inheritance

When a user is added to a case, they receive **case-scoped permissions** based on their role:

```typescript
// Permission check logic
function canAccessResource(user: User, resource: Resource, action: string): boolean {
  // 1. Check if user has the permission for their role
  if (!rolePermissions[user.role].includes(action)) return false;
  
  // 2. Check if user is associated with the case
  if (resource.caseId && !user.caseAssociations.includes(resource.caseId)) return false;
  
  // 3. Check data classification requirements
  if (resource.classification === 'PHI' && !userHasPHIAccess(user)) return false;
  if (resource.classification === 'FERPA' && !userHasFERPAAccess(user)) return false;
  if (resource.classification === 'CHILD' && !userHasChildDataAccess(user)) return false;
  
  // 4. Check for active legal hold or restriction
  if (resource.restricted && !user.hasRestrictionOverride) return false;
  
  return true;
}
```

---

## Privileged Access Management

### Break-Glass Access

For emergency situations where normal access controls would prevent critical operations:

1. **Trigger:** Active security incident, critical system failure, legal emergency
2. **Request:** Submit break-glass request in incident management system with justification
3. **Approval:** Dual approval required (Security Officer + CTO minimum)
4. **Grant:** Time-limited (4-hour maximum) elevated access granted
5. **Monitoring:** All actions during break-glass session logged to immutable trail and alerting
6. **Review:** Post-incident review within 24 hours; all actions justified
7. **Revocation:** Access automatically revoked at time limit; immediate revocation available

### Privileged Identity Management

| Control | Implementation |
|---------|--------------|
| Separate privileged accounts | Admins have separate accounts for admin vs. day-to-day work |
| Just-in-time access | Elevated permissions granted for specific tasks; auto-expire |
| Privileged session recording | Admin sessions logged with enhanced detail |
| Dual control for destructive actions | Case deletion, bulk export require two-person authorization |

---

## Access Review Procedures

### Review Schedule

| Review Type | Frequency | Scope |
|------------|---------|-------|
| User access review | Quarterly | All active users and their role assignments |
| Privileged access review | Monthly | Admin roles; break-glass authorizations |
| Dormant account review | Monthly | Accounts inactive 60+ days; suspend or deactivate |
| Role permission review | Semi-annually | Review that each role's permissions remain appropriate |
| Third-party access review | Quarterly | All API integrations and service accounts |

### Review Process

```
1. Generate access report (users, roles, last activity, case associations)
2. Route to role owners for certification
3. Role owners approve or revoke within 10 business days
4. Unreviewed access automatically suspended at day 15
5. Review completion documented in compliance record
6. Anomalies (dormant accounts with high access, role drift) escalated to security team
```

---

> **Contact:** security@cotrackpro.com | access-control-review@cotrackpro.com  
> **To report access control issues:** security@cotrackpro.com
