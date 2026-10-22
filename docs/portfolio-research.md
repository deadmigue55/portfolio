# What makes a portfolio stand out: research and audit

Research done 2026-10-21/22 for the v2 rebuild of this site. Three parts: what the evidence says,
how the site scored before the rebuild, and what each finding changed. The last part is the backlog.

## 1. What the evidence says

I rate each source: **A** primary (standard, lab or eye-tracking study), **B** reputable practitioner
research, **C** vendor or course blogs (useful for patterns, not for numbers). Many portfolio guides
repeat an "87% of hiring managers prefer portfolios" statistic. I could not trace it to a primary
source, so nothing on this site relies on it.

| # | Finding | Evidence | Source |
|---|---------|----------|--------|
| 1 | Recruiters scan, and look first at name, current title and company, dates and education. Beyond those they hunt for keywords. | **A**, but about résumés, not portfolios | [TheLadders eye-tracking study](https://www.bu.edu/com/files/2018/10/TheLadders-EyeTracking-StudyC2.pdf) |
| 2 | Visitors read at most ~28% of the words on a page (about 20% is more typical). Put the proof first and cut words. | **B** | [Nielsen Norman Group](https://www.nngroup.com/articles/how-little-do-users-read/) |
| 3 | Credibility is built by verifiability: cite and link sources, make contact easy, show the content is current, avoid errors of any size. | **B** (Stanford Persuasive Technology Lab, B.J. Fogg) | [Stanford web credibility guidelines](https://credibility.stanford.edu/guidelines/) |
| 4 | A portfolio stands out when it shows *how you think*: problem, approach, outcome, a clear recommendation, messy real data, visible cleaning steps. A polished dashboard with no visible analysis is distrusted. | **C**, consistent across many sources | [Edgewood](https://online.edgewood.edu/blog/how-to-build-a-data-analyst-portfolio/), [Staragile](https://staragile.com/blog/data-analytics-portfolio), [D8A](https://d8a.academy/blog/is-a-data-analyst-portfolio-worth-it) |
| 5 | A few finished, documented projects beat many unfinished ones. Work must be public and easy to open; live demos beat private repos. | **C**, consistent | [Proxify](https://proxify.io/knowledge-base/job-descriptions/what-makes-a-developer-portfolio-stand-out-to-recruiters), [Fueler](https://www.fueler.io/blog/your-portfolio-has-7-seconds-what-recruiters-look-at-first) |
| 6 | Core Web Vitals "good" thresholds, at the 75th percentile: LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1. | **A** | [web.dev](https://web.dev/articles/vitals) |
| 7 | Moving content that starts by itself, lasts over 5 seconds and sits next to other content needs a way to pause, stop or hide it (WCAG 2.2.2, level A). Infinite background loops fall under this. | **A** | [W3C Understanding 2.2.2](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html) |
| 8 | Animate compositor-friendly properties (transform, opacity), honour `prefers-reduced-motion`, and use View Transitions only as progressive enhancement. | **C**, consistent with MDN guidance | [OpenReplay](https://blog.openreplay.com/replace-animation-libraries-native-web-apis/) |

**The target employer.** Clara is a Mexico City B2B fintech (corporate cards, bill pay, credit). Its
analytics postings ([Finance](https://jobs.generalcatalyst.com/companies/clara-3/jobs/37303886-data-analytics-associate-finance),
[Risk](https://jobs.generalcatalyst.com/companies/clara-3/jobs/37303892-data-analytics-expert-risk))
stress data cleaning, dashboards, advanced analysis and credit and risk behaviour. A portfolio
that shows messy-data work, a dashboard someone can open, and risk judgement maps onto that directly.

**What the research could not tell me.** No eye-tracking study of *portfolio sites* exists in what I
found, so every "recruiters look at X for N seconds" claim for portfolios is opinion. I treat the
résumé study as the closest proxy and design for a fast scan plus an easy way to go deeper.

## 2. Audit of the site before the rebuild

Measured on https://deadmigue.vercel.app/ on 2026-10-22 with a real browser (Playwright, Chromium).

**Strengths to keep**

- Proof in the first screen: a chart of real results (4.1× the regulatory rate, 746k excess deaths, 15 of 15 planted effects).
- Honest labelling ("Shape illustrative · numbers real", synthetic data called synthetic).
- Strong, consistent visual identity (midnight and apricot, electric accents), light and dark modes.
- Healthy basics: no console errors, no layout shift (CLS 0.005), no horizontal overflow, 147 KB gzipped JS, every image has alt text.

**Gaps found**

| Gap | Why it matters | Finding # |
|-----|----------------|-----------|
| Desktop LCP 4.7 s (limit 2.5 s). Fonts came from Google's CDN through a render-blocking stylesheet. | Slow first impression | 6 |
| Infinite decorative animations (background symbols, beams, pulses, spark) with no pause control. | Fails WCAG 2.2.2; distracting for some | 7 |
| No skip link; no language switch though the target market is Mexico City. | Accessibility and reach | 3 |
| Skills section is a wall of 32 claims with no evidence; it sits *before* the projects that prove them. | Claims without proof do not persuade | 4 |
| Two of three projects are placeholders ("In Progress", "Planned") shown as full cards with animated mock-ups and no repository. | Dilutes the one finished flagship | 5 |
| The flagship card shows animated drawings, not the real dashboard. Nothing a visitor can *do* with the data. | Verifiability and engagement | 3, 4 |
| Best proof (the numbers) sits behind a hover on the hero chart; two axis labels hidden under a hint pill. | Skimmers miss it | 2 |
| No "last updated" signal; no 404 page; no print styles. | Credibility details | 3 |

## 3. What changed, finding by finding

| Finding | Change |
|---------|--------|
| 1 First-glance fields | Hero leads with name, role, current company, school and a one-sentence proof line; facts are not hidden behind hover. |
| 2 Skimming | Copy cut and front-loaded; proof numbers promoted; sections reordered so the evidence comes before the claims. |
| 3 Verifiability | Every number links to its source (repo, report, live dashboard); new **Try the table** explorer runs on the project's real data and its maths is verified against the Python code (`scripts/verify-actuarial.mjs`); real dashboard screenshots; "Last updated" in the footer; a branded 404. |
| 4 Show thinking | Explorer turns a result into something to play with; the how-it-was-built story stays; case-study copy states problem, method, result and limits. |
| 5 Few, finished | The live flagship is featured with real screenshots and links; unfinished ideas move to a compact "On the bench" row instead of looking like shipped projects. |
| 6 Web vitals | Fonts self-hosted and the critical ones preloaded (no third-party blocking CSS); screenshots lazy-load; the explorer's data is 4 KB. |
| 7 Pause, stop, hide | One **Pause animations** control (also in the command palette) stops every infinite loop, including Motion and SVG animations; it also follows the system setting. |
| 8 Motion craft | Transform/opacity only; theme and language switches use the View Transitions API where available, with a plain fallback. |
| Reach | English and Spanish with a visible switch, remembered between visits. |
| Power users | `Ctrl/⌘ K` command palette: jump to a section, open a project, copy the email, switch theme or language. |

## 4. Backlog (not done yet)

Ordered by expected value. See the end of the rebuild notes for details.

0. **Keep the live dashboard awake.** Streamlit Community Cloud puts idle apps to sleep, and a recruiter's first click would then meet a "wake this app up" wall. A scheduled GitHub Action in the Mortality-Table-Builder repo that opens the app every few hours prevents it.
1. Publish a one-page CV (PDF, English and Spanish) and add a download button.
2. Case-study sub-pages per project once a second project ships (own URLs, own social preview).
3. Privacy-friendly analytics (Vercel Web Analytics) to learn which sections recruiters read and which links they click.
4. Recorded 90-second walkthrough of the dashboard, embedded in the flagship card.
5. Real testimonials from SCOR colleagues or professors (with permission), as short quotes with names.
6. Writing: two or three short posts (for example, "Why the regulator's mortality table is 4× too light for men").
7. Per-project Open Graph images generated at build time.
8. Split the JavaScript bundle (163 KB gzipped today) so the explorer and story load on demand.
9. A Spanish social-preview image (link previews are fixed to one language per URL).
10. A "How I'd approach Clara's data" one-pager: a worked mini-analysis on public fintech or credit data.
