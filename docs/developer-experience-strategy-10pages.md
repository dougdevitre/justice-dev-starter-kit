# Developer Experience Strategy
## Justice OS — Building the Best Developer Experience in Legal Technology

**Version:** 1.0  
**Audience:** Engineering Leadership, Developer Relations, Partner Teams  
**Last Updated:** 2025

---

## Table of Contents

1. [Developer Experience Philosophy](#1-developer-experience-philosophy)
2. [SDK Design Principles](#2-sdk-design-principles)
3. [Documentation Strategy](#3-documentation-strategy)
4. [Code Examples & Tutorials](#4-code-examples--tutorials)
5. [Community Forums & Support Setup](#5-community-forums--support-setup)
6. [Developer Feedback Loop](#6-developer-feedback-loop)
7. [Integration Testing Tools](#7-integration-testing-tools)
8. [CI/CD for Partners — GitHub Actions Templates](#8-cicd-for-partners--github-actions-templates)
9. [Developer Onboarding: < 30 Minutes to First API Call](#9-developer-onboarding--30-minutes-to-first-api-call)
10. [Developer Events & Bootcamps Calendar](#10-developer-events--bootcamps-calendar)
11. [Developer Certification Program](#11-developer-certification-program)

---

## 1. Developer Experience Philosophy

Developer experience (DX) is not a luxury at Justice OS — it is a force multiplier for our mission. Every hour a developer wastes fighting our API is an hour not spent building tools that help real people navigate the legal system. Our DX philosophy is grounded in a single, measurable commitment: **Time to first API call must be under 30 minutes**, from account creation to receiving a valid API response.

### Core Principles

- **Developer empathy is non-negotiable.** We document every rough edge before we fix it. When a developer gets stuck, that is a product bug, not a documentation gap. Every friction point reported — whether in a GitHub issue, Discord message, or informal conversation — gets logged and triaged. Friction points that affect more than 5 developers automatically enter the next sprint.

- **Open source first.** Every SDK example, every integration template, and every tutorial lives in a public GitHub repository. We don't hide complexity behind paywalls or proprietary tooling. Contributions to our documentation and SDKs are welcomed, reviewed within 48 hours, and celebrated publicly.

- **Developer success is Justice OS success.** We measure DX success quantitatively: time-to-first-API-call, developer NPS, SDK download growth, and integration completion rate. A developer who successfully ships an integration is a developer who expands access to justice. Our developer relations team has an impact metric, not just an engagement metric.

- **Iterate visibly.** When we improve the DX, we announce it. When we introduce breaking changes, we provide migration guides with automated codemods wherever possible. Our developers should always feel like we are working *with* them, not around them.

---

## 2. SDK Design Principles

The Justice OS SDK is the primary interface between our platform and the developer community. A well-designed SDK eliminates cognitive overhead and lets developers focus on their legal-technology product rather than our internal architecture. We hold our SDKs to five foundational design principles.

### Principle 1: Minimal Surface Area

Don't expose complexity. Every method, class, and parameter in a public SDK API is a commitment we must maintain forever. Before adding a new API surface, ask: does the developer *need* to know this, or are we exposing internal implementation detail? Internal concepts like tenant sharding, API version routing, and connection pooling are handled invisibly by the SDK. Developers interact with legal concepts: cases, parties, documents, hearings.

### Principle 2: Sensible Defaults

The SDK must work out of the box for the most common 80% of use cases. Configuration should be opt-in, not opt-out. Retry logic, timeout handling, rate limit backoff, and connection keep-alive are all configured automatically. The only required input to get started is an API key.

### Principle 3: Explicit Over Implicit

No magic. When the SDK does something non-obvious — caches a result, batches a request, transforms data — it documents that behavior in the method's JSDoc/docstring and provides an escape hatch to override. Developers should never be surprised by what the SDK does on their behalf.

### Principle 4: Consistent Naming Conventions

- **JavaScript/TypeScript (primary SDK):** `camelCase` for methods and properties (`createCase`, `addParty`, `generateDocument`)
- **Python SDK:** `snake_case` for methods and attributes (`create_case`, `add_party`, `generate_document`)
- **Ruby SDK:** `snake_case` following Ruby conventions
- **Go SDK:** `PascalCase` for exported functions, `camelCase` for unexported

Resource names are always singular nouns (`Case`, `Party`, `Document`, `Hearing`). Collection methods use `list`, not `getAll`, `fetch`, or `query`. Create methods always return the created resource. Update methods return the updated resource.

### Principle 5: Error Messages That Tell You Exactly What to Fix

Vague errors destroy developer trust. Every error thrown by the SDK includes:

- A human-readable message describing what went wrong
- The field or parameter that caused the error (where applicable)
- A link to the relevant documentation page
- An `errorCode` string that can be programmatically handled

### SDK Availability

| Language | Package | Status | Weekly Downloads |
|---|---|---|---|
| JavaScript/TypeScript | `@justice-os/sdk` (npm) | GA | Primary |
| Python | `justice-os` (PyPI) | GA | Secondary |
| Ruby | `justice_os` (RubyGems) | Beta | Tertiary |
| Go | `github.com/justice-os/go-sdk` | Beta | Tertiary |

### Good vs. Bad SDK Design

```javascript
// ❌ Bad: requires understanding internal architecture
const client = new JusticeOSClient({
  tenantId: 'ten_abc123',
  apiKey: 'sk_live_...',
  baseUrl: 'https://api.justice-os.com',
  timeout: 5000,
  retries: 3
})
await client.caseManager.v2.cases.create({ ... })

// ✅ Good: sensible defaults, simple interface
const justice = createClient({ apiKey: process.env.JUSTICE_OS_API_KEY })
await justice.cases.create({ title: 'Smith v. Jones', type: 'family_law' })
```

The difference is not cosmetic. The "bad" example forces the developer to understand internal versioning (`v2`), subsystem routing (`caseManager`), and infrastructure configuration (`baseUrl`, `timeout`) before they can write a single line of business logic. The "good" example lets them express legal intent directly.

---

## 3. Documentation Strategy

Justice OS documentation follows the **Diátaxis framework** — a principled approach to technical documentation that separates four distinct documentation types by user need and usage context. Conflating these types is the most common cause of documentation that is simultaneously comprehensive and impossible to use.

### Documentation Types (Diátaxis)

| Type | Purpose | User Need | Example |
|---|---|---|---|
| **Tutorials** | Learning-oriented | "I want to learn" | "Build your first intake form" |
| **How-to Guides** | Task-oriented | "I want to do X" | "How to send a webhook" |
| **Reference** | Information-oriented | "I need to know Y" | API endpoint reference |
| **Explanation** | Understanding-oriented | "I want to understand Z" | "How case versioning works" |

### Tooling

- **Docusaurus** (v3): primary documentation site at `docs.justice-os.com`
- **TypeDoc**: auto-generated API reference from TypeScript source code, published on every release
- **Postman Collections**: 100+ pre-configured requests, published to the Postman Public API Network
- **OpenAPI 3.1 spec**: machine-readable API definition, drives SDK generation via `openapi-generator`
- **Playwright**: automated screenshot capture for UI-related docs, re-runs on every release

### Writing Standards

Every documentation page must meet these standards before merging:

- **Plain language**: aim for Flesch-Kincaid Grade 8 or below
- **Code examples in every section**: every concept must be illustrated with a working code snippet
- **Copy-paste ready**: every code block must run without modification (using environment variable placeholders)
- **Tested**: code examples are executed in CI against the sandbox environment
- **Dated**: tutorials include a "Last verified: [date]" badge updated automatically by CI

### Documentation Testing

```yaml
# .github/workflows/docs-ci.yml (excerpt)
- name: Check broken links
  uses: gaurav-nelson/github-action-markdown-link-check@v1

- name: Test code examples
  run: |
    cd docs/examples
    npm install
    JUSTICE_OS_API_KEY=${{ secrets.SANDBOX_API_KEY }} npm test
```

### Maintenance Schedule

- **Quarterly documentation review**: each team owns a section; reviews for accuracy, completeness, and freshness
- **"Last verified" dates**: tutorials that haven't been verified in 90+ days display a warning badge
- **Deprecation process**: deprecated APIs are flagged in documentation 6 months before removal, with migration guide linked inline

### Community Contributions

Documentation is treated as code. All contributions follow the same PR workflow as code:

1. Fork the `justice-os/docs` repository
2. Make changes in a feature branch
3. CI runs link checker and code example tests automatically
4. Documentation team reviews within 48 hours
5. Merged contributions earn the `docs-contributor` badge in Discord

**Documentation bounties** are available for high-priority gaps: $50-$500 USDC for completing a tutorial or how-to guide identified in our [documentation roadmap](https://github.com/justice-os/docs/issues?q=label%3Abounty).

### Documentation Structure

```
docs/
├── getting-started/        # < 30 min tutorials for new developers
│   ├── quickstart.md
│   ├── authentication.md
│   └── first-case.md
├── guides/                 # task-based how-to guides
│   ├── document-generation.md
│   ├── webhooks.md
│   └── bulk-import.md
├── reference/              # complete API reference
│   ├── cases.md
│   ├── parties.md
│   └── documents.md
├── concepts/               # explanations and architecture
│   ├── data-model.md
│   ├── permissions.md
│   └── case-lifecycle.md
├── sdks/                   # SDK-specific documentation
│   ├── javascript.md
│   ├── python.md
│   └── ruby.md
└── integrations/           # partner integration guides
    ├── docusign.md
    ├── twilio.md
    └── salesforce.md
```

---

## 4. Code Examples & Tutorials

### Example 1: Create Your First Case

This tutorial walks you from zero to a fully created legal case with a party and uploaded document in under 10 minutes.

**Step 1: Install the SDK**

```bash
npm install @justice-os/sdk
```

**Step 2: Authenticate**

```bash
# Test authentication with curl
curl https://api.justice-os.com/v1/me \
  -H "Authorization: Bearer $JUSTICE_OS_API_KEY"
# Expected: {"id": "usr_...", "email": "you@example.com"}
```

```javascript
// authenticate.js
import { createClient } from '@justice-os/sdk'

const justice = createClient({ apiKey: process.env.JUSTICE_OS_API_KEY })
const me = await justice.users.me()
console.log(`Authenticated as: ${me.email}`)
```

**Step 3: Create a Case**

```bash
curl -X POST https://api.justice-os.com/v1/cases \
  -H "Authorization: Bearer $JUSTICE_OS_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"title": "Smith v. Jones", "type": "family_law", "jurisdiction": "CA"}'
```

```javascript
const newCase = await justice.cases.create({
  title: 'Smith v. Jones',
  type: 'family_law',
  jurisdiction: 'CA'
})
console.log(`Case created: ${newCase.id}`)
// Output: Case created: cas_01HXYZ...
```

**Step 4: Add a Party**

```javascript
const party = await justice.cases.parties.create(newCase.id, {
  role: 'petitioner',
  firstName: 'Jane',
  lastName: 'Smith',
  email: 'jane.smith@example.com'
})
console.log(`Party added: ${party.id}`)
```

**Step 5: Upload a Document**

```javascript
import { readFileSync } from 'fs'

const document = await justice.cases.documents.upload(newCase.id, {
  file: readFileSync('./petition.pdf'),
  filename: 'petition.pdf',
  type: 'petition'
})
console.log(`Document uploaded: ${document.id}`)
```

---

### Example 2: Build a Legal Intake Form

This example builds a multi-step React intake form that collects client information, guides the user through qualifying questions, and creates a Justice OS case on submission.

```jsx
// IntakeForm.jsx
import { useState } from 'react'
import { createClient } from '@justice-os/sdk'

const justice = createClient({ apiKey: process.env.NEXT_PUBLIC_JUSTICE_OS_KEY })

const STEPS = ['contact', 'legal-issue', 'income', 'review']

export function IntakeForm() {
  const [step, setStep] = useState(0)
  const [formData, setFormData] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const updateField = (field, value) =>
    setFormData(prev => ({ ...prev, [field]: value }))

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      const newCase = await justice.cases.create({
        title: `${formData.firstName} ${formData.lastName} — ${formData.legalIssueType}`,
        type: formData.legalIssueType,
        jurisdiction: formData.state,
        client: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          annualIncome: formData.annualIncome,
          householdSize: formData.householdSize
        }
      })
      window.location.href = `/confirmation?caseId=${newCase.id}`
    } catch (err) {
      console.error('Intake submission failed:', err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="intake-form">
      <StepIndicator steps={STEPS} current={step} />
      {step === 0 && <ContactStep data={formData} onChange={updateField} />}
      {step === 1 && <LegalIssueStep data={formData} onChange={updateField} />}
      {step === 2 && <IncomeStep data={formData} onChange={updateField} />}
      {step === 3 && <ReviewStep data={formData} onSubmit={handleSubmit} submitting={submitting} />}
      <FormNavigation
        step={step}
        totalSteps={STEPS.length}
        onBack={() => setStep(s => s - 1)}
        onNext={() => setStep(s => s + 1)}
      />
    </div>
  )
}
```

The `LegalIssueStep` component uses Justice OS's guided interview logic to surface relevant follow-up questions based on the selected legal issue type. For example, selecting `housing` triggers income verification questions required for eligibility screening.

---

### Example 3: Implement Document Generation

This Python example loads a Jinja2 template, fills it with case data pulled from the Justice OS API, generates a PDF, and uploads the result back to the case dossier.

```python
# generate_document.py
import os
from justice_os import Client
from jinja2 import Environment, FileSystemLoader
from weasyprint import HTML
import tempfile

justice = Client(api_key=os.environ["JUSTICE_OS_API_KEY"])

def generate_summons(case_id: str) -> str:
    """Generate a summons PDF from case data and upload to dossier."""
    # 1. Fetch case data
    case = justice.cases.get(case_id)
    petitioner = next(p for p in case.parties if p.role == "petitioner")
    respondent = next(p for p in case.parties if p.role == "respondent")

    # 2. Render HTML template
    env = Environment(loader=FileSystemLoader("templates/"))
    template = env.get_template("summons.html.j2")
    html_content = template.render(
        case_number=case.case_number,
        court=case.jurisdiction.court_name,
        petitioner_name=f"{petitioner.first_name} {petitioner.last_name}",
        respondent_name=f"{respondent.first_name} {respondent.last_name}",
        filing_date=case.created_at.strftime("%B %d, %Y")
    )

    # 3. Generate PDF
    pdf_bytes = HTML(string=html_content).write_pdf()

    # 4. Upload to case dossier
    document = justice.cases.documents.upload(
        case_id=case_id,
        file=pdf_bytes,
        filename=f"summons_{case.case_number}.pdf",
        document_type="summons",
        generated_by="document-automation"
    )

    print(f"Summons generated and uploaded: {document.id}")
    return document.id

if __name__ == "__main__":
    generate_summons(case_id="cas_01HXYZ...")
```

---

### Example 4: Set Up Real-Time Notifications

This Node.js example establishes a WebSocket connection to the Justice OS event stream, handles reconnection with exponential backoff, and maps incoming events to application-specific handlers.

```javascript
// notifications.js
import WebSocket from 'ws'

const JUSTICE_OS_WS = 'wss://events.justice-os.com/v1/stream'
const EVENT_HANDLERS = {
  'case.status_changed': onCaseStatusChanged,
  'document.uploaded': onDocumentUploaded,
  'hearing.scheduled': onHearingScheduled,
  'message.received': onMessageReceived
}

function connect(apiKey, attempt = 0) {
  const ws = new WebSocket(JUSTICE_OS_WS, {
    headers: { Authorization: `Bearer ${apiKey}` }
  })

  ws.on('open', () => {
    console.log('Connected to Justice OS event stream')
    attempt = 0 // reset backoff on successful connection

    // Subscribe to specific case events
    ws.send(JSON.stringify({
      action: 'subscribe',
      filters: { caseTypes: ['family_law', 'housing'], orgId: 'org_...' }
    }))
  })

  ws.on('message', (data) => {
    const event = JSON.parse(data)
    const handler = EVENT_HANDLERS[event.type]
    if (handler) {
      handler(event.payload)
    } else {
      console.warn(`Unhandled event type: ${event.type}`)
    }
  })

  ws.on('close', (code, reason) => {
    const delay = Math.min(1000 * 2 ** attempt, 30000) // max 30s backoff
    console.log(`Connection closed (${code}). Reconnecting in ${delay}ms...`)
    setTimeout(() => connect(apiKey, attempt + 1), delay)
  })

  ws.on('error', (err) => console.error('WebSocket error:', err.message))
}

function onCaseStatusChanged({ caseId, oldStatus, newStatus }) {
  console.log(`Case ${caseId}: ${oldStatus} → ${newStatus}`)
  // Trigger notification to assigned attorney
}

connect(process.env.JUSTICE_OS_API_KEY)
```

---

### Example 5: Query Case Analytics

This example uses the Justice OS GraphQL API to query analytics across a portfolio of cases, then parses the response to produce a summary report.

```graphql
# analytics-query.graphql
query CaseAnalytics($orgId: ID!, $dateRange: DateRangeInput!) {
  caseAnalytics(orgId: $orgId, dateRange: $dateRange) {
    byType {
      type
      count
      resolvedCount
      resolutionRate
      avgDaysToResolution
    }
    byOutcome {
      outcome
      count
      percentage
    }
    avgTimeToResolution {
      overall
      byType { type days }
    }
    clientDemographics {
      incomeBand { band count percentage }
      primaryLanguage { language count percentage }
    }
  }
}
```

```javascript
// run-analytics.js
import { createClient } from '@justice-os/sdk'

const justice = createClient({ apiKey: process.env.JUSTICE_OS_API_KEY })

const result = await justice.graphql({
  query: require('./analytics-query.graphql'),
  variables: {
    orgId: 'org_...',
    dateRange: { from: '2025-01-01', to: '2025-03-31' }
  }
})

const { caseAnalytics } = result.data

console.log('=== Q1 2025 Case Analytics ===')
console.table(caseAnalytics.byType.map(t => ({
  'Case Type': t.type,
  'Total': t.count,
  'Resolved': t.resolvedCount,
  'Resolution Rate': `${(t.resolutionRate * 100).toFixed(1)}%`,
  'Avg Days': t.avgDaysToResolution
})))

console.log('\n=== Outcomes ===')
caseAnalytics.byOutcome.forEach(o =>
  console.log(`  ${o.outcome}: ${o.count} cases (${o.percentage.toFixed(1)}%)`)
)
```

---

## 5. Community Forums & Support Setup

### Discord Server Structure

The Justice OS Discord server (`discord.gg/justice-os`) is the primary real-time community hub for developers, legal aid organizations, and advocates. Channels are organized by topic:

| Category | Channel | Purpose |
|---|---|---|
| **Community** | `#announcements` | Platform updates, releases, events |
| **Community** | `#general` | Open discussion |
| **Community** | `#introductions` | New member intros |
| **Support** | `#help` | General developer help |
| **Support** | `#help-javascript` | JS/TS SDK support |
| **Support** | `#help-python` | Python SDK support |
| **Support** | `#help-api` | API and REST questions |
| **Build** | `#showcase` | Share what you've built |
| **Build** | `#ideas` | Feature requests and ideas |
| **Contribute** | `#contributing` | Open source contribution coordination |
| **Contribute** | `#good-first-issues` | Curated issues for newcomers |
| **Domain** | `#legal-aid` | Legal aid organization discussions |
| **Domain** | `#courts` | Court system integration |
| **Domain** | `#ai-features` | AI-assisted legal tools discussion |
| **Domain** | `#document-assembly` | Document generation and templates |
| **Internal** | `#partner-lounge` | Verified integration partners |
| **Internal** | `#beta-testers` | Beta program participants |

### GitHub Discussions

GitHub Discussions at `github.com/justice-os/justice-os/discussions` is used for asynchronous, searchable community dialogue:

- **Q&A**: Technical questions with upvoting; answered questions become searchable knowledge base
- **Ideas**: Feature requests; top-voted ideas enter quarterly roadmap review
- **Show and Tell**: Community integrations, projects, and demos
- **General**: Announcements, community updates, off-topic conversation

### Community Moderation Guidelines

1. **Zero tolerance** for harassment, discrimination, or demeaning language toward any group
2. **No sharing** of client PII or case data in any community channel
3. **Constructive criticism** only — frame feedback as suggestions, not attacks
4. **Stay on topic** — direct off-topic conversations to `#general`
5. Moderators will issue one warning; repeat violations result in a 7-day ban; third violation is permanent

### Support Tiers

| Tier | Channel | Response Time | Cost | Best For |
|---|---|---|---|---|
| **Community** | Discord `#help` | Best effort | Free | Individuals, small orgs |
| **Standard** | GitHub Issues | 5 business days | Free | Bug reports, feature requests |
| **Professional** | Email support | 24 hours | Paid plan | Growing organizations |
| **Enterprise** | Priority Slack | 4 hours | Enterprise plan | Large deployments |
| **Mission-Critical** | Dedicated CSM | 1 hour | Custom | Courts, large legal aid |

### Community Metrics

| Metric | Target | Measurement |
|---|---|---|
| Discord median first response time | < 2 hours | Discord analytics |
| GitHub Issue resolution rate | > 80% within 30 days | GitHub API |
| Monthly active Discord members | 500+ by Year 1 | Discord analytics |
| Active contributors (monthly) | 50+ by Year 2 | GitHub contributors |
| Community NPS | 60+ | Quarterly survey |

---

## 6. Developer Feedback Loop

Shipping great developer experience is a continuous process, not a one-time initiative. The Justice OS feedback loop ensures developer pain points are captured, prioritized, and acted upon systematically.

### Monthly Developer Survey

Every month, active SDK users receive a 5-question survey (max 3 minutes):

1. **Overall satisfaction**: How satisfied are you with the Justice OS developer experience? (1-10)
2. **Biggest blocker**: What is the single biggest thing slowing you down as a developer on Justice OS?
3. **Documentation quality**: How would you rate the documentation quality? (1-5, with comment)
4. **Feature request**: What one feature or improvement would make the biggest difference to your work?
5. **NPS**: How likely are you to recommend Justice OS to a fellow developer? (0-10)

Results are published openly in the `#announcements` Discord channel. A public "DX Improvements" changelog documents every change driven by developer feedback.

### The Friction Log

Every time a developer reports getting stuck — in Discord, GitHub Issues, email, or office hours — the event is logged in our internal Friction Log (Linear board, `DX-FRICTION` tag). Each entry includes:

- The exact point of confusion or failure
- Time lost (estimated by developer)
- Number of developers who hit the same issue
- Assigned owner and target resolution sprint

Items with 3+ developer hits in the same quarter are automatically escalated to P1 priority.

### Office Hours

Every Tuesday, 12:00 PM PT: a 1-hour open Zoom session with 2+ core engineering team members. Developers can join without registration to ask questions, share work-in-progress, or get live debugging help. Sessions are recorded and posted to the `#office-hours` Discord channel within 2 hours.

### Beta Program

Before any major feature release, a cohort of 20 developers is selected from community volunteers to access the feature 4 weeks early. Beta participants are expected to:

- Use the feature in a real integration
- Submit at least one piece of written feedback
- Attend one beta debrief call

Beta participants receive `@beta-tester` Discord role, 6 months of Professional support, and attribution in the release blog post.

### Changelog & Migration Guides

Every release includes a public changelog at `justice-os.com/changelog`. Breaking changes include:

- A concrete before/after code migration example
- An automated codemod script where possible (`npx @justice-os/migrate@latest`)
- A deprecation timeline (minimum 6 months before removal)
- A migration guide linked from the changelog and from the deprecated API reference

### Developer Advisory Board

Five developers elected annually from the community to advise on roadmap, DX priorities, and community health. Board members meet monthly with the product team, receive early access to all features, and are credited as advisors in our documentation and website.

---

## 7. Integration Testing Tools

### Sandbox Environment Provisioning

Every registered developer account automatically receives a sandbox tenant within 5 minutes of sign-up. The sandbox is:

- **Isolated**: completely separate from production data
- **Full-featured**: all API endpoints available, with realistic mock data pre-loaded
- **Resettable**: one API call or button press to reset to a clean state
- **Free**: no cost, no credit card required, no approval process

```bash
# Reset your sandbox to default state
curl -X POST https://api.justice-os.com/v1/sandbox/reset \
  -H "Authorization: Bearer $JUSTICE_OS_SANDBOX_KEY"
# Completes in < 30 seconds
```

### Mock Data Generator

The `@justice-os/mock-data` package generates realistic legal data for testing:

```javascript
import { generateMockCase, generateMockParties } from '@justice-os/mock-data'

const mockCase = generateMockCase({ type: 'housing', jurisdiction: 'NY' })
const parties = generateMockParties({ count: 2, roles: ['tenant', 'landlord'] })

// Creates a fully realistic case with plausible names, addresses, dates
console.log(mockCase.title) // "Rodriguez v. Westside Properties LLC"
```

Generates: cases, parties, documents, hearings, attorneys, court records — all with internally consistent, jurisdiction-appropriate data.

### Postman Collection

The Justice OS Postman collection includes 100+ pre-configured API requests organized by resource. Available at:

- Postman Public API Network: search "Justice OS"
- Direct import: `https://api.justice-os.com/postman/collection.json`

Features:
- Environment templates for sandbox and production
- Pre-request scripts for authentication
- Test scripts that validate response schemas
- Example responses for every endpoint

### Integration Test Harness

```bash
# Install the test CLI
npm install -g @justice-os/test-cli

# Run the full intake test suite against sandbox
npx justice-os-test --env sandbox --suite intake

# Run document generation tests
npx justice-os-test --env sandbox --suite document-generation

# Run a specific test scenario
npx justice-os-test --env sandbox --test create-case-with-parties

# Generate a test report
npx justice-os-test --env sandbox --suite all --reporter html --output ./test-report.html
```

### Contract Testing with Pact

Consumer-driven contract tests ensure that SDK clients and the Justice OS API remain compatible as both evolve independently:

```javascript
// pact-test.spec.js
import { Pact } from '@pact-foundation/pact'
import { createClient } from '@justice-os/sdk'

const provider = new Pact({ consumer: 'MyLegalApp', provider: 'JusticeOS' })

describe('Cases API contract', () => {
  it('creates a case', async () => {
    await provider.addInteraction({
      state: 'authenticated user',
      uponReceiving: 'a request to create a case',
      withRequest: { method: 'POST', path: '/v1/cases' },
      willRespondWith: { status: 201, body: { id: like('cas_...'), title: like('Smith v. Jones') } }
    })
    const justice = createClient({ apiKey: 'test-key', baseUrl: provider.mockService.baseUrl })
    const result = await justice.cases.create({ title: 'Smith v. Jones', type: 'family_law' })
    expect(result.id).toMatch(/^cas_/)
  })
})
```

### Test Data Management

```bash
# Seed sandbox with a specific scenario
npx justice-os-seed --scenario high-volume-intake    # 500 cases across 10 organizations
npx justice-os-seed --scenario court-filing-deadline # Simulates deadline-day traffic patterns
npx justice-os-seed --scenario document-generation   # Cases with complex document templates

# Reset sandbox
npx justice-os-seed --reset
```

---

## 8. CI/CD for Partners — GitHub Actions Templates

### Template 1: Integration Testing on Pull Request

```yaml
# .github/workflows/justice-os-integration-tests.yml
name: Justice OS Integration Tests

on:
  pull_request:
    branches: [main, develop]
  push:
    branches: [main]

jobs:
  integration-test:
    name: Run Justice OS Integration Tests
    runs-on: ubuntu-latest
    timeout-minutes: 15

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Setup Justice OS Test Environment
        uses: justice-os/setup-test-env@v1
        with:
          api-key: ${{ secrets.JUSTICE_OS_SANDBOX_KEY }}
          reset-sandbox: true

      - name: Run unit tests
        run: npm run test:unit

      - name: Run integration tests
        run: npm run test:integration
        env:
          JUSTICE_OS_API_KEY: ${{ secrets.JUSTICE_OS_SANDBOX_KEY }}
          JUSTICE_OS_ENV: sandbox

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: test-results
          path: ./test-results/
```

### Template 2: Publishing to the Justice OS Integration Marketplace

```yaml
# .github/workflows/publish-integration.yml
name: Publish to Justice OS Marketplace

on:
  release:
    types: [published]

jobs:
  publish:
    name: Publish Integration
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Validate integration manifest
        uses: justice-os/validate-integration@v1
        with:
          manifest-path: ./justice-os-integration.json

      - name: Run compatibility tests
        uses: justice-os/compatibility-check@v1
        with:
          api-key: ${{ secrets.JUSTICE_OS_MARKETPLACE_KEY }}
          integration-version: ${{ github.event.release.tag_name }}

      - name: Publish to Marketplace
        uses: justice-os/publish-integration@v1
        with:
          api-key: ${{ secrets.JUSTICE_OS_MARKETPLACE_KEY }}
          version: ${{ github.event.release.tag_name }}
          changelog: ${{ github.event.release.body }}
```

### Template 3: Automated Compatibility Checks on Justice OS Releases

```yaml
# .github/workflows/justice-os-compat-check.yml
name: Justice OS Compatibility Check

on:
  repository_dispatch:
    types: [justice-os-release]  # Triggered by Justice OS webhook on new release
  schedule:
    - cron: '0 9 * * 1'          # Weekly Monday 9am check

jobs:
  compatibility:
    name: Check API Compatibility
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Check SDK version compatibility
        uses: justice-os/sdk-compat-check@v1
        with:
          api-key: ${{ secrets.JUSTICE_OS_SANDBOX_KEY }}

      - name: Run contract tests
        run: npm run test:contracts
        env:
          JUSTICE_OS_API_KEY: ${{ secrets.JUSTICE_OS_SANDBOX_KEY }}

      - name: Notify on failure
        if: failure()
        uses: slackapi/slack-github-action@v1.26.0
        with:
          payload: |
            {"text": "⚠️ Justice OS compatibility check failed on ${{ github.repository }}"}
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```

---

## 9. Developer Onboarding: < 30 Minutes to First API Call

### The 30-Minute Journey

| Minute | Activity | Where | What Happens |
|---|---|---|---|
| 0–5 | Sign up & get API key | `justice-os.com/signup` | Email + password → sandbox auto-provisioned → API key shown immediately |
| 5–10 | Install SDK | Terminal | `npm install @justice-os/sdk` (< 30 seconds) |
| 10–20 | Follow quickstart | `docs.justice-os.com/quickstart` | Create a case, add a party, upload a document |
| 20–30 | Explore sandbox | Postman | Import collection, run pre-built requests |

**No credit card required. No approval process. No waiting.**

### Friction Points We Have Eliminated

| Friction Point | Old Experience | Justice OS Experience |
|---|---|---|
| Credit card at signup | Required by most SaaS | Never required for sandbox |
| Sandbox provisioning time | 5–30 minutes (manual) | < 5 minutes (automated) |
| API key location | Buried in settings | Shown on first login screen |
| First API call | Requires reading 20 pages | Works from quickstart copy-paste |
| Approval process | Common for legal tech | No approval, instant access |

### Onboarding Funnel Metrics

We track every step of the developer onboarding funnel to identify drop-off:

| Funnel Step | Target Completion Rate | How Measured |
|---|---|---|
| Sign up → API key retrieved | 95% | Auth events |
| API key → SDK installed | 70% | Telemetry opt-in |
| SDK installed → First API call | 80% | Sandbox API logs |
| First API call → Case created | 75% | Case creation events |
| Case created → Integration shipped | 40% (within 30 days) | Integration marketplace |

When any step drops below target, a Friction Log entry is automatically created and assigned to the Developer Relations team.

---

## 10. Developer Events & Bootcamps Calendar

### Annual Events

**JusticeCon** — Annual Developer Conference  
Virtual · October · Free  
Three days of keynotes, workshops, and hackathon showcasing the year's best Justice OS integrations. Features: SDK deep-dives, legal technology panels, access-to-justice impact stories, and the annual Partner Showcase.

**Quarterly Access-to-Justice Hackathon**  
Virtual · February, May, August, November · $10,000 prize pool  
48-hour hackathon open to all developers. Teams build solutions targeting a specific access-to-justice theme (housing, family law, immigration, criminal records). Prizes: $5K first, $3K second, $2K third. Partner organizations sponsor problem statements and provide mentors.

### 12-Month Event Calendar

| Month | Event | Format | Audience | Duration |
|---|---|---|---|---|
| January | New Year Kickoff Webinar | Virtual | All developers | 1 hour |
| February | Q1 Hackathon | Virtual | All developers | 48 hours |
| March | Law School Series — Spring Kickoff | In-person (rotating campus) | Law students + developers | Full day |
| April | Monthly Office Hours | Zoom | All developers | 1 hour |
| May | Q2 Hackathon | Virtual | All developers | 48 hours |
| June | NYC Regional Meetup | In-person | NYC developers | Evening |
| July | Monthly Office Hours | Zoom | All developers | 1 hour |
| August | Q3 Hackathon | Virtual | All developers | 48 hours |
| September | SF Regional Meetup | In-person | SF/Bay Area developers | Evening |
| October | JusticeCon Annual Conference | Virtual | All developers | 3 days |
| November | Q4 Hackathon | Virtual | All developers | 48 hours |
| December | Chicago/DC Regional Meetups | In-person | Midwest/DC developers | Evening |

### Regional Meetups

In-person meetups in partnership with local bar associations, legal aid societies, and law schools:

- **New York City** (June): co-hosted with Legal Aid Society of NYC
- **San Francisco** (September): co-hosted with Bay Area Legal Aid
- **Chicago** (December): co-hosted with Chicago Bar Foundation
- **Washington, D.C.** (December): co-hosted with DC Bar Foundation
- **London** (April, UK time): co-hosted with The Legal Education Foundation

---

## 11. Developer Certification Program

The Justice OS Certification Program recognizes developers who have demonstrated competency building legal technology integrations on the Justice OS platform. Certifications signal to employers, legal aid organizations, and courts that a developer can be trusted to build mission-critical tools responsibly.

### Tier 1: Justice OS Associate

**Cost:** Free  
**Format:** Self-paced, online  
**Time Commitment:** ~4 hours  
**Validity:** 2 years (re-exam or CEUs required for renewal)

**Modules:**
1. Platform Basics (45 min): Justice OS architecture, data model, case lifecycle
2. API Fundamentals (60 min): Authentication, REST API, pagination, error handling
3. Building Integrations (90 min): SDK usage, webhooks, document generation

**Assessment:**
- 50-question multiple-choice exam (passing score: 80%)
- Hands-on lab: build a complete intake-to-case-creation integration in the sandbox

**Benefits:**
- Digital badge (shareable on LinkedIn, GitHub profile)
- `@associate` Discord role
- Listed in the Justice OS Developer Directory

---

### Tier 2: Justice OS Developer

**Cost:** $99 (scholarship available for legal aid orgs and students)  
**Format:** Proctored exam + project submission  
**Time Commitment:** ~8 hours  
**Prerequisites:** Tier 1 Associate certification

**Modules:**
1. Advanced APIs (90 min): GraphQL, bulk operations, advanced filtering, webhooks security
2. Security & Compliance (90 min): PII handling, HIPAA considerations, data minimization, audit logging
3. Performance & Reliability (60 min): Caching strategies, rate limiting, resilient integrations
4. Testing & Quality (60 min): Contract testing, integration test patterns, CI/CD setup

**Assessment:**
- Proctored exam: 75 questions (passing score: 80%)
- Project submission: build and document a production-ready integration reviewed by Justice OS engineers within 5 business days

**Benefits:**
- Higher-tier digital badge
- 12 months of Professional support (email, 24-hour SLA)
- Early access to beta features
- `@certified-developer` Discord role

---

### Tier 3: Justice OS Expert

**Cost:** Application required (free for approved candidates)  
**Format:** Open source contribution + presentation  
**Time Commitment:** ~20 hours over 8 weeks  
**Prerequisites:** Tier 2 Developer certification + 1 year of active development

**Modules:**
1. Platform Architecture (3 hours): Multi-tenancy, event sourcing, security architecture
2. Contributing to Core (4 hours): Codebase walkthrough, contribution guidelines, PR process
3. Partner Integration Design (4 hours): Designing enterprise integrations, API versioning strategy

**Assessment:**
- Meaningful open source contribution to Justice OS (PR merged to main repository)
- 20-minute presentation to the Justice OS engineering team

**Benefits:**
- Expert digital badge (highest tier)
- Advisory board eligibility
- Speaking opportunity at JusticeCon
- Revenue share (20%) on courses you publish in the Justice OS Academy
- Lifetime Professional support

---

### Certification Renewal

| Tier | Renewal Period | Renewal Method |
|---|---|---|
| Associate | Every 2 years | Free re-exam OR 4 continuing education credits |
| Developer | Every 2 years | Re-exam ($49) OR 8 continuing education credits |
| Expert | Annual | Continued open source contribution (1 merged PR/year) |

Continuing education credits are earned through: attending JusticeCon, completing new SDK modules, publishing a tutorial, or speaking at a community event.

---

*Justice OS Developer Experience Strategy · Version 1.0 · justice-os.com/developers*
