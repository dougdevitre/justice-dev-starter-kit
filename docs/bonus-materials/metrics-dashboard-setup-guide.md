# Metrics Dashboard Setup Guide

> **Goal:** Track performance, attribution, and ROI across all channels  
> **Format:** Step-by-step setup guide for each platform  
> **Review cadence:** Weekly review, monthly deep analysis

---

## Overview: What We're Tracking and Why

| Channel | Platform | Key Metrics |
|---|---|---|
| Blog / Website | Google Analytics | Views, sessions, bounce rate, conversions |
| Twitter / X | Twitter Analytics | Impressions, engagements, link clicks |
| LinkedIn | LinkedIn Analytics | Views, reactions, comments, followers |
| Whitepaper downloads | Google Analytics + form tool | Download count, lead capture rate |
| Email campaigns | Email platform (Apollo / Mailshake / etc.) | Open rate, click rate, reply rate, demos booked |
| Speaking / media | Manual tracker | Applications sent, bookings confirmed, attendees reached |
| Grant pipeline | Manual tracker | Applications in progress, submitted, funded |

---

## Platform 1: Google Analytics (Blog / Website)

### Setup Steps

1. **Create a Google Analytics 4 property**
   - Go to [analytics.google.com](https://analytics.google.com)
   - Click "Admin" → "Create Property"
   - Enter property name: `CoTrackPro Website` (or `Doug Devitre Blog`)
   - Select your time zone and currency

2. **Install the tracking code**
   - In GA4, go to Admin → Data Streams → Web
   - Enter your website URL and stream name
   - Copy the Measurement ID (format: `G-XXXXXXXXXX`)
   - Add the tracking snippet to your website's `<head>` tag
   - If using Next.js, add via `next/script` in `_app.tsx` or `layout.tsx`:
     ```tsx
     import Script from 'next/script'
     // Add to your layout:
     <Script
       src={`https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX`}
       strategy="afterInteractive"
     />
     <Script id="google-analytics" strategy="afterInteractive">
       {`
         window.dataLayer = window.dataLayer || [];
         function gtag(){dataLayer.push(arguments);}
         gtag('js', new Date());
         gtag('config', 'G-XXXXXXXXXX');
       `}
     </Script>
     ```

3. **Set up conversion goals**
   - Go to Admin → Events → Create Event
   - Create events for:
     - `whitepaper_download` — trigger on download button click
     - `demo_booked` — trigger on Calendly booking confirmation
     - `contact_form_submit` — trigger on contact form completion

4. **Set up UTM parameters for all outbound links**
   - All links in email campaigns, social posts, and press releases should include UTM parameters:
     - `utm_source` — e.g., `email`, `twitter`, `linkedin`, `press`
     - `utm_medium` — e.g., `campaign`, `social`, `referral`
     - `utm_campaign` — e.g., `launch-2025`, `email-seq-1`
   - Use Google's [Campaign URL Builder](https://ga.google/campaignurlbuilder/)

### Key Reports to Review Weekly

| Report | Location in GA4 | What to look for |
|---|---|---|
| Traffic overview | Reports → Life cycle → Acquisition | Total users, new vs. returning |
| Top pages | Reports → Life cycle → Engagement → Pages | Which pages get most traffic |
| Traffic sources | Reports → Life cycle → Acquisition → Traffic acquisition | Which channels drive the most visitors |
| Conversions | Reports → Life cycle → Engagement → Events | Goal completions (downloads, demo bookings) |
| Geographic data | Reports → User → Demographics → Geographic | Where your audience is |

---

## Platform 2: Twitter / X Analytics

### Setup Steps

1. **Access Twitter Analytics**
   - Go to [analytics.twitter.com](https://analytics.twitter.com) (must be logged in)
   - No setup required — analytics are built in for all accounts

2. **Enable Twitter conversion tracking (optional)**
   - Go to [ads.twitter.com](https://ads.twitter.com) → Tools → Conversion tracking
   - Add the Twitter pixel to your website if running paid campaigns

### Key Metrics to Track

| Metric | What it means | Target |
|---|---|---|
| Impressions | How many times your tweets were seen | 5,000+/thread |
| Engagements | Clicks, likes, replies, retweets | 200+/thread |
| Engagement rate | Engagements ÷ impressions | 3%+ |
| Link clicks | Clicks on links in tweets | 50+/thread |
| Profile visits | People who visited your profile | Track trend |
| Follower growth | New followers per week | 50+/week during launch |

### Weekly Twitter Report Template

```
Week of [Date]:
- Total impressions: [X]
- Top tweet: [text] — [X] impressions
- Thread performance: [X] impressions, [X] link clicks
- New followers: [X]
- Notable: [any unusual spikes or drops]
```

---

## Platform 3: LinkedIn Analytics

### Setup Steps

1. **Access LinkedIn Analytics**
   - On your LinkedIn profile, click "Analytics" (visible only to you)
   - For articles: click "View analytics" on published articles
   - For a LinkedIn Page (if you have one): Admin view → Analytics

2. **Track article performance specifically**
   - When you publish a LinkedIn article, click "View analytics" 7 days post-publish
   - Note: Views, unique impressions, reactions, comments, shares, and article saves

### Key Metrics to Track

| Metric | What it means | Target |
|---|---|---|
| Article views | People who read your article | 1,000+/article |
| Post impressions | How many times posts appeared in feeds | 2,000+/post |
| Engagement rate | (Reactions + comments + shares) ÷ impressions | 2%+ |
| Profile views | People who viewed your profile | Track weekly trend |
| Search appearances | How often you appear in LinkedIn searches | Track trend |
| Connection requests from content | Inbound connection requests after posting | 5+/article |

---

## Platform 4: Whitepaper / Resource Download Tracking

### Option A: Google Analytics Events (recommended)

1. Add a download button to your whitepaper page
2. Configure a GA4 event on button click:
   ```javascript
   gtag('event', 'whitepaper_download', {
     'document_title': 'Grant Proposal Template',
     'file_name': 'grant-proposal-template.pdf'
   });
   ```
3. View in GA4: Reports → Engagement → Events → `whitepaper_download`

### Option B: Gated Download with Email Capture (for lead generation)

1. Use a form tool (Typeform, Tally, or a simple HubSpot form)
2. Visitor fills in name + email to receive download link
3. Form submission → automated email with download link
4. Each submission = a qualified lead

**Setup with Typeform:**
- Create a form with fields: Name, Email, Organization, Role
- Connect to email automation (Zapier → Mailchimp / HubSpot)
- Embed form on your website whitepaper landing page
- Track form submissions in Typeform dashboard

### Key Metrics

| Metric | What it means | Target |
|---|---|---|
| Downloads per month | Total resource downloads | 50+/month |
| Download-to-lead rate (if gated) | % of downloaders who fill the form | 40%+ |
| Lead quality | % of leads from target organizations | 30%+ |
| Source attribution | Which channel drove the download | Track per UTM |

---

## Platform 5: Email Campaign Analytics

### Setup in Apollo.io, Instantly, or Mailshake

1. **Import your prospect list** with name, email, organization, and any personalization fields
2. **Create a sequence** with your 5 emails and 3–4 day gaps between each
3. **Enable tracking** for opens, clicks, and replies (usually on by default)
4. **Set up reply detection** so the sequence pauses when someone responds

### Key Metrics

| Metric | What it means | Benchmark | Target |
|---|---|---|---|
| Open rate | % of sent emails that were opened | Industry avg: 20–25% | 30%+ |
| Click rate | % of opened emails with a link click | Industry avg: 2–3% | 5%+ |
| Reply rate | % of sent emails that received a reply | Industry avg: 1–3% | 5%+ |
| Bounce rate | % of emails that couldn't be delivered | Industry avg: 2% | <2% |
| Unsubscribe rate | % of recipients who opted out | Industry avg: 0.2% | <0.5% |
| Demo conversion | Demos booked per 100 sent | — | 2+ |

### Weekly Email Report Template

```
Week of [Date] — Email Campaign:
- Emails sent this week: [X] (Email [#] in sequence)
- Open rate: [X%]
- Click rate: [X%]
- Reply rate: [X%]
- Replies received: [X] (positive: [X], neutral: [X], negative: [X])
- Demos booked: [X]
- Notable responses: [any warm leads or notable interactions]
- Adjustments made: [subject line changes, content tweaks]
```

---

## Platform 6: Speaking & Media Opportunity Tracker

### Airtable Setup (recommended)

Create a base with the following tables:

#### Conference Submissions Table

| Field | Type | Description |
|---|---|---|
| Conference Name | Text | Name of event |
| Conference Type | Select | Tech / Legal Tech / Justice / Nonprofit / Gov |
| CFP Deadline | Date | Submission deadline |
| Submission Date | Date | When you submitted |
| Status | Select | Researching / Submitted / Waitlisted / Accepted / Declined |
| Talk Title | Text | Which talk version submitted |
| Notification Date | Date | When they said they'd notify |
| Acceptance Status | Select | Yes / No / Pending |
| Attendees (est.) | Number | Expected conference attendance |
| Notes | Long text | Any relevant notes |

#### Podcast Outreach Table

| Field | Type | Description |
|---|---|---|
| Podcast Name | Text | Name of show |
| Host Name | Text | Host's name |
| Email | Email | Contact email |
| Pitch Sent Date | Date | When you pitched |
| Follow-Up Date | Date | When to follow up |
| Status | Select | Researching / Pitched / Followed Up / Booked / Declined |
| Air Date | Date | When episode airs |
| Episode Link | URL | Link to published episode |
| Est. Listener Count | Number | Show audience size |
| Notes | Long text | |

#### Media / Press Table

| Field | Type | Description |
|---|---|---|
| Journalist Name | Text | |
| Publication | Text | |
| Beat | Text | Legal tech / Justice / AI / Nonprofit / etc. |
| Pitch Sent Date | Date | |
| Status | Select | Researching / Pitched / Responded / Published / Declined |
| Article Title | Text | Once published |
| Article Link | URL | Once published |
| Est. Reach | Number | Publication's audience size |
| Notes | Long text | |

### Grant Pipeline Table

| Field | Type | Description |
|---|---|---|
| Funder Name | Text | |
| Grant Program | Text | |
| Amount Requested | Currency | |
| Deadline | Date | |
| Status | Select | Researching / Drafting / Submitted / Under Review / Awarded / Declined |
| Submission Date | Date | |
| Decision Date | Date | |
| Notes | Long text | |

---

## Weekly Metrics Review Checklist

Every Monday morning, review the following:

- [ ] Google Analytics: views last 7 days vs. prior week (up or down?)
- [ ] Twitter: impressions and engagements last 7 days
- [ ] LinkedIn: article views, post impressions, profile views
- [ ] Email campaign: open rate, reply rate, demos booked
- [ ] Whitepaper downloads: total week, source attribution
- [ ] Speaking tracker: any new acceptances, upcoming deadlines
- [ ] Podcast tracker: any responses, upcoming air dates
- [ ] Press tracker: any published mentions, follow-ups needed
- [ ] Grant pipeline: any upcoming deadlines, drafts in progress

**Weekly report template:** Copy the per-platform templates above into a single doc and share with your team.

---

## Monthly Metrics Deep Analysis

Every first Monday of the month:

1. **Pull 30-day metrics for all platforms** (vs. prior month)
2. **Identify top 3 performing content pieces** — replicate them
3. **Identify bottom 3 performers** — analyze why, adjust
4. **Calculate lead source attribution** — where are demos coming from?
5. **Review grant pipeline** — any decisions or deadlines this month?
6. **Update speaking and media trackers**
7. **Set 3 specific goals for the next 30 days** with measurable outcomes
8. **Adjust strategy based on data** — no strategy survives contact with reality unchanged

---

## Dashboard Tools Summary

| Tool | Cost | Best for |
|---|---|---|
| Google Analytics 4 | Free | Website + blog tracking |
| Twitter Analytics | Free | Twitter performance |
| LinkedIn Analytics | Free | LinkedIn performance |
| Typeform or Tally | Free tier available | Gated download lead capture |
| Apollo.io | Free tier (limited) | Email outreach + tracking |
| Airtable | Free tier available | Speaking/media/grant tracking |
| HubSpot CRM | Free tier | Lead pipeline management |
| Calendly | Free tier | Demo booking + tracking |
| Buffer or Hypefury | Paid | Social scheduling (optional) |
