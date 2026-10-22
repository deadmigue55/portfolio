import { useRef } from 'react'
import NeonButton from './NeonButton'

export default function Hero() {
  const spotRef = useRef(null)

  // Moves the blue spotlight with the cursor (CSS variables, no re-renders)
  const moveSpot = (e) => {
    const el = spotRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    el.style.setProperty('--mx', `${e.clientX - rect.left}px`)
    el.style.setProperty('--my', `${e.clientY - rect.top}px`)
    el.classList.add('is-on')
  }
  const hideSpot = () => spotRef.current?.classList.remove('is-on')

  return (
    <section
      id="home"
      onPointerMove={moveSpot}
      onPointerLeave={hideSpot}
      className="relative min-h-screen flex items-center justify-center px-6 pt-20 overflow-hidden"
    >
      <div ref={spotRef} className="hero-spotlight" aria-hidden="true" />

      {/* Deep radial background glow */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div style={{
          position: 'absolute',
          top: '30%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '700px', maxWidth: '100vw', height: '500px',
          background: 'radial-gradient(ellipse, var(--pool-1) 0%, var(--pool-2) 40%, transparent 70%)',
          filter: 'blur(40px)',
        }} />
      </div>

      <div className="max-w-5xl mx-auto w-full relative z-10">

        {/* Status badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/30 text-accent text-xs font-medium mb-8 shadow-[0_0_18px_var(--glow)]">
          <span className="neon-dot w-1.5 h-1.5 rounded-full"></span>
          Open to new opportunities · Mexico City / Remote
        </div>

        {/* Main heading */}
        <h1 className="text-5xl md:text-7xl font-bold text-fg leading-tight mb-6 [text-shadow:0_0_30px_var(--glow-soft)]">
          Miguel<br />
          <span className="neon-name italic font-normal" style={{ fontFamily: 'Instrument Serif, serif' }}>
            Vilchis
          </span>
        </h1>

        {/* Tagline */}
        <p className="text-xl md:text-2xl text-soft font-light mb-4 max-w-2xl">
          Actuary · Pricing &amp; Risk · Data &amp; AI
        </p>

        <p className="text-muted max-w-xl leading-relaxed mb-10">
          Actuarial Science graduate from{' '}
          <span className="text-fg">Facultad de Ciencias, UNAM</span>, working in pricing and
          risk analytics at <span className="text-fg">SCOR</span>, one of the world's largest
          reinsurers. I build tools that combine probability theory, machine learning and AI to
          price, model and explain risk.
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
        <div className="mt-20 flex items-center gap-3 text-faint text-xs">
          <div className="w-px h-8 bg-gradient-to-b from-accent/70 to-transparent"></div>
          scroll to explore
        </div>
      </div>
    </section>
  )
}
