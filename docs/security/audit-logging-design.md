# Audit Logging Design — CoTrackPro

> **Status:** Production  
> **Applicability:** All CoTrackPro systems  
> **Last Updated:** 2026-04-06  
> **Owner:** Security Engineering & Compliance Team

---

## Table of Contents

1. [Overview](#overview)
2. [Event Classification](#event-classification)
3. [Log Schema](#log-schema)
4. [Log Retention](#log-retention)
5. [Immutable Audit Trails](#immutable-audit-trails)
6. [Monitoring and Alerting](#monitoring-and-alerting)
7. [Log Access and Query](#log-access-and-query)
8. [Legal Hold Integration](#legal-hold-integration)
9. [Compliance Mapping](#compliance-mapping)
10. [Implementation Guide](#implementation-guide)

---

## Overview

CoTrackPro's audit logging system provides an immutable, comprehensive record of all significant events across the platform. The system is designed to satisfy:

- **HIPAA** audit control requirements (45 CFR §164.312(b))
- **FERPA** recordkeeping obligations
- **SOC 2** availability and confidentiality criteria
- **Legal discovery** requirements (7-year retention with legal hold)
- **Security forensics** needs (threat detection, incident investigation)
- **Compliance reporting** requirements for enterprise customers

### Design Goals

| Goal | Implementation |
|------|--------------|
| Tamper-evident | Cryptographic hash chains; WORM storage |
| Complete | Every significant action logged; gaps detected automatically |
| Immutable | No application-layer delete/modify access to audit logs |
| Queryable | Structured JSON; indexed for fast search |
| Performant | Async logging; never blocks application path |
| Compliant | 7-year retention; geographic restrictions |

---

## Event Classification

### Tier 1 — Security Events (Critical)

Security events require immediate logging and trigger real-time alerts for high-severity patterns.

| Event Code | Event Description | Alert Threshold |
|-----------|-----------------|----------------|
| `SEC_001` | Authentication failure | > 5 in 10 minutes from same IP |
| `SEC_002` | Account lockout triggered | Any occurrence |
| `SEC_003` | Successful login after multiple failures | Any occurrence |
| `SEC_004` | Password reset initiated | Any; alert on > 3/hour per user |
| `SEC_005` | MFA bypass attempted | Any occurrence |
| `SEC_006` | MFA device added | Any occurrence |
| `SEC_007` | Privileged role assignment | Any occurrence |
| `SEC_008` | Break-glass access activated | Any occurrence → immediate alert |
| `SEC_009` | API key created or rotated | Any occurrence |
| `SEC_010` | Session hijacking suspected (IP/UA mismatch) | Any occurrence |
| `SEC_011` | Brute force pattern detected | Automated detection |
| `SEC_012` | Unauthorized access attempt | Any occurrence |
| `SEC_013` | Data exfiltration pattern (bulk download) | > 100 records in 10 minutes |
| `SEC_014` | PHI access outside normal hours | Configurable per organization |
| `SEC_015` | Configuration change to security settings | Any occurrence |
| `SEC_016` | Encryption key access | All KMS key operations |
| `SEC_017` | Audit log query | All queries to audit logs |

### Tier 2 — User Actions (Standard)

All user-initiated actions on protected resources.

| Event Code | Event Description | PHI Flag | FERPA Flag |
|-----------|-----------------|---------|-----------|
| `USR_001` | User login (success) | No | No |
| `USR_002` | User logout | No | No |
| `USR_003` | User session expired | No | No |
| `USR_004` | Case created | No | No |
| `USR_005` | Case viewed | No | No |
| `USR_006` | Case edited | No | No |
| `USR_007` | Case closed | No | No |
| `USR_008` | Document uploaded | Conditional | Conditional |
| `USR_009` | Document viewed | Conditional | Conditional |
| `USR_010` | Document downloaded | Conditional | Conditional |
| `USR_011` | Document deleted | Conditional | Conditional |
| `USR_012` | PHI record accessed | ✅ Yes | No |
| `USR_013` | PHI record modified | ✅ Yes | No |
| `USR_014` | FERPA record accessed | No | ✅ Yes |
| `USR_015` | FERPA record modified | No | ✅ Yes |
| `USR_016` | Child record accessed | No | No |
| `USR_017` | Child record modified | No | No |
| `USR_018` | Communication logged | No | No |
| `USR_019` | Communication viewed | No | No |
| `USR_020` | Safety plan viewed | No | No |
| `USR_021` | Safety plan modified | No | No |
| `USR_022` | Data exported | Conditional | Conditional |
| `USR_023` | Report generated | Conditional | Conditional |
| `USR_024` | Court filing submitted | No | No |
| `USR_025` | Emergency alert issued | No | No |
| `USR_026` | User profile updated | No | No |
| `USR_027` | Password changed | No | No |
| `USR_028` | Consent record created | Conditional | Conditional |
| `USR_029` | Consent record revoked | Conditional | Conditional |
| `USR_030` | AI query submitted | No | No |

### Tier 3 — System Events (Infrastructure)

Automated system operations and infrastructure events.

| Event Code | Event Description | Severity |
|-----------|-----------------|---------|
| `SYS_001` | Scheduled job started | Info |
| `SYS_002` | Scheduled job completed | Info |
| `SYS_003` | Scheduled job failed | Error → Alert |
| `SYS_004` | Database backup completed | Info |
| `SYS_005` | Database backup failed | Error → Alert |
| `SYS_006` | Encryption key rotated | Info |
| `SYS_007` | Certificate renewed | Info |
| `SYS_008` | Certificate expiry warning | Warning → Alert |
| `SYS_009` | Retention deletion executed | Info |
| `SYS_010` | Retention deletion failed | Error → Alert |
| `SYS_011` | Data export job completed | Info |
| `SYS_012` | Integration health check (external API) | Info |
| `SYS_013` | Rate limit triggered | Warning |
| `SYS_014` | Error rate threshold exceeded | Warning → Alert |
| `SYS_015` | Deployment event | Info |

### Tier 4 — Administrative Events

Actions by platform or organization administrators.

| Event Code | Event Description | Severity |
|-----------|-----------------|---------|
| `ADM_001` | User account created | Info |
| `ADM_002` | User account modified | Info |
| `ADM_003` | User account suspended | Warning |
| `ADM_004` | User account deleted | Warning |
| `ADM_005` | Role assigned to user | Info |
| `ADM_006` | Role revoked from user | Info |
| `ADM_007` | Organization settings changed | Info |
| `ADM_008` | Billing plan changed | Info |
| `ADM_009` | Third-party integration added | Info |
| `ADM_010` | Third-party integration removed | Info |
| `ADM_011` | Legal hold placed | Warning |
| `ADM_012` | Legal hold released | Warning |
| `ADM_013` | Bulk operation executed | Warning |
| `ADM_014` | Platform configuration changed | Warning → Alert |
| `ADM_015` | Support access granted to account | Warning |

---

## Log Schema

### Canonical Audit Log Entry

All audit events use a consistent JSON schema. Events are written to AWS CloudWatch Logs.

```json
{
  "schema_version": "2.0",
  "event_id": "evt_01HX4K9M2PQ3R5S7T9V1W3Y5Z7",
  "event_code": "USR_012",
  "event_category": "user_action",
  "event_name": "phi_record_accessed",
  "timestamp": "2026-04-06T05:19:14.765Z",
  "timestamp_unix": 1775607554765,
  
  "actor": {
    "user_id": "usr_01HX4K9M2PQ3R5S7",
    "role": "family_therapist",
    "session_id": "ses_01HX4K9M2PQ",
    "ip_address": "192.0.2.1",
    "ip_hash": "sha256:a3f5b2c1...",
    "user_agent_hash": "sha256:d4e6f8a2...",
    "organization_id": "org_01HX4K"
  },
  
  "target": {
    "resource_type": "phi_record",
    "resource_id": "phi_01HX4K9M",
    "case_id": "case_01HX4",
    "data_classification": "PHI_CLASS_1",
    "record_owner_id": "usr_01HX4K_patient"
  },
  
  "action": {
    "type": "READ",
    "method": "GET",
    "endpoint": "/api/cases/{caseId}/phi/{recordId}",
    "result": "SUCCESS",
    "http_status": 200
  },
  
  "context": {
    "purpose": "therapy_session_review",
    "authorization_type": "role_based",
    "case_association_verified": true,
    "phi_access_logged": true,
    "ferpa_access_logged": false,
    "mfa_verified_at_login": true,
    "session_mfa_age_seconds": 1847
  },
  
  "security": {
    "risk_score": 12,
    "anomaly_flags": [],
    "geo_country": "US",
    "geo_state": "MO"
  },
  
  "log_integrity": {
    "previous_event_id": "evt_01HX4K9M2PQ3R5S7T9V1W3Y5Z6",
    "chain_hash": "sha256:3a7b9c2d..."
  }
}
```

### Field Definitions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `schema_version` | string | ✅ | Log schema version for parsing |
| `event_id` | ULID string | ✅ | Globally unique, sortable event ID |
| `event_code` | string | ✅ | Standardized event code (e.g., `USR_012`) |
| `event_category` | enum | ✅ | `security` \| `user_action` \| `system` \| `admin` |
| `timestamp` | ISO 8601 | ✅ | UTC timestamp with milliseconds |
| `actor.user_id` | string | ✅ | Authenticated user identifier |
| `actor.role` | string | ✅ | User's role at time of action |
| `actor.ip_address` | string | ✅ | Requester IP (hashed in analytics) |
| `target.resource_id` | string | Context | Resource acted upon |
| `target.data_classification` | enum | ✅ | Data class of affected resource |
| `action.result` | enum | ✅ | `SUCCESS` \| `FAILURE` \| `PARTIAL` |
| `context.purpose` | string | Context | Business purpose of access |
| `log_integrity.chain_hash` | string | ✅ | Hash of this + previous event for tamper detection |

### PHI-Specific Log Fields

When `target.data_classification` is PHI:

```json
{
  "phi_details": {
    "phi_category": "mental_health_record",
    "identifiers_present": ["name", "date_of_birth"],
    "minimum_necessary_verified": true,
    "baa_reference": "baa_01HX4K_therapist_org",
    "purpose_of_use": "treatment"
  }
}
```

### FERPA-Specific Log Fields

When `target.data_classification` is FERPA:

```json
{
  "ferpa_details": {
    "record_type": "iep_document",
    "student_id_hash": "sha256:b8c2d4e6...",
    "exception_applied": "legitimate_educational_interest",
    "institution_id": "org_01HX4K_school",
    "consent_reference": "consent_01HX4K"
  }
}
```

---

## Log Retention

### Retention Schedule

| Log Category | Retention Period | Storage Tier | Deletion Method |
|-------------|----------------|-------------|----------------|
| Security events (Tier 1) | 7 years | Hot: 1 year; Warm: 7 years | Crypto-erasure at expiry |
| PHI access logs | 7 years | Hot: 1 year; Warm: 7 years | Crypto-erasure at expiry |
| FERPA access logs | 7 years | Hot: 1 year; Warm: 7 years | Crypto-erasure at expiry |
| User action logs (Tier 2) | 7 years | Hot: 1 year; Warm: 7 years | Crypto-erasure at expiry |
| System events (Tier 3) | 2 years | Hot: 6 months; Warm: 2 years | Crypto-erasure at expiry |
| Admin events (Tier 4) | 7 years | Hot: 1 year; Warm: 7 years | Crypto-erasure at expiry |
| Authentication logs | 2 years | Hot: 6 months; Warm: 2 years | Crypto-erasure at expiry |
| AI interaction logs | 1 year | Hot: 1 year | Anonymization + deletion |
| Legal hold logs | Duration of hold + 7 years | Hot until hold release | Manual process |

### Storage Architecture

```
AWS CloudWatch Logs (Hot — queryable, indexed)
    └── Log Groups (per service, per classification)
         └── Log Streams (per day, per instance)
              └── Log Integrity: hash chain per stream

AWS S3 (Warm — compressed, still queryable via Athena)
    └── s3://cotrackpro-audit-archive/
         └── year=2026/month=04/day=06/
              └── security-events-2026-04-06.json.gz
              └── phi-access-2026-04-06.json.gz

S3 Object Lock (WORM) — prevents deletion or modification
    └── Compliance mode: cannot be overridden even by root
    └── Governance mode: admin override possible (for legal deletion)
```

### Retention Enforcement

- Automated lifecycle policies on CloudWatch Log Groups enforce retention
- S3 Object Lock (Compliance Mode) prevents early deletion of archived logs
- Legal hold flag suspends automatic deletion
- Deletion events themselves logged to a separate immutable record

---

## Immutable Audit Trails

### Tamper Detection via Hash Chains

Each audit event includes a hash of the previous event, forming a verifiable chain:

```
event_1 (hash: H1) → event_2 (hash: H2 = SHA256(H1 + event_2_data)) → event_3 (hash: H3 = SHA256(H2 + event_3_data))
```

Any modification to a past event would break the chain, detectable by re-verifying hashes.

**Chain Verification:**
- Automated verification runs nightly
- Any chain break triggers `SEC_017` alert (critical severity)
- Results stored in separate, air-gapped verification log

### WORM Storage (Write Once, Read Many)

All archived audit logs are written to S3 with **Object Lock in Compliance Mode**:

```
S3 Object Lock: Compliance Mode
  - Retention period: Per log category (minimum 7 years for compliance logs)
  - No overrides: Cannot be shortened or removed, even by AWS root account
  - Versioning: Enabled; all versions retained
```

### AWS CloudTrail Integration

All AWS API calls (including audit log writes and KMS operations) are captured by CloudTrail:

- CloudTrail logs stored in separate, isolated S3 bucket
- CloudTrail log integrity validation enabled
- CloudTrail cannot be disabled by application roles

### Log Signing

Critical audit events are signed with an ECDSA P-256 key:

```json
{
  "event_id": "evt_01HX...",
  "signature": {
    "algorithm": "ECDSA-P256",
    "signature_value": "3045022100...",
    "key_id": "audit-signing-key-2026",
    "signed_fields": ["event_id", "timestamp", "actor.user_id", "event_code", "action.result"]
  }
}
```

---

## Monitoring and Alerting

### Real-Time Alert Rules

| Rule Name | Trigger Condition | Severity | Response |
|----------|-----------------|---------|---------|
| Brute force login | 5+ failed logins in 10 min from same IP | Critical | Auto-block IP; notify security |
| Account takeover pattern | Login from new country + sensitive action | High | Force re-auth; notify user |
| PHI bulk access | > 50 PHI records accessed in 1 hour | High | Alert security; review session |
| Mass download | > 100 files downloaded in 1 hour | High | Alert security; temporary hold |
| Break-glass activated | Any `SEC_008` event | Critical | Immediate alert to CISO |
| After-hours PHI access | PHI access outside 6am-10pm local time | Medium | Alert organization admin |
| Privilege escalation | Any `SEC_007` event | High | Alert security |
| Auth chain break | Hash chain verification failure | Critical | Immediate incident response |
| Audit log gap | Gap in expected event sequence | Critical | Immediate investigation |
| Failed backup | `SYS_005` event | High | Alert DevOps |
| Cert expiry | Certificate < 30 days from expiry | Medium | Alert DevOps; auto-renew if ACM |
| Legal hold deletion attempt | Deletion attempted on held record | Critical | Block + alert legal + security |

### Anomaly Detection

Machine learning-based anomaly detection runs on the event stream:

| Detection Model | Signal | Action |
|----------------|-------|-------|
| User behavior baseline | Deviation from user's normal access patterns | Risk score increase + alert |
| Velocity analysis | Unusual speed of actions | Risk score increase |
| Geographic impossibility | Login from two distant locations in short time | Force re-auth |
| Off-hours pattern | Access significantly outside normal patterns | Alert |
| Data stager pattern | Gradual data collection before bulk export | Alert |
| Rare access path | Access via rarely-used code path | Alert |

### Alert Routing

| Severity | Notification Channel | Response Time |
|---------|---------------------|--------------|
| Critical | PagerDuty (on-call) + Slack #security | Immediate |
| High | Slack #security + email | < 15 minutes |
| Medium | Slack #security | < 1 hour |
| Low | Daily digest email | Next business day |
| Info | Logged only | Reviewed in weekly audit |

---

## Log Access and Query

### Who Can Access Audit Logs

| Role | Access Level | Scope |
|------|------------|-------|
| Security Analyst | Full read | All events |
| Compliance Auditor | Full read | All events (auditing) |
| Org Admin | Read | Events within their organization |
| Platform Admin | Read | All events |
| Individual User | Read | Own events only |
| Legal/eDiscovery | Read (court-ordered) | Specific case scope |
| Third-party auditor | Read (contractual) | Agreed scope |

### Querying Audit Logs

```typescript
// Example: Query all PHI access for a case in the last 30 days
const query = {
  logGroupName: '/cotrackpro/audit/phi-access',
  filterPattern: JSON.stringify({
    "target.case_id": "case_01HX4",
    "event_code": { $in: ["USR_012", "USR_013"] }
  }),
  startTime: Date.now() - 30 * 24 * 60 * 60 * 1000,
  endTime: Date.now(),
};

// All audit log queries are themselves logged (event SEC_017)
await logAudit({
  event_code: 'SEC_017',
  action: 'audit_log_query',
  actor: { user_id: currentUser.id },
  context: { query_scope: query },
});
```

### eDiscovery and Legal Hold Queries

When responding to legal discovery:

1. Legal team issues eDiscovery request in case management system
2. Compliance team runs scoped query based on court order parameters
3. Results exported in legally admissible format (JSON with hash chain, PDF report)
4. Export includes chain of custody documentation
5. All eDiscovery queries logged as `SEC_017` events

---

## Legal Hold Integration

### Legal Hold on Audit Logs

When a case is placed under legal hold:

```
1. Case tagged with legal hold status
2. All audit logs referencing case_id tagged with hold flag
3. S3 Object Lock extended to hold duration + 7 years
4. CloudWatch Log Group retention extended
5. Automated deletion suspended for tagged logs
6. Hold status included in all future log entries for the case
```

### Hold Verification

```json
{
  "legal_hold": {
    "status": "active",
    "hold_id": "hold_01HX4K",
    "placed_by": "usr_01HX4_legal",
    "placed_at": "2026-04-06T05:19:14.765Z",
    "case_reference": "Case No. 2026-FC-1234",
    "expiry": null,
    "notes": "Active federal investigation"
  }
}
```

---

## Compliance Mapping

### HIPAA Audit Control Requirements (§164.312(b))

| HIPAA Requirement | CoTrackPro Implementation |
|------------------|--------------------------|
| Implement hardware, software, and/or procedural mechanisms to record and examine activity in information systems | CloudWatch Logs + anomaly detection + SIEM integration |
| Record activity in information systems containing ePHI | Event codes USR_012, USR_013 logged for all PHI access |

### SOC 2 Criteria Mapping

| SOC 2 Criteria | Audit Log Coverage |
|---------------|-------------------|
| CC6.1 Logical access controls | SEC_007, ADM_005, ADM_006 |
| CC6.2 Authentication controls | USR_001, USR_002, SEC_001–006 |
| CC6.3 Provisioning and de-provisioning | ADM_001–006 |
| CC7.2 Security incident monitoring | Tier 1 security events + alerting |
| CC7.3 Security incident response | SEC_008; incident response integration |
| A1.2 System availability monitoring | SYS events; uptime logging |

---

## Implementation Guide

### Adding Audit Logging to Application Code

```typescript
import { auditLogger } from '@/lib/audit';

// Standard user action
await auditLogger.log({
  event_code: 'USR_009',
  actor: { user_id: req.user.id, role: req.user.role, session_id: req.sessionId },
  target: {
    resource_type: 'document',
    resource_id: documentId,
    case_id: caseId,
    data_classification: document.classification,
  },
  action: { type: 'READ', result: 'SUCCESS' },
  context: { purpose: 'case_review' },
});

// PHI access — additional fields required
await auditLogger.logPHIAccess({
  event_code: 'USR_012',
  actor: req.user,
  target: { resource_id: phiRecordId, case_id: caseId },
  phi_details: {
    phi_category: 'medical_record',
    purpose_of_use: 'treatment',
    minimum_necessary_verified: true,
  },
});
```

### Audit Logger Implementation Notes

- Logging is **asynchronous** — never blocks the request path
- Failed log writes are retried with exponential backoff (5 attempts max)
- If logging fails after all retries, the action **proceeds** (logged as a gap event) — do not block user actions due to logging failures
- Gap events trigger high-severity alerts

---

> **Contact:** security@cotrackpro.com | compliance@cotrackpro.com  
> **For audit log requests (legal/compliance):** legal@cotrackpro.com
