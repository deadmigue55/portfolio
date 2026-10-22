# Miguel Vilchis · portfolio

Live at **https://deadmigue.vercel.app/** · Spanish version: https://deadmigue.vercel.app/?lang=es

An actuary's portfolio built around one rule: **evidence before claims**. The first screen shows a real
result, every number links to its source, and the main project can be opened, tested and checked.

| | |
|---|---|
| Stack | React 19, Vite, Tailwind 4, Motion |
| Hosting | Vercel (every push to `main` deploys) |
| Languages | English and Spanish, switchable, remembered between visits |
| Research behind it | [`docs/portfolio-research.md`](docs/portfolio-research.md) |

## What is on the page

1. **Hero**: name, role, company, school, one-sentence proof, and a chart of real results (Mexican men's mortality against the regulatory table).
2. **Projects**: the flagship (Mortality Table Builder) with real dashboard screenshots, four headline numbers, links to the live app, the report and the code, and an expandable case study. Unfinished ideas sit in "On the bench", never dressed up as finished work.
3. **Try the table**: an interactive explorer that runs the project's real 2023 mortality table in the browser. Its maths is verified against the Python project.
4. **How it was built**: a pinned, scroll-driven tour of the five stages.
5. **Skills**: every skill is listed, but the ones used in a shipped project are marked and say where.
6. **About** and **Contact**.

Also: `Ctrl/⌘ K` command menu, light / dark / system themes, a **Pause animations** control (WCAG 2.2.2),
a skip link, print styles, a branded 404, and a no-JavaScript fallback.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build into dist/
npm run lint
```

## Checks

```bash
node scripts/verify-copy.mjs        # English and Spanish have the same structure
node scripts/verify-actuarial.mjs   # the explorer's maths matches the Python project

# End-to-end, in a real browser (needs Python with uv):
npm run build && npx vite preview --port 4173
uv run --no-project --with playwright python -I scripts/qa/qa.py http://localhost:4173
```

`qa.py` checks behaviour: console errors, horizontal overflow from 360 to 1920 px, the explorer's numbers,
the command menu, the language switch, the pause switch, the lightbox, light and dark themes, reduced motion,
and an axe-core accessibility scan (WCAG 2.2 A and AA) in both themes.

## How to change things

**Text** lives in `src/i18n/en.js` and `src/i18n/es.js`, with the same structure (`verify-copy.mjs` enforces it).
`**double asterisks**` mark a phrase shown in the stronger text color. The Spanish avoids gendered words
about the person ("Actuaría" names the field), on purpose.

**Default language** is `DEFAULT_LANG` in `src/i18n/context.js`. A visitor's choice, or a `?lang=es` link, wins over it.

**Links and contact details** are in `src/links.js`.

**Adding a shipped project**: copy the `Flagship` component in `src/components/Projects.jsx`, add its copy to
both language files, and put 3 to 5 screenshots in `public/img/` (WebP, around 1400 px wide). Move the idea out
of `projects.bench.items` once it ships.

**Skills evidence**: in the copy, give a skill a `proof` (where it was used) only when a shipped project really uses it.

**The explorer's data** is exported from the Mortality Table Builder's demo database:

```bash
uv run python -I scripts/export-mortality-data.py   # writes src/data/mortality.js
node scripts/verify-actuarial.mjs
```

**Colors** are tokens in `src/index.css`. The light-mode accent (`#A84300`) is the lightest orange that still
clears 4.5:1 contrast on every tinted surface.

## Motion

All reduced-motion behaviour hangs on one attribute, `data-motion="reduced"` on `<html>`. It is set before the first
paint (inline script in `index.html`) from the system setting or the **Pause animations** button, and kept in sync by
`components/MotionPrefProvider.jsx`. CSS animations, Motion animations and the SVG animations all follow it.

Theme and language changes use the View Transitions API where the browser supports it (a circular reveal for the theme,
a cross-fade for the language) and happen instantly elsewhere (`src/transition.js`).

## Notes

- Fonts are self-hosted (`@fontsource`), so no third-party request blocks the first paint.
- The numbers on the page are real results of the project; drawings that are illustrative say so on the card.
- Photos, CV download and analytics are not wired up yet; see the backlog in `docs/portfolio-research.md`.
