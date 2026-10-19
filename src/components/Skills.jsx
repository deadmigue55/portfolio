import NeonButton from './NeonButton'

const categories = [
  {
    label: 'Probability & Statistical Theory',
    color: 'indigo',
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
    skills: [
      'Python (Pandas, NumPy, sklearn)',
      'R (actuarial packages)',
      'SQL (advanced queries)',
      'Git & GitHub',
      'Jupyter & Streamlit',
      'Excel (VBA, Solver, PivotTables)',
      'Tableau (learning)',
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

import { useRef, useState } from 'react'

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
      className="relative overflow-hidden p-6 rounded-xl border border-white/5 bg-white/[0.02] transition-all duration-300"
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

        <p className="text-indigo-400 text-sm font-medium mb-3 tracking-widest uppercase">Skills</p>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          What I bring to the table
        </h2>
        <p className="text-slate-500 mb-12 max-w-xl">
          A rare combination of actuarial rigor, statistical depth, and data engineering chops.
          Hover the cards.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {categories.map(cat => (
            <NeonCard key={cat.label} cat={cat} />
          ))}
        </div>

        {/* Certs / learning callout */}
        <div className="mt-10 p-5 rounded-xl border border-white/5 bg-white/[0.02] flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="flex-1">
            <p className="text-slate-300 font-medium">Currently pursuing</p>
            <p className="text-slate-500 text-sm mt-1">
              Google Professional Data Analytics Certificate · Kaggle ML competitions · CAS Exam P (review)
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
