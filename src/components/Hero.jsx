export default function Hero() {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center px-6 pt-20">
      <div className="max-w-5xl mx-auto w-full">

        {/* Subtle badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></span>
          Open to data science & fintech roles
        </div>

        {/* Main heading */}
        <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-6">
          Miguel<br />
          <span className="italic font-normal" style={{ fontFamily: 'Instrument Serif, serif' }}>
            Vilchis
          </span>
        </h1>

        {/* Tagline */}
        <p className="text-xl md:text-2xl text-slate-400 font-light mb-4 max-w-2xl">
          Actuary · Reinsurance · Data Science
        </p>

        <p className="text-slate-500 max-w-xl leading-relaxed mb-10">
          Quantitative thinker from <span className="text-slate-300">Facultad de Ciencias, UNAM</span>.
          Currently interning at <span className="text-slate-300">SCOR</span>, building data skills on the side —
          aiming to bring an actuarial edge to modern data science and fintech.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap gap-4">
          <a href="#projects"
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors duration-200">
            View Projects
          </a>
          <a href="#contact"
            className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 rounded-lg text-sm font-medium transition-colors duration-200">
            Get in Touch
          </a>
        </div>

        {/* Scroll hint */}
        <div className="mt-20 flex items-center gap-3 text-slate-600 text-xs">
          <div className="w-px h-8 bg-slate-700"></div>
          scroll to explore
        </div>
      </div>
    </section>
  )
}
