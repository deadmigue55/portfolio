import { useState } from 'react'
import SectionHeader from './SectionHeader'
import { CreditPreview, MortalityPreview, ClaimsPreview } from './Previews'

const MORTALITY_REPO = 'https://github.com/deadmigue55/Mortality-Table-Builder'

/*
  One card component for every project. The animated preview stays on the card; hovering (or
  focusing with the keyboard, or tapping on a phone) opens a details layer that says what was
  built, why it was needed, with what, and links to the repository.
  To add a project: add an object below. `featured` makes it full width.
*/
const projects = [
  {
    title: 'Mortality Table Builder',
    featured: true,
    status: 'Live',
    kicker: 'Flagship project',
    desc: `An end-to-end actuarial pipeline for Mexico. It rebuilds the mortality table from three million
      registered deaths, then uses it the way an insurer or a reinsurer does: projection, an experience
      study, pricing, stress tests and reinsurance.`,
    tags: ['Python', 'R', 'SQL', 'Streamlit', 'Lee-Carter', 'Reinsurance', 'Quarto', 'Excel'],
    Preview: MortalityPreview,
    links: [
      { label: 'Open the live dashboard', href: 'https://mortality-table-builder.streamlit.app/', primary: true },
      { label: 'Methodology report (PDF)', href: `${MORTALITY_REPO}/blob/main/reports/methodology.pdf` },
    ],
    repo: MORTALITY_REPO,
    details: {
      whatTitle: 'What I built',
      what: [
        'Rebuilt Mexico’s mortality tables from 3 million registered deaths and the CONAPO population: completed late registrations, smoothed the rates, closed the old ages.',
        'Projected mortality (Lee-Carter, CBD) and cross-checked it against an independent R implementation and a backtest.',
        'Built an insurer-style experience study, validated by planting 15 known effects and recovering all 15.',
        'Priced a term policy, stress-tested it against the pandemic and longevity, compared reinsurance treaties and priced a longevity swap.',
        'Shipped it as a live dashboard, an Excel workbook with live formulas and an 11-page report.',
      ],
      why: 'Mexico’s regulatory table (CNSF 2013) is more than ten years old and mixes both sexes, so it is far too light for men: at 40 they die at 4.1 times its rate. Insurers’ own experience tables are private, and the pandemic broke every trend. This is a transparent, tested alternative built from official data.',
      results: [
        { value: '746k', label: 'excess deaths in 2020 to 2022, with four baselines' },
        { value: '+60%', label: 'claims if 2021 repeated, against +51% in the regulator’s stress' },
        { value: '15 / 15', label: 'planted effects recovered by the experience study' },
        { value: '100', label: 'automated data checks, 320+ tests on every commit' },
      ],
      tech: [
        'Python (pandas, NumPy, SciPy, statsmodels)', 'R (StMoMo)', 'SQL (SQLite warehouse)',
        'Streamlit + Plotly', 'Quarto + Typst', 'Excel (live formulas)', 'GitHub Actions, pytest, ruff',
      ],
    },
  },
  {
    title: 'Credit Risk Scoring Model',
    status: 'In Progress',
    desc: 'Machine learning pipeline that predicts the probability of credit default from financial and behavioral features. A logistic regression baseline compared against gradient boosting.',
    tags: ['Python', 'sklearn', 'Pandas', 'Finance'],
    Preview: CreditPreview,
    repo: null,
    details: {
      whatTitle: 'What it is',
      what: [
        'A pipeline that predicts the probability a borrower defaults, from financial and behavioral features.',
        'A transparent logistic regression baseline, compared against gradient boosting.',
      ],
      why: 'Lenders price and limit risk on the probability of default, so a model has to rank borrowers well and be explainable. Comparing a simple baseline with a stronger model shows what the extra complexity buys.',
      tech: ['Python', 'scikit-learn', 'Pandas'],
    },
  },
  {
    title: 'Reinsurance Claims Dashboard',
    status: 'Planned',
    desc: 'Dashboard for analyzing reinsurance claims patterns, loss ratios and reserve development. Inspired by real reinsurance workflows.',
    tags: ['Python', 'Plotly', 'Reinsurance', 'Data Viz'],
    Preview: ClaimsPreview,
    repo: null,
    details: {
      whatTitle: 'What it will be',
      what: [
        'A dashboard for claims patterns, loss ratios and reserve development.',
        'Modelled on how reinsurance teams actually read their claims.',
      ],
      why: 'Reinsurers follow their business through loss ratios and how claims develop over time. A clear view of both is where reserving questions start.',
      tech: ['Python', 'Plotly'],
    },
  },
]

const statusColor = {
  'In Progress': 'bg-amber-500/10 text-amber-300 border-amber-500/25',
  'Planned':     'bg-accent/10 text-accent border-accent/25',
  'Live':        'bg-good/10 text-good border-good/25',
}

const hoverCapable = () =>
  typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches

function Chip({ children }) {
  return <span className="text-xs text-soft bg-subtle border border-line px-2 py-0.5 rounded">{children}</span>
}

function Details({ p, wide, onClose }) {
  const d = p.details
  return (
    <div className={`h-full overflow-y-auto rounded-xl bg-bg/95 backdrop-blur-md p-5 ${wide ? 'lg:p-8' : ''}`}>
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <p className="neon-eyebrow text-[11px] font-medium tracking-widest uppercase">Quick view</p>
          <h3 className="text-fg font-bold text-lg mt-1">{p.title}</h3>
        </div>
        <button type="button" onClick={onClose}
          className="[@media(hover:hover)]:hidden shrink-0 rounded-lg border border-line px-3 py-1 text-xs text-soft">
          Close
        </button>
      </div>

      <div className={wide ? 'grid lg:grid-cols-3 gap-6' : 'space-y-4'}>
        <section>
          <h4 className="text-accent text-xs font-semibold uppercase tracking-wider mb-2">{d.whatTitle}</h4>
          <ul className="space-y-2 text-[13px] leading-relaxed text-soft">
            {d.what.map(w => (
              <li key={w} className="flex gap-2"><span className="text-accent mt-1.5 size-1 shrink-0 rounded-full bg-accent" />{w}</li>
            ))}
          </ul>
        </section>

        <section>
          <h4 className="text-accent text-xs font-semibold uppercase tracking-wider mb-2">Why it was needed</h4>
          <p className="text-[13px] leading-relaxed text-soft">{d.why}</p>
          {d.results && (
            <dl className="grid grid-cols-2 gap-2 mt-4">
              {d.results.map(r => (
                <div key={r.value} className="rounded-lg border border-line bg-subtle px-3 py-2">
                  <dt className="text-base font-bold text-accent">{r.value}</dt>
                  <dd className="text-[11px] text-muted leading-snug mt-0.5">{r.label}</dd>
                </div>
              ))}
            </dl>
          )}
        </section>

        <section>
          <h4 className="text-accent text-xs font-semibold uppercase tracking-wider mb-2">Built with</h4>
          <div className="flex flex-wrap gap-1.5">
            {d.tech.map(t => <Chip key={t}>{t}</Chip>)}
          </div>
          {p.repo
            ? (
              <a href={p.repo} target="_blank" rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-on-accent bg-accent hover:brightness-110 transition-colors">
                Go deeper: the repository →
              </a>
            )
            : <p className="mt-5 text-sm text-faint">The repository and write-up will be linked here when this ships.</p>}
        </section>
      </div>
    </div>
  )
}

function ProjectCard({ p }) {
  const [open, setOpen] = useState(false)
  const wide = !!p.featured

  // On phones there is no hover: a tap opens the details, "Close" shuts them.
  const onCardClick = e => {
    if (hoverCapable() || e.target.closest('a')) return
    setOpen(o => !o)
  }

  const layer = open
    ? 'opacity-100 pointer-events-auto'
    : 'opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto group-focus-within:opacity-100 group-focus-within:pointer-events-auto'

  return (
    <article tabIndex={0} onClick={onCardClick} aria-label={`${p.title}: details on hover or focus`}
      className={`neon-ring group relative rounded-xl border border-line bg-card backdrop-blur-sm outline-none focus-visible:ring-2 focus-visible:ring-accent/60 ${
        wide ? 'md:col-span-2 grid lg:grid-cols-[1.05fr_1fr] lg:items-center lg:min-h-[34rem]' : 'hover:-translate-y-1 transition-transform duration-300 flex flex-col'}`}>

      {/* Animated preview: the part that stays */}
      <div className={wide ? 'p-5 lg:p-6' : 'p-6 pb-0'}>
        <p.Preview height={wide ? 'h-56 lg:h-80' : undefined} />
      </div>

      <div className={`flex flex-col ${wide ? 'p-6 lg:p-8' : 'p-6 flex-1'}`}>
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${statusColor[p.status]}`}>{p.status}</span>
          {p.kicker && <span className="text-xs uppercase tracking-widest text-faint">{p.kicker}</span>}
        </div>

        <h3 className={`text-fg font-semibold mb-2 ${wide ? 'text-2xl font-bold mb-3' : ''}`}>{p.title}</h3>
        <p className="text-muted text-sm leading-relaxed flex-1">{p.desc}</p>

        <div className="flex flex-wrap gap-1.5 mt-4">
          {p.tags.map(t => (
            <span key={t} className="text-xs text-muted bg-subtle px-2 py-0.5 rounded">{t}</span>
          ))}
        </div>

        {p.links
          ? (
            <div className="flex flex-wrap gap-3 mt-6">
              {p.links.map(l => (
                <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer"
                  className={l.primary
                    ? 'px-4 py-2 rounded-lg text-sm font-medium text-on-accent bg-accent hover:brightness-110 transition-colors'
                    : 'px-4 py-2 rounded-lg text-sm font-medium text-fg border border-line hover:border-accent/60 hover:text-fg transition-colors'}>
                  {l.label}{l.primary ? ' →' : ''}
                </a>
              ))}
            </div>
          )
          : <span className="mt-5 text-sm text-faint">Write-up coming soon</span>}

        <p className="mt-5 text-[11px] uppercase tracking-widest text-faint group-hover:text-accent transition-colors">
          <span className="hidden [@media(hover:hover)]:inline">Hover</span>
          <span className="[@media(hover:hover)]:hidden">Tap</span> for the quick view
        </p>
      </div>

      {/* Details layer */}
      <div className={`absolute inset-0 z-10 transition-opacity duration-300 ${layer}`}>
        <Details p={p} wide={wide} onClose={e => { e.stopPropagation(); setOpen(false) }} />
      </div>
    </article>
  )
}

export default function Projects() {
  return (
    <section id="projects" className="py-28 px-6">
      <div className="max-w-5xl mx-auto">

        <SectionHeader eyebrow="Projects" title="Things I'm building">
          In-depth projects that put actuarial knowledge to work with data science and AI.
          Hover a card for the quick view: what was built, why it was needed and how.
        </SectionHeader>

        <div className="grid md:grid-cols-2 gap-5">
          {projects.map(p => <ProjectCard key={p.title} p={p} />)}
        </div>

        <p className="text-faint text-sm mt-8">
          More projects are in the pipeline. This page grows as they ship.
        </p>
      </div>
    </section>
  )
}
