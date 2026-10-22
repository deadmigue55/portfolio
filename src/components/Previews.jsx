// Small blueprint-style previews for the Skills and Projects cards.
//
// Each one is complete at rest. Just before it scrolls into view it is armed (hidden), then it
// builds once: outlines draw first, shapes fill in, a spark or sweep keeps moving afterwards.
// Leaving the screen re-arms it, so it builds again on the way back. The animation itself lives in
// CSS (index.css, `.pv-*`); this file only decides what to draw and when each piece starts.
import { useLayoutEffect, useRef, useState } from 'react'

/* ── Helpers ── */

// Seeded random numbers so every visit draws the same "random" data
function rng(seed) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const line = pts => pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ')

// Catmull-Rom through the points, as cubic Bezier segments
function smooth(pts) {
  let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6]
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]
    d += ` C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`
  }
  return d
}

const d = seconds => ({ '--d': `${seconds}s` })

// Armed before first paint (so it never flashes complete), played while on screen
function usePlay() {
  const ref = useRef(null)
  const [state, setState] = useState('rest')
  useLayoutEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    setState('armed')
    const io = new IntersectionObserver(([e]) => setState(e.isIntersecting ? 'playing' : 'armed'), { threshold: 0.35 })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return [ref, state === 'armed' ? 'is-armed' : state === 'playing' ? 'is-playing' : '']
}

// A bare box that plays its children's animations while on screen (the Contact cards use it too)
export function PlayBox({ children, className = '' }) {
  const [ref, state] = usePlay()
  return <div ref={ref} aria-hidden="true" className={`pv ${state} ${className}`}>{children}</div>
}

function Frame({ label, children, className = '', height = 'h-28' }) {
  const [ref, state] = usePlay()
  return (
    <div ref={ref} aria-hidden="true"
      className={`pv ${state} relative ${height} overflow-hidden rounded-lg border border-line bg-gradient-to-br from-card-2 to-card ${className}`}>
      <div className="dot-grid absolute inset-0 opacity-70" />
      {children}
      {label && (
        <span className="absolute left-2 top-2 z-10 rounded bg-bg/70 px-1.5 py-0.5 font-mono text-[10px] text-accent">
          {label}
        </span>
      )}
    </div>
  )
}

function Svg({ vb = '0 0 400 100', children }) {
  return (
    <svg className="absolute inset-0 h-full w-full" viewBox={vb} preserveAspectRatio="xMidYMid meet">
      {children}
    </svg>
  )
}

// A line that draws itself (pathLength is normalised to 1 so the CSS needs no per-path numbers)
function Draw({ path, stroke = 'var(--accent)', w = 2, delay = 0, time = 1.4, glow = false, ...rest }) {
  return (
    <>
      {glow && <path d={path} pathLength="1" fill="none" stroke={stroke} strokeWidth={w * 4} opacity="0.14" strokeLinecap="round"
        className="pv-draw" style={{ ...d(delay), '--t': `${time}s` }} />}
      <path d={path} pathLength="1" fill="none" stroke={stroke} strokeWidth={w} strokeLinecap="round"
        className="pv-draw" style={{ ...d(delay), '--t': `${time}s` }} {...rest} />
    </>
  )
}

/* ════════ Skills previews ════════ */

// Probability and statistics: a histogram rising under a bell curve, a sweep reading across it
const BARS = 26
const bell = x => Math.exp(-(x * x) / 2)
const bellBars = (() => {
  const r = rng(7)
  return Array.from({ length: BARS }, (_, i) => {
    const x = -3 + (6 * (i + 0.5)) / BARS
    return 66 * bell(x) * (0.82 + r() * 0.3)
  })
})()
const bellPath = line(Array.from({ length: 61 }, (_, k) => {
  const x = -3 + (6 * k) / 60
  return [30 + (k / 60) * 340, 88 - 66 * bell(x)]
}))

export function StatsPreview() {
  return (
    <Frame label="N(μ, σ²)">
      <Svg>
        {bellBars.map((h, i) => (
          <rect key={i} x={30 + i * (340 / BARS) + 1} y={88 - h} width={340 / BARS - 2} height={h} rx="1.5"
            className="pv-grow fill-accent/25 stroke-accent/50" strokeWidth="1" style={d(0.5 + i * 0.03)} />
        ))}
        <Draw path="M20,88 H380" stroke="var(--soft)" w={1.2} time={0.9} />
        <Draw path={bellPath} delay={0.9} time={1.5} glow />
        <line x1="30" x2="30" y1="14" y2="88" stroke="var(--beam-core)" strokeWidth="1.5" className="pv-sweep" style={{ '--span': '340px' }} />
      </Svg>
    </Frame>
  )
}

// Actuarial science: a development triangle. Paid cells land first, projected (IBNR) cells shimmer.
const N = 6
const CELL = 11, GAP = 3
const cells = Array.from({ length: N * N }, (_, k) => ({ i: Math.floor(k / N), j: k % N }))

export function ActuarialPreview() {
  const x0 = 270, y0 = 12
  return (
    <Frame label="chain ladder · IBNR">
      <Svg>
        {cells.map(({ i, j }) => {
          const known = i + j < N
          const x = x0 + j * (CELL + GAP), y = y0 + i * (CELL + GAP)
          return known ? (
            <rect key={`${i}-${j}`} x={x} y={y} width={CELL} height={CELL} rx="2"
              className="pv-pop fill-accent/35 stroke-accent/45" strokeWidth="1" style={d(0.3 + (i + j) * 0.07)} />
          ) : (
            <g key={`${i}-${j}`} className="pv-fade" style={d(1.2 + (i + j - N) * 0.1)}>
              <rect x={x} y={y} width={CELL} height={CELL} rx="2" strokeDasharray="2.5 2"
                className="pv-shimmer fill-accent/10 stroke-accent" strokeWidth="1" style={d(2.6 + (i + j - N) * 0.22)} />
            </g>
          )
        })}
        <g className="pv-fade" style={d(0.8)} fontFamily="IBM Plex Mono, monospace" fontSize="9">
          <rect x="60" y="38" width="9" height="9" rx="2" className="fill-accent/35 stroke-accent/45" />
          <text x="76" y="46" fill="var(--muted)">paid</text>
          <rect x="60" y="56" width="9" height="9" rx="2" strokeDasharray="2.5 2" className="fill-accent/10 stroke-accent" />
          <text x="76" y="64" fill="var(--muted)">projected</text>
        </g>
      </Svg>
    </Frame>
  )
}

// Quantitative finance: Monte Carlo paths with a VaR line, one path glowing at a time
const WALKS = (() => {
  const r = rng(42)
  const normal = () => Math.sqrt(-2 * Math.log(r() + 1e-9)) * Math.cos(2 * Math.PI * r())
  return Array.from({ length: 7 }, () => {
    let y = 50
    return smooth(Array.from({ length: 31 }, (_, s) => {
      if (s) y = Math.min(88, Math.max(14, y + normal() * 4.2))
      return [14 + (s / 30) * 372, y]
    }))
  })
})()
const WALK_COLORS = ['var(--accent)', 'var(--accent-2)', 'var(--fg)', 'var(--accent)', 'var(--accent-2)', 'var(--soft)', 'var(--muted)']

export function QuantPreview() {
  return (
    <Frame label="monte carlo · VaR₉₉">
      <Svg>
        {WALKS.map((path, i) => (
          <g key={i} className="pv-glow" style={d(2.4 + i * 1.1)}>
            <Draw path={path} stroke={WALK_COLORS[i]} w={1.5} delay={i * 0.12} time={1.6} />
          </g>
        ))}
        <g className="pv-fade" style={d(1.6)}>
          <line x1="14" x2="386" y1="80" y2="80" stroke="var(--fg)" strokeWidth="1" strokeDasharray="4 4" opacity="0.6" />
          <text x="384" y="75" textAnchor="end" fontFamily="IBM Plex Mono, monospace" fontSize="8.5" fill="var(--muted)">VaR₉₉</text>
        </g>
      </Svg>
    </Frame>
  )
}

// Data and tools: a terminal typing itself out
const TERM = [
  { t: '$ python reserve.py --method chain-ladder', c: 'text-soft' },
  { t: '>>> df = pd.read_csv("claims.csv")', c: 'text-accent' },
  { t: '>>> model.fit(X_train, y_train)', c: 'text-accent' },
  { t: '✓ model trained · report saved', c: 'text-good' },
]
const START = [0.3, 1.9, 3.1, 4.2]

export function ToolsPreview() {
  return (
    <Frame className="bg-card-2">
      <div className="flex gap-1.5 px-3 pt-2.5">
        <span className="h-2 w-2 rounded-full bg-rose-400/70" />
        <span className="h-2 w-2 rounded-full bg-amber-300/70" />
        <span className="h-2 w-2 rounded-full bg-emerald-400/70" />
      </div>
      <div className="space-y-1 px-3 pt-2 font-mono text-[11px] leading-tight">
        {TERM.map((l, i) => (
          <p key={i} className={`pv-type ${l.c}`}
            style={{ '--w': `${l.t.length}ch`, '--n': l.t.length, '--t': `${l.t.length * 0.03}s`, '--d': `${START[i]}s` }}>
            {l.t}
          </p>
        ))}
        <span className="pv-caret inline-block h-3 w-1.5 translate-y-0.5 bg-accent" style={d(5.2)} />
      </div>
    </Frame>
  )
}

/* ════════ Project previews ════════ */

// Credit risk: defaults (top) and repayments (bottom) separated by a logistic curve
const SIG = Array.from({ length: 41 }, (_, k) => {
  const x = 14 + (k / 40) * 372
  return [x, 82 - 62 / (1 + Math.exp(-(x - 200) / 34))]
})
const SIG_PATH = line(SIG)
const CREDIT_DOTS = (() => {
  const r = rng(11)
  return Array.from({ length: 26 }, () => {
    const x = 20 + r() * 360
    const def = r() < 1 / (1 + Math.exp(-(x - 200) / 46))
    return { x, y: def ? 14 + r() * 14 : 72 + r() * 14, def }
  })
})()

export function CreditPreview() {
  return (
    <Frame label="P(default | x)">
      <Svg>
        <Draw path="M14,90 H386" stroke="var(--soft)" w={1} time={0.8} />
        <g className="pv-fade" style={d(1.4)}>
          <line x1="200" x2="200" y1="10" y2="90" stroke="var(--fg)" strokeWidth="1" strokeDasharray="3 4" opacity="0.5" />
        </g>
        {CREDIT_DOTS.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="2.7" className="pv-pop"
            fill={p.def ? 'var(--accent)' : 'var(--muted)'} style={d(0.3 + i * 0.035)} />
        ))}
        <Draw path={SIG_PATH} delay={0.6} time={1.5} glow />
        <g>
          <circle r="7" fill="var(--accent)" opacity="0.28" />
          <circle r="2.6" fill="var(--beam-core)" />
          <animateMotion dur="5s" begin="2.4s" repeatCount="indefinite" path={SIG_PATH} />
          <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.9;1" dur="5s" begin="2.4s" repeatCount="indefinite" />
        </g>
      </Svg>
    </Frame>
  )
}

// Flagship: life expectancy at 65 for Mexican men, observed (with the pandemic dip) and projected.
// Real values from the project (observed: INEGI and CONAPO; scenarios: Lee-Carter fits, p5 to p95).
const YEARS = [1950, 2070], VALS = [11, 24]
const FX = y => 52 + ((y - YEARS[0]) / (YEARS[1] - YEARS[0])) * 408
const FY = v => 250 - ((v - VALS[0]) / (VALS[1] - VALS[0])) * 216
const OBS = [[1950, 12.08], [1955, 13.27], [1960, 13.57], [1965, 14.06], [1970, 14.06], [1975, 15.09], [1980, 14.97],
  [1985, 15.38], [1990, 15.8], [1995, 15.87], [2000, 16.51], [2005, 16.47], [2010, 17.14], [2015, 17.47], [2019, 18.16],
  [2020, 13.6], [2021, 13.7], [2024, 17.55]].map(([y, v]) => [FX(y), FY(v)])
const SCEN = {
  long: { mid: [[2024, 17.55], [2025, 17.61], [2040, 18.59], [2055, 19.56], [2070, 20.55]], hi: [17.72, 19.05, 20.32, 21.61], lo: [17.5, 18.1, 18.79, 19.52] },
  recent: { mid: [[2024, 17.55], [2025, 17.56], [2040, 17.84], [2055, 18.1], [2070, 18.36]], hi: [17.67, 18.38, 19.04, 19.71], lo: [17.46, 17.28, 17.16, 17.1] },
  conapo: { mid: [[2024, 17.55], [2025, 18.52], [2040, 20.08], [2055, 21.71], [2070, 23.24]] },
}
const toPts = mid => mid.map(([y, v]) => [FX(y), FY(v)])
const band = ({ hi, lo }) => {
  const ys = [2025, 2040, 2055, 2070]
  const up = ys.map((y, i) => [FX(y), FY(hi[i])])
  const dn = ys.map((y, i) => [FX(y), FY(lo[i])]).reverse()
  return `${smooth(up)} L${dn[0][0].toFixed(1)},${dn[0][1].toFixed(1)} ${smooth(dn).replace(/^M[^C]*/, '')} Z`
}
const OBS_PATH = line(OBS)
const LONG_PATH = smooth(toPts(SCEN.long.mid))

export function MortalityPreview({ height }) {
  const mono = { fontFamily: 'IBM Plex Mono, monospace' }
  return (
    <Frame label="e₆₅ · life expectancy at 65" height={height}>
      <Svg vb="0 0 480 290">
        {/* axes and ticks */}
        <Draw path={`M52,24 V250 H474`} stroke="var(--soft)" w={1.2} time={1} />
        <g className="pv-fade" style={d(0.5)} fontSize="9.5" {...mono} fill="var(--faint)">
          {[1950, 2000, 2050].map(y => <text key={y} x={FX(y)} y="268" textAnchor="middle">{y}</text>)}
          {[15, 20].map(v => <text key={v} x="44" y={FY(v) + 3} textAnchor="end">{v}</text>)}
          {[15, 20].map(v => <line key={v} x1="52" x2="474" y1={FY(v)} y2={FY(v)} stroke="var(--line)" />)}
        </g>
        {/* scenario bands, then the observed history, then the projections */}
        <path d={band(SCEN.long)} fill="var(--accent)" fillOpacity="0.22" className="pv-fade" style={d(2.3)} />
        <path d={band(SCEN.recent)} fill="var(--fg)" fillOpacity="0.1" className="pv-fade" style={d(2.5)} />
        <Draw path={OBS_PATH} stroke="var(--fg)" w={2} delay={0.5} time={1.9} />
        <Draw path={smooth(toPts(SCEN.conapo.mid))} stroke="var(--muted)" w={1.5} delay={2.6} time={1} />
        <Draw path={smooth(toPts(SCEN.recent.mid))} stroke="var(--soft)" w={1.8} delay={2.6} time={1} />
        <Draw path={LONG_PATH} w={2.6} delay={2.4} time={1.2} glow />
        {/* the pandemic */}
        <g className="pv-fade" style={d(1.9)} {...mono} fontSize="9">
          <line x1={FX(2020.5)} x2={FX(2020.5)} y1="30" y2="250" stroke="var(--fg)" strokeDasharray="2 4" opacity="0.4" />
          <text x={FX(2020.5) - 5} y="40" textAnchor="end" fill="var(--muted)">COVID-19</text>
        </g>
        <g className="pv-fade" style={d(3.2)} {...mono} fontSize="9.5">
          <text x="462" y="36" textAnchor="end" fill="var(--muted)">CONAPO official</text>
          <text x="462" y={FY(21.61) - 8} textAnchor="end" fill="var(--accent)">long-run trend</text>
          <text x="462" y={FY(17.1) + 16} textAnchor="end" fill="var(--soft)">recent trend</text>
        </g>
        <g>
          <circle r="9" fill="var(--accent)" opacity="0.3" />
          <circle r="3.4" fill="var(--beam-core)" />
          <animateMotion dur="5s" begin="4s" repeatCount="indefinite" path={LONG_PATH} />
          <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.9;1" dur="5s" begin="4s" repeatCount="indefinite" />
        </g>
      </Svg>
    </Frame>
  )
}

// Claims dashboard: KPI tiles, monthly claim bars and a loss-ratio line
const CLAIMS = (() => {
  const r = rng(5)
  return Array.from({ length: 12 }, () => 28 + r() * 52)
})()
const CLAIM_X = i => 160 + i * 19.5
const LOSS_PATH = smooth(CLAIMS.map((h, i) => [CLAIM_X(i) + 7, 84 - (h * 0.8 + 6) * 0.78]))

export function ClaimsPreview() {
  const mono = { fontFamily: 'IBM Plex Mono, monospace' }
  return (
    <Frame label="claims · loss ratio">
      <Svg>
        {['Loss ratio', 'Reserves', 'Claims'].map((k, i) => (
          <g key={k} className="pv-fade" style={d(0.2 + i * 0.12)}>
            <rect x="16" y={24 + i * 22} width="124" height="18" rx="3" className="fill-subtle stroke-line" />
            <text x="22" y={36 + i * 22} fontSize="8" {...mono} fill="var(--faint)">{k}</text>
            <rect x="74" y={29 + i * 22} width={44 - i * 10} height="6" rx="3" fill="var(--accent)" opacity="0.7" />
          </g>
        ))}
        {CLAIMS.map((h, i) => (
          <rect key={i} x={CLAIM_X(i)} y={88 - h * 0.8} width="14" height={h * 0.8} rx="1.5"
            className="pv-grow fill-accent/30 stroke-accent/60" strokeWidth="1" style={d(0.4 + i * 0.05)} />
        ))}
        <Draw path="M150,88 H394" stroke="var(--soft)" w={1} time={0.8} />
        <Draw path={LOSS_PATH} delay={1} time={1.5} glow />
        <line x1="150" x2="150" y1="14" y2="88" stroke="var(--beam-core)" strokeWidth="1.5" className="pv-sweep" style={{ '--span': '244px' }} />
      </Svg>
    </Frame>
  )
}
