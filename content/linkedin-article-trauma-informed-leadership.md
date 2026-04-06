# Why Justice Tech Leaders Need to Understand Trauma-Informed Design

*LinkedIn Article | Doug Devitre | ~1,500 words*
*Audience: Tech leaders, product managers, CTOs, venture capitalists*

---

If you're building or investing in justice technology, there's a design principle you need to understand — and most tech leaders I speak with have never heard of it.

It's called trauma-informed design. And it's not a soft, nice-to-have concept. It's a business-critical discipline that will determine whether your justice tech product succeeds or becomes another cautionary tale in what I call the "justice tech graveyard."

Let me make the business case.

---

## What Trauma-Informed Design Actually Is

Trauma-informed design is the practice of building technology for users who are experiencing acute stress, historical trauma, or high-stakes decision-making. It draws from trauma-informed care frameworks developed in healthcare and social work, and applies them to product design.

The core insight is this: **users under stress don't behave like users in a usability test.**

When someone is filling out a protective order form, or documenting a custody violation at 2am, or trying to understand a court notice they just received — their cognitive function is impaired. Executive function decreases. Working memory shrinks. Tolerance for ambiguity drops. Risk perception is heightened.

If your interface assumes a calm, patient, digitally literate user with ample time — you will lose these people before they complete your flow.

And in justice tech, losing users before they complete the flow doesn't mean you lost a conversion. It means someone didn't get the legal protection they needed.

---

## The Business Case for Your Leadership Team

Here's how I explain this to tech leaders who aren't immediately persuaded by the social mission argument:

### 1. Completion Rate is the Only Metric That Matters

In consumer tech, we obsess over conversion rates. In justice tech, the equivalent is form completion rate — and it is catastrophic without trauma-informed design.

CoTrackPro's original incident logging form had a 34% completion rate. After a trauma-informed redesign — same functionality, different UX — completion rate rose to **89%**.

That's not a UX win. That's your product actually working versus not working.

If you're building a justice tech tool and you haven't run trauma-informed UX research with your actual user population, you almost certainly have a completion rate problem you're not measuring.

### 2. Retention and Word-of-Mouth Depend on Outcome Quality

Justice tech users who successfully use your tool don't just renew their subscription. They tell everyone in their support network — social workers, shelter advocates, legal aid attorneys, online communities of people facing similar situations.

The word-of-mouth dynamics in this market are unique: your users are embedded in high-trust networks of people facing the same challenges. One user who successfully files a protective order using your tool will refer, on average, 4–7 people in similar situations.

But this only works if your tool produces a successful outcome. Trauma-informed design is how you get to outcomes.

### 3. Legal Liability is Real

Accessibility failures in justice tech are not just bad UX — they're potential ADA Title III violations. Several justice tech companies have faced civil rights complaints in the past three years for deploying tools that were inaccessible to users with disabilities.

WCAG 2.1 AA compliance is not optional if you are serving courts, government agencies, or any federally funded organization. And meeting WCAG 2.1 AA requires trauma-informed design thinking — clear language, simple navigation, no time limits on forms — because these are the same principles.

Beyond ADA, there are emerging legal theories around algorithmic discrimination and disparate impact. If your tool systematically fails users from particular demographic groups — due to language complexity, digital literacy assumptions, or cognitive load — you face potential liability under existing civil rights frameworks.

### 4. Enterprise Deals Depend on Compliance

Court systems and legal aid organizations are your highest-value enterprise accounts. They also have the most stringent compliance requirements.

When a court system procurement officer asks "Is this WCAG 2.1 AA compliant?", "Does it meet HIPAA security patterns?", "Can it handle users with cognitive disabilities?" — trauma-informed design is the foundation of your "yes."

Organizations that build with trauma-informed principles as defaults close enterprise deals faster because they can answer these questions from day one, not as a retrofit six months into a sales cycle.

### 5. It's a Genuine Competitive Differentiator

The justice tech market is growing quickly, but most products are still built by engineers who design for themselves. Trauma-informed design is genuinely rare.

In a competitive evaluation — and court systems and foundations do rigorous competitive evaluations — being the only product that can demonstrate evidence of trauma-informed design, user testing with crisis populations, and documented completion rate improvements is a meaningful differentiator.

This is not positioning. It's engineering. Which makes it defensible.

---

## What It Looks Like in Practice

Here are five practical changes that have the highest impact:

**1. One question per screen**
Don't paginate a 20-question form into a single page. Show one question at a time with clear forward/backward navigation. This reduces cognitive load and abandonment dramatically.

**2. Auto-save everything, always**
Never let a user lose their progress. Auto-save every field change. Make it visible: "Saved 2 minutes ago." Users under stress have interruptions. Your form should survive them.

**3. Replace legal jargon with plain language**
"Petitioner" → "You." "Respondent" → "The other person in this case." Offer legal terms as optional tooltips for users who want them, but never as the primary label.

**4. Make errors supportive, not punishing**
"Error: Required field" is useless. "This field needs a little more information — please describe what happened in a sentence or two" is actionable. Error messages should explain the problem and guide the next step.

**5. Explain what happens after submission**
"Your form has been submitted" is not enough. "Your form has been submitted. You will receive a confirmation email within 15 minutes. The court typically processes these requests within 3 business days. Here's what to expect next…" This addresses the anxiety that follows completing a high-stakes form.

---

## How to Build This Capability in Your Organization

**Hire for lived experience.** Your product team should include people who have personally navigated the legal system without a lawyer. This is not optional and cannot be replaced by user research alone. Lived experience informs what to ask in research and what to look for in testing.

**Partner with trauma professionals for training.** SAMHSA offers free trauma-informed care training resources. Many legal aid organizations offer workshops for tech partners. Budget for this as an engineering and product expense, not an HR expense.

**Conduct research with actual users.** Not employees. Not people who "know someone who went through this." Work with legal aid organizations and social service agencies to conduct user research with actual users, following ethical research protocols.

**Add trauma-informed review to your design process.** Before any new feature ships, include a trauma-informed design review step. Questions to ask: What is the user's emotional state when they reach this screen? What's the highest-stakes decision on this page? What happens if they make a mistake?

**Measure completion rates and outcomes, not vanity metrics.** Total users registered tells you nothing. Completion rate, outcome quality (was their motion granted?), and user confidence tell you whether your product is working.

---

## Where to Start

If you're new to trauma-informed design and want to move quickly, here are three resources I recommend:

1. **Justice Dev Starter Kit** — Our open-source boilerplate with trauma-informed design defaults built in. Start here if you're building a justice tech product: [github.com/dougdevitre/justice-dev-starter-kit](https://github.com/dougdevitre/justice-dev-starter-kit)

2. **SAMHSA's Trauma-Informed Approach** — Free, comprehensive framework for understanding trauma responses and designing around them: [samhsa.gov/trauma](https://www.samhsa.gov/trauma)

3. **Federal Plain Language Guidelines** — Practical guidance for writing at accessible reading levels: [plainlanguage.gov](https://www.plainlanguage.gov)

---

## The Leadership Imperative

I've watched dozens of justice tech products fail because they were built by smart, well-intentioned people who didn't understand their users' actual experience.

The tools that work — the ones that actually get used, that produce outcomes, that close enterprise deals — are built by teams that take trauma-informed design as seriously as security architecture or API performance.

If you lead a justice tech product, you have a professional obligation to understand this. Not because it's the right thing to do (though it is), but because it's the only way to build a product that actually works for the people it's supposed to serve.

**The question isn't whether trauma-informed design matters. The question is whether you're willing to do the work.**

---

*Doug Devitre is the founder of CoTrackPro and architect of the Justice OS ecosystem — 72+ open-source tools building infrastructure for accessible justice. Follow for weekly insights on justice tech, trauma-informed design, and access-to-justice innovation.*

*GitHub: [@dougdevitre](https://github.com/dougdevitre) | Email: hello@justice-os.org*
