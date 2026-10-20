import SectionHeader from './SectionHeader'
import { CreditPreview, MortalityPreview, ClaimsPreview } from './Previews'

const projects = [
  {
    title: 'Credit Risk Scoring Model',
    status: 'In Progress',
    desc: 'Machine learning pipeline that predicts the probability of credit default from financial and behavioral features. A logistic regression baseline compared against gradient boosting.',
    tags: ['Python', 'sklearn', 'Pandas', 'Finance'],
    Preview: CreditPreview,
    link: null,
  },
  {
    title: 'Mortality Table Builder',
    status: 'Planned',
    desc: 'Interactive tool to construct and visualize mortality tables with actuarial methodology, built for life insurance pricing.',
    tags: ['Python', 'Actuarial', 'Streamlit'],
    Preview: MortalityPreview,
    link: null,
  },
  {
    title: 'Reinsurance Claims Dashboard',
    status: 'Planned',
    desc: 'Dashboard for analyzing reinsurance claims patterns, loss ratios and reserve development. Inspired by real reinsurance workflows.',
    tags: ['Python', 'Plotly', 'Reinsurance', 'Data Viz'],
    Preview: ClaimsPreview,
    link: null,
  },
]

const statusColor = {
  'In Progress': 'bg-amber-500/10 text-amber-300 border-amber-500/25',
  'Planned':     'bg-sky-500/10 text-sky-300 border-sky-500/25',
  'Live':        'bg-emerald-500/10 text-emerald-300 border-emerald-500/25',
}

export default function Projects() {
  return (
    <section id="projects" className="py-28 px-6">
      <div className="max-w-5xl mx-auto">

        <SectionHeader eyebrow="Projects" title="Things I'm building">
          In-depth projects that put actuarial knowledge to work with data science and AI.
          Each one gets a full write-up: the problem, the math, the code and the results.
        </SectionHeader>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map(p => (
            <div key={p.title}
              className="neon-ring group p-6 rounded-xl border border-white/10 bg-[#0c0c14]/85 backdrop-blur-sm hover:-translate-y-1 transition-all duration-300 flex flex-col">

              <div className="mb-5">
                <p.Preview />
              </div>

              {/* Status badge */}
              <span className={`self-start px-2.5 py-1 rounded-full text-xs font-medium border mb-4 ${statusColor[p.status]}`}>
                {p.status}
              </span>

              <h3 className="text-white font-semibold mb-2 group-hover:text-sky-100 transition-colors">{p.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed flex-1">{p.desc}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mt-4">
                {p.tags.map(t => (
                  <span key={t} className="text-xs text-slate-400 bg-white/5 px-2 py-0.5 rounded">
                    {t}
                  </span>
                ))}
              </div>

              {/* Link once a write-up exists */}
              {p.link
                ? (
                  <a href={p.link} target="_blank" rel="noopener noreferrer"
                    className="mt-5 text-sm text-sky-300 hover:text-white transition-colors">
                    Read the full write-up →
                  </a>
                )
                : <span className="mt-5 text-sm text-slate-600">Write-up coming soon</span>}
            </div>
          ))}
        </div>

        <p className="text-slate-500 text-sm mt-8">
          More projects are in the pipeline. This page grows as they ship.
        </p>
      </div>
    </section>
  )
}
