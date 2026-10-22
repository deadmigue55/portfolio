import NeonButton from './NeonButton'
import Reveal from './Reveal'
import { SpotLayer } from './Electric'
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
  const c = colorMap[cat.color]

  return (
    <div className="spot-card relative h-full overflow-hidden p-6 rounded-xl border border-line bg-card">
      <SpotLayer />

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
          {categories.map((cat, i) => (
            <Reveal key={cat.label} delay={(i % 2) * 0.12} className="h-full">
              <NeonCard cat={cat} />
            </Reveal>
          ))}
        </div>

        {/* Certs / learning callout */}
        <div className="spot-card relative mt-10 p-5 rounded-xl border border-line bg-card flex flex-col md:flex-row items-start md:items-center gap-4">
          <SpotLayer />
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
