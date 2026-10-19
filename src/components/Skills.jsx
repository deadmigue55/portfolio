const categories = [
  {
    label: 'Actuarial & Finance',
    color: 'indigo',
    skills: ['Reserving (IBNR)', 'Pricing & Rating', 'Life & Non-Life Models', 'Stochastic Processes', 'Financial Mathematics', 'Reinsurance'],
  },
  {
    label: 'Data & Programming',
    color: 'violet',
    skills: ['Python', 'R', 'SQL', 'Pandas', 'NumPy', 'Matplotlib / Seaborn'],
  },
  {
    label: 'Tools & Workflow',
    color: 'sky',
    skills: ['Excel (Advanced)', 'Git & GitHub', 'Jupyter Notebooks', 'LaTeX', 'Tableau (learning)', 'Vercel'],
  },
  {
    label: 'Currently Learning',
    color: 'emerald',
    skills: ['Machine Learning (sklearn)', 'Streamlit', 'Data Engineering basics', 'React', 'Financial APIs'],
  },
]

const colorMap = {
  indigo: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20',
  violet: 'bg-violet-500/10 text-violet-300 border-violet-500/20',
  sky:    'bg-sky-500/10    text-sky-300    border-sky-500/20',
  emerald:'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
}

export default function Skills() {
  return (
    <section id="skills" className="py-28 px-6 bg-white/[0.02]">
      <div className="max-w-5xl mx-auto">

        <p className="text-indigo-400 text-sm font-medium mb-3 tracking-widest uppercase">Skills</p>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-12">What I work with</h2>

        <div className="grid md:grid-cols-2 gap-6">
          {categories.map(cat => (
            <div key={cat.label}
              className="p-6 rounded-xl border border-white/5 bg-white/[0.02] hover:border-white/10 transition-colors duration-200">
              <h3 className="text-slate-300 font-semibold mb-4">{cat.label}</h3>
              <div className="flex flex-wrap gap-2">
                {cat.skills.map(s => (
                  <span key={s}
                    className={`px-3 py-1 rounded-full text-xs font-medium border ${colorMap[cat.color]}`}>
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
