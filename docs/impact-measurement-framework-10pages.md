# Impact Measurement Framework
## Justice OS — Measuring What Matters in Access to Justice

**Version:** 1.0  
**Audience:** Leadership, Program Staff, Funders, Partners, Evaluators  
**Last Updated:** 2025

---

## Table of Contents

1. [Theory of Change](#1-theory-of-change)
2. [User Access Metrics](#2-user-access-metrics)
3. [Outcome Metrics](#3-outcome-metrics)
4. [Scale Metrics](#4-scale-metrics)
5. [Sustainability Metrics](#5-sustainability-metrics)
6. [Measurement Methodology](#6-measurement-methodology)
7. [Reporting Cadence](#7-reporting-cadence)
8. [Sample Impact Dashboard](#8-sample-impact-dashboard)
9. [Evaluation Framework](#9-evaluation-framework)
10. [Data Collection Tools & Integrations](#10-data-collection-tools--integrations)

---

## 1. Theory of Change

### The Problem

Eighty percent of the civil legal needs of low-income Americans go unmet. This is not a small gap — it represents tens of millions of people each year who face housing evictions, child custody disputes, immigration proceedings, domestic violence protection orders, and benefits denials without any legal representation. The consequences cascade: families lose homes, children are separated from parents, survivors of violence remain unprotected, and individuals lose income and opportunities they can never recover.

The legal aid sector is chronically underfunded. There are fewer than 6,000 civil legal aid attorneys in the United States serving a potential client base of over 50 million low-income Americans — a ratio of roughly 1 attorney per 8,000 eligible clients. Technology is the only plausible path to closing this gap at scale.

### Logic Model

```
INPUTS
─────────────────────────────────────────────────────
• Justice OS platform (software, infrastructure)
• Legal aid partner organizations (60+ nationwide)
• Volunteer and pro bono attorneys
• Court system integrations (e-filing, records)
• Foundation and government funding
• Open source developer community

          │
          ▼

ACTIVITIES
─────────────────────────────────────────────────────
• Online legal intake and triage (guided interviews)
• Automated document assembly (forms, motions, letters)
• Case management for legal aid organizations
• Attorney-client matching and referral
• Court e-filing integration
• Self-help portals for pro se litigants

          │
          ▼

OUTPUTS (what we produce)
─────────────────────────────────────────────────────
• Individuals screened and triaged
• Cases opened and managed
• Legal documents generated
• Attorney hours saved via automation
• Partner organizations onboarded
• Court integrations active

          │
          ▼

SHORT-TERM OUTCOMES (0–12 months)
─────────────────────────────────────────────────────
• Reduced time to access legal help
• Increased case intake capacity for legal aid orgs
• Higher rate of cases reaching resolution
• Improved client understanding of legal process

          │
          ▼

MEDIUM-TERM OUTCOMES (1–3 years)
─────────────────────────────────────────────────────
• Improved legal outcomes (benefits obtained, evictions
  prevented, custody agreements reached)
• Reduced recidivism for justice-involved individuals
• Increased housing stability for low-income families
• Legal aid organizations operating at greater capacity

          │
          ▼

LONG-TERM OUTCOMES (3–10 years)
─────────────────────────────────────────────────────
• Systemic reduction in the justice gap
• Reduced inequality of legal outcomes across income levels
• Policy changes driven by aggregated access-to-justice data
• A more accessible, efficient, and equitable civil justice system
```

---

## 2. User Access Metrics

Access metrics measure whether Justice OS is reaching the people who need it most. Financial access, demographic reach, and geographic coverage are tracked separately because each requires distinct interventions.

### Cost Per Access to Justice

**Definition:** Total platform operating cost divided by the number of individuals who received meaningful legal assistance through the platform in a given period.

**Why it matters:** Traditional legal aid costs $500–$2,000 per case served when accounting for attorney time, overhead, and administration. Technology-enabled legal assistance must dramatically reduce this cost to make universal access feasible.

| Metric | Baseline (Traditional Legal Aid) | Justice OS Target | Current |
|---|---|---|---|
| Cost per case (full representation) | $500 – $2,000 | < $50 | [measured quarterly] |
| Cost per document generated | $150 – $400 | < $5 | [measured monthly] |
| Cost per intake completed | $50 – $200 | < $10 | [measured monthly] |

**Measurement:** Finance team calculates monthly. Tracked as a trend over rolling 12 months. Broken out by case type and service level (full case management vs. document-only vs. self-help triage).

---

### Demographic Reach

Justice OS measures demographic reach to ensure the platform is genuinely serving marginalized communities and not inadvertently widening the digital divide.

**Income Level**
- **Target:** > 80% of users at or below 125% of the Federal Poverty Level (FPL)
- **Measurement:** Voluntary income declaration at intake (range bands, not exact income)
- **Current FPL guideline:** Published annually by HHS; 125% FPL for family of 4 = ~$38,625 (2025)

**Race and Ethnicity**
- **Target:** Demographic alignment with the population in the geographic service area, not overrepresentation of any single group
- **Measurement:** Voluntary self-identification at intake; compared against U.S. Census ACS data for the relevant jurisdiction
- **Reporting:** Aggregate only; never individual-level race/ethnicity data in external reports

**Gender**
- **Target:** Parity in access; no gender should be significantly underrepresented relative to the eligible population for each case type (e.g., domestic violence cases will skew female; that is expected)
- **Measurement:** Voluntary at intake (including non-binary and gender non-conforming options)

**Primary Language**
- **Target:** > 30% of users whose primary language is not English
- **Platform support:** Currently available in: English, Spanish, Mandarin, Vietnamese, Portuguese, Arabic, Haitian Creole (7 languages); Year 2 target: 15 languages
- **Measurement:** Language selected at intake

**Digital Access**
- **Target:** > 25% of sessions completed on mobile devices (indicates access by lower-income users who rely on smartphones as primary internet access)
- **Measurement:** Device type analytics (anonymized)

---

### Geographic Coverage

**Jurisdictions Covered**
- **Year 1 target:** 15 states with active integrations (court e-filing, legal aid org partnerships)
- **Year 2 target:** 35 states
- **Year 3 target:** All 50 states + D.C. + Puerto Rico

**Rural vs. Urban Access**
- Track the percentage of users in rural counties (defined as USDA Rural-Urban Continuum Code 4–9)
- **Target:** Rural users represent at least their proportional share of unmet legal need (estimated 25–30%)
- **Rural-specific feature:** Offline document generation for areas with unreliable internet access

**Legal Desert Penetration**
- A "legal desert" is defined as any county with fewer than 1 civil legal aid attorney per 1,000 eligible residents
- **Target:** Active usage in at least 50% of identified legal desert counties in served states by Year 2
- **Measurement:** ZIP code of user at intake mapped to county attorney density data (LSC annual report)

---

## 3. Outcome Metrics

Outcome metrics measure whether the people who use Justice OS actually achieve better legal results. These are harder to measure than access metrics but far more important.

### Case Resolution Rate

The most fundamental question: does using Justice OS help people resolve their legal issues?

**Definition:** Percentage of cases opened through Justice OS that reach a formal resolution (settlement, judgment, dismissal, withdrawal, or administrative closure) within 18 months of opening.

| Metric | Self-Help Baseline | With Legal Aid | Justice OS Target |
|---|---|---|---|
| Case resolution rate | 45% | 75% | 70% |
| Resolution within 6 months | 20% | 50% | 45% |
| Resolution within 12 months | 35% | 65% | 60% |

**Measurement:**
- Case status tracked from intake through close in the Justice OS case management system
- For self-represented litigants: 90-day post-intake follow-up survey to capture outcomes not recorded in the system
- Cases that migrate off-platform are marked "transferred" and tracked separately

---

### Time to Resolution

**Definition:** Median number of calendar days from case opening to formal resolution.

**Why it matters:** Delays in legal proceedings create compounding harm. A family waiting 18 months for an eviction case resolution may lose their housing multiple times over during that period.

| Case Type | National Baseline | Justice OS Target | Measurement |
|---|---|---|---|
| Family law (divorce/custody) | 18 months | 12 months | Case timestamps |
| Housing/eviction | 6 months | 3 months | Case timestamps |
| Immigration (asylum) | 48 months | 36 months | Case timestamps |
| Benefits (SSI/SSDI) | 24 months | 18 months | Case timestamps |
| Consumer debt | 9 months | 6 months | Case timestamps |

**Reporting:** Median (not mean) to avoid distortion from outlier long-running cases. Also report 90th percentile to capture the worst-case experience.

---

### Client Satisfaction (Net Promoter Score)

**Definition:** Standard NPS question: "On a scale of 0–10, how likely are you to recommend this service to a friend or family member in a similar legal situation?"

| Measurement Point | Timing | Baseline | Target |
|---|---|---|---|
| Post-intake survey | 24 hours after intake completion | 20 NPS | 60+ NPS |
| Post-document survey | Immediately after document generation | — | 65+ NPS |
| Post-resolution survey | 30 days after case closure | — | 55+ NPS |

**Survey delivery:** SMS (primary), email (secondary), in-app notification (tertiary). Surveys are available in all supported languages. Maximum 3 questions per survey to maximize completion rate.

---

### Quality of Justice Outcomes

Tracking whether cases resolved — but not whether they resolved *well* — would be misleading. We track specific positive outcomes by case type:

**Family Law**
- Custody arrangement established with legal documentation (vs. informal agreement)
- Child support order entered and enforced
- Domestic violence protective order granted
- Target: 70% of family law cases result in a documented legal outcome that improves client safety or stability

**Housing**
- Eviction dismissed or resolved in tenant's favor
- Habitability repairs ordered by court
- Unlawful lockout remedied
- Target: 65% of housing cases result in tenant remaining housed or receiving compensation

**Immigration**
- Asylum granted or case still pending with no removal order
- DACA renewal completed
- Naturalization application filed
- Target: 80% of immigration cases result in no adverse immigration action

**Benefits**
- SSI, SSDI, SNAP, Medicaid, or unemployment benefits approved or reinstated
- Target: 75% of benefits cases result in at least partial benefit approval

**Measurement approach:**
1. Attorney outcome coding at case close (required field in case management system)
2. 12-month follow-up survey mailed to clients (assesses durability of outcomes)
3. Court records matching (where electronically available) to verify self-reported outcomes

---

## 4. Scale Metrics

Scale metrics measure the rate at which Justice OS grows its reach and impact. Growth must be sustainable and mission-aligned — not growth for its own sake.

### Core Scale Metrics

| Metric | Year 1 Target | Year 2 Target | Year 3 Target |
|---|---|---|---|
| Monthly Active Users (individuals) | 2,500 | 10,000 | 40,000 |
| Cumulative Users Served | 15,000 | 75,000 | 300,000 |
| New Cases Opened per Month | 800 | 3,500 | 15,000 |
| Cumulative Cases Served | 5,000 | 30,000 | 150,000 |
| Documents Generated per Month | 3,000 | 15,000 | 75,000 |
| Cumulative Documents Generated | 20,000 | 120,000 | 600,000 |
| Active Jurisdictions (states) | 15 | 35 | 50 |
| Partner Organizations | 40 | 120 | 300 |
| Attorney Partners (pro bono + staff) | 500 | 2,000 | 8,000 |
| Attorney Hours Saved per Month | 2,000 | 10,000 | 50,000 |
| Estimated Cases per $1,000 Invested | 15 | 30 | 60 |

### Impact per Dollar

We report our "cases served per $1,000 invested" metric in every public impact report as a measure of capital efficiency. This metric is calculated as:

```
Impact Efficiency = Total Cases Served (TTM) ÷ (Total Operating Expenses (TTM) ÷ 1,000)
```

Year 3 target of 60 cases per $1,000 invested compares favorably to the industry average of 1–2 cases per $1,000 for traditional legal aid, demonstrating the leverage of technology-enabled service delivery.

---

## 5. Sustainability Metrics

A platform that runs out of money cannot serve anyone. Sustainability metrics track Justice OS's organizational health and long-term viability.

### Financial Sustainability

| Metric | Target | Measurement |
|---|---|---|
| MoM ARR Growth | > 15% (Year 1-2) | Financial reporting |
| Gross Revenue Retention | > 85% | Annual cohort analysis |
| Net Revenue Retention | > 100% | Annual cohort analysis |
| Grant Renewal Rate | > 70% | Funder relationships |
| Cash Runway | > 12 months always | Board dashboard |

### Team & Organizational Health

| Metric | Target | Measurement |
|---|---|---|
| 90-day new hire retention | > 90% | HR tracking |
| Employee NPS (eNPS) | > 40 | Quarterly pulse survey |
| Diversity (leadership) | > 40% underrepresented groups | HR tracking |
| Voluntary attrition rate | < 15% annually | HR tracking |

### Partner Ecosystem Health

| Metric | Target | Measurement |
|---|---|---|
| Active integration partners | 50+ by Year 2 | Integration marketplace |
| Monthly API calls from partners | 5M+ by Year 2 | API telemetry |
| Partner NPS | > 50 | Quarterly partner survey |
| Integration uptime | > 99.5% | Monitoring |

### Open Source Community Health

| Metric | Target | Measurement |
|---|---|---|
| GitHub stars | 2,000+ by Year 2 | GitHub API |
| Monthly active contributors | 50+ by Year 2 | GitHub API |
| Maintainer retention rate | > 80% annually | GitHub contributor data |
| Average PR merge time | < 5 business days | GitHub API |
| Issue response time (median) | < 24 hours | GitHub API |

---

## 6. Measurement Methodology

### Data Collection Principles

Justice OS operates under a **privacy-first measurement philosophy**. We collect only the data necessary to measure impact, protect it rigorously, and never sell or share individual-level data.

1. **Minimal data collection:** We collect the least data necessary to answer a specific measurement question. If we can answer the question with aggregate data, we do not collect individual-level data.
2. **Informed consent:** Every intake survey and follow-up survey includes a clear explanation of what data is collected, how it is used, and how to opt out.
3. **Anonymization by default:** All public reports use aggregated, anonymized data. No individual is identifiable in any public report.
4. **Data retention limits:** Survey data is retained for 3 years; case data for 7 years (legal compliance requirement); analytics data for 2 years.

### Measurement Tools

| Tool | Purpose | Data Stored |
|---|---|---|
| **Mixpanel** | Product analytics (user flows, feature usage) | Anonymized event data |
| **PostgreSQL** | Case data, outcome tracking | PII-protected case records |
| **Typeform** | Intake surveys, satisfaction surveys | Survey responses |
| **SurveyMonkey** | Outcome follow-up surveys (90-day, 12-month) | Survey responses |
| **Looker** | Impact dashboard and reporting | Aggregated data views |
| **BigQuery** | Central impact data warehouse | Aggregated, anonymized |

### Responsible Data Use

- **No data sales:** Justice OS will never sell user data, period.
- **Partner data sharing:** Aggregate, anonymized impact data only; never individual records
- **Government data requests:** Challenged in court unless legally required; users notified where permitted
- **Breach notification:** 72-hour notification to affected users; immediate public disclosure

### Data Governance

- **Quarterly data quality reviews:** Data team audits for completeness, consistency, and accuracy
- **Annual external audit:** Third-party data privacy and security audit
- **Data steward:** Designated staff member responsible for data quality and compliance
- **Data dictionary:** Published and maintained for all core data elements

### Statistical Methods

- **Cohort analysis:** Users tracked by intake month to measure outcomes over time without selection bias
- **Regression analysis:** Used to attribute outcome improvements to Justice OS services vs. other factors (e.g., economic conditions, jurisdiction)
- **Confidence intervals:** All outcome estimates reported with 95% confidence intervals
- **Comparison groups:** Where possible, compare outcomes to matched comparison groups using propensity score matching

---

## 7. Reporting Cadence

### Reporting Schedule

| Cadence | Report | Audience | Owner | Format |
|---|---|---|---|---|
| Weekly | Operational metrics dashboard | Internal team | Data Analyst | Live dashboard |
| Monthly | Impact update | Partners, funders | Program Director | PDF (3 pages) |
| Quarterly | Progress vs. goals | Board of Directors | CEO | Slide deck |
| Annual | Comprehensive impact report | Public | Executive Team | PDF (30 pages) |

### Weekly Operational Report (Internal)

Automated dashboard updated every Monday morning:
- Cases opened (week / month-to-date)
- Documents generated (week / month-to-date)
- System uptime (rolling 7 days)
- New partner organizations onboarded
- Support tickets (open / resolved)
- API error rate

### Monthly Impact Report (Partners & Funders)

Three-page PDF delivered first Monday of each month:
1. **Page 1:** Headline numbers (cases served, documents generated, MAU, cost per case)
2. **Page 2:** Outcomes highlight (2–3 case types with resolution rates and trend)
3. **Page 3:** Geographic reach map + demographic summary

### Quarterly Board Report

15-slide deck covering:
- Progress vs. OKRs
- Financial performance
- Impact metrics vs. targets
- Top 3 risks and mitigation status
- Strategic decisions needed from board

### Annual Impact Report (Public)

Published each February covering the previous calendar year. Sections:
1. Executive summary and letter from CEO
2. The problem we are solving
3. Who we served (demographics, geography)
4. What happened to them (outcomes by case type)
5. How efficiently we did it (cost per case, scale metrics)
6. Stories from the field (3–5 anonymized client stories)
7. Financial transparency (audited financials)
8. Goals for the coming year

---

## 8. Sample Impact Dashboard

The Justice OS Impact Dashboard is accessible at `impact.justice-os.com` (public view, updated daily). Below is a description of the dashboard layout and key visualizations.

### Top-Line Numbers (Hero Metrics)

```
┌─────────────────────────────────────────────────────────────────────┐
│                    JUSTICE OS IMPACT — Q1 2025                      │
├──────────────────┬──────────────────┬──────────────────┬────────────┤
│  TOTAL USERS     │  CASES SERVED    │  DOCS GENERATED  │  COST/CASE │
│   12,450         │    8,230         │   31,780         │   $42      │
│  ▲ 23% vs Q4    │  ▲ 31% vs Q4    │  ▲ 28% vs Q4    │  ▼ 18%     │
└──────────────────┴──────────────────┴──────────────────┴────────────┘
```

### Trend Charts

**Monthly Active Users (12-month trend)**
- X-axis: Month (Apr 2024 – Mar 2025)
- Y-axis: MAU (0 to 15,000)
- Series: New users (bar) + Returning users (bar, stacked) + Trend line

**Case Resolution Rate Over Time**
- X-axis: Intake month cohort
- Y-axis: % resolved at 3, 6, 9, 12 months
- Shows improvement in resolution rate as platform matures

### Geographic Coverage

Heat map of the continental U.S. showing:
- **Dark green:** States with full integration (court e-filing + legal aid partner)
- **Light green:** States with partial integration (legal aid partner only)
- **Gray:** States not yet covered
- Tooltip on hover: state name, active partners, cases served this quarter

### Demographic Breakdown

```
INCOME LEVEL                    PRIMARY LANGUAGE
Below 100% FPL  ████████ 54%   English     ████████████ 67%
100-125% FPL    ████ 27%       Spanish     ████ 22%
125-200% FPL    ██ 12%         Mandarin    █ 5%
Above 200% FPL  █ 7%           Other       █ 6%
```

### Partner Performance Table

| Partner Organization | State | Cases This Quarter | Avg Resolution Rate | Partner NPS |
|---|---|---|---|---|
| Greater Boston Legal Svcs | MA | 423 | 72% | 68 |
| Bay Area Legal Aid | CA | 387 | 69% | 71 |
| Legal Aid of Western NY | NY | 341 | 74% | 65 |
| DC Bar Foundation | DC | 298 | 71% | 74 |
| Chicago Bar Foundation | IL | 276 | 68% | 62 |

---

## 9. Evaluation Framework

### Internal Evaluation: Quarterly Self-Assessment

Each quarter, the program team completes a 20-question rubric covering:
- **Access (5 questions):** Are we reaching the intended population? Is cost per case declining?
- **Quality (5 questions):** Are outcomes meeting targets? Is client satisfaction improving?
- **Scale (5 questions):** Are we growing at plan? Are new jurisdictions coming online?
- **Sustainability (5 questions):** Is the financial model working? Is the team healthy?

Rubric scores are shared with the board quarterly. Any domain scoring below 3/5 triggers a formal improvement plan.

### External Evaluation: Annual Third-Party Assessment

An independent evaluator conducts an annual program evaluation, including:
- Review of all impact data for the prior year
- Interviews with 20+ clients across 5+ partner organizations
- Site visits to 3–5 partner organizations
- Comparison of Justice OS outcomes to matched comparison group
- Published report made publicly available

### Academic Partnerships

Justice OS actively supports IRB-approved research studies on access-to-justice outcomes:

- **University partnerships:** Harvard Law School Access to Justice Lab, Stanford Legal Design Lab, Georgetown Law Center on Poverty and Inequality
- **Data sharing agreements:** Anonymized, aggregate data shared with academic partners under formal data use agreements
- **Research agenda:** Priority questions include: What types of legal issues benefit most from technology-assisted services? Does early intervention change long-term outcomes?

### Randomized Evaluation Opportunities

For major product interventions (new features, service models), we design randomized or quasi-experimental evaluations where ethically feasible:
- A/B tests of different intake question sequences and their effect on case completion
- Staged rollouts of new AI-assisted features to measure outcome impact vs. control
- Geographic rollout sequencing that enables difference-in-differences analysis

### Publication Strategy

- All research produced with Justice OS data is published open access
- Pre-registration of study designs on OSF.io before data collection
- Annual submission to the Journal of Access to Justice and/or Law and Social Inquiry
- Presentations at NLADA Annual Conference and State Bar access-to-justice symposia

---

## 10. Data Collection Tools & Integrations

### Platform-Native Analytics

The Justice OS platform collects the following metrics automatically (no additional integration required):

| Data Element | Collection Method | Storage | Retention |
|---|---|---|---|
| Case creation / status changes | API event stream | PostgreSQL | 7 years |
| Document generation events | API event stream | PostgreSQL | 7 years |
| User session data (anonymized) | Client-side SDK | Mixpanel | 2 years |
| API response times | Server-side telemetry | DataDog | 90 days |
| Feature usage patterns | Event tracking | Mixpanel | 2 years |

### Survey Infrastructure

- **Typeform (intake surveys):** Embedded in the Justice OS intake flow; conditional logic based on case type; available in 7 languages; responses fed automatically to BigQuery
- **SurveyMonkey (outcome follow-up):** 90-day and 12-month follow-up surveys sent via SMS and email; longitudinal tracking linked to case ID (anonymized)

### Partner Reporting

Partners submit monthly data via a standardized Google Form:
- Total cases opened, closed, and pending
- Cases by type and outcome
- Client demographic summary (aggregated)
- Attorney hours contributed
- Notable challenges or successes

Data from all partners is consolidated in BigQuery within 24 hours of submission.

### Government & Court Data Integration

Where available:
- **Court records:** Electronic court records accessed via state e-filing system APIs (currently: CA, NY, IL, TX, FL)
- **Benefits enrollment data:** Medicaid and SNAP enrollment confirmation from state agencies (data sharing agreement required)
- **Legal aid program data:** LSC annual grantee data matched against Justice OS service area

### Impact Data Architecture

```typescript
// Core impact event interface (TypeScript)
interface ImpactEvent {
  eventId: string;                    // UUID
  eventType: ImpactEventType;         // enum: INTAKE | DOCUMENT | CASE_CLOSED | OUTCOME
  timestamp: Date;
  caseId: string;                     // anonymized case identifier
  organizationId: string;             // partner organization
  jurisdiction: string;               // state/territory code
  caseType: CaseType;                 // enum: FAMILY | HOUSING | IMMIGRATION | BENEFITS | OTHER
  clientDemographics: {
    incomeBand: IncomeBand;           // enum: BELOW_100FPL | 100_125FPL | etc.
    primaryLanguage: string;          // ISO 639-1 language code
    isRural: boolean;
  };
  outcome?: {
    outcomeType: OutcomeType;         // enum: FAVORABLE | ADVERSE | NEUTRAL | PENDING
    daysToResolution?: number;
    clientSatisfactionScore?: number; // 1-10
  };
}
```

All ImpactEvents flow into the central BigQuery data warehouse within 5 minutes via a Pub/Sub event pipeline. The warehouse powers all impact dashboards, partner reports, and external research data requests.

---

*Justice OS Impact Measurement Framework · Version 1.0 · impact.justice-os.com*
