import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import NeonButton from './NeonButton'

// Scroll cue: a mouse outline with a dot that slides down, and a label in the site's two voices
// (mono for the instruction, the serif italic of the surname for the invitation).
// It fades away as soon as the visitor starts scrolling, and a click jumps to the next section.
function ScrollCue() {
  const { scrollY } = useScroll()
  const opacity = useTransform(scrollY, [0, 140], [1, 0])
  const lift = useTransform(scrollY, [0, 140], [0, 14])
  return (
    <motion.a href="#about" style={{ opacity, y: lift }}
      aria-label="Scroll down to the About section"
      className="group mt-16 inline-flex items-center gap-4 outline-none">
      <span aria-hidden="true"
        className="relative flex h-12 w-7 justify-center rounded-full border border-line pt-2.5 transition-colors duration-300 group-hover:border-accent group-focus-visible:border-accent">
        <motion.span className="block h-2 w-1 rounded-full bg-accent"
          animate={{ y: [0, 16], opacity: [1, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 0.5, ease: [0.45, 0, 0.2, 1] }} />
      </span>
      <span className="flex flex-col leading-none transition-transform duration-300 ease-out group-hover:translate-x-1">
        <span className="font-mono text-[11px] uppercase tracking-[0.26em] text-accent">Scroll</span>
        <span className="mt-2 text-xl italic text-soft transition-colors duration-300 group-hover:text-fg"
          style={{ fontFamily: 'Instrument Serif, serif' }}>to explore</span>
      </span>
    </motion.a>
  )
}

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
          <NeonButton href="#projects" variant="primary" arrow>
            View Projects
          </NeonButton>
          <NeonButton href="#contact" variant="ghost">
            Get in Touch
          </NeonButton>
        </div>

        <ScrollCue />
      </div>
    </section>
  )
}
