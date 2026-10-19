export default function About() {
  const timeline = [
    {
      year: '2024 – Present',
      title: 'Intern — Pricing & Reserving',
      org: 'SCOR, Mexico City',
      desc: 'Working in reinsurance pricing and actuarial reserving. Building exposure to financial data pipelines and risk modeling.',
    },
    {
      year: '2020 – 2024',
      title: 'B.Sc. Actuarial Science',
      org: 'Facultad de Ciencias, UNAM',
      desc: 'Studied probability, statistics, financial mathematics, and stochastic processes. Built a strong quantitative foundation.',
    },
  ]

  return (
    <section id="about" className="py-28 px-6">
      <div className="max-w-5xl mx-auto">

        <p className="text-indigo-400 text-sm font-medium mb-3 tracking-widest uppercase">About</p>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-12">
          Actuary learning to build things
        </h2>

        <div className="grid md:grid-cols-2 gap-12">

          {/* Left: bio */}
          <div className="space-y-5 text-slate-400 leading-relaxed">
            <p>
              I'm a recently graduated actuary from UNAM, currently working as an intern at{' '}
              <span className="text-slate-200">SCOR</span>, one of the world's largest reinsurers.
              Day-to-day I work with pricing models, reserving methodologies, and actuarial data.
            </p>
            <p>
              Outside of work, I'm actively learning data science and building projects that sit at
              the intersection of <span className="text-slate-200">quantitative finance</span>,{' '}
              <span className="text-slate-200">machine learning</span>, and{' '}
              <span className="text-slate-200">risk modeling</span> — where my actuarial training
              actually becomes a competitive advantage.
            </p>
            <p>
              My goal is to transition into a data science or fintech role in Mexico City or remotely,
              where I can use both sides of my skill set.
            </p>
          </div>

          {/* Right: timeline */}
          <div className="space-y-6">
            {timeline.map((item, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 shrink-0"></div>
                  {i < timeline.length - 1 && <div className="w-px flex-1 bg-white/5 mt-2"></div>}
                </div>
                <div className="pb-6">
                  <span className="text-xs text-indigo-400 font-medium">{item.year}</span>
                  <h3 className="text-white font-semibold mt-1">{item.title}</h3>
                  <p className="text-slate-500 text-sm">{item.org}</p>
                  <p className="text-slate-400 text-sm mt-2 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
