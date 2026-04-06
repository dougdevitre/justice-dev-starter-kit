# HIPAA Compliance Framework — CoTrackPro

> **Status:** Production  
> **Applicability:** All CoTrackPro deployments handling Protected Health Information (PHI)  
> **Last Updated:** 2026-04-06  
> **Owner:** Security & Compliance Team

---

## Table of Contents

1. [Overview](#overview)
2. [Data Classification](#data-classification)
3. [Encryption Requirements](#encryption-requirements)
4. [Access Control Policies](#access-control-policies)
5. [Audit Logging and Retention](#audit-logging-and-retention)
6. [Business Associate Agreement (BAA) Template](#business-associate-agreement-baa-template)
7. [Risk Assessment Framework](#risk-assessment-framework)
8. [Security Incident Response Procedures](#security-incident-response-procedures)
9. [Training Requirements](#training-requirements)
10. [Compliance Verification](#compliance-verification)

---

## Overview

CoTrackPro operates at the intersection of family law, co-parenting coordination, and child welfare. Where users are healthcare providers, therapists, or case managers, or where platform data includes health-related information about children or adults, CoTrackPro may qualify as a **Business Associate** under HIPAA (45 CFR Parts 160 and 164).

This document establishes the framework for achieving and maintaining HIPAA compliance across:

- **Administrative Safeguards** (§164.308)
- **Physical Safeguards** (§164.310)
- **Technical Safeguards** (§164.312)
- **Organizational Requirements** (§164.314)
- **Policies and Procedures** (§164.316)

### Scope

| Component | HIPAA Applicability | Notes |
|-----------|--------------------|----|
| Therapist session notes | ✅ PHI | Covered when therapists use the platform |
| Mental health records shared in custody | ✅ PHI | Requires BAA with healthcare providers |
| Child medical condition documentation | ✅ PHI | Always encrypted at rest and in transit |
| Attorney case notes | ⚠️ Context-dependent | PHI if derived from medical records |
| Court filings | ❌ Not PHI | Public court records |
| Communication logs between co-parents | ❌ Not PHI | Unless health information included |
| Incident reports (non-medical) | ❌ Not PHI | Child safety documentation |

---

## Data Classification

### PHI Categories on CoTrackPro

**Class 1 — Highly Sensitive PHI**

| Data Type | Examples | Storage | Access |
|-----------|---------|---------|--------|
| Mental health records | Therapy notes, diagnoses, treatment plans | AES-256 encrypted, separate key | Therapist + subject only |
| Substance use records | Treatment history, relapse documentation | AES-256 + 42 CFR Part 2 controls | Treating provider only |
| Child psychiatric evaluations | GAL psychological reports, custody evaluations | AES-256 encrypted | Court-ordered access only |
| HIV/AIDS status | Medical disclosures in custody proceedings | AES-256, segregated storage | Treating provider + explicit consent |

**Class 2 — Standard PHI**

| Data Type | Examples | Storage | Access |
|-----------|---------|---------|--------|
| General medical history | Chronic conditions disclosed in custody | AES-256 encrypted | Role-based (see Access Control Matrix) |
| Prescription records | Medication adherence documentation | AES-256 encrypted | Healthcare roles + parents with consent |
| Physical health conditions | Disabilities, injuries documented in proceedings | AES-256 encrypted | Case participants per court order |
| Vaccination records | Child health documentation | AES-256 encrypted | Parents, healthcare providers, school |

**Class 3 — Non-PHI (Operational Data)**

| Data Type | Storage | Notes |
|-----------|---------|-------|
| Case metadata | Standard encrypted storage | Not PHI unless linked to health records |
| Communication timestamps | Standard storage | No health content |
| User authentication data | Hashed + encrypted | See Encryption Spec |
| Billing information | PCI DSS scope, not HIPAA | Stripe-managed |

### PHI Identification Protocol

```
IF data contains one or more HIPAA identifiers AND relates to:
  - Past, present, or future physical/mental health of an individual
  - Provision of healthcare to an individual
  - Payment for healthcare to an individual
THEN → classify as PHI → apply Class 1 or Class 2 controls
```

**HIPAA's 18 Identifiers (De-identification Safe Harbor):**

1. Names
2. Geographic data smaller than state
3. Dates (except year) for individuals
4. Phone numbers
5. Fax numbers
6. Email addresses
7. Social security numbers
8. Medical record numbers
9. Health plan beneficiary numbers
10. Account numbers
11. Certificate/license numbers
12. Vehicle identifiers
13. Device identifiers
14. Web URLs
15. IP addresses
16. Biometric identifiers
17. Full-face photographs
18. Any other unique identifying number

---

## Encryption Requirements

### At-Rest Encryption

| Data Classification | Encryption Standard | Key Management |
|--------------------|--------------------|----------------|
| Class 1 PHI | AES-256-GCM | AWS KMS with CMK, annual rotation |
| Class 2 PHI | AES-256-GCM | AWS KMS with CMK, annual rotation |
| Class 3 / Non-PHI | AES-256 (AWS default) | AWS-managed keys |
| Backups | AES-256 | Separate backup encryption key |
| Audit logs | AES-256 + WORM | Immutable log storage |

### In-Transit Encryption

| Connection Type | Protocol | Certificate |
|----------------|---------|------------|
| Client ↔ Application | TLS 1.3 (minimum TLS 1.2) | Public CA (Let's Encrypt / ACM) |
| Application ↔ Database | TLS 1.3 | Internal CA |
| Application ↔ AWS Services | TLS 1.3 via VPC endpoints | AWS-managed |
| API ↔ Third-party integrations | TLS 1.3, mutual TLS preferred | Per-integration certificates |

### Encryption Key Management

- **Key rotation:** Annual minimum for CMKs; 90-day for session keys
- **Key escrow:** AWS KMS CloudHSM for Class 1 PHI keys
- **Key access:** Break-glass procedures documented; dual-control for master keys
- **Destruction:** NIST SP 800-88 compliant key destruction upon data deletion

---

## Access Control Policies

### Minimum Necessary Standard

All access to PHI must adhere to the **minimum necessary standard** (45 CFR §164.514(d)):

1. Identify the purpose of each role's access to PHI
2. Define the minimum PHI needed for that purpose
3. Implement technical controls to enforce the limit
4. Document justifications for all PHI access grants

### Role-Based PHI Access

See the [Access Control Matrix](./access-control-matrix.md) for the full 35+ role permission table. PHI-specific access rules:

| Role Category | PHI Access Level | Conditions |
|---------------|----------------|-----------|
| Healthcare Providers (therapists, doctors) | Full PHI for their patients | Must have active treatment relationship |
| Guardian ad Litem (GAL) | Court-ordered PHI scope | Limited to court order parameters |
| Judges | Review only, no download | Court proceedings only |
| Parents | Own records + minor children's | Per custody order |
| Attorneys | PHI their client authorized | Client consent required |
| Administrators (CoTrackPro staff) | Break-glass access only | Logged, requires incident ticket |
| Law Enforcement | Court order or emergency only | Legal process required |

### Workforce Access Controls

- **Background checks:** Required before any PHI access
- **Training:** Annual HIPAA training mandatory; documented completion
- **Sanctions:** Documented sanction policy for violations (see Incident Response)
- **Termination:** PHI access revoked within 1 hour of termination
- **Unique identifiers:** No shared accounts; each user uniquely identified

---

## Audit Logging and Retention

### Required Audit Events (HIPAA §164.312(b))

| Event Type | Logged Fields | Retention |
|-----------|--------------|-----------|
| PHI access | User ID, patient ID, data type, timestamp, action | 7 years |
| PHI modification | Before/after values (redacted), user ID, timestamp | 7 years |
| PHI deletion | User ID, data description, deletion method, timestamp | 7 years |
| Failed access attempts | User ID, attempted resource, timestamp, IP | 7 years |
| Privilege escalation | Requesting user, approver, scope, duration | 7 years |
| Export of PHI | User, recipient, data scope, purpose | 7 years |
| Login/logout | User ID, IP, device fingerprint, success/failure | 7 years |
| Administrative actions | Admin ID, action, affected records, timestamp | 7 years |

### Audit Log Integrity

- Logs written to **immutable AWS CloudWatch Logs with log group protection**
- **CloudTrail** enabled for all AWS API calls
- Log integrity verified via **SHA-256 hash chains**
- Logs replicated to **secondary region** within 15 minutes
- WORM storage: logs cannot be modified or deleted before retention period expires

### Audit Log Access

- Logs accessible only to: Security team, Compliance officer, authorized auditors
- All audit log queries are themselves logged
- Regular automated review via SIEM rules for anomalous patterns

---

## Business Associate Agreement (BAA) Template

### CoTrackPro Business Associate Agreement

**BUSINESS ASSOCIATE AGREEMENT**

This Business Associate Agreement ("Agreement") is entered into between **[Covered Entity Name]** ("Covered Entity") and **CoTrackPro, Inc.** ("Business Associate"), effective as of **[Effective Date]**.

#### 1. Definitions

Terms used but not otherwise defined in this Agreement shall have the same meaning as those terms in the HIPAA Rules (45 CFR Parts 160 and 164).

**"PHI"** means Protected Health Information as defined at 45 CFR §164.103.

**"HIPAA Rules"** means the Privacy, Security, Breach Notification, and Enforcement Rules at 45 CFR Parts 160 and 164.

#### 2. Obligations of Business Associate

Business Associate agrees to:

a) Not use or disclose PHI other than as permitted by this Agreement or required by law;

b) Use appropriate safeguards and comply with Subpart C of 45 CFR Part 164 with respect to ePHI to prevent unauthorized use or disclosure;

c) Report to Covered Entity any use or disclosure of PHI not provided for by this Agreement, including breaches of Unsecured PHI per 45 CFR §164.410, within **60 days** of discovery;

d) Ensure any subcontractors that create, receive, maintain, or transmit PHI agree to the same restrictions and conditions;

e) Make PHI available for access by individuals per 45 CFR §164.524;

f) Make PHI available for amendment per 45 CFR §164.526;

g) Maintain an accounting of disclosures per 45 CFR §164.528;

h) Make internal practices available to HHS for determining compliance;

i) Return or destroy all PHI upon termination of this Agreement.

#### 3. Permitted Uses and Disclosures

Business Associate may use or disclose PHI only to:

a) Provide services described in the underlying service agreement;

b) For Business Associate's proper management and administration;

c) As required by law;

d) For data aggregation services relating to Covered Entity's healthcare operations.

#### 4. Term and Termination

a) **Term:** This Agreement is effective upon execution and terminates upon termination of the underlying service agreement.

b) **Termination for Cause:** Either party may terminate if the other materially breaches this Agreement.

c) **Effect of Termination:** Business Associate will return or destroy all PHI within **30 days** of termination.

#### 5. Miscellaneous

This Agreement is governed by applicable federal law. Covered Entity and Business Associate agree to amend this Agreement as necessary to comply with changes in the HIPAA Rules.

**COVERED ENTITY:**

Signature: _______________________ Date: _________  
Name: _________________________  
Title: _________________________  
Organization: ___________________

**BUSINESS ASSOCIATE (CoTrackPro, Inc.):**

Signature: _______________________ Date: _________  
Name: _________________________  
Title: _________________________

---

## Risk Assessment Framework

### Annual Risk Assessment Process (45 CFR §164.308(a)(1))

**Step 1: Scope Definition**
- Identify all ePHI: where it's created, received, maintained, and transmitted
- Document all hardware, software, data, interfaces, users, procedures, policies

**Step 2: Threat and Vulnerability Identification**

| Threat Category | Examples | Likelihood (1-5) | Impact (1-5) | Risk Score |
|----------------|---------|-----------------|-------------|-----------|
| Unauthorized access | Credential theft, insider threat | Assess annually | Assess annually | L × I |
| Malware / ransomware | Encryption of ePHI systems | Assess annually | Assess annually | L × I |
| Physical theft | Device theft, unauthorized facility access | Assess annually | Assess annually | L × I |
| Data transmission interception | MITM attacks, unencrypted transmission | Assess annually | Assess annually | L × I |
| Human error | Misdirected PHI, accidental deletion | Assess annually | Assess annually | L × I |
| System failure | Database corruption, hardware failure | Assess annually | Assess annually | L × I |
| Natural disaster | Data center events | Assess annually | Assess annually | L × I |

**Step 3: Risk Rating**
- **Critical (15-25):** Immediate remediation required
- **High (10-14):** Remediation within 30 days
- **Medium (5-9):** Remediation within 90 days
- **Low (1-4):** Remediation within 180 days or accept with documentation

**Step 4: Risk Management**
- Select controls to reduce risks to acceptable levels
- Document implementation and responsibility
- Set timelines and metrics for each control

**Step 5: Ongoing Review**
- Annual formal risk assessment
- Triggered re-assessment upon: significant system changes, new threats identified, workforce changes, security incidents

---

## Security Incident Response Procedures

### HIPAA Breach Definition

A **breach** is the acquisition, access, use, or disclosure of PHI in a manner not permitted under the HIPAA Privacy Rule (45 CFR §164.402), unless the Covered Entity or Business Associate demonstrates a **low probability** that PHI has been compromised based on a 4-factor risk assessment:

1. Nature and extent of the PHI involved (identifiers, sensitivity)
2. Who accessed or used the PHI, or to whom the disclosure was made
3. Whether the PHI was actually acquired or viewed
4. Extent to which the risk has been mitigated

### Breach Notification Timelines

| Notification Target | Timeline | Method | Required Content |
|--------------------|---------|--------|-----------------|
| Covered Entity / HHS | 60 days from discovery | Written | Description, PHI involved, unauthorized persons, access/acquisition, mitigation |
| Affected Individuals | 60 days from discovery | First-class mail (or email if opted in) | Description, PHI types, steps to protect themselves, what CE is doing, contact info |
| Media (if 500+ in a state) | 60 days from discovery | Prominent media outlet in state | Same as individual notice |
| HHS (if 500+) | Same as individual notice | HHS online portal | Summary of breach |
| HHS (if <500) | Annual log | HHS online portal | Annual breach log |

### Incident Response Steps

1. **Detect** — Monitoring alert, user report, or routine audit
2. **Contain** — Isolate affected systems within 1 hour
3. **Assess** — 4-factor risk assessment within 24 hours
4. **Notify** — Internal notification within 24 hours; external per timelines above
5. **Investigate** — Root cause analysis within 72 hours
6. **Remediate** — Implement fixes; document completion
7. **Review** — Post-incident analysis; update controls; re-assess risk

See [Incident Response Plan](./incident-response-plan.md) for full procedures.

---

## Training Requirements

### Initial Training
- Completed before any PHI access is granted
- Covers: HIPAA overview, PHI identification, access controls, reporting obligations
- Assessment: Minimum 80% score required; immediate re-training if below

### Annual Training
- All workforce members with any PHI access
- Topics: Updates to HIPAA rules, recent incidents and lessons learned, policy refreshers
- Completion tracked in HR system; access revoked if overdue by more than 30 days

### Role-Specific Training

| Role | Additional Training | Frequency |
|------|--------------------|----|
| Security team | Advanced threat detection, incident response | Quarterly |
| Administrators | Break-glass procedures, audit log review | Semi-annually |
| Healthcare providers | PHI handling for their specific use case | Annually |
| Developers | Secure coding for PHI systems | Upon hire + annually |

---

## Compliance Verification

### Internal Audits
- Quarterly access reviews: verify minimum necessary standard is met
- Semi-annual penetration testing of PHI systems
- Annual gap assessment against HIPAA Security Rule

### External Audits
- Annual third-party HIPAA audit by qualified assessor
- SOC 2 Type II audit (includes HIPAA controls)
- Results reviewed by executive team; remediation plans formally tracked

### Metrics and KPIs

| Metric | Target | Review Frequency |
|--------|--------|----------------|
| PHI access reviews completed | 100% | Quarterly |
| HIPAA training completion | 100% | Monthly |
| Mean time to revoke access on termination | < 1 hour | Monthly |
| Audit log coverage | 100% of PHI systems | Monthly |
| Open critical/high risks | 0 | Weekly |
| Time to breach notification (when applicable) | ≤ 60 days | Per incident |

---

> **Legal Notice:** This document provides compliance guidance and does not constitute legal advice. Consult qualified legal counsel for advice specific to your organization's HIPAA obligations.

> **Contact:** security@cotrackpro.com | For BAA execution: legal@cotrackpro.com
