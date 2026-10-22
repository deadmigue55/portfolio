// Small animated previews for Skills and Projects cards.
// They animate when scrolled into view and loop while visible.
import { motion } from 'motion/react'

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
const toPath = pts => pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ')

const inView = { amount: 0.4 }
const loop = (delay = 0, duration = 1.6) => ({
  duration, delay, ease: 'easeInOut',
  repeat: Infinity, repeatType: 'reverse', repeatDelay: 2.4,
})

function Frame({ label, children, className = '', height = 'h-28' }) {
  return (
    <div className={`relative ${height} overflow-hidden rounded-lg border border-line bg-gradient-to-br from-card-2 to-card ${className}`} aria-hidden="true">
      {children}
      {label && (
        <span className="absolute top-2 left-2 z-10 rounded bg-bg/70 px-1.5 py-0.5 font-mono text-[10px] text-accent">
          {label}
        </span>
      )}
    </div>
  )
}

// SVG line that draws itself (stretches to fill the frame)
function DrawPath({ d, color = 'var(--accent)', width = 2, delay = 0, dashed = false, glow = true }) {
  return (
    <motion.path
      d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round"
      strokeDasharray={dashed ? '4 4' : undefined}
      vectorEffect="non-scaling-stroke"
      style={glow ? { filter: 'drop-shadow(0 0 4px var(--glow))' } : undefined}
      initial={{ pathLength: 0, opacity: 0 }}
      whileInView={{ pathLength: 1, opacity: 1 }}
      viewport={inView}
      transition={loop(delay)}
    />
  )
}

function Svg({ children }) {
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 80" preserveAspectRatio="none">
      {children}
    </svg>
  )
}

/* ════════ Skills previews ════════ */

// Probability & Statistics: histogram filling under a bell curve
const bellPts = Array.from({ length: 61 }, (_, k) => {
  const x = -3 + (6 * k) / 60
  return [(k / 60) * 200, 76 - 60 * Math.exp(-(x * x) / 2)]
})
const bellBars = (() => {
  const r = rng(7)
  return Array.from({ length: 16 }, (_, i) => {
    const x = -3 + (6 * (i + 0.5)) / 16
    const h = 60 * Math.exp(-(x * x) / 2) * (0.82 + r() * 0.3)
    return (h / 80) * 100
  })
})()

export function StatsPreview() {
  return (
    <Frame label="N(μ, σ²)">
      <div className="absolute inset-x-0 bottom-[5%] top-0 flex items-end gap-[2px] px-[1px]">
        {bellBars.map((h, i) => (
          <motion.div key={i} className="flex-1 rounded-t-sm bg-accent/25 border-t border-accent/60"
            initial={{ height: 0 }} whileInView={{ height: `${h}%` }} viewport={inView}
            transition={loop(i * 0.04, 0.9)} />
        ))}
      </div>
      <Svg><DrawPath d={toPath(bellPts)} delay={0.3} /></Svg>
    </Frame>
  )
}

// Actuarial Science: chain-ladder triangle, known cells then projected (IBNR) cells
const N = 6
const cells = Array.from({ length: N * N }, (_, k) => ({ i: Math.floor(k / N), j: k % N }))

export function ActuarialPreview() {
  return (
    <Frame label="chain ladder · IBNR">
      <div className="absolute inset-0 flex items-center justify-end gap-4 pl-4 pr-4 pt-6 pb-2">
        <div className="grid grid-cols-6 gap-[3px] h-full aspect-square">
          {cells.map(({ i, j }) => {
            const known = i + j < N
            return (
              <motion.div key={`${i}-${j}`}
                className={known
                  ? 'rounded-[2px] bg-accent/35 border border-accent/40'
                  : 'rounded-[2px] border border-dashed border-accent/80 bg-accent/10 shadow-[0_0_6px_var(--glow)]'}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }} viewport={inView}
                transition={loop(known ? (i + j) * 0.07 : 0.6 + (i + j - N) * 0.09, 0.45)} />
            )
          })}
        </div>
        <div className="flex flex-col gap-1.5 text-[10px] text-muted">
          <span className="flex items-center gap-1.5"><i className="w-2 h-2 rounded-[2px] bg-accent/50" /> paid</span>
          <span className="flex items-center gap-1.5"><i className="w-2 h-2 rounded-[2px] border border-dashed border-accent" /> projected</span>
        </div>
      </div>
    </Frame>
  )
}

// Quant Finance & ML: Monte Carlo random-walk paths with a VaR line
const walks = (() => {
  const r = rng(42)
  const normal = () => Math.sqrt(-2 * Math.log(r() + 1e-9)) * Math.cos(2 * Math.PI * r())
  return Array.from({ length: 7 }, () => {
    let y = 40
    return toPath(Array.from({ length: 41 }, (_, s) => {
      if (s) y = Math.min(76, Math.max(6, y + normal() * 3.2))
      return [(s / 40) * 200, y]
    }))
  })
})()
const walkColors = ['var(--accent)', 'var(--accent-2)', 'var(--fg)', 'var(--accent)', 'var(--accent-2)', 'var(--soft)', 'var(--muted)']

export function QuantPreview() {
  return (
    <Frame label="monte carlo · VaR₉₉">
      <Svg>
        {walks.map((d, i) => (
          <DrawPath key={i} d={d} color={walkColors[i]} width={1.4} delay={i * 0.12} glow={i < 3} />
        ))}
        <DrawPath d="M0,68 L200,68" color="var(--fg)" width={1} dashed delay={1} glow={false} />
      </Svg>
    </Frame>
  )
}

// Data & Tools: terminal lines typing themselves out
const termLines = [
  { t: '$ python reserve.py --method chain-ladder', c: 'text-soft' },
  { t: '>>> df = pd.read_csv("claims.csv")', c: 'text-accent' },
  { t: '>>> model.fit(X_train, y_train)', c: 'text-accent' },
  { t: '✓ model trained · report saved', c: 'text-good' },
]

export function ToolsPreview() {
  return (
    <Frame className="bg-card-2">
      <div className="flex gap-1.5 px-3 pt-2.5">
        <span className="w-2 h-2 rounded-full bg-rose-400/70" />
        <span className="w-2 h-2 rounded-full bg-amber-300/70" />
        <span className="w-2 h-2 rounded-full bg-emerald-400/70" />
      </div>
      <div className="px-3 pt-2 space-y-1 font-mono text-[11px] leading-tight">
        {termLines.map((l, i) => (
          <motion.p key={i} className={`whitespace-nowrap ${l.c}`}
            initial={{ clipPath: 'inset(0 100% 0 0)' }}
            whileInView={{ clipPath: 'inset(0 0% 0 0)' }} viewport={inView}
            transition={{ ...loop(i * 0.55, 0.6), ease: 'linear' }}>
            {l.t}
          </motion.p>
        ))}
      </div>
    </Frame>
  )
}

/* ════════ Project previews ════════ */

// Credit risk: logistic curve with defaults (top) and non-defaults (bottom)
const sigmoidPts = Array.from({ length: 51 }, (_, k) => {
  const x = (k / 50) * 200
  return [x, 72 - 60 / (1 + Math.exp(-(x - 100) / 16))]
})
const creditDots = (() => {
  const r = rng(11)
  return Array.from({ length: 22 }, () => {
    const x = r() * 200
    const p = 1 / (1 + Math.exp(-(x - 100) / 22))
    const def = r() < p
    const y = def ? 8 + r() * 8 : 64 + r() * 8
    return { left: (x / 200) * 100, top: (y / 80) * 100, def }
  })
})()

export function CreditPreview() {
  return (
    <Frame label="P(default | x)">
      {creditDots.map((d, i) => (
        <motion.span key={i}
          className={`absolute w-1.5 h-1.5 -ml-[3px] -mt-[3px] rounded-full ${d.def ? 'bg-rose-400 shadow-[0_0_6px_rgba(251,113,133,0.9)]' : 'bg-accent shadow-[0_0_6px_var(--glow)]'}`}
          style={{ left: `${d.left}%`, top: `${d.top}%` }}
          initial={{ opacity: 0, scale: 0 }} whileInView={{ opacity: 1, scale: 1 }} viewport={inView}
          transition={loop(i * 0.04, 0.4)} />
      ))}
      <Svg><DrawPath d={toPath(sigmoidPts)} delay={0.6} /></Svg>
    </Frame>
  )
}

// Mortality: q(x) by age, two populations (Gompertz-style curves)
const mortCurve = shift => Array.from({ length: 51 }, (_, k) => {
  const age = (k / 50) * 100
  const q = Math.min(1, 0.0002 * Math.exp(0.085 * (age - shift)) + 0.012 * Math.exp(-age / 1.5))
  return [(k / 50) * 200, 74 - 64 * q]
})

export function MortalityPreview({ height }) {
  return (
    <Frame label="qₓ by age" height={height}>
      <Svg>
        <DrawPath d={toPath(mortCurve(0))} color="var(--accent)" />
        <DrawPath d={toPath(mortCurve(5))} color="var(--fg)" dashed delay={0.4} />
      </Svg>
      <div className="absolute bottom-1 inset-x-2 flex justify-between font-mono text-[9px] text-faint">
        <span>0</span><span>50</span><span>100</span>
      </div>
    </Frame>
  )
}

// Claims dashboard: KPI tiles, monthly claim bars and a loss-ratio line
const claimBars = (() => {
  const r = rng(5)
  return Array.from({ length: 12 }, () => 30 + r() * 55)
})()
const lossRatio = toPath(claimBars.map((h, i) => [((i + 0.5) / 12) * 200, 80 - (h * 0.8 + 6) * 0.8]))

export function ClaimsPreview() {
  return (
    <Frame label="claims · loss ratio">
      <div className="absolute inset-0 flex gap-2 p-2 pt-7">
        <div className="flex flex-col gap-1.5 w-[28%]">
          {['Loss ratio', 'Reserves', 'Claims'].map((k, i) => (
            <motion.div key={k} className="flex-1 rounded border border-line bg-subtle px-1.5 py-1"
              initial={{ opacity: 0, x: -8 }} whileInView={{ opacity: 1, x: 0 }} viewport={inView}
              transition={loop(i * 0.12, 0.5)}>
              <p className="text-[8px] text-faint leading-none">{k}</p>
              <div className="mt-1 h-1.5 w-3/4 rounded-full bg-gradient-to-r from-accent/70 to-accent-2/30" />
            </motion.div>
          ))}
        </div>
        <div className="relative flex-1">
          <div className="absolute inset-0 flex items-end gap-[3px]">
            {claimBars.map((h, i) => (
              <motion.div key={i} className="flex-1 rounded-t-sm bg-accent/30 border-t border-accent/70"
                initial={{ height: 0 }} whileInView={{ height: `${h}%` }} viewport={inView}
                transition={loop(0.2 + i * 0.05, 0.7)} />
            ))}
          </div>
          <Svg><DrawPath d={lossRatio} color="var(--accent)" delay={0.8} /></Svg>
        </div>
      </div>
    </Frame>
  )
}
