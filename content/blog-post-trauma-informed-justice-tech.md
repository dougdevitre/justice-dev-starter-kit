# How to Build Trauma-Informed Justice Tech That Actually Works

*By Doug Devitre | Justice OS | ~2,500 words*

---

## The Problem Nobody Wants to Talk About

Most justice tech is built by people who have never been in crisis.

That's not an insult — it's a structural reality. Engineers and product managers typically design for average users in stable conditions: someone sitting comfortably at a desk, not under time pressure, not in fear, not grieving, not facing the loss of their children or home.

But justice tech users are almost never in those conditions.

They are filling out a protection order form while their abuser is asleep in the next room. They are documenting custody violations at 2 a.m. because they finally have a moment alone. They are uploading evidence of a wage theft claim after a 12-hour shift, trying to understand a legal system that was never designed for them.

**The gap between how justice tech is built and who actually uses it is costing people their cases, their safety, and their lives.**

This post is for the developers, founders, and product managers building tools in the justice space. We're going to look at what trauma-informed design actually means, why it matters for your product's success, and how to implement it — starting today.

---

## Why Trauma Changes Everything About Design

Trauma is not just a mental health concept. It has direct, measurable effects on how people process information and interact with technology.

When someone is under acute stress or living with trauma responses, their cognitive load is already maxed out. Executive function — the ability to plan, make decisions, sequence actions — is impaired. Working memory shrinks. Reading comprehension drops. Tolerance for ambiguity decreases.

Now look at your intake form. How many fields does it have? How many are labeled with legal jargon? How many are required versus optional, and is that clearly communicated? What happens when someone makes a mistake?

If your form asks "Petitioner's relationship to respondent" without an explanation, a trauma-impacted user may freeze. Not because they don't know their relationship — they do — but because the word "petitioner" is unfamiliar, the context is legally loaded, and they're scared of giving the wrong answer.

**Every point of friction in your interface is magnified under trauma.** What feels like a minor UX annoyance in a usability test becomes an insurmountable barrier in a real crisis.

This is not theoretical. Research from access-to-justice labs and legal aid organizations consistently shows that even moderate increases in form complexity lead to significant drop-off rates among self-represented litigants. And 80% of family court cases now include at least one self-represented party.

---

## The Five Core Principles of Trauma-Informed Design

### 1. Reduce Cognitive Load at Every Step

Every decision you require the user to make costs something. Their mental energy, their attention, their time. In trauma-informed design, we minimize these costs aggressively.

**Practical applications:**
- Break long forms into one question per screen (question-by-question progression)
- Use plain language: "What is your relationship to this person?" not "State the petitioner-respondent relationship"
- Pre-populate fields wherever possible using data you already have
- Save progress automatically — never make someone start over
- Provide examples within the form itself, not in a separate help doc

In CoTrackPro, our communication logging feature uses a simplified entry format with pre-set categories and optional free text. Users don't have to categorize, date-stamp, and narrate simultaneously — the system handles the structure while they provide the content.

### 2. Return Control to the User

Trauma often involves a loss of control. Your interface should actively restore it.

This means:
- **Showing progress clearly.** "Step 3 of 7" is better than an infinite form. A completion percentage is even better.
- **Making reversibility visible.** Users should know they can go back, change answers, or delete entries without consequences.
- **Previewing outcomes.** Before submitting anything, show users a summary. Let them confirm.
- **Allowing partial completion.** Some users can't finish in one session. Honor that.
- **Explaining what happens next.** After submission, what should they expect? A confirmation email? A case number? A 3-day processing window?

In Justice OS components, the `ProgressBar` and `StepNavigator` components are built with these principles baked in. They show both where you are and where you're going — reducing the anxiety of navigating an opaque system.

### 3. Use Neutral, Non-Triggering Language

Language is a design element. The words you choose on a button, a label, an error message — these have real impact on traumatized users.

**Avoid:**
- Words that imply blame: "You failed to provide…", "Error: Invalid input"
- Words that imply judgment: "Are you sure?", "Warning: This action is permanent"
- Legal jargon without explanation: "Respondent", "Petitioner", "Affiant", "Declarant"
- Language that assumes literacy or familiarity with legal process

**Prefer:**
- Neutral and supportive: "This field needs a little more information", "Let's double-check before you submit"
- Plain descriptions: "The other person in this case", "The person filing this form"
- Action-oriented prompts: "Add a date" not "Date field required"

In our CoTrackPro documentation, we replaced all legal-style field labels with descriptive plain language, then added optional tooltip expansions for users who want the legal term. This reduced confusion-related support tickets by over 60% in early testing.

### 4. Design for Accessibility as Default

Accessibility is not an add-on feature. It is a core requirement for justice tech — and a legal obligation in many jurisdictions.

Your users may:
- Have visual impairments or low vision
- Use screen readers
- Have motor disabilities affecting keyboard or mouse use
- Have cognitive disabilities affecting reading comprehension
- Access your tool on a mobile phone with a cracked screen and low battery

**Minimum accessibility requirements:**
- WCAG 2.1 AA compliance across all interactive elements
- Keyboard navigability for all forms and workflows
- Screen reader compatible markup (ARIA labels, semantic HTML)
- Minimum 4.5:1 color contrast ratio for all text
- Font size no smaller than 16px for body text
- No time limits on form sessions without explicit user consent
- Error messages that explain the problem and how to fix it, not just flag a field red

The justice-dev-starter-kit includes a built-in `AuditBanner` component and accessibility utilities. These are defaults — not optional extras.

### 5. Measure Outcomes, Not Vanity Metrics

Standard tech metrics — pageviews, session duration, click-through rates — tell you nothing about whether your justice tech is actually working.

**Vanity metrics for justice tech:**
- Total users registered
- Average session duration
- Number of forms started

**Outcome metrics for justice tech:**
- Forms completed vs. started (completion rate)
- Documents successfully filed with the court
- Protective orders granted
- Cases resolved (and how)
- User-reported confidence before and after using the tool
- Time to filing for self-represented litigants vs. represented parties

If you don't know your completion rate, start there. If it's below 70%, your tool is failing the people it's supposed to serve — regardless of how many users registered.

---

## Real Examples: CoTrackPro and Justice OS

### CoTrackPro: Documenting Co-Parenting for Court

CoTrackPro is a communication and documentation platform built specifically for family court cases. Our users are overwhelmingly self-represented, frequently in high-conflict situations, and often returning to the platform during moments of extreme stress.

**What we got wrong first:**
Our original incident logging form had 14 fields. It included fields like "Incident Type (select from list)", "Location (if applicable)", and "Impact on Parenting Plan Compliance." Our completion rate was 34%.

**What trauma-informed redesign changed:**
We collapsed the form to 3 required fields: date, what happened, and how it affected the child. Everything else became optional, reachable via an "Add more detail" toggle. We replaced "Incident Type" with a visual grid of common scenarios (missed pickup, communication violation, school interference) with icons. We added auto-save every 30 seconds.

Completion rate after redesign: **89%**.

The same information is captured. The cognitive burden is dramatically lower.

### Justice OS: Building for the Ecosystem

Justice OS is a modular architecture for justice tech applications. One of the core design principles of the entire ecosystem is that every component should be safe to use under stress.

That means:
- The `AuthProvider` never locks users out without a clear path to re-entry
- The `BillingGate` never silently blocks users mid-workflow — it surfaces the upgrade path clearly and non-judgmentally
- The `RoleGuard` communicates access restrictions in plain language, not error codes

These aren't just nice-to-haves. They are load-bearing requirements for an ecosystem designed to serve people in their most vulnerable moments.

---

## Accessible Language Hierarchy

One of the most powerful tools in trauma-informed design is the **accessible language hierarchy**. It's a framework for deciding how to communicate complex information at different levels of user need.

| Level | Audience | Format |
|-------|----------|--------|
| 1 | First-time, stressed, low-literacy user | Short sentences, no jargon, icons, examples |
| 2 | Returning user with some familiarity | Normal conversational language, brief explanations |
| 3 | Power user / attorney | Full legal terminology available on demand |
| 4 | Developer / integrator | Technical documentation |

A well-designed justice tech tool should serve all four levels — not just the one who looks most like the designer.

In practice, this means every form label is Level 1 by default. Level 3 terminology is available as a tooltip or expandable note. Level 4 lives in your developer documentation.

---

## How to Get Trauma Training

You don't need to be a therapist to build trauma-informed tech. You need to:

**1. Take a trauma-informed care training.** The Substance Abuse and Mental Health Services Administration (SAMHSA) offers free online resources. Many legal aid organizations offer workshops for tech partners.

**2. Read the research.** The Legal Services Corporation's *Documenting the Justice Gap* report is essential reading. So is the Self-Represented Litigation Network's research library.

**3. Hire for lived experience.** Your product team should include people who have navigated the legal system without a lawyer. This is not optional. Their perspective is the most valuable signal you can get.

**4. Conduct user research with actual users.** Not your lawyers, not your board members, not your own employees. The people who will use your tool. This means getting IRB approval for research, partnering with legal aid organizations, and following ethical protocols for working with trauma-exposed populations.

**5. Use frameworks.** The Center for Court Innovation's trauma-informed design principles, the Trauma-Informed Legal Services framework, and the Plain Language Action and Information Network (PLAIN) guidelines are all excellent starting points.

---

## The Bottom Line

Trauma-informed design is not a philosophy — it's an engineering discipline.

It means:
- Reduce cognitive load aggressively
- Return control to the user at every step
- Use language that doesn't harm
- Build accessibility in from the start
- Measure whether the tool actually works for the people it's supposed to serve

The justice system is already extraordinarily difficult for the people who need it most. Your software doesn't have to add to that difficulty.

**The tools that actually get used are the ones that meet people where they are.**

---

## Get Started Today

- **Use the [justice-dev-starter-kit](https://github.com/dougdevitre/justice-dev-starter-kit)** — trauma-informed defaults built in
- **Join the Justice OS community** — [GitHub organization](https://github.com/dougdevitre), Discord (coming soon)
- **Read the architecture docs** — [docs/architecture.md](./docs/architecture.md)
- **Contribute** — [CONTRIBUTING.md](./CONTRIBUTING.md)

---

*Doug Devitre is the founder of CoTrackPro and architect of the Justice OS ecosystem — 72+ open-source projects building the infrastructure for accessible justice. Follow on GitHub: [@dougdevitre](https://github.com/dougdevitre)*
