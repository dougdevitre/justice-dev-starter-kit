# Data Handling Policy — CoTrackPro

> **Status:** Production  
> **Applicability:** All CoTrackPro data, all deployment environments  
> **Last Updated:** 2026-04-06  
> **Owner:** Data Governance & Compliance Team

---

## Table of Contents

1. [Overview](#overview)
2. [Data Collection Minimization](#data-collection-minimization)
3. [Storage Location Requirements](#storage-location-requirements)
4. [Data Retention Schedules](#data-retention-schedules)
5. [Deletion Procedures](#deletion-procedures)
6. [Export and Portability Requirements](#export-and-portability-requirements)
7. [Data Processing Agreements](#data-processing-agreements)
8. [Cross-Border Data Transfers](#cross-border-data-transfers)
9. [Sensitive Data Categories](#sensitive-data-categories)
10. [Compliance Verification](#compliance-verification)

---

## Overview

CoTrackPro processes data about families, children, legal proceedings, and healthcare — some of the most sensitive personal information that exists. This policy establishes mandatory practices for how CoTrackPro collects, stores, retains, deletes, and exports data to protect individuals' rights and meet regulatory requirements.

### Governing Regulations

| Regulation | Scope |
|-----------|-------|
| HIPAA / HITECH | Health information (see HIPAA-compliance.md) |
| FERPA | Student educational records (see FERPA-compliance.md) |
| COPPA | Data from children under 13 |
| CCPA / CPRA | California residents |
| State privacy laws | Varies by state; tracked in Compliance Operations runbook |
| Court rules | Jurisdiction-specific court record handling |

---

## Data Collection Minimization

### Principle of Data Minimization

CoTrackPro collects **only the personal data necessary** to provide a specific service function. Before adding any new data collection, the following questions must be answered:

1. **Purpose:** What specific feature or legal obligation requires this data?
2. **Necessity:** Is there a less privacy-invasive way to achieve the same purpose?
3. **Proportionality:** Is the privacy impact proportionate to the benefit?
4. **Retention:** When will this data no longer be needed?

Any new data collection that cannot clearly answer all four questions must be reviewed by the Data Governance team before implementation.

### Data Collection Inventory

| Data Category | Collected | Purpose | Minimization Applied |
|--------------|---------|---------|---------------------|
| Full legal name | ✅ Yes | Account identification, court documents | Name required for legal use |
| Date of birth | ✅ Yes | Age verification, child welfare | Required for role-specific features |
| Email address | ✅ Yes | Authentication, notifications | One address per user |
| Phone number | ⚠️ Optional | MFA, emergency contact | Not required; user chooses |
| Physical address | ⚠️ Context | Court filing jurisdictions | Collected only when needed for filings |
| Social Security Number | ❌ Never | — | Not collected; not needed |
| Financial account numbers | ❌ Never | — | Stripe handles all payment data |
| Device fingerprint | ⚠️ Minimal | Fraud detection, session security | Hash only; not full fingerprint |
| IP address | ✅ Logged | Security, audit | Retained per audit log schedule; hashed in analytics |
| Location (GPS) | ❌ No | — | Not collected; jurisdiction inferred from address |
| Biometric data | ❌ No | — | Not collected |
| Sexual orientation/gender identity | ❌ No | — | Self-described gender expression only if voluntarily provided |

### Child Data (Under 13 — COPPA)

CoTrackPro **does not knowingly collect personal data directly from children under 13**. Children are represented on the platform as **subjects of case records**, not as users.

| Data Type | Collection Basis |
|-----------|----------------|
| Child's name | Parental consent; required for case management |
| Child's date of birth | Parental consent; required for age-appropriate services |
| Child's school information | Parental consent; required for educational coordination |
| Child's medical information | Parental consent; HIPAA-compliant handling |
| Child photographs/video | Parental consent; evidence vault with strict access control |

**COPPA Compliance:** CoTrackPro does not operate user accounts for children under 13. All child data is entered by adult users (parents, professionals) who consent on behalf of or about the child. Age gates are enforced at account creation.

---

## Storage Location Requirements

### Geographic Storage Requirements

| Data Type | Required Storage Location | Rationale |
|----------|--------------------------|---------|
| User PII | United States (AWS us-east-1 or us-west-2) | US legal jurisdiction |
| PHI (HIPAA) | United States | HIPAA compliance; BAA with AWS |
| FERPA records | United States | FERPA federal law applies |
| Court documents | United States | Jurisdiction requirements |
| Audit logs | United States (primary) + US DR region | Compliance + redundancy |
| Aggregate analytics (de-identified) | US or EU | No PII; cross-border acceptable |
| Model training data | United States; anonymized only | Privacy protection |

### AWS Infrastructure

| Service | Region | Purpose |
|---------|--------|---------|
| DynamoDB | us-east-1 (primary), us-west-2 (replica) | Application data |
| S3 | us-east-1 (primary), us-west-2 (backup) | File storage |
| CloudWatch Logs | us-east-1 | Audit logs |
| Cognito | us-east-1 | Authentication |
| KMS | us-east-1 | Key management |
| Secrets Manager | us-east-1 | Credentials |

**Prohibition:** Personal data related to US-based users and cases **must not** be stored outside the United States without explicit legal review and user notification.

### Segmentation Requirements

| Data Category | Segregation Requirement |
|--------------|------------------------|
| PHI | Separate DynamoDB table partition with separate KMS key |
| Child data | Flagged in schema; access control enforced at application layer |
| Legal hold data | Tagged; automated deletion disabled |
| Audit logs | Separate log groups; immutable; no application-layer access |

---

## Data Retention Schedules

### Master Retention Schedule

| Data Type | Retention Period | Legal Basis | Action at Expiry |
|----------|----------------|------------|-----------------|
| **Account data** | Duration of account + 3 years | Contract, legal obligation | Secure deletion |
| **Case records** | 7 years after case closure | Legal hold requirements, state statutes | Secure deletion or transfer to user |
| **PHI (medical records)** | Longer of HIPAA minimum (6 years) or state law | HIPAA §164.530(j) | Secure deletion |
| **FERPA records** | Per FERPA schedule (see FERPA-compliance.md) | FERPA | Secure deletion or transfer to institution |
| **Financial/billing records** | 7 years | IRS, state tax law | Secure deletion |
| **Audit logs (security)** | 7 years | HIPAA, SOC 2, legal holds | Immutable; then secure deletion |
| **Audit logs (operational)** | 2 years | Operations | Secure deletion |
| **Incident records** | 7 years | Legal, insurance | Secure deletion |
| **Consent records** | Duration of consent + 5 years | Legal obligation | Secure deletion |
| **Authentication logs** | 2 years | Security | Secure deletion |
| **AI interaction logs** | 1 year | Safety, improvement | Anonymization then deletion |
| **Communications (in-platform)** | Duration of case + 7 years | Court record requirements | Secure deletion |
| **Evidence files** | Duration of case + 7 years | Court record requirements, user data rights | Transfer to user or secure deletion |
| **Backup copies** | 30 days (rolling) | Business continuity | Automated deletion |
| **Deleted user data** | 30 days (recovery window) then purged | User rights | Secure deletion |

### Retention Exceptions

**Legal Hold:** Any data under active legal hold is exempt from the standard retention schedule. Legal holds override automated deletion.

**User Request:** Data may be retained beyond standard schedules if a user explicitly requests extended retention for legitimate case management purposes (documented).

**Regulatory Order:** Government orders requiring preservation take precedence over standard schedules.

---

## Deletion Procedures

### Standard Deletion Workflow

**User-Initiated Account Deletion:**

```
1. User submits deletion request through settings or by emailing privacy@cotrackpro.com
2. System checks for active legal holds, open legal proceedings
3. If no holds: 30-day grace period initiated (account deactivated, data retained for recovery)
4. At day 30: Deletion job triggered
   a. Soft delete all records in DynamoDB (tombstone with deletion timestamp)
   b. Schedule S3 object deletion (lifecycle policy)
   c. Revoke all authentication tokens
   d. Anonymize audit logs (replace PII with user hash)
5. Day 60: Hard delete completes across all systems
6. Confirmation email sent to user's last known address
7. Deletion audit record retained for 7 years
```

**Case Closure and Record Expiry:**

```
1. Case marked closed by authorized user or automated trigger
2. Retention timer starts (7 years for case records)
3. At retention expiry:
   a. 30-day advance notification sent to case participants
   b. Export window opened: users may download their data
   c. Legal hold check performed
   d. If no hold: automated deletion job scheduled
4. Deletion executes:
   a. Case records deleted from DynamoDB
   b. Associated files deleted from S3
   c. KMS key deleted for case-specific encryption key (crypto-erase)
5. Deletion confirmed in compliance log
```

### Deletion Standards

| Media Type | Deletion Method | Standard |
|-----------|----------------|---------|
| DynamoDB records | Crypto-erasure (delete KMS key) + record overwrite | NIST SP 800-88 |
| S3 files | S3 object versioning deletion + KMS key deletion | NIST SP 800-88 |
| Database backups | Lifecycle expiry + KMS key deletion | NIST SP 800-88 |
| CloudWatch logs | Retention policy enforcement; no individual deletion | Log group configuration |
| Development/test data | Real data never used in dev; synthetic data deleted after use | Privacy by design |

### Right to Erasure (CCPA/State Laws)

California residents and users in states with erasure rights may request deletion of personal data that CoTrackPro is not legally required to retain. CoTrackPro will:

1. Acknowledge request within 10 business days
2. Complete deletion within 45 days (extensions require notice)
3. Notify third-party processors to delete within the same timeframe
4. Provide confirmation of deletion

**Exceptions to Erasure Requests:**
- Data subject to active legal proceedings
- Data legally required to be retained (audit logs, PHI retention minimums)
- Data necessary to complete a transaction the user requested
- Data required for security, fraud prevention, or legal compliance

---

## Export and Portability Requirements

### Data Portability Rights

Users have the right to receive their personal data in a structured, commonly used, machine-readable format.

### Export Capabilities

| Data Type | Export Format | Availability | Timeline |
|----------|-------------|-------------|---------|
| Case records | JSON, PDF | Self-service portal | Immediate |
| Communications | JSON, HTML | Self-service portal | Immediate |
| Documents / evidence files | Original format (PDF, DOCX, images, video) | Self-service portal | Immediate |
| Audit log (own actions) | JSON, CSV | Self-service portal | Up to 2-year history |
| Account data | JSON | Self-service portal | Immediate |
| Full data export | JSON bundle (ZIP) | Request to privacy@cotrackpro.com | 30 days |

### Export Security

- All exports are delivered via encrypted S3 pre-signed URLs (72-hour expiry)
- Export events are logged in audit trail
- Bulk exports require re-authentication (MFA prompt)
- Exports containing PHI are encrypted with user-provided password

### Court-Ordered Export

When records are required by court order or subpoena:

1. Legal team reviews order for validity and scope
2. Narrowly scoped export prepared matching court order requirements
3. Export delivered in court-appropriate format (PDF with chain of custody)
4. Delivery method coordinated with requesting party or court
5. All court-ordered disclosures logged in compliance record

---

## Data Processing Agreements

CoTrackPro maintains Data Processing Agreements (DPAs) with all subprocessors. See [Third-Party Compliance](./third-party-compliance.md) for the full subprocessor list and DPA requirements.

**Minimum DPA Requirements:**

- Process data only on CoTrackPro's documented instructions
- Ensure persons authorized to process data are bound by confidentiality
- Implement appropriate technical and organizational security measures
- Assist CoTrackPro in responding to data subject rights requests
- Notify CoTrackPro of any personal data breach without undue delay
- Delete or return all personal data upon termination of services
- Provide information necessary to demonstrate compliance

---

## Cross-Border Data Transfers

**Current Policy: US-only data residency** for all personal data, PHI, and FERPA records.

If cross-border transfers become necessary (e.g., international expansion):

1. Legal review required before any transfer mechanism is implemented
2. Appropriate safeguards must be in place (SCCs, adequacy decision, binding corporate rules)
3. Data subjects must be notified of international transfers
4. PHI transfers subject to HIPAA BAA requirements with international entities
5. FERPA data: transfers require prior written consent from rights holders

---

## Sensitive Data Categories

### Special Handling Requirements

| Data Category | Special Requirements |
|--------------|---------------------|
| Children's data (under 13) | COPPA compliance; parent consent; no profiling |
| Child welfare / abuse records | State mandatory reporter laws; law enforcement notification protocols |
| Mental health records | HIPAA Class 1; 42 CFR Part 2 if substance use |
| Domestic violence / safety plan data | Address confidentiality; shelter confidentiality laws |
| Immigration status | No collection except where legally required; no disclosure |
| Sexual orientation / gender identity | Collected only if voluntarily provided; not disclosed without consent |
| Biometric data | Not collected |
| Criminal history | Collected only where legally required and from authorized sources |

### Address Confidentiality Programs

Several states operate **Address Confidentiality Programs (ACPs)** for domestic violence survivors. CoTrackPro supports ACPs:

- Users may register using their ACP address
- ACP status is flagged; substitute address substituted in all communications
- ACP records subject to heightened access controls
- Disclosure of actual address is prohibited; violation triggers immediate incident response

---

## Compliance Verification

### Data Governance Meetings
- Monthly: Data inventory review; retention schedule audit
- Quarterly: DPA review; cross-border transfer assessment
- Annually: Full policy review; regulatory update assessment

### Metrics

| Metric | Target | Frequency |
|--------|--------|----------|
| Deletion requests completed within SLA | 100% | Monthly |
| Data export requests completed within SLA | 100% | Monthly |
| Retention schedule compliance (auto-deletion) | 100% | Quarterly |
| Third-party DPAs current | 100% | Quarterly |
| Data inventory accuracy | > 95% | Annually |

---

> **Contact:** privacy@cotrackpro.com | Data Protection Officer: dpo@cotrackpro.com  
> **To exercise data rights:** privacy@cotrackpro.com (response within 10 business days)
