# Conference Talk Outline: Building Justice Tech That Actually Gets Used

**Title:** "Building Justice Tech That Actually Gets Used: Lessons from 72 Open-Source Projects"
**Duration:** 30 minutes + Q&A
**Format:** Keynote / Main stage / Workshop track
**Audience:** Tech conferences, legal tech events, government, nonprofits

---

## Talk Abstract

The justice tech graveyard is full of well-funded projects that nobody uses. Why does this keep happening — and what does it take to build tools that actually serve people in crisis?

In this talk, Doug Devitre shares lessons from building 72 open-source justice tech projects, including CoTrackPro (family court documentation) and the Justice OS ecosystem. He'll cover modular architecture principles, trauma-informed design, the real reasons justice tech fails, and practical frameworks any team can use starting today.

**Key takeaway:** Justice tech requires fundamentally different thinking than consumer tech — but the principles are learnable, and the infrastructure to build on already exists.

---

## Slide Deck Outline

---

### [0:00–2:00] Opening Hook

**Slide 1: The Number**
> "80%"

Let that land. Don't say anything for 3 seconds.

> "80% of family court cases in the United States have at least one party who doesn't have a lawyer."

**Slide 2: What That Means**
> "These are people making life-changing decisions — about their children, their homes, their safety — without any professional guidance."
> "And most of the technology we've built to help them... doesn't work."

**Option A — Personal story opening:**
*"Three years ago, I watched someone I know navigate a custody hearing with no legal help, a printed-out form she wasn't sure she'd filled out correctly, and a Google Docs list of incidents she'd documented over 18 months. She lost. Not because she was wrong — she was right. But because the system is designed for attorneys, not people."*

**Option B — Statistic-forward opening:**
*"The justice tech market will be $37 billion by 2030. We've been building justice technology for 15 years. And yet 80% of family court litigants still have no legal help. What are we building, and why isn't it working?"*

---

### [2:00–5:00] The Problem: Justice Tech Graveyard

**Slide 3: The Graveyard**
> "Let me show you the justice tech graveyard."

*(Display: A graveyard image with tombstones labeled with categories: "Great idea, no users." / "Built for lawyers, not litigants." / "Ran out of grant funding." / "Pilot never scaled." / "UI failed the people in crisis.")*

**Slide 4: The Pattern**
> "Every failed project had at least one of these characteristics:"
- Built for the person imagined in the planning meeting, not the person using it at 2am
- Launched with a press release, not a distribution strategy
- Monolithic architecture that cost $500,000 to build and $200,000/year to maintain
- Never measured whether it produced outcomes
- Designed with accessibility as an afterthought

**Slide 5: The Root Cause**
> "The root cause is not a technology problem. It's a design philosophy problem."
> "We keep building justice tech the same way we build consumer tech."
> "But justice tech users are not in the same state as your average consumer."

---

### [5:00–10:00] The Architecture Solution: Modular Justice Tech

**Slide 6: The Two Approaches**
*(Visual: Two diagrams side by side)*

*Monolithic:* One big system. Everything coupled. High cost, slow to change, expensive to deploy.

*Modular (Justice OS):* Small, composable pieces. Each solves one problem. Mix, match, build fast.

**Slide 7: What It Costs to Build From Scratch**
> "Every justice tech team is solving the same foundational problems:"
- Authentication and role management
- Document generation
- Secure file storage
- Billing
- Audit logging
- Security headers

> "Done from scratch: approximately 1,560 engineering hours. About $234,000."

> "With Justice OS: approximately 62 hours. Same functionality."

**Slide 8: The Justice OS Stack**
*(Visual: 4-layer architecture diagram)*

```
Application Layer    →  CoTrackPro, Pro Se Toolkit
UX / AI Layer        →  Trauma-Informed Components, AI Guardrails
Platform Layer       →  Auth, Billing, Documents, Storage, Audit
Infrastructure       →  CI/CD, Security Scanning, Deployment
```

> "72 projects. All MIT licensed. All built on this stack."

**Slide 9: What This Enables**
> "When you build on a platform, you don't solve the same problems over and over."
> "A law school clinic in Missouri doesn't need to build authentication. They build the tenant rights tool — and use the platform for everything else."
> "That's how you get to scale."

---

### [10:00–15:00] Five Core Principles That Work

**Slide 10: Principle 1 — Reduce Cognitive Load**

> "Your users are not in a good state when they come to your tool."
> "They're stressed, scared, sleep-deprived, and often in crisis."
> "Every decision you make them make costs cognitive resources they don't have."

*How to apply it:*
- One question per screen
- Auto-save always
- Pre-populate everything you can
- Show progress clearly

**Slide 11: Principle 2 — Return Control**

> "Trauma involves loss of control. Your interface should restore it."

*What this looks like:*
- "Step 3 of 7" — always visible
- Every action is reversible
- Preview before submit
- Explain what happens next

**Slide 12: Principle 3 — Use Neutral Language**

> "Words are design elements."
> "Every label, every error message, every button text is a choice."

*Do:*
- "The other person in this case" not "Respondent"
- "This field needs more detail" not "Error: Required"
- "Let's check this before you submit" not "Are you sure?"

**Slide 13: Principle 4 — Accessibility is Not Optional**

> "WCAG 2.1 AA is not a nice-to-have. It's a legal requirement for any tool deployed with court systems or federal funding."
> "And it's the same principles as trauma-informed design: clear language, simple navigation, no time limits."
> "If you're not building for a screen reader user, you're not building for accessibility."

**Slide 14: Principle 5 — Measure Outcomes, Not Vanity Metrics**

> "If you don't know your completion rate, you don't know if your tool works."
> "Users registered is not a metric. Documents successfully filed is a metric."

*Outcome metrics for justice tech:*
- Form completion rate
- Documents filed / accepted
- Protective orders granted
- Case resolution rate
- User confidence (before vs. after)

---

### [15:00–20:00] Case Studies

**Slide 15: CoTrackPro — The Numbers**

> "CoTrackPro: Family court documentation platform."

*The problem:* Self-represented litigants can't document incidents consistently for court.

*The solution:* Structured logging + trauma-informed design + auto-export to court format.

*The results:*
- Original completion rate: **34%**
- After trauma-informed redesign: **89%**
- Same features. Different design.

**Slide 16: The Specific Change**

> "What changed?"
- 14 fields → 3 required fields + optional details
- Text labels → Visual category grid with icons
- No save → Auto-save every 30 seconds

> "None of these are technology changes. All of them are design changes."

**Slide 17: Legal Aid Partnership Model**

> "The fastest way to real users in justice tech is legal aid partnerships."

*Case: Organization deploys CoTrackPro for clients*
- Attorney time on documentation review: **-73%**
- Clients served with same attorney hours: **+33%**
- Cases resolved at mediation: **41% → 67%**

> "The ROI for legal aid organizations is significant. That's your enterprise sales argument."

**Slide 18: The Pro Se Toolkit**

> "Maria's story."

*Week 1:* Download the toolkit. Read the custody modification guide. Understand what she needs.

*Week 2:* Start documenting using CoTrackPro integration. 23 incidents logged.

*Week 3:* Generate motion using court-doc-engine. Reviewed by legal aid volunteer.

*Week 5:* Custody modification granted at first hearing.

> "Maria did this herself. We built the rails. She ran on them."

---

### [20:00–25:00] Common Mistakes and How to Avoid Them

**Slide 19: Mistake 1 — Building for the Wrong User**

> "The person who approves the grant is not the person who uses the tool."
> "Build for the 2am user. Test with the 2am user."

*How to avoid it:*
- User research with legal aid clients (not employees, not volunteers)
- Lived experience on the product team
- Trauma-informed UX researcher from day one

**Slide 20: Mistake 2 — Ignoring Distribution**

> "Most justice tech dies because nobody knows it exists."
> "Technology + distribution = impact. Technology alone = nothing."

*Distribution channels that work:*
- Legal aid partnerships (fastest)
- Domestic violence shelter referrals
- Family court self-help centers
- Social worker networks
- Community organizations

**Slide 21: Mistake 3 — Monolithic Architecture**

> "If your tool costs $500,000 to build, only organizations with $500,000 can build it."
> "The justice tech we need exists at the intersection of many small tools, not one big one."

*How to avoid it:*
- Start with Justice OS starter kit
- Build only what's unique to your use case
- Contribute shared components back to the ecosystem

**Slide 22: Mistake 4 — Skipping Accessibility**

> "Accessibility is not a feature. It's the foundation."
> "If your tool doesn't work for a user with a screen reader, it doesn't work for your users."

*The cost of retrofitting:* Rebuilding for accessibility after launch typically costs 3–5x what it would have cost to build accessible from the start.

**Slide 23: Mistake 5 — Not Measuring Outcomes**

> "You can't improve what you don't measure."
> "Vanity metrics will make you feel good and let your product fail."

*Build outcome measurement into your product from day one.*

---

### [25:00–28:00] How to Get Started

**Slide 24: For Developers**

> "Clone this repo today:"
> `github.com/dougdevitre/justice-dev-starter-kit`

What you get:
- Auth, billing, AI, documents, storage, audit — pre-configured
- Trauma-informed component library
- Security headers and CSP by default
- CI/CD workflows for testing and deployment

**Slide 25: For Organizations**

> "Three ways to partner:"
1. **Deploy** an existing Justice OS app for your clients
2. **Build** a new application on the Justice OS platform
3. **Contribute** to the open-source ecosystem

Contact: partnerships@justice-os.org

**Slide 26: For Everyone**

> "The justice tech ecosystem needs all of you."

- Developers: build
- Designers: make it usable
- Lawyers: translate the law
- Researchers: measure impact
- Funders: invest in platform infrastructure
- Court systems: deploy and share feedback

---

### [28:00–30:00] Close

**Slide 27: The Opportunity**

> "The legal system is the most important technology infrastructure in American democracy."
> "It's also the most underfunded."
> "We have the tools. We have the architecture. We have the principles."
> "What we need is builders."

**Slide 28: One Ask**

> "I have one ask."
> "Go back to your team and ask: 'When did we last run user research with someone in crisis?'"
> "If the answer is never, that's your first action item."

**Slide 29: Thank You + Resources**

- GitHub: github.com/dougdevitre
- Starter kit: github.com/dougdevitre/justice-dev-starter-kit
- Blog: [blog URL]
- Contact: hello@justice-os.org

> *"Access to justice shouldn't depend on access to resources. Let's build like that's true."*

---

## Speaker Notes

### Preparation
- Run through the talk 3x before the event, timing each section
- Have CoTrackPro demo environment ready if doing a live demo (Slides 15–16)
- Prepare 2–3 audience interaction questions for the [10:00–15:00] principles section
- Bring printed QR code for github.com/dougdevitre/justice-dev-starter-kit

### Backup for Q&A
Common questions to be prepared for:
- "How do you monetize open source justice tech?" → Managed hosting, enterprise contracts, grant funding
- "How do you handle jurisdiction differences?" → Template variants + configurable defaults
- "What about AI hallucination risk?" → Guardrails section + citation requirements
- "How do you protect user privacy?" → Encryption at rest, RBAC, audit logging, HIPAA patterns
- "Can small organizations really deploy this?" → Yes, 62 hours vs. 1,560 hours; show the math

### Adjustments for Different Audiences
- **Tech conference (general):** Emphasize architecture and business case
- **Legal tech event:** Emphasize outcome metrics and enterprise deployment
- **Government/courts:** Emphasize compliance, security, and cost savings
- **Nonprofit/foundation:** Emphasize ROI, leverage, and ecosystem model
