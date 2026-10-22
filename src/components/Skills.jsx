import { useRef, useState } from 'react'
import NeonButton from './NeonButton'
import SectionHeader from './SectionHeader'
import { StatsPreview, ActuarialPreview, QuantPreview, ToolsPreview } from './Previews'

const categories = [
  {
    label: 'Probability & Statistical Theory',
    color: 'indigo',
    Preview: StatsPreview,
    skills: [
      'A/B Testing & Hypothesis Testing',
      'Bayesian Inference & MCMC',
      'Maximum Likelihood Estimation',
      'Central Limit Theorem Applications',
      'Confidence Intervals & p-values',
      'Chi-Squared & F-Tests',
      'Non-Parametric Methods',
      'Bootstrap & Resampling',
    ],
  },
  {
    label: 'Actuarial Science',
    color: 'violet',
    Preview: ActuarialPreview,
    skills: [
      'IBNR Reserving (Chain Ladder, BF)',
      'Pricing & Experience Rating',
      'Survival Analysis & Hazard Models',
      'Credibility Theory (Bühlmann)',
      'Loss Distributions (Pareto, LogN)',
      'Risk Measures: VaR, CVaR, TVaR',
      'Extreme Value Theory',
      'Copula Modeling',
    ],
  },
  {
    label: 'Quantitative Finance & ML',
    color: 'cyan',
    Preview: QuantPreview,
    skills: [
      'Credit Risk Scoring (PD, LGD, EAD)',
      'Monte Carlo Simulation',
      'Stochastic Processes (Brownian Motion)',
      'ARIMA, GARCH Time Series',
      'GLMs & Regression Analysis',
      'Gradient Boosting (XGBoost)',
      'Principal Component Analysis',
      'Markov Chain Models',
    ],
  },
  {
    label: 'Data Engineering & Tools',
    color: 'sky',
    Preview: ToolsPreview,
    skills: [
      'Python (Pandas, NumPy, sklearn)',
      'R (actuarial packages)',
      'SQL (advanced queries)',
      'Git & GitHub',
      'Jupyter & Streamlit',
      'Excel (VBA, Solver, PivotTables)',
      'AI-assisted development (Claude Code)',
      'LaTeX (mathematical typesetting)',
    ],
  },
]

const colorMap = {
  indigo: { tag: 'bg-accent/10 text-accent border-accent/20', header: 'text-accent', glow: 'var(--glow)' },
  violet: { tag: 'bg-accent/10 text-accent border-accent/20', header: 'text-accent', glow: 'var(--glow)' },
  cyan:   { tag: 'bg-accent/10   text-accent   border-accent/20',   header: 'text-accent',   glow: 'var(--glow)' },
  sky:    { tag: 'bg-accent/10    text-accent    border-accent/20',    header: 'text-accent',    glow: 'var(--glow)' },
}

function NeonCard({ cat }) {
  const ref = useRef(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(false)
  const c = colorMap[cat.color]

  const handleMouseMove = (e) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative overflow-hidden p-6 rounded-xl border border-line bg-card transition-[border-color,box-shadow] duration-300"
      style={{
        borderColor: hovered ? 'color-mix(in srgb, var(--accent) 45%, transparent)' : undefined,
        boxShadow: hovered ? '0 0 30px var(--glow-soft), inset 0 0 30px var(--glow-soft)' : undefined,
      }}
    >
      {/* Mouse-following inner glow */}
      <span
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none rounded-xl transition-opacity duration-150"
        style={{
          opacity: hovered ? 1 : 0,
          background: `radial-gradient(circle 140px at ${pos.x}px ${pos.y}px, var(--glow-soft) 0%, transparent 70%)`,
        }}
      />

      <div className="relative z-10 mb-5">
        <cat.Preview />
      </div>

      <h3 className={`${c.header} font-semibold mb-4 text-sm tracking-wide uppercase relative z-10`}>
        {cat.label}
      </h3>
      <div className="flex flex-wrap gap-2 relative z-10">
        {cat.skills.map(s => (
          <span key={s} className={`px-3 py-1 rounded-full text-xs font-medium border ${c.tag}`}>
            {s}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function Skills() {
  return (
    <section id="skills" className="py-28 px-6 bg-subtle/40">
      <div className="max-w-5xl mx-auto">

        <SectionHeader eyebrow="Skills" title="What I bring to the table">
          Actuarial rigor, statistical depth and the engineering to turn them into working tools.
        </SectionHeader>

        <div className="grid md:grid-cols-2 gap-6">
          {categories.map(cat => (
            <NeonCard key={cat.label} cat={cat} />
          ))}
        </div>

        {/* Certs / learning callout */}
        <div className="neon-ring mt-10 p-5 rounded-xl border border-line bg-card flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="flex-1">
            <p className="text-fg font-medium">Currently leveling up</p>
            <p className="text-muted text-sm mt-1">
              SOA Exam FM · Building AI-powered apps with LLM APIs · Full-stack development with React
            </p>
          </div>
          <NeonButton href="#contact" variant="ghost">
            Let's talk
          </NeonButton>
        </div>
      </div>
    </section>
  )
}
