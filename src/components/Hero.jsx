import NeonSymbols from './NeonSymbols'
import NeonButton from './NeonButton'

export default function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center px-6 pt-20 overflow-hidden">

      {/* Floating neon math symbols */}
      <NeonSymbols />

      {/* Deep radial background glow */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div style={{
          position: 'absolute',
          top: '30%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '700px', height: '500px',
          background: 'radial-gradient(ellipse, rgba(99,102,241,0.12) 0%, rgba(0,212,255,0.05) 40%, transparent 70%)',
          filter: 'blur(40px)',
        }} />
      </div>

      <div className="max-w-5xl mx-auto w-full relative z-10">

        {/* Status badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></span>
          Open to data science &amp; fintech roles · Mexico City / Remote
        </div>

        {/* Main heading */}
        <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-6">
          Miguel<br />
          <span
            className="italic font-normal"
            style={{
              fontFamily: 'Instrument Serif, serif',
              background: 'linear-gradient(90deg, #a5b4fc 0%, #22d3ee 50%, #818cf8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
            Vilchis
          </span>
        </h1>

        {/* Tagline */}
        <p className="text-xl md:text-2xl text-slate-400 font-light mb-4 max-w-2xl">
          Actuary · Quant Risk · Data Scientist
        </p>

        <p className="text-slate-500 max-w-xl leading-relaxed mb-10">
          Probabilistic thinker from{' '}
          <span className="text-slate-300">Facultad de Ciencias, UNAM</span>.
          Turning stochastic models and actuarial intuition into production-ready
          data science at <span className="text-slate-300">SCOR</span> —
          one of the world's top reinsurers. Building the bridge between
          classical probability theory and modern machine learning.
        </p>

        {/* LED Neon CTAs */}
        <div className="flex flex-wrap gap-4">
          <NeonButton href="#projects" variant="primary">
            View Projects
          </NeonButton>
          <NeonButton href="#contact" variant="ghost">
            Get in Touch
          </NeonButton>
        </div>

        {/* Scroll hint */}
        <div className="mt-20 flex items-center gap-3 text-slate-700 text-xs">
          <div className="w-px h-8 bg-slate-800"></div>
          scroll to explore
        </div>
      </div>
    </section>
  )
}
