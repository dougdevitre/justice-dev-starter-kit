# Advanced Analytics & Metrics Setup Guide — Justice OS

> **Comprehensive Dashboard Setup + SQL Queries for Data-Driven Decision Making**

---

## Overview

This guide covers the setup and configuration of all analytics tools used by Justice OS and CoTrackPro, including website analytics, product analytics, revenue tracking, community health monitoring, and custom dashboards.

**Analytics Stack:**

| Tool | Purpose | Status |
|------|---------|--------|
| Google Analytics 4 | Website traffic + acquisition | Configure first |
| Mixpanel | Product usage + user journeys | Configure second |
| Stripe Dashboard | Revenue + billing metrics | Configure third |
| GitHub Insights | Community + open-source health | Native; configure alerts |
| Salesforce / Pipedrive | Sales pipeline + CRM | Configure fourth |
| Metabase | Custom dashboards + SQL queries | Configure last |

---

## Dashboard 1: User Acquisition

### Google Analytics 4 Setup

**Step 1: Create GA4 Property**
1. Go to analytics.google.com → Create Property
2. Choose "Web" as platform
3. Set up data stream for justiceos.dev
4. Copy Measurement ID (G-XXXXXXXXXX)

**Step 2: Install in Next.js**

```typescript
// src/lib/analytics.ts
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID;

export const pageview = (url: string) => {
  window.gtag('config', GA_MEASUREMENT_ID, { page_path: url });
};

export const event = (action: string, params: Record<string, unknown>) => {
  window.gtag('event', action, params);
};
```

```typescript
// src/app/layout.tsx — add inside <head>
<Script
  strategy="afterInteractive"
  src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
/>
<Script id="google-analytics" strategy="afterInteractive">
  {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${GA_MEASUREMENT_ID}');
  `}
</Script>
```

**Step 3: Key Events to Track**

| Event Name | Trigger | Parameters |
|-----------|---------|-----------|
| `sign_up` | User registers | `{ method: 'email' | 'github' }` |
| `trial_start` | Starts free trial | `{ plan: string }` |
| `demo_request` | Clicks "Request Demo" | `{ source: string }` |
| `download_resource` | Downloads PDF/guide | `{ resource_name: string }` |
| `pricing_view` | Views pricing page | `{ referrer: string }` |
| `contact_submit` | Submits contact form | `{ form_type: string }` |

**Step 4: GA4 Acquisition Report Queries**

```sql
-- Top acquisition sources this month (BigQuery export)
SELECT
  traffic_source.source AS source,
  traffic_source.medium AS medium,
  COUNT(DISTINCT user_pseudo_id) AS users,
  COUNT(DISTINCT session_id) AS sessions,
  AVG(engagement_time_msec) / 1000 AS avg_engagement_sec
FROM `project.analytics_XXXXXXXXX.events_*`
WHERE _TABLE_SUFFIX BETWEEN FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY))
  AND FORMAT_DATE('%Y%m%d', CURRENT_DATE())
GROUP BY 1, 2
ORDER BY users DESC
LIMIT 20;
```

---

## Dashboard 2: Revenue Dashboard

### Stripe Setup

**Step 1: Configure Stripe Webhooks**

```typescript
// src/app/api/webhooks/stripe/route.ts
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const relevantEvents = new Set([
  'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted',
  'invoice.payment_succeeded',
  'invoice.payment_failed',
]);

export async function POST(req: Request) {
  const sig = req.headers.get('stripe-signature')!;
  const body = await req.text();
  const event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);

  if (relevantEvents.has(event.type)) {
    await handleStripeEvent(event);
  }

  return new Response(JSON.stringify({ received: true }));
}
```

**Step 2: Revenue Metrics SQL (Metabase)**

```sql
-- Monthly Recurring Revenue (MRR)
SELECT
  DATE_TRUNC('month', created_at) AS month,
  SUM(amount) / 100.0 AS mrr_usd,
  COUNT(DISTINCT customer_id) AS paying_customers
FROM subscriptions
WHERE status = 'active'
  AND interval = 'month'
GROUP BY 1
ORDER BY 1 DESC;

-- Annual Recurring Revenue (ARR)
SELECT
  SUM(amount * (CASE WHEN interval = 'month' THEN 12 ELSE 1 END)) / 100.0 AS arr_usd
FROM subscriptions
WHERE status = 'active';

-- Monthly Churn Rate
SELECT
  month,
  churned_customers,
  previous_customers,
  ROUND(churned_customers::numeric / NULLIF(previous_customers, 0) * 100, 2) AS churn_rate_pct
FROM (
  SELECT
    DATE_TRUNC('month', canceled_at) AS month,
    COUNT(*) AS churned_customers,
    LAG(COUNT(DISTINCT customer_id)) OVER (ORDER BY DATE_TRUNC('month', canceled_at)) AS previous_customers
  FROM subscriptions
  WHERE canceled_at IS NOT NULL
  GROUP BY 1
) t
ORDER BY month DESC;

-- MRR Movement (New, Expansion, Contraction, Churn)
SELECT
  month,
  SUM(CASE WHEN change_type = 'new' THEN amount ELSE 0 END) AS new_mrr,
  SUM(CASE WHEN change_type = 'expansion' THEN amount ELSE 0 END) AS expansion_mrr,
  SUM(CASE WHEN change_type = 'contraction' THEN amount ELSE 0 END) AS contraction_mrr,
  SUM(CASE WHEN change_type = 'churn' THEN amount ELSE 0 END) AS churned_mrr
FROM mrr_movements
GROUP BY month
ORDER BY month DESC;
```

**Key Stripe Dashboard Views:**
- MRR / ARR trend (last 12 months)
- New subscriptions per day
- Failed payments + dunning status
- Revenue by plan tier
- Net revenue retention (NRR)

---

## Dashboard 3: Product Usage (Mixpanel)

### Mixpanel Setup

**Step 1: Install Mixpanel SDK**

```bash
npm install mixpanel-browser
```

```typescript
// src/lib/mixpanel.ts
import mixpanel from 'mixpanel-browser';

mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_TOKEN!, {
  debug: process.env.NODE_ENV === 'development',
  track_pageview: true,
  persistence: 'localStorage',
});

export const track = (event: string, props?: Record<string, unknown>) => {
  mixpanel.track(event, props);
};

export const identify = (userId: string, traits?: Record<string, unknown>) => {
  mixpanel.identify(userId);
  if (traits) mixpanel.people.set(traits);
};
```

**Step 2: Key Product Events**

```typescript
// Case management events
track('Case Created', { caseType, jurisdiction, isProSe });
track('Case Updated', { caseId, fieldsChanged: fields.length });
track('Document Generated', { caseId, documentType, pageCount });
track('Deadline Added', { caseId, deadlineType, daysUntilDue });

// User journey events
track('Onboarding Completed', { stepsCompleted, timeToComplete });
track('Feature Discovered', { featureName, discoveryMethod });
track('Integration Connected', { integrationName });
track('Support Ticket Opened', { category, priority });
```

**Step 3: Mixpanel Funnels**

| Funnel | Steps | Target Conversion |
|--------|-------|------------------|
| Signup → Active User | Register → Create Case → Add Document | 40% |
| Trial → Paid | Trial Start → Feature Used → Upgrade | 25% |
| Free → Nonprofit | Free Register → Upgrade to Nonprofit | 15% |
| Onboarding | Account Setup → Invite Team → First Case | 60% |

**Step 4: Retention Cohorts**

Configure in Mixpanel:
- D1 retention (next day after signup)
- D7 retention
- D30 retention
- W4–W12 weekly retention cohorts

**Target:** 40%+ D30 retention

---

## Dashboard 4: Community Health

### GitHub Insights Automation

**Step 1: GitHub Actions — Weekly Community Report**

```yaml
# .github/workflows/community-metrics.yml
name: Weekly Community Metrics
on:
  schedule:
    - cron: '0 9 * * MON'

jobs:
  metrics:
    runs-on: ubuntu-latest
    steps:
      - uses: lowlighter/metrics@latest
        with:
          token: ${{ secrets.METRICS_TOKEN }}
          user: dougdevitre
          template: classic
          base: activity, community, repositories
          plugin_contributors: yes
          plugin_issues: yes
          plugin_traffic: yes
```

**Step 2: Community Metrics SQL (from GitHub API → Postgres)**

```sql
-- Active contributors (last 30 days)
SELECT
  COUNT(DISTINCT author_login) AS active_contributors,
  SUM(additions) AS lines_added,
  SUM(deletions) AS lines_removed,
  COUNT(*) AS total_prs_merged
FROM pull_requests
WHERE merged_at > NOW() - INTERVAL '30 days'
  AND merged_at IS NOT NULL;

-- New contributor funnel
SELECT
  DATE_TRUNC('month', first_contribution_date) AS month,
  COUNT(*) AS new_contributors,
  COUNT(CASE WHEN second_contribution_date IS NOT NULL THEN 1 END) AS retained_contributors,
  ROUND(COUNT(CASE WHEN second_contribution_date IS NOT NULL THEN 1 END)::numeric /
        NULLIF(COUNT(*), 0) * 100, 1) AS retention_pct
FROM (
  SELECT
    author_login,
    MIN(merged_at) AS first_contribution_date,
    NULLIF(
      MIN(CASE WHEN pr_rank > 1 THEN merged_at END),
      NULL
    ) AS second_contribution_date
  FROM (
    SELECT
      author_login,
      merged_at,
      ROW_NUMBER() OVER (PARTITION BY author_login ORDER BY merged_at) AS pr_rank
    FROM pull_requests
    WHERE merged_at IS NOT NULL
  ) ranked
  GROUP BY author_login
) funnel
GROUP BY month
ORDER BY month DESC;

-- Module health score
SELECT
  repo_name,
  days_since_last_commit,
  open_issues,
  open_prs,
  CASE
    WHEN days_since_last_commit < 7 AND open_prs < 5 THEN 'Healthy'
    WHEN days_since_last_commit < 30 THEN 'Active'
    WHEN days_since_last_commit < 90 THEN 'Slow'
    ELSE 'Stale'
  END AS health_status
FROM module_metrics
ORDER BY health_status, days_since_last_commit;
```

---

## Dashboard 5: Content Performance

### Content Analytics Setup

**Step 1: UTM Parameter Convention**

All links in marketing materials use consistent UTM parameters:

```
https://justiceos.dev/[path]?utm_source=[source]&utm_medium=[medium]&utm_campaign=[campaign]&utm_content=[content]
```

| Parameter | Values |
|-----------|--------|
| `utm_source` | `newsletter`, `twitter`, `linkedin`, `conference`, `podcast`, `email` |
| `utm_medium` | `social`, `email`, `organic`, `referral`, `paid` |
| `utm_campaign` | `product-launch`, `q1-outreach`, `case-study-[name]` |
| `utm_content` | `cta-button`, `hero-link`, `footer-link` |

**Step 2: Content Performance SQL**

```sql
-- Top performing content by leads generated
SELECT
  page_path,
  page_title,
  COUNT(DISTINCT session_id) AS sessions,
  COUNT(DISTINCT CASE WHEN event_name = 'sign_up' THEN user_id END) AS signups,
  COUNT(DISTINCT CASE WHEN event_name = 'demo_request' THEN user_id END) AS demo_requests,
  ROUND(
    COUNT(DISTINCT CASE WHEN event_name IN ('sign_up','demo_request') THEN user_id END)::numeric /
    NULLIF(COUNT(DISTINCT session_id), 0) * 100, 2
  ) AS conversion_rate_pct
FROM page_views
LEFT JOIN events USING (session_id)
WHERE created_at > NOW() - INTERVAL '90 days'
GROUP BY page_path, page_title
ORDER BY signups DESC
LIMIT 20;
```

---

## Dashboard 6: Sales Pipeline

### CRM Setup (Pipedrive)

**Step 1: Pipeline Stages**

| Stage | Definition | Target Days in Stage |
|-------|-----------|---------------------|
| Lead | Identified prospect | — |
| Qualified | Discovery call done, BANT confirmed | 7 |
| Demo | Demo scheduled or completed | 14 |
| Proposal | Proposal sent | 7 |
| Negotiation | Legal/procurement review | 21 |
| Closed Won | Contract signed | — |
| Closed Lost | No longer pursuing | — |

**Step 2: Sales Pipeline SQL**

```sql
-- Current pipeline by stage
SELECT
  stage,
  COUNT(*) AS deals,
  SUM(deal_value) AS total_value,
  AVG(days_in_stage) AS avg_days_in_stage,
  SUM(deal_value * probability) AS weighted_pipeline
FROM deals
WHERE stage NOT IN ('Closed Won', 'Closed Lost')
GROUP BY stage
ORDER BY stage_order;

-- Win rate by source
SELECT
  lead_source,
  COUNT(*) AS total_deals,
  COUNT(CASE WHEN stage = 'Closed Won' THEN 1 END) AS won,
  ROUND(
    COUNT(CASE WHEN stage = 'Closed Won' THEN 1 END)::numeric /
    NULLIF(COUNT(*), 0) * 100, 1
  ) AS win_rate_pct,
  AVG(CASE WHEN stage = 'Closed Won' THEN deal_value END) AS avg_deal_size
FROM deals
WHERE stage IN ('Closed Won', 'Closed Lost')
  AND closed_at > NOW() - INTERVAL '365 days'
GROUP BY lead_source
ORDER BY win_rate_pct DESC;
```

---

## Dashboard 7: Enterprise Customer Health

### Customer Success Metrics

**Step 1: Health Score Calculation**

```typescript
// src/lib/customer-health.ts
interface CustomerHealthScore {
  customerId: string;
  score: number;       // 0–100
  status: 'Healthy' | 'At Risk' | 'Critical';
  signals: Record<string, number>;
}

export function calculateHealthScore(metrics: CustomerMetrics): CustomerHealthScore {
  const signals = {
    loginFrequency: metrics.loginsLast30Days >= 20 ? 25 : metrics.loginsLast30Days >= 10 ? 15 : 5,
    featureAdoption: Math.min(25, (metrics.featuresUsed / metrics.totalFeatures) * 25),
    supportTickets: metrics.openSupportTickets === 0 ? 15 : metrics.openSupportTickets <= 2 ? 10 : 0,
    paymentHealth: metrics.paymentStatus === 'current' ? 20 : 0,
    npsScore: metrics.npsScore >= 8 ? 15 : metrics.npsScore >= 6 ? 8 : 0,
  };

  const score = Object.values(signals).reduce((a, b) => a + b, 0);
  const status = score >= 70 ? 'Healthy' : score >= 40 ? 'At Risk' : 'Critical';

  return { customerId: metrics.customerId, score, status, signals };
}
```

**Step 2: Enterprise Health Dashboard SQL**

```sql
-- Enterprise customer health overview
SELECT
  c.company_name,
  c.plan_tier,
  c.mrr,
  c.contract_renewal_date,
  c.nps_score,
  cs.health_score,
  cs.status AS health_status,
  cs.last_login_date,
  cs.features_adopted,
  cs.open_support_tickets,
  CASE
    WHEN c.contract_renewal_date < NOW() + INTERVAL '60 days' THEN 'Renewal Alert'
    ELSE 'Normal'
  END AS renewal_flag
FROM customers c
JOIN customer_health_scores cs ON c.id = cs.customer_id
WHERE c.plan_tier = 'enterprise'
ORDER BY cs.health_score ASC;
```

---

## Metabase Custom Dashboard Setup

### Installation

```bash
# Docker Compose
services:
  metabase:
    image: metabase/metabase:latest
    ports:
      - "3001:3000"
    environment:
      MB_DB_TYPE: postgres
      MB_DB_HOST: db
      MB_DB_PORT: 5432
      MB_DB_DBNAME: metabase
      MB_DB_USER: metabase
      MB_DB_PASS: ${METABASE_DB_PASSWORD}
```

### Dashboard Layout

**Executive Dashboard (Weekly Review):**
- Row 1: MRR, ARR, MoM growth, Active customers
- Row 2: New signups this week, Demos scheduled, Pipeline value
- Row 3: Active contributors (GitHub), Community call attendance
- Row 4: Churn alerts, At-risk customers

**Product Dashboard (Daily Check):**
- Row 1: DAU, WAU, MAU, D30 retention
- Row 2: Feature adoption rates (top 10 features)
- Row 3: Onboarding funnel completion
- Row 4: Error rates, support ticket volume

---

## Alerting Setup

### Recommended Alerts

| Alert | Threshold | Channel |
|-------|---------|---------|
| MRR drops > 5% MoM | < -5% | Slack #finance |
| Payment failure spike | > 3 failures/day | Slack #billing |
| Customer health drops to Critical | Any | Slack #csm |
| Server error rate | > 1% | PagerDuty |
| GitHub CI failure | Any on main | Slack #engineering |
| New enterprise signup | Any | Slack #sales |
| Community PR open > 7 days unreviewed | 7 days | Slack #contributors |
