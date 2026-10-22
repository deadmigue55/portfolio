import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, useMotionValueEvent, useSpring } from 'motion/react'
import SectionHeader from './SectionHeader'
import Reveal from './Reveal'
import { BeamBorder } from './Electric'
import { useCopy } from '../i18n'
import { useMotionPref } from '../motion-pref'
import { REPO } from '../links'
import data from '../data/mortality'
import { dieBefore, lifeExpectancy, termPremium } from '../lib/actuarial'

/*
  "Try the table": the project's real 2023 mortality table, running in the visitor's browser.
  Pick a sex and an age; the page shows the chance of dying within a year, the remaining life
  expectancy and the price of a 20-year term policy, on the Mexican table and on the regulator's
  (CNSF M 2013). The data comes from the Python project (scripts/export-mortality-data.py) and the
  maths is checked against it (scripts/verify-actuarial.mjs).
*/

const AGE_MIN = 18
const AGE_MAX = 70
const TERM = 20

// Plot box inside a 520 x 300 drawing; the vertical axis is logarithmic
const X0 = 50, X1 = 504, Y0 = 20, Y1 = 212
const LO = Math.log10(1e-4)
const HI = Math.log10(1)
const px = age => X0 + (age / 100) * (X1 - X0)
const py = q => Y1 - ((Math.log10(Math.max(q, 1e-4)) - LO) / (HI - LO)) * (Y1 - Y0)
const path = qx => qx.slice(0, 101).map((q, i) => `${i ? 'L' : 'M'}${px(i).toFixed(1)},${py(q).toFixed(1)}`).join('')
const PATHS = { M: path(data.qx.M), F: path(data.qx.F), CNSF: path(data.qx.CNSF) }
const GRID = [[1e-4, '0.01%'], [1e-3, '0.1%'], [1e-2, '1%'], [1e-1, '10%'], [1, '100%']]
const TICKS = [0, 20, 40, 60, 80, 100]

const fmtSmall = v => (v < 1 ? v.toFixed(2) : v < 10 ? v.toFixed(1) : v.toFixed(0))
const fmtPrice = v => (v < 10 ? v.toFixed(2) : v.toFixed(1))
const fmtPct = v => (v < 10 ? v.toFixed(1) : v.toFixed(0))

// A number that glides to its new value (and simply jumps when animations are paused)
function Num({ value, format, className = '' }) {
  const ref = useRef(null)
  const { reduced } = useMotionPref()
  const spring = useSpring(value, { stiffness: 150, damping: 24 })
  const [first] = useState(() => format(value)) // React never rewrites the text after this: the spring owns it
  useEffect(() => { if (reduced) spring.jump(value); else spring.set(value) }, [value, reduced, spring])
  useMotionValueEvent(spring, 'change', v => { if (ref.current) ref.current.textContent = format(v) })
  return <span ref={ref} className={`tabular-nums ${className}`}>{first}</span>
}

// Two bars on one scale: Mexico (filled) and the regulatory table (outlined)
function Bar({ fraction, strong, reduced }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-subtle">
      <motion.div className={`h-full rounded-full ${strong ? 'bg-accent shadow-[0_0_10px_var(--glow)]' : 'bg-muted/50'}`}
        initial={false} animate={{ width: `${Math.max(2, fraction * 100)}%` }}
        transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 170, damping: 24 }} />
    </div>
  )
}

// Two bars on one scale, with the label above them
function Rows({ label, rows, reduced }) {
  const top = Math.max(...rows.map(r => r.value))
  return (
    <div>
      <p className="text-[12.5px] font-medium leading-snug text-soft">{label}</p>
      <div className="mt-4 space-y-3.5">
        {rows.map((r, i) => (
          <div key={r.name}>
            <div className="mb-1.5 flex items-baseline justify-between gap-3">
              <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">{r.name}</span>
              <span className={`font-mono text-xl ${i === 0 ? 'font-medium text-fg' : 'text-soft'}`}>
                <Num value={r.value} format={r.format} />
                {r.unit && <span className="ml-1.5 text-[11px] text-muted">{r.unit}</span>}
              </span>
            </div>
            <Bar fraction={r.value / top} strong={i === 0} reduced={reduced} />
          </div>
        ))}
      </div>
    </div>
  )
}

// A card with one block of rows (two when `second` is given), and the takeaway pinned to the bottom
function Metric({ label, rows, second, note, reduced, className = '' }) {
  return (
    <div className={`spot-card relative flex min-w-0 flex-col rounded-xl border border-line bg-card p-5 ${className}`}>
      <Rows label={label} rows={rows} reduced={reduced} />
      {second && (
        <div className="mt-5 border-t border-line pt-5">
          <Rows label={second.label} rows={second.rows} reduced={reduced} />
        </div>
      )}
      <div className="min-h-5 flex-1" />
      <p className="mt-auto rounded-lg border border-accent/25 bg-accent/10 px-3 py-2 text-[12.5px] leading-snug text-fg">{note}</p>
    </div>
  )
}

export default function Explore() {
  const c = useCopy().explore
  const { reduced } = useMotionPref()
  const [sex, setSex] = useState('M')
  const [age, setAge] = useState(40)
  const svgRef = useRef(null)
  const dragging = useRef(false)

  const r = useMemo(() => {
    const qx = data.qx[sex]
    const cn = data.qx.CNSF
    const qM = qx[age]
    const qC = cn[age]
    const pM = termPremium(qx, age, TERM, data.interest) * 1000
    const pC = termPremium(cn, age, TERM, data.interest) * 1000
    // The chance of dying before 65 (before 85 once past 65): a cumulative view of the same gap
    const target = age < 65 ? 65 : 85
    return {
      qM, qC, ratio: qM / qC,
      target, bM: dieBefore(qx, age, target) * 100, bC: dieBefore(cn, age, target) * 100,
      eM: lifeExpectancy(qx, age), eC: lifeExpectancy(cn, age),
      pM, pC,
    }
  }, [sex, age])

  const sexName = sex === 'M' ? c.men : c.women
  const mx = px(age)
  const yM = py(r.qM)
  const yC = py(r.qC)
  const spring = reduced ? { duration: 0 } : { type: 'spring', stiffness: 260, damping: 30 }

  // Moving across the chart sets the age: a hover with a mouse, a drag with a finger (vertical scroll still works)
  const scrub = e => {
    const box = svgRef.current.getBoundingClientRect()
    const x = ((e.clientX - box.left) / box.width) * 520
    const a = Math.round(((x - X0) / (X1 - X0)) * 100)
    setAge(Math.min(AGE_MAX, Math.max(AGE_MIN, a)))
  }
  const onPointerDown = e => { dragging.current = true; e.currentTarget.setPointerCapture(e.pointerId); scrub(e) }
  const onPointerMove = e => { if (e.pointerType === 'mouse' || dragging.current) scrub(e) }
  const onPointerUp = () => { dragging.current = false }

  const premiumGap = r.pM > 0 ? (r.pM - r.pC) / r.pM : 0
  const pct = Math.round(Math.abs(premiumGap) * 100)
  const priceNote = premiumGap >= 0.03 ? c.cards.price.cheap(pct) : premiumGap <= -0.03 ? c.cards.price.dear(Math.round((r.pC / r.pM - 1) * 100)) : c.cards.price.near

  const seg = on => `rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${on ? 'bg-accent text-on-accent' : 'text-muted hover:text-fg'}`

  return (
    <section id="explore" aria-labelledby="explore-title" className="py-28 px-6">
      <div className="max-w-5xl mx-auto">
        <SectionHeader id="explore-title" eyebrow={c.eyebrow} title={c.title}>{c.intro}</SectionHeader>

        <Reveal>
          {/* Controls */}
          <div className="mb-5 flex flex-wrap items-end gap-x-10 gap-y-5 rounded-2xl border border-line bg-card p-5">
            <div role="radiogroup" aria-label={c.sex}>
              <p className="mb-2 font-mono text-[10.5px] uppercase tracking-[0.18em] text-faint">{c.sex}</p>
              <div className="inline-flex rounded-full border border-line bg-subtle p-0.5">
                <button type="button" role="radio" aria-checked={sex === 'M'} onClick={() => setSex('M')} className={seg(sex === 'M')}>{c.men}</button>
                <button type="button" role="radio" aria-checked={sex === 'F'} onClick={() => setSex('F')} className={seg(sex === 'F')}>{c.women}</button>
              </div>
            </div>

            <div className="min-w-[14rem] flex-1">
              <label htmlFor="explore-age" className="mb-2 flex items-baseline justify-between font-mono text-[10.5px] uppercase tracking-[0.18em] text-faint">
                <span>{c.age}</span>
                <span className="text-base normal-case tracking-normal text-fg"><span className="text-2xl font-medium tabular-nums">{age}</span> {c.ageUnit}</span>
              </label>
              <input id="explore-age" type="range" min={AGE_MIN} max={AGE_MAX} step={1} value={age}
                onChange={e => setAge(+e.target.value)} aria-label={c.sliderAria}
                className="h-2 w-full cursor-pointer accent-accent" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.15fr_1fr]">
            {/* Chart */}
            <div className="relative flex min-w-0 flex-col rounded-2xl border border-line bg-card p-4 sm:p-5 lg:col-start-1 lg:row-start-1">
              <BeamBorder slow />
              <div className="flex items-center justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
                <span className="flex items-center gap-2"><span className="neon-dot size-1.5 rounded-full" aria-hidden="true" />{c.chartTitle}</span>
                <span className="hidden sm:inline">{c.scrub}</span>
              </div>
              <div className="relative mt-3 flex flex-1 items-center">
                <div className="dot-grid absolute inset-0" aria-hidden="true" />
                <svg ref={svgRef} viewBox="0 0 520 240" role="img" aria-label={c.chartAria(sexName.toLowerCase(), age)}
                  onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp}
                  className="relative block w-full cursor-crosshair select-none" style={{ touchAction: 'pan-y' }}>
                  {GRID.map(([q, label]) => (
                    <g key={label}>
                      <line x1={X0} x2={X1} y1={py(q)} y2={py(q)} stroke="var(--line)" />
                      <text x={X0 - 8} y={py(q) + 3.5} textAnchor="end" fontSize="9.5" fontFamily="IBM Plex Mono, monospace" fill="var(--faint)">{label}</text>
                    </g>
                  ))}
                  <path d={`M${X0},${Y0 - 6} V${Y1} H${X1 + 6}`} fill="none" stroke="var(--soft)" strokeWidth="1.2" />
                  {TICKS.map(a => (
                    <text key={a} x={px(a)} y={Y1 + 18} textAnchor="middle" fontSize="9.5" fontFamily="IBM Plex Mono, monospace" fill="var(--faint)">{a}</text>
                  ))}

                  {/* The ages a term policy is usually sold at */}
                  <rect x={px(AGE_MIN)} y={Y0} width={px(AGE_MAX) - px(AGE_MIN)} height={Y1 - Y0} fill="var(--accent)" opacity="0.05" />

                  <path d={PATHS.CNSF} fill="none" stroke="var(--muted)" strokeWidth="2" strokeDasharray="5 5" strokeLinecap="round" />
                  <motion.path initial={false} animate={{ d: PATHS[sex] }} transition={reduced ? { duration: 0 } : { duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    fill="none" stroke="var(--accent)" strokeWidth="9" strokeLinecap="round" opacity="0.16" />
                  <motion.path initial={false} animate={{ d: PATHS[sex] }} transition={reduced ? { duration: 0 } : { duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    fill="none" stroke="var(--accent)" strokeWidth="2.8" strokeLinecap="round" />

                  {/* The marker: a guide, the gap between the two tables, and its ratio */}
                  <motion.line y1={Y0} y2={Y1} stroke="var(--fg)" strokeWidth="1" opacity="0.25" initial={false} animate={{ x1: mx, x2: mx }} transition={spring} />
                  <motion.line stroke="var(--fg)" strokeWidth="1.3" strokeDasharray="2 3" initial={false} animate={{ x1: mx, x2: mx, y1: yM, y2: yC }} transition={spring} />
                  <motion.circle r="4" fill="var(--accent)" initial={false} animate={{ cx: mx, cy: yM }} transition={spring} />
                  <motion.circle r="4" fill="var(--bg)" stroke="var(--muted)" strokeWidth="1.8" initial={false} animate={{ cx: mx, cy: yC }} transition={spring} />
                  <motion.g initial={false} animate={{ x: mx + 10, y: (yM + yC) / 2 }} transition={spring}>
                    <rect x="0" y="-11" width="52" height="22" rx="11" fill="var(--bg)" stroke="var(--accent)" strokeWidth="1.2" />
                    <text x="26" y="4" textAnchor="middle" fontSize="12" fontWeight="500" fontFamily="IBM Plex Mono, monospace" fill="var(--fg)">{r.ratio.toFixed(1)}×</text>
                  </motion.g>
                </svg>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                <span className="flex items-center gap-2"><i className="block h-0.5 w-5 rounded bg-accent" /> {sexName} · {c.legendMexico}</span>
                <span className="flex items-center gap-2"><i className="block h-0 w-5 border-t-2 border-dashed border-muted" /> {c.legendCnsf}</span>
              </div>
            </div>

            {/* Results: risk and life on the right, the price (the "so what") under the chart */}
            <>
              <Metric reduced={reduced} className="lg:col-start-2 lg:row-start-1" label={c.cards.risk.label} note={c.cards.risk.ratio(`${r.ratio.toFixed(1)}×`)}
                rows={[
                  { name: c.cards.risk.mexico, value: r.qM * 1000, format: fmtSmall, unit: c.perThousand },
                  { name: c.cards.risk.cnsf, value: r.qC * 1000, format: fmtSmall, unit: c.perThousand },
                ]}
                second={{
                  label: c.cards.risk.before(r.target),
                  rows: [
                    { name: c.cards.risk.mexico, value: r.bM, format: fmtPct, unit: '%' },
                    { name: c.cards.risk.cnsf, value: r.bC, format: fmtPct, unit: '%' },
                  ],
                }} />
              <Metric reduced={reduced} className="lg:col-start-2 lg:row-start-2" label={c.cards.life.label} note={c.cards.life.gap(r.eC - r.eM)}
                rows={[
                  { name: c.cards.life.mexico, value: r.eM, format: v => v.toFixed(1), unit: c.cards.life.unit },
                  { name: c.cards.life.cnsf, value: r.eC, format: v => v.toFixed(1), unit: c.cards.life.unit },
                ]} />
              <Metric reduced={reduced} className="lg:col-start-1 lg:row-start-2" label={c.cards.price.label} note={priceNote}
                rows={[
                  { name: c.cards.price.mexico, value: r.pM, format: fmtPrice },
                  { name: c.cards.price.cnsf, value: r.pC, format: fmtPrice },
                ]} />
            </>
          </div>

          <p className="mt-5 max-w-3xl text-[12.5px] leading-relaxed text-faint">
            {c.note}{' '}
            <a href={REPO} target="_blank" rel="noopener noreferrer" className="text-accent underline decoration-accent/40 underline-offset-4 hover:decoration-accent">{c.verify} →</a>
          </p>
        </Reveal>
      </div>
    </section>
  )
}
