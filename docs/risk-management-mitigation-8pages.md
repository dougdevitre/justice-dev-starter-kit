# Risk Management & Mitigation
## Justice OS — Proactive Risk Management for a Mission-Critical Platform

**Version:** 1.0  
**Audience:** Executive Team, Board of Directors, Risk Owners  
**Last Updated:** 2025  
**Review Cadence:** Weekly (operational) · Monthly (strategic) · Quarterly (board)

---

## Table of Contents

1. [Risk Management Overview](#1-risk-management-overview)
2. [Risk Scoring Matrix](#2-risk-scoring-matrix)
3. [Technical Risks](#3-technical-risks)
4. [Market Risks](#4-market-risks)
5. [Operational Risks](#5-operational-risks)
6. [Regulatory Risks](#6-regulatory-risks)
7. [Reputational Risks](#7-reputational-risks)
8. [Financial Risks](#8-financial-risks)
9. [Risk Register Summary Table](#9-risk-register-summary-table)
10. [Risk Governance Structure](#10-risk-governance-structure)

---

## 1. Risk Management Overview

### Philosophy

Justice OS is a mission-critical platform. Our clients are often in crisis — facing eviction, custody disputes, immigration threats, or domestic violence. A security breach, a platform outage, or a regulatory violation does not just inconvenience a customer; it can cause irreversible harm to vulnerable people who trusted us with their most sensitive information and their most urgent needs.

Our risk management philosophy rests on three pillars:

1. **Proactive identification:** We do not wait for risks to materialize. We actively seek out risks through regular reviews, external audits, developer friction reports, and scenario planning. Identifying a risk early costs almost nothing; responding to a crisis costs everything.

2. **Honest assessment:** Every risk is assessed without optimism bias. We acknowledge the true probability and impact of each risk, even when the assessment is uncomfortable. Minimizing a risk on paper does not make it smaller in reality.

3. **Clear ownership:** Every risk has a named owner who is accountable for monitoring it, executing mitigations, and escalating if the risk materializes. No risk is "owned by everyone," which means it would be owned by no one.

### Risk Appetite Statement

| Risk Category | Risk Appetite | Rationale |
|---|---|---|
| Data security and privacy | **Very Low** | Client PII and case data is sacred; any breach damages trust irreparably |
| Unauthorized practice of law | **Very Low** | Criminal and civil liability; threatens platform viability |
| Financial runway | **Low** | Mission cannot be served from bankruptcy |
| Operational / process | **Moderate** | Recoverable; invest in monitoring and rapid response |
| Market / competitive | **Moderate** | Manageable through product and partnership strategy |
| Technology / platform | **Low** | Downtime directly harms clients in time-sensitive legal situations |

---

## 2. Risk Scoring Matrix

### Scoring Dimensions

**Probability Rating:**
- **H (High):** > 60% likelihood of occurring within 12 months
- **M (Medium):** 20–60% likelihood of occurring within 12 months
- **L (Low):** < 20% likelihood of occurring within 12 months

**Impact Rating:**
- **H (High):** Threatens platform viability, causes significant client harm, or creates major legal/regulatory exposure
- **M (Medium):** Significant operational setback, revenue impact, or reputational damage requiring substantial resources to remediate
- **L (Low):** Minor disruption, manageable with existing resources, limited client impact

### Risk Heat Map

```
              LOW IMPACT    MED IMPACT    HIGH IMPACT
              ──────────────────────────────────────
HIGH PROB  │      6      │      6      │      9      │
           ├─────────────┼─────────────┼─────────────┤
MED PROB   │      2      │      4      │      6      │
           ├─────────────┼─────────────┼─────────────┤
LOW PROB   │      1      │      3      │      3      │
              ──────────────────────────────────────

Score 9: CRITICAL — Immediate action required; escalate to board
Score 6: HIGH — Active mitigation required; monthly exec review
Score 4: MEDIUM — Mitigation plan in place; quarterly review
Score 3: MEDIUM — Monitor; semi-annual review
Score 2: LOW — Accept or low-cost mitigation; annual review
Score 1: LOW — Accept; annual review
```

---

## 3. Technical Risks

### T1: Data Breach Exposing Client PII/Legal Case Data

| Attribute | Detail |
|---|---|
| **Risk Description** | Unauthorized access to client personally identifiable information (PII), legal case details, and privileged communications. Clients include domestic violence survivors, undocumented immigrants, and individuals with criminal records — populations for whom a data breach can cause direct physical harm. |
| **Probability** | Medium |
| **Impact** | High |
| **Risk Score** | 6 (High) |
| **Owner** | CTO |
| **Review Cadence** | Monthly |

**Mitigation Actions:**
1. SOC 2 Type II certification (annual audit by independent assessor)
2. End-to-end encryption for all PII at rest (AES-256) and in transit (TLS 1.3)
3. Penetration testing quarterly by external firm; bug bounty program
4. Zero-trust network architecture; no employee has standing access to production PII
5. Regular security training for all staff; phishing simulation quarterly

**Contingency Plan:** Incident response plan (IRP) triggers within 15 minutes of detection. Automated PII scrubbing from logs. Legal counsel notified within 1 hour. State breach notification letters prepared within 24 hours. Public disclosure within 72 hours per GDPR/state law requirements.

---

### T2: Platform Scalability Failure During Court Filing Deadline Rush

| Attribute | Detail |
|---|---|
| **Risk Description** | Court filing deadlines create sharp, predictable traffic spikes. If the platform degrades or fails during a filing window (typically 4–6 PM on business days), clients miss legally binding deadlines that cannot be recovered. |
| **Probability** | Medium |
| **Impact** | Medium |
| **Risk Score** | 4 (Medium) |
| **Owner** | CTO |
| **Review Cadence** | Quarterly |

**Mitigation Actions:**
1. Auto-scaling infrastructure (AWS ECS Fargate) with 10× burst capacity pre-configured
2. Load testing simulating 5× peak traffic before every major release
3. Graceful degradation: non-critical features (analytics, AI suggestions) shed first under load
4. Real-time monitoring (DataDog) with PagerDuty alerts at 80% resource utilization

**Contingency Plan:** Runbook for manual infrastructure scale-up executed within 5 minutes. Direct phone line to court clerk for clients affected by documented outage. Post-incident report published within 48 hours.

---

### T3: Critical Third-Party API Dependency Failure or Pricing Change

| Attribute | Detail |
|---|---|
| **Risk Description** | Justice OS depends on third-party APIs for core functionality: DocuSign (e-signature), Twilio (SMS), Stripe (payments), and state court e-filing APIs. A vendor outage, API deprecation, or 10× pricing increase could break core platform functionality. |
| **Probability** | Medium |
| **Impact** | Medium |
| **Risk Score** | 4 (Medium) |
| **Owner** | CTO |
| **Review Cadence** | Quarterly |

**Mitigation Actions:**
1. Vendor abstraction layer in codebase: all third-party API calls routed through internal adapters, enabling swap-out without application code changes
2. Fallback vendors identified and pre-integrated for each critical service (e.g., HelloSign as DocuSign fallback)
3. Annual contract reviews with price escalation caps negotiated for critical vendors

**Contingency Plan:** Activate fallback vendor within 4 hours using feature flag. Notify affected partners within 1 hour. Client communications drafted and ready for deployment.

---

### T4: Data Loss Due to Backup Failure

| Attribute | Detail |
|---|---|
| **Risk Description** | Failure of backup systems resulting in irreversible loss of case data, documents, and client records. Legal case data has 7-year retention requirements; loss would have regulatory consequences in addition to client harm. |
| **Probability** | Low |
| **Impact** | High |
| **Risk Score** | 3 (Medium) |
| **Owner** | CTO |
| **Review Cadence** | Semi-annual |

**Mitigation Actions:**
1. Automated daily backups to geographically separate AWS region (us-east-1 primary, us-west-2 secondary)
2. Monthly backup restoration test (restore to staging environment and verify data integrity)
3. Point-in-time recovery enabled for all PostgreSQL databases (35-day retention)

**Contingency Plan:** RTO < 4 hours; RPO < 1 hour for production databases. Activate DR environment; notify partners immediately. Data loss incident triggers external audit.

---

### T5: AI Model Producing Biased or Incorrect Legal Guidance

| Attribute | Detail |
|---|---|
| **Risk Description** | AI-assisted features (triage, document drafting suggestions, legal research) may produce outputs that are legally incorrect, jurisdictionally wrong, or systematically biased against certain demographic groups. Incorrect legal guidance can cause direct harm to clients who rely on it. |
| **Probability** | Medium |
| **Impact** | High |
| **Risk Score** | 6 (High) |
| **Owner** | CTO + Head of Legal |
| **Review Cadence** | Monthly |

**Mitigation Actions:**
1. All AI outputs are presented as "suggestions" with mandatory attorney review flags for consequential decisions
2. Bias testing on AI outputs across demographic groups quarterly; disparate impact analysis by race, language, and income
3. Legal expert review panel (5 attorneys) evaluates AI outputs monthly in blind review sessions
4. User feedback mechanism on every AI suggestion; low-rated outputs flagged for immediate review

**Contingency Plan:** Ability to disable AI features with a single feature flag within 5 minutes. Rollback to previous model version within 1 hour. Public disclosure of known bias issue within 24 hours.

---

### T6: Performance Degradation at Scale

| Attribute | Detail |
|---|---|
| **Risk Description** | As the platform scales to 50,000+ MAU, API response times exceed the 2-second threshold that degrades user experience and abandonment rate in intake forms. Legal aid clients often have limited patience and low-bandwidth connections. |
| **Probability** | Medium |
| **Impact** | Medium |
| **Risk Score** | 4 (Medium) |
| **Owner** | CTO |
| **Review Cadence** | Quarterly |

**Mitigation Actions:**
1. p95 API response time < 500ms SLA enforced; automated alerts at 800ms
2. Database query optimization reviews before every release
3. CDN (CloudFront) for all static assets and document downloads

**Contingency Plan:** Performance triage runbook; database read replica promotion; non-essential feature circuit breakers.

---

## 4. Market Risks

### M1: Slow Adoption by Legal Aid Organizations

| Attribute | Detail |
|---|---|
| **Risk** | Legal aid organizations are often bureaucratic, change-averse, and constrained by board oversight, funder restrictions, and limited IT capacity. Adoption cycles of 18–36 months are common. |
| **Probability** | High |
| **Impact** | Medium |
| **Score** | 6 (High) |
| **Owner** | CEO |

**Mitigation Actions:**
1. White-glove onboarding for first 20 partner organizations; dedicated implementation specialist
2. LSC-compliant data architecture (pre-approved by Legal Services Corporation IT security review)
3. Free tier for organizations serving < 500 cases/year; eliminates budget approval barrier
4. Executive champion program: identify and support a technology-forward staff member at each target org

**Contingency:** Pivot to direct-to-client model (consumer product) if B2B legal aid adoption < 50% of plan at 18 months.

---

### M2: Well-Funded Competitor Launches Similar Open-Source Platform

| Attribute | Detail |
|---|---|
| **Risk** | A well-funded organization (Microsoft Philanthropies, Salesforce.org, or a venture-backed startup) launches a competing open-source legal technology platform with more resources. |
| **Probability** | Medium |
| **Impact** | High |
| **Score** | 6 (High) |
| **Owner** | CEO |

**Mitigation Actions:**
1. Community moat: 72-project integrated ecosystem creates switching costs that no new entrant can replicate quickly
2. Mission alignment: legal aid organizations prefer a mission-driven nonprofit/benefit corp over a corporate subsidiary
3. Network effects: each new partner org, court integration, and document template makes the platform more valuable

**Contingency:** Evaluate partnership or integration with competitor rather than competing head-to-head. Open source ensures survival even if commercial entity struggles.

---

### M3: Economic Recession Reduces Legal Aid Funding

| Attribute | Detail |
|---|---|
| **Risk** | Economic recession reduces foundation endowments, government budgets, and corporate philanthropy, leading to budget cuts at legal aid organizations that reduce their willingness to pay for new technology. |
| **Probability** | Medium |
| **Impact** | High |
| **Score** | 6 (High) |
| **Owner** | CEO |

**Mitigation Actions:**
1. Diversified revenue: paid subscriptions, foundation grants, government contracts, court system contracts — no single source > 30% of revenue
2. "Recession-proof" value proposition: Justice OS reduces cost per case, which becomes *more* attractive when budgets are cut
3. 12+ months cash runway maintained at all times

**Contingency:** Activate emergency grant applications; offer payment deferrals to existing customers; reduce burn rate via contractor reduction.

---

### M4: LSC or Major Grant Funder Cuts Access-to-Justice Funding

| Attribute | Detail |
|---|---|
| **Risk** | The Legal Services Corporation (LSC) or a major foundation (Ford, MacArthur, Open Society) significantly reduces access-to-justice funding due to political changes or strategic reallocation. |
| **Probability** | Medium |
| **Impact** | High |
| **Score** | 6 (High) |
| **Owner** | CEO |

**Mitigation Actions:**
1. Active diversification of grant portfolio: target 15+ active grant relationships across 5+ funder categories
2. Build SaaS revenue to cover core operations independent of grant income within 24 months
3. Maintain relationships with international funders (EU, UK, Canada) as diversification

**Contingency:** Emergency fundraising campaign; community-supported model (individual donations); explore B-Corp impact investor financing.

---

### M5: Court Systems Mandate Proprietary Solutions

| Attribute | Detail |
|---|---|
| **Risk** | State or federal court systems mandate exclusive use of specific proprietary case management or e-filing systems that are incompatible with Justice OS, blocking key integrations. |
| **Probability** | Low |
| **Impact** | High |
| **Score** | 3 (Medium) |
| **Owner** | Head of Legal |

**Mitigation Actions:**
1. Proactive engagement with state court technology offices; Justice OS as preferred open standards partner
2. Tyler Technologies and Thomson Reuters relationships: integration APIs rather than competition
3. Advocate for open standards in court technology through NCSC (National Center for State Courts) membership

**Contingency:** Build PDF-based submission workflows as fallback for courts without API integration.

---

## 5. Operational Risks

### O1: Key Person Dependency — Founder Departure

| Attribute | Detail |
|---|---|
| **Risk** | Departure of one or both founders would remove critical technical knowledge, funder relationships, and organizational credibility at a stage where the organization depends heavily on founder-led sales and fundraising. |
| **Probability** | Medium |
| **Impact** | High |
| **Score** | 6 (High) |
| **Owner** | Board Chair |

**Mitigation Actions:**
1. Founder institutional knowledge systematically documented: architecture decisions, funder relationships, strategic context
2. Executive succession planning: VP Engineering hired within 18 months to reduce founder single-point-of-failure
3. Board relationships maintained independently of founders: board members know key funders directly

**Contingency:** Board activates interim leadership within 48 hours of founder departure; executive search launched within 2 weeks.

---

### O2: Inability to Hire Technical Talent at Nonprofit Pay Scales

| Attribute | Detail |
|---|---|
| **Risk** | Competitive salaries for senior engineers in legal technology ($180K–$250K+ in major markets) may be unachievable at nonprofit pay scales, leading to inability to hire or high attrition of existing staff. |
| **Probability** | High |
| **Impact** | Medium |
| **Score** | 6 (High) |
| **Owner** | CEO |

**Mitigation Actions:**
1. Mission-driven compensation strategy: below-market base + equity-equivalent (profit-sharing or LTIP), full benefits, and meaningful mission alignment
2. Remote-first hiring: access to talent pools in lower cost-of-living markets
3. Fellowship programs: Code for America, Harvard Public Interest Technology fellowship, LSC technology fellowship

**Contingency:** Expanded contractor and fractional engineering relationships; open source community contributions; strategic partnership with law schools for student developer programs.

---

### O3: Process Failures in Client Onboarding Leading to Data Errors

| Attribute | Detail |
|---|---|
| **Risk** | Errors in the client intake process (incorrect legal issue classification, incorrect party information, missing eligibility data) lead to clients being served by the wrong attorney, missing deadlines, or receiving incorrect documents. |
| **Probability** | Medium |
| **Impact** | Medium |
| **Score** | 4 (Medium) |
| **Owner** | COO |

**Mitigation Actions:**
1. Guided intake with validation: required fields, format validation, jurisdictional eligibility checks at intake
2. Attorney review checkpoint before case is activated: no case proceeds without staff verification
3. Data quality dashboards: partner organizations see their own error rates; accountability drives improvement

**Contingency:** Automated error detection flags cases for review; client notification within 24 hours of detected error; root cause analysis and process change within 1 week.

---

### O4: Vendor Lock-In with Cloud Provider Making Migration Costly

| Attribute | Detail |
|---|---|
| **Risk** | Deep integration with AWS-proprietary services (RDS, SES, Lambda, S3) makes migration to alternative cloud provider or on-premise hosting prohibitively expensive, giving AWS pricing power over infrastructure costs. |
| **Probability** | Low |
| **Impact** | Medium |
| **Score** | 2 (Low) |
| **Owner** | CTO |

**Mitigation Actions:**
1. Containerized architecture (Docker/Kubernetes) enables provider portability for compute workloads
2. Use open standards where possible: PostgreSQL over Aurora Proprietary, standard S3 API over proprietary storage

**Contingency:** Cloud cost spike > 50% triggers architecture review; 6-month migration plan ready to activate.

---

## 6. Regulatory Risks

### R1: HIPAA Violation from Improper PHI Handling

| Attribute | Detail |
|---|---|
| **Risk** | Immigration cases, domestic violence cases, and disability benefits cases frequently involve Protected Health Information (PHI). Improper handling triggers HIPAA violations with civil penalties up to $1.9M per violation category. |
| **Probability** | Medium |
| **Impact** | High |
| **Score** | 6 (High) |
| **Owner** | Head of Legal |

**Mitigation Actions:**
1. HIPAA-compliant data architecture: PHI stored in segregated, separately encrypted data stores
2. Business Associate Agreements (BAAs) with all subprocessors that may touch PHI
3. Annual HIPAA training for all staff; case intake screens flag PHI-containing case types
4. HIPAA-specific access controls: minimum necessary access enforced by role

**Contingency:** HIPAA breach response plan activated within 1 hour; HHS notification within 60 days as required; legal counsel engaged immediately.

---

### R2: State Bar Unauthorized Practice of Law Claim — CRITICAL

| Attribute | Detail |
|---|---|
| **Risk** | A state bar association alleges that Justice OS's guided interview tools, AI legal suggestions, or document drafting features constitute the unauthorized practice of law (UPL), threatening platform shutdown, fines, and reputational damage. |
| **Probability** | High |
| **Impact** | High |
| **Score** | **9 (CRITICAL)** |
| **Owner** | Head of Legal + CEO |
| **Review Cadence** | **Monthly** |

**Mitigation Actions:**
1. Licensed attorney review of all guided interview scripts, AI output templates, and document drafting tools before deployment
2. UPL disclaimers on every screen: "This is legal information, not legal advice. For legal advice, consult a licensed attorney."
3. Active engagement with state bars in top 10 markets: formal advisory opinions sought before launch
4. "Attorney in the Loop" architecture: all consequential outputs require attorney review before delivery to client
5. Monitor NOLO, Avvo, LegalZoom precedents; adjust product design to stay within established safe harbors
6. Pro Bono legal counsel relationship with a top-20 law firm for regulatory defense

**Contingency Plan:** Immediate feature shutdown capability via feature flag. Legal defense fund ($250K reserved). Engagement with state legislature for access-to-justice technology safe harbor statute (model legislation drafted and ready).

---

### R3: GDPR Non-Compliance for EU Expansion

| Attribute | Detail |
|---|---|
| **Risk** | Expanding to serve EU-based legal aid organizations (UK, Germany, Netherlands) without full GDPR compliance exposes Justice OS to fines up to 4% of global annual revenue. |
| **Probability** | Medium |
| **Impact** | High |
| **Score** | 6 (High) |
| **Owner** | Head of Legal |

**Mitigation Actions:**
1. EU expansion delayed until GDPR compliance architecture is certified (target: Year 2)
2. Data residency in EU-West AWS region for any EU data
3. GDPR-specific consent flows, right-to-erasure implementation, and data portability export

**Contingency:** EU operations suspended immediately upon regulatory inquiry. Legal counsel in affected jurisdiction retained proactively.

---

### R4: FERPA Violation in Law School Clinical Programs

| Attribute | Detail |
|---|---|
| **Risk** | Law school clinical programs using Justice OS to manage student-supervised cases may inadvertently expose student records or patient records in ways that violate FERPA. |
| **Probability** | Low |
| **Impact** | Medium |
| **Score** | 2 (Low) |
| **Owner** | Head of Legal |

**Mitigation Actions:**
1. Student data segregation in law school clinical program configurations
2. FERPA addendum to law school partnership agreements

**Contingency:** Suspend law school clinical program data sharing; engage university counsel.

---

### R5: State-Specific Data Breach Notification Failure

| Attribute | Detail |
|---|---|
| **Risk** | All 50 states have distinct data breach notification laws with different timelines (24 hours to 90 days), covered data definitions, and notification requirements. Non-compliance with any state's law triggers regulatory penalties. |
| **Probability** | Medium |
| **Impact** | High |
| **Score** | 6 (High) |
| **Owner** | Head of Legal |

**Mitigation Actions:**
1. Multi-state breach notification matrix maintained and reviewed quarterly by legal counsel
2. Automated breach detection → legal counsel notification pipeline (< 1 hour from detection)
3. Pre-drafted breach notification letter templates for all 50 states

**Contingency:** Immediate legal counsel engagement; state-specific notification letters deployed within required windows.

---

## 7. Reputational Risks

### P1: Public Data Breach Exposing Vulnerable Clients

| Attribute | Detail |
|---|---|
| **Risk** | A public data breach exposing case data of domestic violence survivors or undocumented immigrants generates major media coverage and permanently damages trust in Justice OS as a safe platform for vulnerable populations. |
| **Probability** | Low |
| **Impact** | High |
| **Score** | 3 (Medium) |
| **Owner** | CEO |

**Mitigation Actions:**
1. Tiered data sensitivity architecture: most sensitive data (DV, immigration) in highest security tier with additional access controls
2. Crisis communications plan drafted and pre-approved by board; spokesperson designated
3. Relationship with legal aid community cultivated to provide context and support in crisis

**Contingency:** Crisis communications team activated within 2 hours. CEO statement published within 12 hours. Free credit monitoring for affected individuals.

---

### P2: AI Bias Causing Systematically Worse Outcomes for Minority Clients

| Attribute | Detail |
|---|---|
| **Risk** | Audit reveals that Justice OS AI features (triage, document suggestions) produce systematically worse recommendations for clients of color, non-English speakers, or lower-income clients, amplifying existing disparities. |
| **Probability** | Medium |
| **Impact** | High |
| **Score** | 6 (High) |
| **Owner** | CTO + Head of Legal |

**Mitigation Actions:**
1. Proactive disparate impact testing before every AI model deployment; independent third-party audit annually
2. Diverse dataset curation for AI training: overrepresentation of minority-community legal scenarios
3. Human rights impact assessment for any new AI feature before launch

**Contingency:** Immediate AI feature suspension; public acknowledgment within 24 hours; independent audit commissioned; remediation timeline published.

---

### P3: Platform Used for Unauthorized Practice of Law by a Partner

| Attribute | Detail |
|---|---|
| **Risk** | A partner organization uses Justice OS to provide what a state bar characterizes as legal advice without attorney supervision, and Justice OS is named as enabling the UPL violation. |
| **Probability** | Medium |
| **Impact** | Medium |
| **Score** | 4 (Medium) |
| **Owner** | Head of Legal |

**Mitigation Actions:**
1. Partner agreements include UPL compliance obligations; Justice OS may suspend access for violations
2. Partner onboarding training includes UPL guidelines specific to their state
3. Usage monitoring: flag partner usage patterns inconsistent with attorney-supervised workflow

**Contingency:** Immediate partner account suspension; legal counsel engaged; cooperation with bar investigation; public clarification of Justice OS UPL safeguards.

---

## 8. Financial Risks

### F1: Runway < 6 Months with No Bridge in Sight

| Attribute | Detail |
|---|---|
| **Risk** | Slow ARR growth and delayed grant disbursements leave the organization with less than 6 months of operating cash and no clear funding bridge, risking inability to meet payroll. |
| **Probability** | Medium |
| **Impact** | High |
| **Score** | 6 (High) |
| **Owner** | CEO |

**Mitigation Actions:**
1. 12-month runway minimum policy: begin fundraising when runway drops below 12 months
2. Board runway dashboard: real-time runway visibility for all board members
3. Pre-approved cost reduction plan: 3 tiers of cuts (10%, 25%, 40% of burn) that can activate within 2 weeks

**Contingency:** Activate venture debt facility (pre-negotiated); emergency board fundraising sprint; revenue-based financing from existing partners.

---

### F2: Customer Acquisition Cost Exceeds Lifetime Value

| Attribute | Detail |
|---|---|
| **Risk** | Expensive white-glove onboarding, long sales cycles, and high churn of small legal aid organizations results in CAC exceeding LTV within 24 months, making the business model unsustainable. |
| **Probability** | Medium |
| **Impact** | High |
| **Score** | 6 (High) |
| **Owner** | CEO |

**Mitigation Actions:**
1. Monthly cohort LTV/CAC tracking by customer segment and acquisition channel
2. Invest in product-led growth: self-serve onboarding to reduce CAC for smaller organizations
3. Identify and focus on highest-LTV customer segments (courts, large legal aid networks)

**Contingency:** Pause low-LTV customer acquisition; concentrate sales resources on enterprise segment.

---

### F3: Grant Reporting Failure Leading to Clawback

| Attribute | Detail |
|---|---|
| **Risk** | Failure to meet grant reporting requirements (missed deadline, inadequate documentation, misclassified expenses) leads to a funder demanding repayment of disbursed funds. |
| **Probability** | Low |
| **Impact** | High |
| **Score** | 3 (Medium) |
| **Owner** | COO |

**Mitigation Actions:**
1. Grant tracking system (Salesforce Nonprofit): all grant requirements, milestones, and deadlines tracked
2. Grant report calendar with 30-day advance reminders
3. External accountant reviews grant expense classification quarterly

**Contingency:** Proactive funder communication at first sign of reporting difficulty; offer alternative metrics or timeline.

---

### F4: Key Customer Churns Unexpectedly

| Attribute | Detail |
|---|---|
| **Risk** | A customer representing > 20% of ARR churns unexpectedly (leadership change, budget cut, alternative solution), creating an immediate financial crisis. |
| **Probability** | Medium |
| **Impact** | High |
| **Score** | 6 (High) |
| **Owner** | CEO |

**Mitigation Actions:**
1. No single customer > 20% of ARR target; proactive diversification of customer base
2. Executive sponsor program: CEO maintains direct relationships with all customers > 10% ARR
3. Quarterly health scoring for all strategic customers; early warning system

**Contingency:** Emergency customer success intervention (CEO + CSM); accelerated sales pipeline activation for replacement revenue.

---

## 9. Risk Register Summary Table

| ID | Risk Name | Category | Probability | Impact | Score | Owner | Last Review |
|---|---|---|---|---|---|---|---|
| R2 | Unauthorized practice of law claim | Regulatory | High | High | **9** | Head of Legal | Monthly |
| T1 | Data breach — client PII | Technical | Medium | High | 6 | CTO | Monthly |
| T5 | AI bias / incorrect legal guidance | Technical | Medium | High | 6 | CTO | Monthly |
| M1 | Slow legal aid org adoption | Market | High | Medium | 6 | CEO | Monthly |
| M2 | Well-funded competitor | Market | Medium | High | 6 | CEO | Monthly |
| M3 | Recession reduces legal aid funding | Market | Medium | High | 6 | CEO | Monthly |
| M4 | LSC/major funder cuts A2J funding | Market | Medium | High | 6 | CEO | Monthly |
| O1 | Founder departure | Operational | Medium | High | 6 | Board Chair | Monthly |
| O2 | Technical hiring at nonprofit pay | Operational | High | Medium | 6 | CEO | Monthly |
| R1 | HIPAA violation | Regulatory | Medium | High | 6 | Head of Legal | Monthly |
| R3 | GDPR non-compliance (EU) | Regulatory | Medium | High | 6 | Head of Legal | Monthly |
| R5 | State breach notification failure | Regulatory | Medium | High | 6 | Head of Legal | Monthly |
| F1 | Runway < 6 months | Financial | Medium | High | 6 | CEO | Monthly |
| F2 | CAC > LTV | Financial | Medium | High | 6 | CEO | Monthly |
| F4 | Key customer churns | Financial | Medium | High | 6 | CEO | Monthly |
| P2 | AI bias — minority clients | Reputational | Medium | High | 6 | CTO | Monthly |
| T2 | Scalability failure — filing deadline | Technical | Medium | Medium | 4 | CTO | Quarterly |
| T3 | Third-party API dependency | Technical | Medium | Medium | 4 | CTO | Quarterly |
| T6 | Performance degradation at scale | Technical | Medium | Medium | 4 | CTO | Quarterly |
| O3 | Client onboarding data errors | Operational | Medium | Medium | 4 | COO | Quarterly |
| P3 | Partner UPL violation | Reputational | Medium | Medium | 4 | Head of Legal | Quarterly |
| T4 | Data loss — backup failure | Technical | Low | High | 3 | CTO | Semi-annual |
| M5 | Court mandates proprietary solutions | Market | Low | High | 3 | Head of Legal | Semi-annual |
| P1 | Public breach — vulnerable clients | Reputational | Low | High | 3 | CEO | Semi-annual |
| F3 | Grant reporting failure / clawback | Financial | Low | High | 3 | COO | Semi-annual |
| R4 | FERPA violation — law school | Regulatory | Low | Medium | 2 | Head of Legal | Annual |
| O4 | Cloud vendor lock-in | Operational | Low | Medium | 2 | CTO | Annual |

---

## 10. Risk Governance Structure

### Risk Owner Assignments

| Risk Category | Primary Owner | Secondary Owner | Escalation Path |
|---|---|---|---|
| Technical | CTO | VP Engineering | CEO → Board Tech Committee |
| Market | CEO | VP Sales | Board → Full Board |
| Operational | COO | Department Heads | CEO → Board |
| Regulatory | Head of Legal | CEO | Board → External Counsel |
| Reputational | CEO | Head of Legal | Board Chair → Crisis Comm Firm |
| Financial | CEO | CFO/Controller | Board → Emergency Finance Committee |

### Monthly Risk Review Meeting Agenda (60 minutes)

1. **Critical and High risks review** (30 min): Status update from each owner; mitigation progress; any new developments
2. **New risk identification** (10 min): Any new risks identified since last meeting?
3. **Risk score changes** (10 min): Any risks that should be re-scored up or down?
4. **Action items** (10 min): Assign owners and deadlines for any new mitigation actions

### Board Risk Reporting Format

Quarterly board report includes a one-page risk summary:
- Risk register heatmap (color-coded by score)
- Top 5 risks: current status and mitigation progress
- Any risks that changed score since last quarter
- Any new critical or high risks identified
- Incident summary: any risk events that materialized in the quarter

### Incident Response Activation Criteria

An incident response is formally activated (all-hands, IRP team assembled, CEO notified within 30 minutes) when any of the following occur:

- Any confirmed data breach affecting even 1 user
- Platform downtime > 30 consecutive minutes
- Receipt of any state bar complaint or regulatory inquiry
- Any press inquiry related to a listed risk
- Any financial event that reduces runway below 9 months

---

*Justice OS Risk Management Framework · Version 1.0 · Confidential — Board and Executive Use*
