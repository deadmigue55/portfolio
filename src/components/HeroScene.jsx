import { useState } from 'react'
import { motion } from 'motion/react'
import { BeamBorder } from './Electric'
import CountUp from './CountUp'
import { useCopy } from '../i18n'
import { useMotionPref } from '../motion-pref'
import data from '../data/mortality'

/*
  The hero chart: Mexican men's probability of dying by age, as insured lives (the table version 2 prices
  a quote on), as the whole population, and in the regulatory table (CNSF 2013). Real numbers, read from
  src/data/mortality.js. Drawn the way a blueprint becomes a product: grid and axes first, then a scan
  line that reveals the curves, then a spark that keeps running along the curve and the gap that
  matters (insured men at 40 die at about an eighth of the population's rate).
  With animations paused everything is drawn in its final state straight away and the spark is gone.
*/

const AGES = [20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100]
const INSURED = AGES.map(a => data.qx.IM[a])
const MEN = AGES.map(a => data.qx.M[a])
const CNSF = AGES.map(a => data.qx.CNSF[a])
const I40 = data.qx.IM[40]
const M40 = data.qx.M[40]

// Plot box inside a 520 x 290 drawing; the vertical axis is logarithmic
const X0 = 46, X1 = 496, Y0 = 36, Y1 = 238
const LO = Math.log10(1.5e-4)
const HI = Math.log10(0.5)
const px = age => X0 + ((age - 20) / 80) * (X1 - X0)
const py = q => Y1 - ((Math.log10(q) - LO) / (HI - LO)) * (Y1 - Y0)

// Catmull-Rom through the points, written as cubic Bezier segments: a smooth line, not a polyline
function smooth(values) {
  const pts = values.map((q, i) => [px(AGES[i]), py(q)])
  let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[i + 2] || p2
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6]
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]
    d += ` C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`
  }
  return d
}

const INSURED_PATH = smooth(INSURED)
const MEN_PATH = smooth(MEN)
const CNSF_PATH = smooth(CNSF)
const GAP_X = px(40)
const GAP_TOP = py(M40) // the population, above
const GAP_BOTTOM = py(I40) // insured lives, below
const GAP_LABEL = `${Math.round((I40 / M40) * 100)}%`
const DECADES = [[1e-3, '0.1%'], [1e-2, '1%'], [1e-1, '10%']]
const TICKS = [20, 40, 60, 80, 100]

const REVEAL_START = 1.0   // seconds before the scan line starts
const REVEAL_TIME = 2.3
const ease = [0.45, 0, 0.2, 1]

// The numbers are read from the project's results; the labels and units come from the copy
const IMPACT = data.impact
const STAT_VALUES = [
  { to: Math.round(IMPACT.data.deaths / 1000), digits: 0 }, // insured deaths behind the table, thousands
  { to: IMPACT.price.m40, digits: 0 }, // % lower premium, man of 40
  { to: Math.round((I40 / M40) * 100), digits: 0 }, // % of the population's death rate, man of 40
]

export default function HeroScene() {
  const c = useCopy().chart
  const { reduced } = useMotionPref()
  const [open, setOpen] = useState(false)
  // With animations paused every element starts in its final state
  const init = v => (reduced ? false : v)
  const stats = STAT_VALUES.map((v, i) => ({
    ...v, ...c.stats[i], format: x => `${x.toFixed(v.digits)}${c.stats[i].unit}`,
  }))

  // Mouse opens on hover, keyboard on focus, touch on tap. Pen and touch toggle with a tap.
  const onClick = e => {
    const type = e.nativeEvent.pointerType
    if (type === 'touch' || type === 'pen') setOpen(v => !v)
  }
  return (
    <motion.div
      tabIndex={0}
      role="group"
      aria-label={c.aria}
      onPointerEnter={e => e.pointerType === 'mouse' && setOpen(true)}
      onPointerLeave={e => e.pointerType === 'mouse' && setOpen(false)}
      onFocus={e => e.currentTarget.matches(':focus-visible') && setOpen(true)}
      onBlur={() => setOpen(false)}
      onKeyDown={e => e.key === 'Escape' && setOpen(false)}
      onClick={onClick}
      initial={init({ opacity: 0, y: 28, scale: 0.97 })}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 1, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="relative rounded-2xl border border-line bg-card p-4 outline-none focus-visible:border-accent sm:p-5"
    >
      <BeamBorder />

      <div className="flex items-center justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
        <span className="flex items-center gap-2">
          <span className="neon-dot size-1.5 rounded-full" aria-hidden="true" />
          {c.title}
        </span>
        <span className="hidden sm:inline">{c.year}</span>
      </div>

      {/* Quick view */}
      <div aria-hidden="true"
        className={`absolute inset-0 z-20 flex flex-col justify-center gap-3 overflow-hidden rounded-2xl border border-accent/40 bg-card p-5 shadow-[0_0_40px_var(--glow-soft)] transition-[opacity,transform] duration-300 ease-out sm:gap-4 sm:p-6 ${
          open ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-2 opacity-0'}`}>
        {c.brief.map(([title, text], i) => (
          <div key={title} className={`transition-[opacity,transform] duration-500 ease-out ${i === 0 ? 'hidden sm:block' : ''}`}
            style={{ transitionDelay: open ? `${80 + i * 70}ms` : '0ms', opacity: open ? 1 : 0, transform: open ? 'none' : 'translateY(8px)' }}>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">{title}</p>
            <p className="mt-1 text-[12.5px] leading-snug text-soft sm:mt-1.5 sm:text-sm sm:leading-relaxed">{text}</p>
          </div>
        ))}
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-faint">{c.sources}</p>
      </div>
      <p className="sr-only">{c.brief.map(([title, text]) => `${title}: ${text}`).join(' ')}</p>

      <div className="relative mt-3">
        <div className="dot-grid absolute inset-0" aria-hidden="true" />
        <svg viewBox="0 0 520 270" className="relative block w-full" role="img" aria-label={c.svgAria}>
          <defs>
            <clipPath id="hero-reveal">
              <motion.rect x="0" y="0" height="270" initial={init({ width: 0 })} animate={{ width: 540 }}
                transition={{ duration: REVEAL_TIME, delay: REVEAL_START, ease }} />
            </clipPath>
          </defs>

          {/* Axes and grid draw first, like a blueprint */}
          {DECADES.map(([q, label], i) => (
            <g key={label}>
              <motion.line x1={X0} x2={X1} y1={py(q)} y2={py(q)} stroke="var(--line)" strokeWidth="1"
                initial={init({ pathLength: 0, opacity: 0 })} animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.9, delay: 0.5 + i * 0.12, ease }} />
              <motion.text x={X0 - 8} y={py(q) + 3.5} textAnchor="end" fontSize="9.5"
                fontFamily="IBM Plex Mono, monospace" fill="var(--faint)"
                initial={init({ opacity: 0 })} animate={{ opacity: 1 }} transition={{ delay: 0.9 + i * 0.1 }}>
                {label}
              </motion.text>
            </g>
          ))}
          <motion.path d={`M${X0},${Y0 - 6} V${Y1} H${X1 + 6}`} fill="none" stroke="var(--soft)" strokeWidth="1.2"
            initial={init({ pathLength: 0 })} animate={{ pathLength: 1 }} transition={{ duration: 1.1, delay: 0.3, ease }} />
          {TICKS.map((age, i) => (
            <motion.text key={age} x={px(age)} y={Y1 + 18} textAnchor="middle" fontSize="9.5"
              fontFamily="IBM Plex Mono, monospace" fill="var(--faint)"
              initial={init({ opacity: 0 })} animate={{ opacity: 1 }} transition={{ delay: 0.8 + i * 0.08 }}>
              {age}
            </motion.text>
          ))}

          {/* The curves are revealed by a rectangle that grows with the scan line */}
          <g clipPath="url(#hero-reveal)">
            <path d={CNSF_PATH} fill="none" stroke="var(--muted)" strokeWidth="2" strokeDasharray="5 5" strokeLinecap="round" />
            <path d={MEN_PATH} fill="none" stroke="var(--soft)" strokeWidth="1.8" strokeLinecap="round" />
            <path d={INSURED_PATH} fill="none" stroke="var(--accent)" strokeWidth="9" strokeLinecap="round" opacity="0.16" />
            <path d={INSURED_PATH} fill="none" stroke="var(--accent)" strokeWidth="2.8" strokeLinecap="round" />
          </g>

          {/* Scan line (only while the chart draws) */}
          {!reduced && (
            <motion.line y1={Y0 - 10} y2={Y1 + 6} stroke="var(--beam-core)" strokeWidth="1.5"
              initial={{ x1: 0, x2: 0, opacity: 0 }}
              animate={{ x1: [0, 540], x2: [0, 540], opacity: [0, 1, 1, 0] }}
              transition={{ duration: REVEAL_TIME, delay: REVEAL_START, ease, times: [0, 0.04, 0.94, 1] }}
              style={{ filter: 'drop-shadow(0 0 6px var(--accent))' }} />
          )}

          {/* The gap that matters */}
          <motion.g initial={init({ opacity: 0 })} animate={{ opacity: 1 }} transition={{ delay: 2.6, duration: 0.6 }}>
            <line x1={GAP_X} x2={GAP_X} y1={GAP_TOP + 3} y2={GAP_BOTTOM - 3} stroke="var(--fg)" strokeWidth="1.2" strokeDasharray="2 3" />
            <circle cx={GAP_X} cy={GAP_BOTTOM} r="3.2" fill="var(--accent)" />
            <circle cx={GAP_X} cy={GAP_TOP} r="3.2" fill="var(--bg)" stroke="var(--soft)" strokeWidth="1.6" />
            <rect x={GAP_X + 10} y={(GAP_TOP + GAP_BOTTOM) / 2 - 11} width="46" height="22" rx="11" fill="var(--bg)" stroke="var(--accent)" strokeWidth="1.2" />
            <text x={GAP_X + 33} y={(GAP_TOP + GAP_BOTTOM) / 2 + 4} textAnchor="middle" fontSize="12" fontWeight="500"
              fontFamily="IBM Plex Mono, monospace" fill="var(--fg)">{GAP_LABEL}</text>
          </motion.g>

          {/* A spark that keeps running along the curve (gone when animations are paused) */}
          {!reduced && (
            <g opacity="0">
              <circle r="9" fill="var(--accent)" opacity="0.3" />
              <circle r="3.4" fill="var(--beam-core)" />
              <animateMotion dur="5.5s" begin="3.4s" repeatCount="indefinite" path={INSURED_PATH} keyPoints="0;1" keyTimes="0;1" calcMode="spline" keySplines="0.45 0 0.2 1" />
              <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.9;1" dur="5.5s" begin="3.4s" repeatCount="indefinite" />
            </g>
          )}
        </svg>
      </div>

      {/* Legend, with the hint on the right (it used to sit over the age labels) */}
      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
        <span className="flex items-center gap-2"><i className="block h-0.5 w-5 rounded bg-accent" /> {c.men}</span>
        <span className="flex items-center gap-2"><i className="block h-0.5 w-5 rounded bg-soft" /> {c.population}</span>
        <span className="flex items-center gap-2"><i className="block h-0 w-5 border-t-2 border-dashed border-muted" /> {c.table}</span>
        <span aria-hidden="true"
          className={`ml-auto rounded-full border border-line bg-bg/80 px-2.5 py-1 tracking-[0.16em] transition-opacity duration-300 ${open ? 'opacity-0' : 'opacity-100'}`}>
          <span className="[@media(hover:hover)]:hidden">{c.hintTap}</span>
          <span className="hidden [@media(hover:hover)]:inline">{c.hintHover}</span> {c.hintTail}
        </span>
      </div>

      <dl className="mt-4 grid grid-cols-3 gap-2 sm:gap-3">
        {stats.map((s, i) => (
          <div key={i} className="border-t border-line pt-2.5">
            <dt className="font-mono text-xl font-medium text-fg sm:text-2xl">
              <CountUp to={s.to} format={s.format} delay={2.2 + i * 0.25} />
            </dt>
            <dd className="mt-0.5 text-[10.5px] leading-snug text-muted sm:text-xs">{s.label}</dd>
          </div>
        ))}
      </dl>
    </motion.div>
  )
}
