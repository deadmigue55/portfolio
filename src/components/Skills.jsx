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
  indigo: { tag: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20', header: 'text-indigo-400', glow: 'rgba(99,102,241,0.6)' },
  violet: { tag: 'bg-violet-500/10 text-violet-300 border-violet-500/20', header: 'text-violet-400', glow: 'rgba(167,139,250,0.6)' },
  cyan:   { tag: 'bg-cyan-500/10   text-cyan-300   border-cyan-500/20',   header: 'text-cyan-400',   glow: 'rgba(34,211,238,0.6)'  },
  sky:    { tag: 'bg-sky-500/10    text-sky-300    border-sky-500/20',    header: 'text-sky-400',    glow: 'rgba(56,189,248,0.6)'  },
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
      className="relative overflow-hidden p-6 rounded-xl border border-white/5 bg-[#0c0c14]/70 backdrop-blur-sm transition-all duration-300"
      style={{
        borderColor: hovered ? c.glow.replace('0.6', '0.35') : undefined,
        boxShadow: hovered ? `0 0 30px ${c.glow.replace('0.6', '0.1')}, inset 0 0 30px ${c.glow.replace('0.6', '0.03')}` : undefined,
      }}
    >
      {/* Mouse-following inner glow */}
      <span
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none rounded-xl transition-opacity duration-150"
        style={{
          opacity: hovered ? 1 : 0,
          background: `radial-gradient(circle 140px at ${pos.x}px ${pos.y}px, ${c.glow.replace('0.6', '0.12')} 0%, transparent 70%)`,
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
    <section id="skills" className="py-28 px-6 bg-white/[0.015]">
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
        <div className="neon-ring mt-10 p-5 rounded-xl border border-white/10 bg-[#0c0c14]/80 flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="flex-1">
            <p className="text-slate-200 font-medium">Currently leveling up</p>
            <p className="text-slate-400 text-sm mt-1">
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
