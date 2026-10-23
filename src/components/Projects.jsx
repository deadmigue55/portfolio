import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import SectionHeader from './SectionHeader'
import Magnetic from './Magnetic'
import Reveal from './Reveal'
import Tilt from './Tilt'
import { BeamBorder, SpotLayer } from './Electric'
import { useCopy } from '../i18n'
import { DASHBOARD, REPORT, REPO, HANDBOOK } from '../links'

/*
  The flagship card shows what a visitor most wants to check: real screenshots of the live dashboard,
  the four headline results (always visible, never behind a hover) and links to the live app, the report
  and the code. The case study (what was built, why, with what) opens under it.
  Projects that have not shipped are listed in "On the bench" with no mock-ups, so they never read as finished work.
  To add a shipped project: add a card like the flagship. To add an idea: add an item to bench in the copy.
*/

// Technologies carry the same names in both languages
const TECH = [
  'Python (pandas, NumPy, SciPy, statsmodels)', 'R (StMoMo)', 'SQL (SQLite warehouse)',
  'Streamlit + Plotly', 'Quarto + Typst', 'Excel (live formulas)', 'GitHub Actions, pytest, ruff',
]

const SHOT_W = 1400
const SHOT_H = 900
const shot = file => `/img/dashboard-${file}.webp`

const statusStyle = {
  live: 'bg-good/10 text-good border-good/30',
  progress: 'bg-accent/10 text-accent border-accent/30',
  planned: 'bg-subtle text-muted border-line',
}

function Chip({ children }) {
  return <span className="text-xs text-soft bg-subtle border border-line px-2 py-0.5 rounded">{children}</span>
}

const arrowIcon = (
  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8" /></svg>
)

/* ── Lightbox: a native <dialog>, so focus, Escape and the backdrop behave like a real modal ── */
function Lightbox({ items, index, setIndex, onClose, labels }) {
  const ref = useRef(null)
  const open = index !== null
  const n = items.length

  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (open && !d.open) d.showModal()
    if (!open && d.open) d.close()
  }, [open])

  const go = useCallback(step => setIndex(i => (i + step + n) % n), [setIndex, n])
  const onKey = e => {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(1) }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1) }
  }
  const item = items[index ?? 0]
  const btn = 'grid size-10 place-items-center rounded-full border border-line bg-card/90 text-fg backdrop-blur transition-colors hover:border-accent hover:text-accent'

  return (
    <dialog ref={ref} onClose={onClose} onKeyDown={onKey}
      onClick={e => { if (e.target === ref.current) onClose() }}
      aria-label={item.title}
      className="m-auto max-h-[96vh] w-[min(96vw,1100px)] max-w-none overflow-y-auto rounded-2xl border border-line bg-bg p-0 text-fg shadow-[0_30px_120px_rgba(0,0,0,0.5)] backdrop:bg-[rgba(7,22,43,0.78)] backdrop:backdrop-blur-sm">
      {open && (
        <div className="relative">
          <img src={shot(item.file)} alt={item.alt} width={SHOT_W} height={SHOT_H} className="block h-auto max-h-[calc(96vh-4.5rem)] w-full rounded-t-2xl object-contain object-top" />
          <div className="flex items-center justify-between gap-4 border-t border-line px-4 py-3">
            <p className="text-sm text-soft"><span className="font-medium text-fg">{item.title}</span> · {labels.count(index + 1, n)}</p>
            <div className="flex gap-2">
              <button type="button" onClick={() => go(-1)} aria-label={labels.prev} className={btn}>←</button>
              <button type="button" onClick={() => go(1)} aria-label={labels.next} className={btn}>→</button>
              <button type="button" onClick={onClose} aria-label={labels.close} className={btn}>✕</button>
            </div>
          </div>
        </div>
      )}
    </dialog>
  )
}

/* ── A browser window with the real dashboard in it, and tabs to switch pages ── */
function BrowserShots({ labels }) {
  const items = labels.items
  const [current, setCurrent] = useState(0)
  const [zoom, setZoom] = useState(null)
  const item = items[current]

  return (
    <div role="group" aria-label={labels.browser} className="min-w-0">
      <div className="overflow-hidden rounded-xl border border-line bg-bg shadow-[0_10px_50px_var(--glow-soft)]">
        <div className="flex items-center gap-3 border-b border-line bg-card-2 px-3 py-2">
          <span className="flex gap-1.5" aria-hidden="true">
            <i className="size-2 rounded-full bg-rose-400/70" /><i className="size-2 rounded-full bg-amber-300/70" /><i className="size-2 rounded-full bg-emerald-400/70" />
          </span>
          <a href={DASHBOARD} target="_blank" rel="noopener noreferrer"
            className="flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-md bg-bg px-3 py-1 font-mono text-[10.5px] text-muted transition-colors hover:text-accent">
            <span className="truncate">mortality-table-builder.streamlit.app</span>{arrowIcon}
          </a>
        </div>
        <button type="button" onClick={() => setZoom(current)} aria-label={`${labels.open}: ${item.title}`}
          className="group relative block w-full cursor-zoom-in overflow-hidden bg-white" style={{ aspectRatio: `${SHOT_W} / ${SHOT_H}` }}>
          <AnimatePresence initial={false}>
            <motion.img key={item.file} src={shot(item.file)} alt={item.alt} width={SHOT_W} height={SHOT_H} loading="lazy" decoding="async"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, position: 'absolute' }} transition={{ duration: 0.35 }}
              className="block h-full w-full object-cover object-top" />
          </AnimatePresence>
          <span aria-hidden="true" className="absolute bottom-2 right-2 rounded-full border border-line bg-bg/90 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-muted opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
            {labels.open}
          </span>
        </button>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5" role="tablist" aria-label={labels.browser}>
        {items.map((it, i) => (
          <button key={it.file} type="button" role="tab" aria-selected={i === current} onClick={() => setCurrent(i)}
            className={`rounded-full border px-3 py-1 text-xs transition-colors ${
              i === current ? 'border-accent/50 bg-accent/10 text-accent' : 'border-line text-muted hover:border-accent/40 hover:text-fg'}`}>
            {it.title}
          </button>
        ))}
      </div>

      <Lightbox items={items} index={zoom} setIndex={setZoom} onClose={() => setZoom(null)} labels={labels} />
    </div>
  )
}

/* ── The flagship ── */
function Flagship() {
  const c = useCopy().projects
  const f = c.flagship
  const [caseOpen, setCaseOpen] = useState(false)
  const gallery = { ...c.gallery, browser: c.browserLabel }

  const button = 'group/btn inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-[transform,filter,border-color,box-shadow] duration-200 active:scale-95'

  return (
    <article aria-labelledby="flagship-title" className="spot-card relative rounded-2xl border border-line bg-card">
      <BeamBorder />
      <SpotLayer />

      <div className="grid grid-cols-1 gap-8 p-5 lg:grid-cols-[1.08fr_1fr] lg:items-center lg:gap-10 lg:p-8">
        <BrowserShots labels={gallery} />

        <div className="flex min-w-0 flex-col">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${statusStyle.live}`}>{c.status.live}</span>
            <span className="text-xs uppercase tracking-widest text-faint">{f.kicker}</span>
          </div>

          <h3 id="flagship-title" className="mb-3 text-2xl font-bold text-fg">{f.title}</h3>
          <p className="text-sm leading-relaxed text-muted">{f.desc}</p>

          {/* The four numbers: always visible */}
          <dl className="mt-5 grid grid-cols-2 gap-2">
            {f.results.map(r => (
              <div key={r.value} className="rounded-lg border border-line bg-subtle px-3 py-2.5">
                <dt className="font-mono text-lg font-medium text-accent">{r.value}</dt>
                <dd className="mt-0.5 text-[11.5px] leading-snug text-muted">{r.label}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-6 flex flex-wrap gap-3">
            <Magnetic strength={0.2} max={7}>
              <a href={DASHBOARD} target="_blank" rel="noopener noreferrer"
                className={`${button} bg-accent text-on-accent hover:brightness-110 hover:shadow-[0_0_20px_var(--glow)]`}>
                {f.linkDashboard}
                <span aria-hidden="true" className="transition-transform duration-300 ease-out group-hover/btn:translate-x-1">→</span>
              </a>
            </Magnetic>
            <Magnetic strength={0.2} max={7}>
              <a href={REPORT} target="_blank" rel="noopener noreferrer"
                className={`${button} border border-line text-fg hover:border-accent/60`}>{f.linkReport}</a>
            </Magnetic>
            <Magnetic strength={0.2} max={7}>
              <a href={HANDBOOK} target="_blank" rel="noopener noreferrer"
                className={`${button} border border-line text-fg hover:border-accent/60`}>{f.linkHandbook}</a>
            </Magnetic>
          </div>

          <button type="button" onClick={() => setCaseOpen(o => !o)} aria-expanded={caseOpen} aria-controls="flagship-case"
            className="mt-5 inline-flex w-fit items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-accent transition-colors hover:text-fg">
            {caseOpen ? c.caseClose : c.caseOpen}
            <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
              className={`transition-transform duration-300 ${caseOpen ? 'rotate-180' : ''}`}><path d="m6 9 6 6 6-6" /></svg>
          </button>
        </div>
      </div>

      {/* The business case: always visible, because it is what a hiring company wants to see */}
      <div className="border-t border-line p-5 lg:p-8">
        <div className="mb-5 max-w-3xl">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-accent">{f.impact.title}</h4>
          <p className="mt-2 text-[13px] leading-relaxed text-muted">{f.impact.intro}</p>
        </div>
        <ol className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {f.impact.steps.map((s, i) => (
            <li key={s.k} className="rounded-lg border border-line bg-subtle p-4">
              <p className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-faint">0{i + 1} · {s.k}</p>
              <p className="mt-2 font-mono text-2xl font-medium text-accent">{s.value}</p>
              <p className="mt-2 text-[12.5px] leading-relaxed text-soft">{s.text}</p>
            </li>
          ))}
        </ol>
        <p className="mt-4 max-w-3xl text-[12px] leading-relaxed text-faint">{f.impact.caveat}</p>
      </div>

      {/* The case study: opens in place (grid-rows animates the height, nothing jumps) */}
      <div id="flagship-case" role="region" aria-label={f.title}
        className={`grid transition-[grid-template-rows] duration-500 ease-out ${caseOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
        <div className="overflow-hidden" inert={!caseOpen}>
          <div className="grid grid-cols-1 gap-8 border-t border-line p-5 lg:grid-cols-3 lg:p-8">
            <section>
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-accent">{f.whatTitle}</h4>
              <ul className="space-y-2.5 text-[13.5px] leading-relaxed text-soft">
                {f.what.map(w => (
                  <li key={w} className="flex gap-2.5"><span className="mt-2 size-1 shrink-0 rounded-full bg-accent" />{w}</li>
                ))}
              </ul>
            </section>
            <section>
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-accent">{c.whyTitle}</h4>
              <p className="text-[13.5px] leading-relaxed text-soft">{f.why}</p>
            </section>
            <section>
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-accent">{c.builtWith}</h4>
              <div className="flex flex-wrap gap-1.5">
                {TECH.map(t => <Chip key={t}>{t}</Chip>)}
              </div>
              <a href={REPO} target="_blank" rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-on-accent transition-[filter] hover:brightness-110">
                {c.goDeeper}
              </a>
            </section>
          </div>
        </div>
      </div>
    </article>
  )
}

/* ── Ideas that have not shipped: listed plainly, no mock-ups ── */
function Bench() {
  const c = useCopy().projects
  return (
    <div className="mt-14">
      <h3 className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent">{c.bench.title}</h3>
      <p className="mt-2 max-w-xl text-sm text-muted">{c.bench.intro}</p>
      <ul className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
        {c.bench.items.map((p, i) => (
          <Reveal as="li" key={p.title} delay={i * 0.1}>
            <Tilt className="h-full rounded-xl">
            <div className="spot-card relative h-full rounded-xl border border-dashed border-line bg-card/60 p-5">
              <SpotLayer />
              <div className="relative z-10">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h4 className="font-semibold text-fg">{p.title}</h4>
                  <span className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${statusStyle[p.status]}`}>{c.status[p.status]}</span>
                </div>
                <p className="text-sm leading-relaxed text-muted">{p.desc}</p>
                {p.step && (
                  <div className="mt-4">
                    <div className="mb-1.5 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
                      <span>{p.step.label}</span>
                      <span aria-hidden="true">{Math.round((p.step.done / p.step.total) * 100)}%</span>
                    </div>
                    <div role="progressbar" aria-valuemin={0} aria-valuemax={p.step.total} aria-valuenow={p.step.done}
                      aria-label={p.step.label} className="progress-neon h-1.5 overflow-hidden rounded-full bg-subtle">
                      <span className="progress-neon-fill block h-full rounded-full" style={{ width: `${(p.step.done / p.step.total) * 100}%` }} />
                    </div>
                  </div>
                )}
                {p.facts && (
                  <dl className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
                    {p.facts.map(x => (
                      <div key={x.value} className="rounded-lg border border-line bg-subtle px-3 py-2">
                        <dt className="font-mono text-base font-medium text-accent">{x.value}</dt>
                        <dd className="mt-0.5 text-[11.5px] leading-snug text-muted">{x.label}</dd>
                      </div>
                    ))}
                  </dl>
                )}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {p.tags.map(t => <span key={t} className="rounded bg-subtle px-2 py-0.5 text-xs text-muted">{t}</span>)}
                </div>
                {p.href && (
                  <a href={p.href} target="_blank" rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent underline-offset-4 hover:underline">
                    {p.hrefLabel}{arrowIcon}
                  </a>
                )}
              </div>
            </div>
            </Tilt>
          </Reveal>
        ))}
      </ul>
    </div>
  )
}

export default function Projects() {
  const c = useCopy().projects
  return (
    <section id="projects" aria-labelledby="projects-title" className="py-28 px-6">
      <div className="max-w-5xl mx-auto">
        <SectionHeader id="projects-title" eyebrow={c.eyebrow} title={c.title}>{c.intro}</SectionHeader>

        <Reveal><Flagship /></Reveal>
        <Bench />

        <p className="text-faint text-sm mt-10">{c.more}</p>
      </div>
    </section>
  )
}
