const projects = [
  {
    title: 'Credit Risk Scoring Model',
    status: 'In Progress',
    desc: 'Machine learning pipeline to predict credit default probability using financial and behavioral features. Logistic regression baseline with gradient boosting comparison.',
    tags: ['Python', 'sklearn', 'Pandas', 'Finance'],
    link: null,
  },
  {
    title: 'Mortality Table Builder',
    status: 'Planned',
    desc: 'Interactive tool to construct and visualize mortality tables using actuarial methodology. Built for life insurance pricing use cases.',
    tags: ['Python', 'Actuarial', 'Streamlit'],
    link: null,
  },
  {
    title: 'Reinsurance Claims Dashboard',
    status: 'Planned',
    desc: 'Data visualization dashboard for analyzing reinsurance claims patterns, loss ratios, and reserve development. Inspired by real SCOR workflows.',
    tags: ['Python', 'Plotly', 'Reinsurance', 'Data Viz'],
    link: null,
  },
]

const statusColor = {
  'In Progress': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  'Planned':     'bg-slate-500/10  text-slate-400  border-slate-500/20',
  'Live':        'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
}

export default function Projects() {
  return (
    <section id="projects" className="py-28 px-6">
      <div className="max-w-5xl mx-auto">

        <p className="text-indigo-400 text-sm font-medium mb-3 tracking-widest uppercase">Projects</p>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Things I'm building</h2>
        <p className="text-slate-500 mb-12 max-w-xl">
          Projects that combine actuarial knowledge with data science. More coming as I build skills.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((p, i) => (
            <div key={i}
              className="group p-6 rounded-xl border border-white/5 bg-white/[0.02] hover:border-indigo-500/30 hover:bg-white/[0.04] transition-all duration-200 flex flex-col">

              {/* Status badge */}
              <span className={`self-start px-2.5 py-1 rounded-full text-xs font-medium border mb-4 ${statusColor[p.status]}`}>
                {p.status}
              </span>

              <h3 className="text-white font-semibold mb-2">{p.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed flex-1">{p.desc}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mt-4">
                {p.tags.map(t => (
                  <span key={t} className="text-xs text-slate-500 bg-white/5 px-2 py-0.5 rounded">
                    {t}
                  </span>
                ))}
              </div>

              {/* Link if available */}
              {p.link && (
                <a href={p.link} target="_blank" rel="noopener noreferrer"
                  className="mt-4 text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
                  View project →
                </a>
              )}
            </div>
          ))}
        </div>

        <p className="text-slate-600 text-sm mt-8">
          More projects will appear here as they're built. Check back soon.
        </p>
      </div>
    </section>
  )
}
