# Security Incident Response Plan — CoTrackPro

> **Status:** Production  
> **Applicability:** All CoTrackPro systems, personnel, and third-party integrations  
> **Last Updated:** 2026-04-06  
> **Owner:** Security Team & Executive Leadership  
> **Classification:** Confidential — Internal Use

---

## Table of Contents

1. [Overview](#overview)
2. [Incident Classification](#incident-classification)
3. [Response Team and Roles](#response-team-and-roles)
4. [Detection and Escalation Procedures](#detection-and-escalation-procedures)
5. [Notification Timelines](#notification-timelines)
6. [Incident Response Playbooks](#incident-response-playbooks)
7. [Remediation Workflows](#remediation-workflows)
8. [Post-Incident Analysis](#post-incident-analysis)
9. [Communication Templates](#communication-templates)
10. [Training and Testing](#training-and-testing)

---

## Overview

This Incident Response Plan (IRP) establishes procedures for detecting, containing, investigating, and recovering from security incidents affecting CoTrackPro. Given the sensitive nature of data handled (PHI, FERPA records, child welfare information, domestic violence safety plans), all security incidents must be treated with the highest urgency.

### Governing Principles

1. **Child safety first** — any incident that may put a child at immediate risk triggers emergency escalation
2. **Contain before counting costs** — isolate threats immediately; business impact is secondary to protection
3. **Transparent communication** — notify affected users promptly and honestly
4. **Learn and improve** — every incident produces actionable improvements
5. **Legal compliance** — meet all regulatory notification timelines (HIPAA: 60 days, state breach laws vary)

### Plan Scope

This plan covers:
- Unauthorized access to CoTrackPro systems or data
- Data breaches involving PHI, FERPA records, or child data
- Ransomware or destructive malware
- Insider threats
- Denial of service attacks affecting availability
- Third-party/vendor security incidents affecting CoTrackPro data
- Physical security incidents (hardware theft, unauthorized facility access)
- Social engineering attacks targeting staff

---

## Incident Classification

### Severity Levels

| Level | Name | Definition | Initial Response Time | Example |
|-------|------|-----------|----------------------|---------|
| **P0** | Critical | Imminent child safety risk OR active breach of PHI/FERPA for 1000+ users | **Immediate (< 15 min)** | Active data exfiltration; ransomware encrypting systems |
| **P1** | High | Confirmed breach or unauthorized access; contained but significant | **< 1 hour** | Confirmed breach of < 1000 PHI records; account takeover |
| **P2** | Medium | Suspected breach or significant security event; investigation required | **< 4 hours** | Suspicious access pattern; single account compromise |
| **P3** | Low | Security event with limited or no data exposure; process violation | **Next business day** | Policy violation; failed attack attempt with no compromise |
| **P4** | Informational | Security anomaly; no compromise; low risk | **Weekly review** | Single failed login; routine scanning |

### Automatic P0 Escalation Triggers

The following conditions automatically escalate to P0 regardless of initial assessment:

- Any incident involving child safety plan data
- Any incident involving domestic violence victim location data
- Active ransomware or destructive attack
- Compromise of authentication infrastructure (Cognito/Clerk)
- Compromise of encryption keys (KMS)
- Exfiltration of > 500 records of PHI
- Compromise of audit logging infrastructure

---

## Response Team and Roles

### Incident Response Team (IRT)

| Role | Title | Responsibility | After-Hours Contact |
|------|-------|--------------|-------------------|
| **Incident Commander** | CISO or delegated Security Lead | Overall incident management; decisions; external comms | PagerDuty → primary on-call |
| **Technical Lead** | Senior Security Engineer | Technical investigation; containment; remediation | PagerDuty → secondary on-call |
| **Communications Lead** | VP Communications or CEO (P0) | User notifications; regulatory notifications; PR | Incident bridge line |
| **Legal Counsel** | General Counsel | Legal obligations; privilege; regulatory notices | Emergency legal line |
| **Operations Lead** | VP Engineering | Infrastructure restoration; deployment decisions | PagerDuty → DevOps on-call |
| **Privacy Officer** | DPO / Compliance Lead | HIPAA/FERPA assessment; breach determination | PagerDuty → compliance on-call |

### Escalation Contacts

```
Security Hotline:    security@cotrackpro.com + PagerDuty integration
CEO Emergency Line:  [stored in 1Password team vault: "Emergency Contacts"]
Legal Emergency:     [stored in 1Password team vault: "Legal Emergency"]
AWS Support:         Enterprise support; account number in runbook
Anthropic Security:  security@anthropic.com
Stripe Security:     security@stripe.com
```

---

## Detection and Escalation Procedures

### Detection Sources

| Source | Method | Who Reviews |
|--------|--------|------------|
| SIEM / CloudWatch Alarms | Automated rules + ML anomaly detection | Security on-call (automated pager) |
| User report | Email to security@cotrackpro.com or in-app report | Security team; 24-hour response |
| Third-party notification | Vendor breach notification, threat intel feed | Security team |
| Penetration test finding | Scheduled or bug bounty report | Security team + Engineering |
| Regulatory notification | HIPAA OCR, state AG, court order | Legal + Security + Compliance |
| Internal discovery | Employee discovers anomaly | Report to security@cotrackpro.com |

### Initial Triage (First 15 Minutes)

```
1. IDENTIFY the incident type:
   - What systems are affected?
   - What data may be involved? (PHI? FERPA? Child data? Safety plans?)
   - Is the attack ongoing?
   - What is the blast radius?

2. ASSIGN severity level (P0/P1/P2/P3/P4)

3. NOTIFY Incident Commander via PagerDuty
   - P0: Auto-page; assemble IRT within 15 minutes
   - P1: Page IC; assemble IRT within 1 hour
   - P2: Page IC; schedule IRT call within 4 hours
   - P3/P4: Create ticket; normal business hours

4. PRESERVE evidence:
   - Screenshot alerts; do not clear them
   - Capture logs immediately (before rotation)
   - Do not reboot systems unless necessary

5. INITIATE incident ticket in tracking system
   - Incident ID format: INC-YYYY-NNNN
   - Document all actions with timestamps
```

### Escalation Decision Tree

```
Security Alert Triggered
        │
        ▼
Is data exfiltration confirmed or suspected?
    │YES                    │NO
    ▼                       ▼
Is it PHI/FERPA/Child?   Is system availability affected?
    │YES     │NO           │YES              │NO
    ▼        ▼             ▼                 ▼
   P0/P1    P1/P2         P1/P2           P2/P3/P4
    │
    ▼
Is child safety at risk?
    │YES
    ▼
    P0 — Immediately notify Incident Commander
         AND alert law enforcement if child is in danger
```

---

## Notification Timelines

### Internal Notifications

| Severity | Incident Commander | Executive Team | All Engineering |
|---------|-------------------|---------------|----------------|
| P0 | Immediate | Within 30 minutes | Within 1 hour |
| P1 | Within 15 minutes | Within 2 hours | As needed |
| P2 | Within 1 hour | If data breach confirmed | As needed |
| P3/P4 | Within 4 hours | Next business day summary | Not required |

### Regulatory Notifications

| Regulation | Notification Requirement | Timeline | Recipient |
|-----------|------------------------|---------|---------|
| HIPAA Breach Notification | Breach of unsecured PHI | **60 days from discovery** | Covered Entity (BAA partner) → HHS |
| HIPAA (500+ affected) | Large breach | 60 days | HHS + prominent media in state |
| FERPA | Best practice (no explicit requirement) | **72 hours** | Affected institution |
| CCPA (California) | Security breach of Californians' data | **72 hours** (AG); expedient (individuals) | CA Attorney General + individuals |
| State breach laws | Varies by state | Typically 30-72 days | State AG + affected individuals |
| PCI DSS | Payment data compromise | **24 hours** | Stripe (as payment processor) |

### User Notifications

| Scenario | Timeline | Method | Content |
|---------|---------|--------|---------|
| Confirmed PHI breach | As soon as possible; maximum 60 days | Email + in-app notification | What happened, what data, what to do |
| Account compromise | Within 24 hours | Email + forced re-auth | Account secured, actions taken |
| Service disruption | Within 1 hour of confirmed outage | Status page + email | What's affected, estimated restoration |
| Near-miss / contained incident | If user data was at risk, even if not breached | Email within 7 days | What happened, why data was safe |

---

## Incident Response Playbooks

### Playbook 1: Data Breach / Unauthorized PHI Access

**Trigger:** Confirmed unauthorized access to PHI records

**Phase 1 — Contain (0–1 hour)**

```
□ Identify the compromised account(s) or access vector
□ Immediately revoke sessions and tokens for affected accounts
□ Isolate affected systems if breach is ongoing
□ Preserve audit logs and forensic state (snapshot EBS, export CloudWatch logs)
□ Notify Incident Commander → assemble IRT
□ Begin incident documentation (INC-YYYY-NNNN)
```

**Phase 2 — Assess (1–4 hours)**

```
□ Determine scope: Which records were accessed?
□ Identify affected individuals (patients/users whose PHI was exposed)
□ Classify breach: Was data viewed? Downloaded? Transmitted externally?
□ 4-factor HIPAA risk assessment:
   1. Nature and extent of PHI involved
   2. Identity of unauthorized person(s)
   3. Whether PHI was actually acquired or viewed
   4. Extent to which risk has been mitigated
□ Brief Privacy Officer and Legal Counsel
□ Document assessment with timestamps
```

**Phase 3 — Notify (4–72 hours based on scope)**

```
□ Notify Covered Entity partner (if applicable) per BAA
□ Brief executive team
□ Draft user notification (review with Legal)
□ Prepare HHS notification (if applicable, HIPAA breach confirmed)
□ Send user notifications
□ Update public status page if service affected
```

**Phase 4 — Remediate**

```
□ Close the vulnerability or access vector
□ Force password reset for affected accounts
□ Rotate all API keys and credentials potentially in scope
□ Implement additional controls to prevent recurrence
□ Verify remediation through testing
```

---

### Playbook 2: Ransomware Attack

**Trigger:** Ransomware detected on CoTrackPro systems

**Phase 1 — Contain (IMMEDIATE — within minutes)**

```
□ IMMEDIATELY isolate affected systems from network
□ Disconnect affected EC2 instances / services from VPC
□ Do NOT pay any ransom without executive + legal approval
□ Do NOT reboot systems (destroys forensic evidence)
□ Page Incident Commander; declare P0
□ Activate disaster recovery runbook
□ Notify AWS Support (Enterprise): report ransomware activity
```

**Phase 2 — Assess**

```
□ Determine blast radius: which systems encrypted?
□ Identify attack vector: how did ransomware enter?
□ Determine if data was exfiltrated before encryption
□ Check backup integrity: are backups clean?
□ Assess if PHI, FERPA, or child data was involved
```

**Phase 3 — Recovery**

```
□ Restore from clean backups (validate backup integrity first)
□ Rebuild affected systems from known-good images
□ DO NOT restore from potentially infected backups
□ Restore in isolated environment; test before reconnecting
□ Verify data integrity post-restoration
□ Change ALL credentials (assume full compromise)
```

**Phase 4 — Notify and Remediate**

```
□ Regulatory notifications per data involved (PHI → HIPAA breach assessment)
□ User notification if data was at risk
□ Law enforcement notification (FBI IC3 for ransomware)
□ Insurance carrier notification
□ Root cause analysis and control improvements
```

---

### Playbook 3: Account Takeover / Insider Threat

**Trigger:** Evidence that a legitimate user account has been compromised or is being abused

**Immediate Actions**

```
□ Immediately terminate all active sessions for suspect account
□ Disable account (not delete — preserve forensic evidence)
□ Preserve all audit logs for account activity for past 90 days
□ Identify what data was accessed during suspect period
□ Determine if account was taken over externally or if this is an insider threat
```

**Insider Threat (Known Employee)**

```
□ Notify HR and Legal immediately
□ Do not confront employee before security review
□ Preserve all evidence per HR + Legal guidance
□ Document all unauthorized actions
□ Notify affected users/case participants if their data was accessed
□ Law enforcement referral if warranted
```

**External Account Takeover**

```
□ Force password reset + new MFA enrollment for user
□ Notify user of compromise; provide guidance
□ Review for credential stuffing / phishing campaign affecting other users
□ Implement additional authentication controls if systemic
```

---

### Playbook 4: Child Safety Emergency

**Trigger:** Any incident where a child's physical safety may be immediately at risk based on information in CoTrackPro

**This is NOT a standard security incident — child safety supersedes all other considerations.**

```
IMMEDIATE (within minutes):
□ If child is in imminent danger: call 911 immediately
□ Notify Incident Commander AND designated child safety officer
□ Preserve all relevant case records; do not modify
□ Emergency access to safety plans granted to on-call team

NEXT STEPS:
□ Coordinate with law enforcement as directed
□ Document actions taken (all are time-stamped for court)
□ Notify relevant professionals on the case (GAL, DCFS, etc.)
□ Preserve all audit logs indefinitely (legal hold)
□ Post-incident review with child safety advocate
```

---

## Remediation Workflows

### Short-Term Remediation (During/Immediately After Incident)

| Priority | Action | Owner | Timeline |
|---------|--------|-------|---------|
| P0 | Revoke compromised credentials | Security Engineer | Within 15 minutes |
| P0 | Isolate affected systems | Operations | Within 30 minutes |
| P0 | Activate backup/DR systems if needed | Operations | Within 1 hour |
| P1 | Patch exploited vulnerability | Engineering | Within 24 hours |
| P1 | Deploy WAF/firewall rules to block attack pattern | Security | Within 4 hours |
| P1 | Restore from clean backup | Operations | Within 4–24 hours depending on scope |

### Long-Term Remediation (Post-Incident)

1. **Root Cause Fix:** Address the underlying vulnerability or process gap
2. **Control Enhancement:** Implement additional controls to reduce likelihood or impact
3. **Detection Improvement:** Update SIEM rules to detect this pattern earlier next time
4. **Training:** Update security training if human error was involved
5. **Policy Update:** Revise policies if process gap was the root cause
6. **Third-Party Review:** If third-party was involved, assess and update vendor relationship

### Verification Before Closing Incident

```
□ Root cause identified and documented
□ Vulnerability patched or mitigated (verified by testing)
□ All compromised credentials rotated
□ Affected systems restored and verified clean
□ Notifications sent to all required parties
□ Regulatory notifications submitted (if applicable)
□ Legal review completed
□ Post-incident analysis scheduled
□ Action items tracked to completion
□ Incident officially closed by Incident Commander
```

---

## Post-Incident Analysis

### Blameless Post-Mortem Process

Post-incident analysis follows a **blameless post-mortem** model — the goal is systemic improvement, not assigning individual blame.

**Within 24 hours of incident closure:**
- Incident Commander schedules post-mortem meeting (within 5 business days)
- All IRT members required to attend
- Invite key stakeholders (Engineering, Product, Legal as appropriate)

### Post-Mortem Template

```markdown
## Incident Post-Mortem: [INC-YYYY-NNNN]

**Date of incident:** 
**Date of post-mortem:**
**Incident Commander:**
**Severity:** 

### Timeline of Events
| Time (UTC) | Event | Actor |
|-----------|-------|-------|
| | | |

### Root Cause Analysis
**Primary cause:**
**Contributing factors:**

### Impact Assessment
- Users affected:
- Data involved:
- Downtime (if any):
- Regulatory implications:

### What Went Well
1.
2.

### What Could Be Improved
1.
2.

### Action Items
| Action | Owner | Due Date | Priority |
|--------|-------|---------|---------|
| | | | |

### Metrics
- Time to detect:
- Time to contain:
- Time to remediate:
- Time to notify users (if applicable):
```

### Learning Distribution

- Post-mortem summary shared with all engineering teams within 1 week
- Critical findings shared with executive team
- Anonymized lessons learned included in annual security report
- Patterns across incidents reviewed quarterly by Security team

---

## Communication Templates

### User Breach Notification (HIPAA)

```
Subject: Important Security Notice — Your CoTrackPro Account

Dear [Name],

We are writing to notify you of a security incident that may have affected 
your account at CoTrackPro.

WHAT HAPPENED
On [date], we discovered that [brief description of incident]. We immediately 
took steps to contain the incident and began an investigation.

WHAT INFORMATION WAS INVOLVED
The following types of information may have been accessed: [list specific types]

WHAT WE ARE DOING
We have taken the following steps to protect your information and prevent 
future incidents:
- [Action 1]
- [Action 2]

WHAT YOU CAN DO
We recommend that you:
1. Change your CoTrackPro password immediately at [link]
2. Review your account activity for anything you don't recognize
3. Be alert for phishing emails that may reference your account

FOR MORE INFORMATION
If you have questions, please contact our privacy team at privacy@cotrackpro.com
or call [phone] between [hours].

We sincerely apologize for this incident and the concern it may cause.

[Name], CISO
CoTrackPro, Inc.
```

### Status Page Template (Service Disruption)

```
## [Date] — Service Disruption

**Status:** Investigating / Identified / Monitoring / Resolved

We are currently experiencing [description of impact]. Our team is actively 
investigating and working to resolve the issue.

**Affected services:** [List]

**Impact:** [Description of user impact]

**Next update:** [Time]

---
[Time] — [Update]
[Time] — [Update]
```

---

## Training and Testing

### Tabletop Exercises

| Exercise | Frequency | Participants | Scenario |
|---------|---------|------------|---------|
| PHI breach tabletop | Semi-annual | Full IRT | Simulated breach of PHI records |
| Ransomware tabletop | Annual | IRT + DevOps | Ransomware affecting application servers |
| Account takeover tabletop | Annual | IRT + Product | Credential stuffing campaign |
| Child safety emergency | Annual | IRT + Child Safety Officer | Safety plan exposure incident |
| Notification drill | Annual | Legal + Compliance + Comms | Full regulatory notification process |

### Penetration Testing

- **External penetration test:** Semi-annual by third-party firm
- **Internal red team exercise:** Annual
- **Social engineering assessment:** Annual
- **Results:** Feed directly into remediation backlog

### Plan Maintenance

- This plan is reviewed and updated **annually** or following any P0/P1 incident
- Review includes: regulatory updates, technology changes, personnel changes, lessons learned
- All revisions tracked in version history
- Personnel listed in this plan are notified of updates

---

> **Emergency Security Contact:** security@cotrackpro.com | PagerDuty on-call  
> **Law Enforcement:** If a child is in immediate danger, call 911 first, then security@cotrackpro.com  
> **HIPAA Breach Reporting to HHS:** https://ocrportal.hhs.gov/ocr/breach/wizard_breach.jsf  
> **FBI Ransomware Reporting:** https://www.ic3.gov/
