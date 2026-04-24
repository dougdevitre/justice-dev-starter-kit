# Conference Talk Submission Template

> **Format:** Standard conference submission format  
> **Pre-filled for:** Tech, legal tech, justice tech, nonprofit tech, and government tech conferences  
> **Instructions:** Choose the version that best matches your target conference and customize `[bracketed]` fields.

---

## Version A — Tech / Developer Conferences

### Title
Building Justice Tech That Actually Works: AI, Compliance, and the 80% Problem

### Abstract (150 words)

80% of family court litigants navigate the legal system without an attorney. Most technology built for the justice system has failed to reach them — either too complex, too expensive, or designed for professionals rather than the people the system most impacts.

This talk tells the story of CoTrackPro, a justice tech platform built to close that gap, and the hard technical lessons learned building it: how to implement HIPAA and FERPA compliance at the data model level (not the UI layer), how to build AI guardrails that prevent catastrophic hallucinations in legal contexts, how to design role-based access control for 35+ role types, and how to ship a trauma-informed UX for users navigating the worst moments of their lives.

Attendees will leave with concrete patterns, architectural decisions, and hard-won lessons applicable to any high-stakes, compliance-heavy application.

### Full Description (500 words)

The justice system's technology problem is deceptively simple to describe and brutally hard to solve: the people who most need help navigating courts — low-income litigants, domestic violence survivors, parents in custody disputes — are the people for whom the least technology has been designed.

CoTrackPro is an attempt to change that. It's a full-stack justice tech platform built on Next.js, AWS Lambda, DynamoDB, and OpenAI — and the engineering decisions behind it reveal a set of challenges that any developer building for high-stakes, regulated, human-centered contexts will face.

**What this talk covers:**

**1. Compliance as architecture (not afterthought)**  
HIPAA and FERPA compliance isn't something you bolt on at the end. I'll show how we modeled data to enforce compliance at the query layer — not just the UI — and what that means for your schema design, your access patterns, and your audit trail implementation.

**2. AI guardrails for legal contexts**  
An AI hallucination in a recipe app is annoying. In a custody case, it can cost a parent their child. I'll walk through CoTrackPro's guardrail architecture: citation validation, bias detection, confidence scoring, and forced human review pathways — and the prompt engineering patterns that make AI useful without making it dangerous.

**3. Role-based access at scale**  
CoTrackPro supports 35+ distinct role types — from attorneys to self-represented litigants to foster parents to court clerks. I'll show the RBAC model that makes this possible, the lessons from early mistakes, and the testing patterns that catch permission errors before they reach production.

**4. Trauma-informed UX — in practice**  
Every UX decision in CoTrackPro goes through a filter: is this understandable for someone who hasn't slept in three days and is terrified they're going to lose their family? I'll share the specific design principles, language choices, and accessibility requirements that shaped the platform.

**5. Open source as a sustainability strategy**  
The Justice OS Ecosystem — 70+ open-source justice tech tools — is free and forkable by design. I'll share how open source serves both the mission and the business model, and why technology serving marginalized communities can't be locked behind enterprise paywalls.

This is not a conceptual talk. It is a technical post-mortem and architectural deep-dive from someone who has been building production justice tech and shipping it to real courts, legal aid organizations, and self-represented litigants.

### Learning Objectives

1. Implement HIPAA/FERPA compliance at the data model layer, not the UI layer
2. Design AI guardrails — citation validation, confidence scoring, bias detection — for high-stakes contexts
3. Build role-based access control for complex, multi-stakeholder environments (35+ role types)
4. Apply trauma-informed UX principles to software for users under extreme stress

### Target Audience

Software engineers, architects, and technical leads building for regulated, compliance-heavy, or high-stakes contexts — particularly anyone working in health tech, legal tech, education tech, or government tech.

### Experience Level

**Intermediate** — Attendees should be comfortable with REST API design, cloud infrastructure basics, and frontend frameworks. Deep TypeScript or React experience is not required, but helpful.

### Speaker Bio

Doug Devitre is the founder of the Justice OS Ecosystem — a suite of 70+ open-source tools built for courts, legal aid organizations, and the families who navigate them. He is the creator of CoTrackPro, a justice tech platform serving self-represented litigants and legal professionals in family court proceedings. He speaks and writes at the intersection of AI safety, compliance architecture, and technology for social good.

📎 GitHub: [github.com/dougdevitre]  
🌐 [dougdevitre.com]  
📸 Headshot: [link to headshot]

---

## Version B — Legal Tech Conferences

### Title
CoTrackPro: A New Architecture for the Access-to-Justice Gap

### Abstract (150 words)

The access-to-justice gap is a well-documented crisis. What's less discussed is how technology has largely failed to address it — and what a platform built specifically for the 80% who are unrepresented actually looks like.

This talk presents CoTrackPro, a justice tech platform built for courts, legal aid organizations, and self-represented litigants in family court proceedings. It covers: why existing legal tech tools fail self-represented litigants, what HIPAA/FERPA compliance looks like in a practical deployment, how AI can be used safely in legal guidance contexts (with real guardrails, not aspirational ones), and what trauma-informed legal software design looks like in practice.

Attendees will leave with a concrete framework for evaluating justice tech, a set of questions to ask any AI legal tool vendor, and a replicable architecture for organizations building or procuring access-to-justice technology.

### Learning Objectives

1. Evaluate legal tech platforms against HIPAA/FERPA compliance requirements
2. Understand AI guardrails necessary for safe legal guidance tools
3. Identify design principles for software serving self-represented litigants
4. Apply CoTrackPro's open-source architecture to your organization's needs

### Target Audience

Legal aid attorneys, court administrators, legal tech practitioners, bar association technology leads, law school clinical faculty

### Experience Level

**Beginner to Intermediate** — No technical background required. Familiarity with legal aid practice or court administration is helpful.

---

## Version C — Justice Tech / Nonprofit Tech Conferences

### Title
The 80% Problem: Building Technology for People the Justice System Left Behind

### Abstract (150 words)

80% of family court litigants have no attorney. This isn't a new statistic — it's a decades-old crisis that legal aid funding, pro bono programs, and courthouse self-help centers have failed to close. What's different now is that the technology exists to dramatically change outcomes — if we build it right.

This talk tells the story of CoTrackPro and the Justice OS Ecosystem: what it takes to build technology for people navigating custody disputes, domestic violence protection orders, and child support cases without legal help. It covers the design principles, architectural decisions, and hard lessons from deploying justice tech in real organizations with real families.

Attendees will leave with a framework for evaluating justice tech, concrete open-source resources they can use today, and a clearer picture of where technology can close the access-to-justice gap — and where it can't.

### Learning Objectives

1. Apply trauma-informed design principles to technology serving justice-involved populations
2. Evaluate justice tech platforms against real-world deployment requirements
3. Identify open-source resources available for legal aid and court technology
4. Understand the limits and possibilities of AI in access-to-justice contexts

### Target Audience

Nonprofit technology directors, legal aid program staff, court technology staff, foundation program officers, policy researchers

### Experience Level

**Beginner** — No technical background required.

---

## Version D — Government Tech Conferences

### Title
Cloud-Native Justice Tech: Deploying CoTrackPro in Government and Court Contexts

### Abstract (150 words)

Courts and government agencies face a technology paradox: the people they serve most need digital tools, but the compliance, procurement, and security requirements for deploying them are formidable. CoTrackPro was designed to meet government buyers where they are — HIPAA/FERPA compliant, available in cloud, hybrid, and on-premises deployment models, and procurable through standard government contracting mechanisms.

This talk covers what government technology leads need to know about justice tech deployment: the security architecture that meets CJIS, HIPAA, and state agency requirements; the deployment models available for cloud-skeptical jurisdictions; the procurement pathways that work for state and county governments; and the implementation patterns that have worked in real court and agency deployments.

Attendees will leave with a vendor evaluation framework, a set of questions for any justice tech procurement, and a clear picture of what successful government justice tech deployment looks like.

### Learning Objectives

1. Evaluate justice tech platforms against government compliance and procurement requirements
2. Select deployment models (cloud/hybrid/on-prem) based on agency policy requirements
3. Structure a justice tech RFP or sole-source justification
4. Apply lessons from successful government CoTrackPro deployments

### Target Audience

Court technology directors, state IT officers, county CIOs, government technology leads, procurement officials

### Experience Level

**Intermediate** — Familiarity with government IT procurement and compliance requirements is helpful.

---

## Submission Checklist

Before submitting to any conference, confirm you have:

- [ ] Title (compelling, under 80 characters, searchable)
- [ ] Abstract (within word limit for the specific conference)
- [ ] Full description (within word limit)
- [ ] Learning objectives (3–4, action-verb format)
- [ ] Target audience description
- [ ] Experience level selected
- [ ] Speaker bio (within word limit, third-person)
- [ ] Professional headshot (300 DPI, min 1000×1000px)
- [ ] Any required video sample (link to past talk or recorded presentation)
- [ ] Co-presenter info (if applicable)
- [ ] AV/tech requirements noted (slides, live demo, microphone preference)
- [ ] Travel/accommodation requirements confirmed

## Target Conference List

### Tech Conferences
- GitHub Universe
- AWS re:Invent (Social Impact track)
- All Things Open
- Strange Loop
- PyCon (if adding Python components)

### Legal Tech Conferences
- ILTA Annual Conference
- Legalweek
- TechShow (ABA)
- CLOC Global Institute

### Justice Tech Conferences
- Access to Justice Tech Forum
- National Legal Aid & Defender Association
- Legal Services Corporation Technology Initiative Grant conference

### Nonprofit Tech Conferences
- Nonprofit Technology Conference (NTC)
- Cause Camp
- Connecting Up (international)

### Government Tech Conferences
- Code for America Summit
- Government Innovation Summit
- StateScoop Summit
- Digital Government Summit
