import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useMotionValueEvent, useScroll, useTransform } from 'motion/react'
import SectionHeader from './SectionHeader'
import Reveal from './Reveal'
import { BeamBorder } from './Electric'

/*
  "How it was built": a pinned tour of the Mortality Table Builder. The section sticks to the screen
  while the page scrolls past it, and the scroll position scrubs five small drawings, one per stage.
  Every number is a real result of the project. The shapes are drawn to explain, not to measure,
  and say so on the card. On phones and for visitors who ask for less motion there is no pinning:
  the five stages stack and each drawing is shown complete.
*/

const mono = { fontFamily: 'IBM Plex Mono, monospace' }
// Fixed pseudo-random numbers so every visit draws the same picture
const noise = (i, s = 1) => {
  const x = Math.sin(i * 12.9898 + s * 78.233) * 43758.5453
  return x - Math.floor(x)
}

const useRange = (p, a, b) => useTransform(p, [a, b], [0, 1], { clamp: true })

/* ── 1. Rebuild: late registrations complete the latest years ── */
const BAR_H = [86, 90, 93, 96, 99, 102, 128, 150, 118]
const CAP = [0.01, 0.01, 0.01, 0.015, 0.02, 0.025, 0.05, 0.09, 0.16]

function Bar({ p, i }) {
  const grow = useRange(p, i * 0.04, i * 0.04 + 0.35)
  const fill = useRange(p, 0.7, 1)
  const x = 30 + i * 38
  const h = BAR_H[i]
  const cap = Math.max(4, h * CAP[i] * 2.4)
  const base = { transformBox: 'fill-box', transformOrigin: '50% 100%' }
  return (
    <g>
      <motion.rect x={x} y={196 - h} width="26" height={h} rx="2" fill="var(--accent)" fillOpacity="0.35"
        stroke="var(--accent)" strokeWidth="1" style={{ ...base, scaleY: grow }} />
      <motion.rect x={x} y={196 - h - cap} width="26" height={cap} rx="2" fill="var(--accent)"
        style={{ ...base, scaleY: fill }} />
    </g>
  )
}

function VisualRebuild({ p }) {
  const note = useRange(p, 0.8, 1)
  return (
    <svg viewBox="0 0 400 240" className="h-full w-full" aria-hidden="true">
      <line x1="22" y1="196" x2="384" y2="196" stroke="var(--line)" />
      {BAR_H.map((_, i) => <Bar key={i} p={p} i={i} />)}
      <motion.g style={{ opacity: note }} fontSize="10" fill="var(--fg)" fontFamily="IBM Plex Mono, monospace">
        <text x="30" y="40" fill="var(--faint)">registered deaths</text>
        <text x="30" y="54" fill="var(--accent)">+ late registrations</text>
      </motion.g>
    </svg>
  )
}

/* ── 2. Graduate: noisy rates settle onto a smooth curve ── */
const curveY = t => 196 - 150 * Math.pow(t, 3.2) - 6
const DOTS = Array.from({ length: 22 }, (_, i) => {
  const t = (i + 0.5) / 22
  const x = 24 + t * 352
  const fit = curveY(t)
  return { x, fit, raw: fit + (noise(i) - 0.5) * 56 * (0.4 + t) }
})
const CURVE = (() => {
  let s = ''
  for (let i = 0; i <= 40; i++) {
    const t = i / 40
    s += `${i ? 'L' : 'M'}${(24 + t * 352).toFixed(1)} ${curveY(t).toFixed(1)}`
  }
  return s
})()

function Dot({ p, dot, i }) {
  const y = useTransform(p, [0.05 + i * 0.006, 0.7 + i * 0.006], [dot.raw, dot.fit], { clamp: true })
  return <motion.circle cx={dot.x} cy={y} r="3.2" fill="var(--accent)" />
}

function VisualGraduate({ p }) {
  const draw = useRange(p, 0.3, 0.95)
  const label = useRange(p, 0.8, 1)
  return (
    <svg viewBox="0 0 400 240" className="h-full w-full" aria-hidden="true">
      <line x1="22" y1="202" x2="384" y2="202" stroke="var(--line)" />
      <line x1="22" y1="30" x2="22" y2="202" stroke="var(--line)" />
      <motion.path d={CURVE} fill="none" stroke="var(--fg)" strokeWidth="1.6" strokeLinecap="round" style={{ pathLength: draw }} />
      {DOTS.map((dot, i) => <Dot key={i} p={p} dot={dot} i={i} />)}
      <motion.text x="30" y="44" fontSize="10" fill="var(--accent)" style={{ ...mono, opacity: label }}>
        qx smoothed, old ages closed
      </motion.text>
    </svg>
  )
}

/* ── 3. Project: the curve is extended and the doubt widens ── */
function VisualProject({ p }) {
  const past = useRange(p, 0, 0.4)
  const fan = useRange(p, 0.35, 0.95)
  const reveal = useTransform(fan, [0, 1], [0, 190])
  const tag = useRange(p, 0.85, 1)
  const hist = 'M24 150 C60 146 90 150 118 138 S160 122 190 112'
  const mid = 'M190 112 C240 92 300 78 376 66'
  const upper = 'M190 112 C240 98 300 96 376 98 L376 40 C300 52 240 80 190 112 Z'
  return (
    <svg viewBox="0 0 400 240" className="h-full w-full" aria-hidden="true">
      <line x1="22" y1="202" x2="384" y2="202" stroke="var(--line)" />
      <line x1="190" y1="30" x2="190" y2="202" stroke="var(--line)" strokeDasharray="3 4" />
      <text x="186" y="44" textAnchor="end" fontSize="9" fill="var(--faint)" style={mono}>observed</text>
      <text x="196" y="44" fontSize="9" fill="var(--faint)" style={mono}>projected</text>
      <motion.path d={hist} fill="none" stroke="var(--fg)" strokeWidth="1.8" strokeLinecap="round" style={{ pathLength: past }} />
      <clipPath id="story-fan"><motion.rect x="190" y="0" height="240" style={{ width: reveal }} /></clipPath>
      <path d={upper} fill="var(--accent)" fillOpacity="0.28" clipPath="url(#story-fan)" />
      <motion.path d={mid} fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" style={{ pathLength: fan }} />
      <motion.text x="376" y="218" textAnchor="end" fontSize="9" fill="var(--accent)" style={{ ...mono, opacity: tag }}>
        Lee-Carter and CBD, backtested
      </motion.text>
    </svg>
  )
}

/* ── 4. Stress: what the pandemic would do to claims ── */
function Column({ p, x, value, label, strong }) {
  const grow = useRange(p, 0.05, 0.8)
  const text = useTransform(grow, v => `+${Math.round(v * value)}%`)
  const h = value * 2.2
  return (
    <g>
      <motion.rect x={x} y={190 - h} width="74" height={h} rx="3"
        fill="var(--accent)" fillOpacity={strong ? 0.9 : 0.3} stroke="var(--accent)"
        style={{ scaleY: grow, transformBox: 'fill-box', transformOrigin: '50% 100%' }} />
      <motion.text x={x + 37} y={184 - h} textAnchor="middle" fontSize="15" fontWeight="600" fill="var(--fg)" style={{ ...mono, opacity: grow }}>{text}</motion.text>
      <text x={x + 37} y="208" textAnchor="middle" fontSize="9" fill="var(--muted)" style={mono}>{label}</text>
    </g>
  )
}

function VisualStress({ p }) {
  return (
    <svg viewBox="0 0 400 240" className="h-full w-full" aria-hidden="true">
      <line x1="40" y1="190" x2="360" y2="190" stroke="var(--line)" />
      <Column p={p} x={92} value={51} label="regulator p99.5" />
      <Column p={p} x={232} value={60} label="2021 replayed" strong />
    </svg>
  )
}

/* ── 5. Reinsure: how much of the capital a treaty takes away ── */
function VisualReinsure({ p }) {
  const total = useRange(p, 0, 0.35)
  const relief = useRange(p, 0.45, 0.95)
  const lab = useRange(p, 0.2, 0.5)
  const lab2 = useRange(p, 0.75, 1)
  const W = 330
  const pandemic = W * 0.41
  const left = 35
  const edge = { transformBox: 'fill-box', transformOrigin: '0% 50%' }
  return (
    <svg viewBox="0 0 400 240" className="h-full w-full" aria-hidden="true">
      <motion.g style={{ opacity: lab }} fontSize="9.5" fill="var(--muted)" fontFamily="IBM Plex Mono, monospace">
        <text x={left} y="62">claims capital, simulated year</text>
      </motion.g>
      <motion.rect x={left} y="72" width={W} height="34" rx="4" fill="var(--accent)" fillOpacity="0.18" stroke="var(--line)"
        style={{ ...edge, scaleX: total }} />
      <motion.rect x={left} y="72" width={pandemic} height="34" rx="4" fill="var(--accent)" style={{ ...edge, scaleX: total }} />
      <motion.text x={left + pandemic / 2} y="94" textAnchor="middle" fontSize="11" fontWeight="600" fill="var(--on-accent)" style={{ ...mono, opacity: lab }}>
        pandemic 41%
      </motion.text>

      <motion.g style={{ opacity: lab2 }} fontSize="9.5" fill="var(--muted)" fontFamily="IBM Plex Mono, monospace">
        <text x={left} y="150">with a stop loss at 6% per peso</text>
      </motion.g>
      <rect x={left} y="160" width={W} height="34" rx="4" fill="var(--accent)" fillOpacity="0.18" stroke="var(--line)" />
      <motion.rect x={left} y="160" width={pandemic * 0.4} height="34" rx="4" fill="var(--accent)" style={{ opacity: lab2 }} />
      <motion.rect x={left + pandemic * 0.4} y="160" width={pandemic * 0.6} height="34" rx="4" fill="var(--good)" fillOpacity="0.55"
        strokeDasharray="4 3" stroke="var(--good)" style={{ ...edge, scaleX: relief }} />
      <motion.text x={left + pandemic * 0.7} y="181" textAnchor="middle" fontSize="10.5" fontWeight="600" fill="var(--fg)" style={{ ...mono, opacity: lab2 }}>
        60% relieved
      </motion.text>
    </svg>
  )
}

const STEPS = [
  {
    k: 'Rebuild',
    title: 'Rebuild the table from raw data',
    text: 'Three million registered deaths from INEGI, matched to CONAPO population. Late registrations are completed with a chain-ladder triangle, so the latest year gains 2.3% and lands within 1% of CONAPO’s own projection.',
    Visual: VisualRebuild,
    stat: '+2.3%',
    statLabel: 'late registrations completed, 2024',
  },
  {
    k: 'Graduate',
    title: 'Smooth it without losing the shape',
    text: 'Four graduation methods (P-spline, Whittaker-Henderson, Heligman-Pollard, Kannisto) turn noisy rates into a complete 0 to 110 table, with digit preference found and old ages closed.',
    Visual: VisualGraduate,
    stat: '4',
    statLabel: 'methods compared, one table out',
  },
  {
    k: 'Project',
    title: 'Look forward, and say how unsure',
    text: 'Lee-Carter and CBD projections, cross-checked against an independent R implementation and a backtest, so the fan of futures is something you can trust and not just look at.',
    Visual: VisualProject,
    stat: '15 / 15',
    statLabel: 'planted effects recovered in the checks',
  },
  {
    k: 'Stress',
    title: 'Replay the pandemic on a portfolio',
    text: 'If 2021 happened again, claims on the illustrative book would rise 60%, more than the 51% in the regulator’s p99.5 stress. The standard scenario is lighter than what already happened.',
    Visual: VisualStress,
    stat: '746k',
    statLabel: 'excess deaths, 2020 to 2022',
  },
  {
    k: 'Reinsure',
    title: 'Price what a treaty is worth',
    text: 'The pandemic is 41% of the simulated claims capital. A stop loss relieves 60% of it at 6% per peso, quota share costs about 20%, and a longevity swap on the annuity block needs a fee near 18 bp a year.',
    Visual: VisualReinsure,
    stat: '41%',
    statLabel: 'of claims capital is the pandemic',
  },
]
const N = STEPS.length

/* ── Pinned stage ── */
function Layer({ progress, i, Visual }) {
  const lo = i / N
  const hi = (i + 1) / N
  const e = 0.012
  const opacity = useTransform(
    progress,
    i === 0 ? [0, hi - e, hi + e] : i === N - 1 ? [lo - e, lo + e, 1] : [lo - e, lo + e, hi - e, hi + e],
    i === 0 ? [1, 1, 0] : i === N - 1 ? [0, 1, 1] : [0, 1, 1, 0],
  )
  // Progress of this stage alone, finishing a little before its slot ends so the drawing rests
  const local = useTransform(progress, [lo, (i + 0.85) / N], [0, 1], { clamp: true })
  return (
    <motion.div className="absolute inset-0 p-5 pb-16" style={{ opacity }}>
      <Visual p={local} />
    </motion.div>
  )
}

function VisualCard({ progress, active }) {
  return (
    <div className="relative aspect-[5/4] w-full overflow-hidden rounded-2xl border border-line bg-gradient-to-br from-card-2 to-card shadow-[0_0_60px_var(--glow-soft)] sm:aspect-[16/12]">
      <BeamBorder slow />
      <div className="dot-grid absolute inset-0 opacity-60" aria-hidden="true" />
      {STEPS.map((s, i) => <Layer key={s.k} progress={progress} i={i} Visual={s.Visual} />)}
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 border-t border-line bg-card/80 px-5 py-3">
        <div>
          <p className="text-2xl font-bold leading-none text-fg tabular-nums">{STEPS[active].stat}</p>
          <p className="mt-1 text-[11px] text-muted" style={mono}>{STEPS[active].statLabel}</p>
        </div>
        <p className="text-[10px] uppercase tracking-[0.2em] text-faint" style={mono}>Shape illustrative · numbers real</p>
      </div>
    </div>
  )
}

function StepList({ progress, active }) {
  const fill = useTransform(progress, [0, 1], [0, 1])
  return (
    <div className="relative pl-7">
      <div className="absolute left-0 top-1 bottom-1 w-px bg-line" aria-hidden="true">
        <motion.div className="h-full w-px origin-top bg-accent shadow-[0_0_10px_var(--glow)]" style={{ scaleY: fill }} />
      </div>
      <ol className="space-y-5">
        {STEPS.map((s, i) => (
          <li key={s.k} className={`transition-opacity duration-500 ${i === active ? 'opacity-100' : 'opacity-35'}`}>
            <p className="text-[11px] uppercase tracking-[0.22em] text-accent" style={mono}>0{i + 1} · {s.k}</p>
            <h3 className="mt-1 text-lg font-semibold text-fg md:text-xl">{s.title}</h3>
            <div className={`grid transition-[grid-template-rows] duration-500 ease-out ${i === active ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
              <p className="overflow-hidden text-sm leading-relaxed text-muted">
                <span className="block pt-2">{s.text}</span>
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}

function Pinned() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const [active, setActive] = useState(0)
  useMotionValueEvent(scrollYProgress, 'change', v => {
    const next = Math.min(N - 1, Math.max(0, Math.floor(v * N)))
    setActive(cur => (cur === next ? cur : next))
  })
  return (
    <div ref={ref} className="relative" style={{ height: `${N * 90 + 60}vh` }}>
      <div className="sticky top-0 flex h-screen items-center pt-16">
        <div className="mx-auto grid w-full max-w-5xl items-center gap-10 px-6 lg:grid-cols-[0.95fr_1.05fr]">
          <StepList progress={scrollYProgress} active={active} />
          <VisualCard progress={scrollYProgress} active={active} />
        </div>
      </div>
    </div>
  )
}

/* ── Stacked version: phones and reduced motion ── */
function StaticStep({ s, i }) {
  const done = useMotionValue(1)
  return (
    <Reveal>
      <article className="overflow-hidden rounded-2xl border border-line bg-card">
        <div className="relative aspect-[5/3.4] border-b border-line bg-gradient-to-br from-card-2 to-card p-4">
          <div className="dot-grid absolute inset-0 opacity-60" aria-hidden="true" />
          <div className="relative h-full"><s.Visual p={done} /></div>
        </div>
        <div className="p-5">
          <p className="text-[11px] uppercase tracking-[0.22em] text-accent" style={mono}>0{i + 1} · {s.k}</p>
          <h3 className="mt-1 text-lg font-semibold text-fg">{s.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">{s.text}</p>
          <p className="mt-4 flex items-baseline gap-3 border-t border-line pt-3">
            <span className="text-xl font-bold text-fg tabular-nums">{s.stat}</span>
            <span className="text-[11px] text-muted" style={mono}>{s.statLabel}</span>
          </p>
        </div>
      </article>
    </Reveal>
  )
}

function usePinned() {
  const query = '(min-width: 1024px) and (prefers-reduced-motion: no-preference)'
  const [on, setOn] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches)
  useEffect(() => {
    const mq = window.matchMedia(query)
    const fn = () => setOn(mq.matches)
    mq.addEventListener('change', fn)
    return () => mq.removeEventListener('change', fn)
  }, [])
  return on
}

export default function Story() {
  const pinned = usePinned()
  return (
    <section id="story" className="relative px-6 pt-28">
      <div className="mx-auto max-w-5xl">
        <SectionHeader eyebrow="How it was built" title="From raw deaths to reinsurance capital">
          Five stages of the Mortality Table Builder. Keep scrolling and each one draws itself.
        </SectionHeader>
      </div>
      {pinned ? (
        <Pinned />
      ) : (
        <div className="mx-auto grid max-w-5xl gap-6 pb-28 md:grid-cols-2">
          {STEPS.map((s, i) => <StaticStep key={s.k} s={s} i={i} />)}
        </div>
      )}
      <span className="sr-only">Illustrative drawings; every number quoted is a result of the project.</span>
    </section>
  )
}
