# Third-Party Integration Safety & Compliance — CoTrackPro

> **Status:** Production  
> **Applicability:** All CoTrackPro third-party vendors, integrations, and subprocessors  
> **Last Updated:** 2026-04-06  
> **Owner:** Security & Compliance Team

---

## Table of Contents

1. [Overview](#overview)
2. [Vendor Assessment Criteria](#vendor-assessment-criteria)
3. [Data Processing Agreements (DPAs)](#data-processing-agreements-dpas)
4. [Subprocessor Management](#subprocessor-management)
5. [Current Approved Subprocessors](#current-approved-subprocessors)
6. [Integration Security Standards](#integration-security-standards)
7. [Ongoing Monitoring](#ongoing-monitoring)
8. [Vendor Incident Response](#vendor-incident-response)
9. [Offboarding Third Parties](#offboarding-third-parties)

---

## Overview

CoTrackPro integrates with third-party services to provide authentication, payments, AI capabilities, cloud infrastructure, and communications. Each integration represents a potential risk surface for data exposure, service disruption, or compliance violation.

This document establishes:
- How CoTrackPro evaluates new vendors before integration
- Contractual requirements for all vendors processing user data
- The complete subprocessor register
- Ongoing monitoring and incident response for vendor-related issues

### Risk Principle

> Any third party that receives, processes, stores, or transmits CoTrackPro user data inherits a portion of CoTrackPro's compliance obligations. CoTrackPro remains responsible to its users regardless of which party caused a failure.

---

## Vendor Assessment Criteria

### Security Assessment Questionnaire

Before any integration that will access user data, vendors must complete a security assessment:

**Tier 1 Assessment (High Risk — access to PII, PHI, or FERPA records)**

| Category | Questions |
|---------|-----------|
| **Security certifications** | SOC 2 Type II, ISO 27001, HITRUST, PCI DSS (as applicable)? |
| **Encryption** | AES-256 at rest? TLS 1.3 in transit? Key management practices? |
| **Access controls** | RBAC implemented? MFA enforced? Privileged access management? |
| **Incident response** | IRP documented? Breach notification SLA? Prior breaches in last 3 years? |
| **Data residency** | Where is data stored? US only? Data transfer mechanisms? |
| **Subprocessors** | Who are their subprocessors? How are they vetted? |
| **Data deletion** | Deletion procedures and timelines upon contract termination? |
| **Vulnerability management** | Penetration testing frequency? Vulnerability disclosure program? |
| **Business continuity** | RTO/RPO? DR plan? Last DR test? |
| **Compliance** | HIPAA BAA available? FERPA compliant? CCPA compliant? |

**Tier 2 Assessment (Medium Risk — access to non-PII operational data)**

Abbreviated assessment: certifications, encryption, incident response, data deletion.

**Tier 3 Assessment (Low Risk — no user data access)**

Vendor security review at contract level; no detailed assessment required.

### Assessment Scoring

| Score | Outcome |
|-------|---------|
| 90–100 | Approved; standard monitoring |
| 75–89 | Conditionally approved; remediation plan required within 90 days |
| 60–74 | Conditional approval with compensating controls; 30-day re-assessment |
| < 60 | Not approved; seek alternative vendor or escalate to CISO |

### Required Certifications by Vendor Category

| Vendor Category | Required Certifications |
|----------------|------------------------|
| Cloud infrastructure | SOC 2 Type II; ISO 27001 |
| Healthcare data processing | HIPAA BAA; SOC 2 Type II; HITRUST preferred |
| Educational data processing | FERPA compliant; SOC 2 Type II |
| Payment processing | PCI DSS Level 1 |
| AI/ML service providers | SOC 2 Type II; data use policy reviewed by Legal |
| Identity/authentication | SOC 2 Type II; SOC 3 preferred |
| Email/communications | SOC 2 Type II |

---

## Data Processing Agreements (DPAs)

### DPA Requirements

A Data Processing Agreement is **required** before any integration that will process personal data of CoTrackPro users. The DPA must include:

#### Minimum DPA Clauses

**1. Subject Matter and Nature of Processing**
- Specific categories of personal data processed
- Purposes of processing
- Duration of processing
- Types of data subjects

**2. Processor Obligations**

```
The Processor agrees to:
a) Process personal data only on documented instructions from CoTrackPro
b) Ensure persons authorized to process data are bound by confidentiality
c) Implement appropriate technical and organizational security measures
d) Not engage sub-processors without prior written authorization from CoTrackPro
e) Assist CoTrackPro in responding to data subject rights requests
f) Notify CoTrackPro without undue delay (maximum 72 hours) after discovering 
   a personal data breach
g) Delete or return all personal data upon termination of services
h) Make available all information necessary to demonstrate compliance
i) Allow for and contribute to audits and inspections by CoTrackPro
```

**3. Security Measures**

The DPA must specify:
- Encryption standards for data at rest and in transit
- Access control measures
- Incident detection and response procedures
- Business continuity and disaster recovery
- Regular security testing procedures

**4. Sub-Processing**

- Vendor must disclose all sub-processors
- Vendor must notify CoTrackPro 30 days before adding new sub-processors
- CoTrackPro has the right to object to new sub-processors
- Vendor must impose the same obligations on sub-processors

**5. Data Subject Rights**

Vendor must assist CoTrackPro in responding within required timeframes to:
- Right of access requests
- Rectification requests
- Erasure requests (right to be forgotten)
- Data portability requests
- Restriction of processing requests

**6. HIPAA-Specific Addendum (for PHI processors)**

Vendors accessing PHI must execute a separate **Business Associate Agreement (BAA)** in addition to the DPA. See [HIPAA Compliance](./HIPAA-compliance.md) for the BAA template.

**7. FERPA-Specific Requirements (for educational data processors)**

Vendors accessing student data must acknowledge:
- FERPA applicability and their obligations as a "school official" under FERPA
- Data may only be used for the educational purpose for which it was disclosed
- No re-disclosure without consent or FERPA exception
- Student data may not be used for advertising or profiling

**8. Data Return and Deletion**

Upon termination, vendor must:
- Return all personal data in a portable format within 30 days
- Provide written confirmation that all copies have been securely deleted
- Retain data only if legally required to do so (and notify CoTrackPro)

**9. Audit Rights**

CoTrackPro may:
- Request copies of audit reports (SOC 2, penetration tests) annually
- Conduct or commission independent audits with 30 days notice
- Review security practices upon reasonable request

---

## Subprocessor Management

### Subprocessor Register

CoTrackPro maintains a public register of all subprocessors. Users are notified of significant subprocessor changes 30 days in advance.

**Notification Process for Subprocessor Changes:**

1. CoTrackPro identifies new subprocessor or change to existing
2. Legal reviews DPA/BAA requirements for new subprocessor
3. 30-day advance notice sent to enterprise customers and posted in changelog
4. Users may object; if objection is unresolvable, termination without penalty available
5. Subprocessor register updated on effective date

### Risk Tiering

| Risk Tier | Definition | Example | Review Frequency |
|----------|-----------|---------|----------------|
| **Critical** | Access to PHI, FERPA, or child data in production | AWS (primary infra), Anthropic (AI) | Quarterly |
| **High** | Access to PII or authentication credentials | Cognito, Stripe, SendGrid | Semi-annual |
| **Medium** | Access to non-PII operational data | Error monitoring, analytics | Annual |
| **Low** | No access to user data | Development tooling | On contract renewal |

---

## Current Approved Subprocessors

### Critical Tier Subprocessors

| Vendor | Service | Data Accessed | Location | Certifications | DPA Status | BAA Status |
|--------|---------|-------------|---------|--------------|-----------|-----------|
| **Amazon Web Services (AWS)** | Cloud infrastructure, database, storage, authentication | All user data (encrypted) | US (us-east-1, us-west-2) | SOC 2 Type II, ISO 27001, HIPAA, PCI DSS, FedRAMP | ✅ AWS DPA | ✅ AWS BAA |
| **Anthropic** | Claude AI for de-escalation and legal analysis | Non-PHI prompts only (see AI Data Policy) | US | SOC 2 Type II | ✅ Anthropic DPA | ⚠️ PHI prohibited from prompts |

### High Tier Subprocessors

| Vendor | Service | Data Accessed | Location | Certifications | DPA Status | BAA Status |
|--------|---------|-------------|---------|--------------|-----------|-----------|
| **Stripe** | Payment processing | Billing information only (no PHI/PII passed) | US / EU | PCI DSS Level 1, SOC 2 Type II | ✅ Stripe DPA | ❌ Not applicable (no health data) |
| **AWS Cognito** | Authentication and identity | Email, authentication tokens | US | SOC 2 Type II, ISO 27001, HIPAA | Part of AWS DPA | Part of AWS BAA |
| **Amazon SES** | Transactional email | Email addresses, notification content | US | SOC 2 Type II, ISO 27001 | Part of AWS DPA | Part of AWS BAA |

### Medium Tier Subprocessors

| Vendor | Service | Data Accessed | Location | Certifications | DPA Status |
|--------|---------|-------------|---------|--------------|-----------|
| **AWS CloudWatch** | Application monitoring and logging | Log data (encrypted; PHI redacted from logs) | US | SOC 2 Type II, HIPAA | Part of AWS DPA |
| **AWS CloudTrail** | API audit logging | API metadata (no PHI payload) | US | SOC 2 Type II, HIPAA | Part of AWS DPA |

### AI Data Policy

**Critical restriction on Anthropic Claude usage:**

CoTrackPro uses Anthropic Claude for:
- Communication de-escalation suggestions
- Legal document plain-language summaries
- Non-case-specific guidance

**PHI and FERPA data must NEVER be included in prompts sent to Anthropic.** Implementation controls:

```typescript
// AI prompt sanitization — remove any potential PHI before sending to Claude
function sanitizeForAI(prompt: string, context: AIContext): string {
  // Strip identified PHI fields
  let sanitized = prompt
    .replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[SSN]')           // SSN pattern
    .replace(/\b[A-Z]\d{6,8}\b/g, '[MEDICAL_RECORD_ID]')   // Medical record pattern
    .replace(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, '[PHONE]'); // Phone numbers
  
  // Ensure no PHI-flagged content is included
  if (context.containsPHI) {
    throw new Error('Cannot send PHI to external AI service');
  }
  
  return sanitized;
}
```

The AI context flag `containsPHI` is set by the data classification system and checked before every API call to Anthropic. Violations trigger a `SEC_015` audit event.

---

## Integration Security Standards

### API Security Requirements

All third-party API integrations must comply with:

| Requirement | Standard |
|------------|---------|
| Authentication | API keys stored in AWS Secrets Manager; never hardcoded |
| Transport | TLS 1.3 minimum |
| Secret rotation | API keys rotated every 90 days or upon personnel change |
| Scope | API keys scoped to minimum necessary permissions |
| Logging | All API calls logged (request metadata, not payload) |
| Error handling | API errors never expose sensitive data in logs |

### Webhook Security

For vendors sending webhooks to CoTrackPro:

```typescript
// Webhook signature verification (example: Stripe)
function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const expectedSig = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  
  // Constant-time comparison to prevent timing attacks
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(`sha256=${expectedSig}`)
  );
}
```

Requirements:
- All webhooks verified using HMAC signature before processing
- Webhook secret stored in AWS Secrets Manager
- Replay attacks prevented by checking event timestamp (reject if > 5 minutes old)
- Duplicate event IDs rejected (idempotency key check)

### Outbound API Call Security

```typescript
// All outbound API calls must:
// 1. Use secrets from AWS Secrets Manager
// 2. Verify TLS certificates
// 3. Log call metadata (not payload)
// 4. Handle errors without exposing sensitive data

async function callExternalAPI(endpoint: string, data: unknown): Promise<Response> {
  const apiKey = await secretsManager.getSecretValue({ SecretId: 'vendor-api-key' });
  
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey.SecretString}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  // Log metadata (not payload — never log request body to external services)
  await auditLogger.log({
    event_code: 'SYS_012',
    context: { vendor: 'anthropic', endpoint, status: response.status },
  });
  
  return response;
}
```

---

## Ongoing Monitoring

### Vendor Monitoring Schedule

| Activity | Frequency | Owner |
|---------|---------|------|
| Review vendor SOC 2 / audit reports | Annual | Security team |
| Check vendor security advisories | Weekly (automated) | Security team |
| Review vendor changelog for security changes | Monthly | Engineering |
| Verify DPA/BAA currency and completeness | Annual | Legal + Compliance |
| Subprocessor register accuracy | Quarterly | Compliance team |
| API key rotation verification | Quarterly | Engineering |
| Vendor security questionnaire re-assessment | Annual (Tier 1/2) | Security team |
| Integration penetration testing | Annual | Third-party pen tester |

### Automated Monitoring

- **Certificate expiry:** Automated alerts for any vendor certificate < 30 days from expiry
- **API error rates:** Alerts on sustained error rates > 5% (potential vendor incident)
- **Latency anomalies:** Alerts on significant latency increases (potential vendor issue)
- **Security advisory feeds:** Automated ingestion of CVE/advisory feeds for all vendors
- **Subprocessor breach monitoring:** Monitor HaveIBeenPwned and security news for vendor breaches

### Vendor Risk Register

Each Critical and High tier vendor has a risk register entry:

| Field | Description |
|-------|------------|
| Last assessment date | Date of most recent security assessment |
| Risk score | Current risk score (1–100) |
| Open findings | Number and severity of unresolved findings |
| Next review | Scheduled date of next review |
| Status | Approved / Conditional / Under review / Offboarding |

---

## Vendor Incident Response

### When a Vendor Reports a Breach

Upon receiving a vendor breach notification:

```
1. ASSESS (within 4 hours):
   - Was CoTrackPro user data involved?
   - What types of data? (PHI, FERPA, PII, credentials)
   - What was the scope and timeline?

2. CONTAIN (immediately):
   - If credentials compromised: rotate immediately
   - If data breach: assess if CoTrackPro must notify its own users
   - If ongoing: disconnect integration if possible until vendor confirms resolution

3. NOTIFY (per CoTrackPro's own obligations):
   - If PHI involved: HIPAA breach assessment and notification per IRP
   - If credentials compromised: reset all affected secrets
   - If user data involved: user notification per incident response plan

4. DOCUMENT:
   - Full timeline of vendor notification → CoTrackPro actions
   - Evidence preserved for regulatory compliance

5. REVIEW (within 30 days):
   - Vendor root cause and remediation assessment
   - Consider vendor risk tier re-assessment or replacement
```

### CoTrackPro's Vendor Notification Obligations

If CoTrackPro's systems or data are compromised, CoTrackPro must notify:

- Affected vendors (if the incident originated at CoTrackPro and affects vendor systems)
- AWS (if AWS infrastructure is involved)
- Anthropic, Stripe, Cognito (if credentials or API keys were compromised)

---

## Offboarding Third Parties

### Vendor Offboarding Checklist

When terminating a vendor relationship:

```
□ Revoke all API keys and credentials immediately
□ Remove integration from production systems
□ Notify vendor in writing of termination
□ Invoke DPA data return/deletion clause
□ Set 30-day deadline for vendor to confirm data deletion
□ Obtain written confirmation of deletion
□ Retain deletion confirmation for 7 years
□ Remove vendor from subprocessor register
□ Notify users if vendor was material to service delivery
□ Update security documentation
□ Review for any residual data at vendor (check logs, APIs)
□ Final audit log review of all data transferred to vendor
```

### Data Return Requirements

Upon vendor termination, CoTrackPro may request:
- Full export of all CoTrackPro data in portable format (JSON/CSV)
- Confirmation of deletion from vendor's systems and all subprocessors
- Certificate of destruction for PHI data (HIPAA requirement)

---

> **Contact:** security@cotrackpro.com | For DPA inquiries: legal@cotrackpro.com  
> **Subprocessor update notifications:** privacy@cotrackpro.com  
> **To report a vendor security issue:** security@cotrackpro.com
