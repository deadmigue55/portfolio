import { useEffect, useRef } from 'react'
import { useCopy } from '../i18n'

const OMEGA = 110 // the age at which the life table closes, as in the Mortality Table Builder
const MAJOR = [0, 20, 40, 60, 80, 100]

// A ruler down the right edge: how far you have scrolled, read as an age from 0 to omega.
// Click or drag on it to jump. Decoration for mouse users on wide screens (hidden from assistive
// technology; the page's own links and the keyboard do the real navigating).
export default function AgeRuler() {
  const label = useCopy().intro.age
  const box = useRef(null)
  const marker = useRef(null)
  const readout = useRef(null)

  useEffect(() => {
    let raf = 0
    const draw = () => {
      raf = 0
      const max = document.documentElement.scrollHeight - window.innerHeight
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
      const top = `${(p * 100).toFixed(2)}%`
      marker.current.style.top = top
      readout.current.style.top = top
      readout.current.textContent = `${label} ${Math.round(p * OMEGA)}`
    }
    const schedule = () => { if (!raf) raf = requestAnimationFrame(draw) }
    draw()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      cancelAnimationFrame(raf)
    }
  }, [label])

  const scrub = e => {
    const r = box.current.getBoundingClientRect()
    const p = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height))
    const max = document.documentElement.scrollHeight - window.innerHeight
    window.scrollTo({ top: p * max, behavior: 'instant' })
  }
  const down = e => { e.currentTarget.setPointerCapture(e.pointerId); scrub(e) }
  const drag = e => { if (e.currentTarget.hasPointerCapture(e.pointerId)) scrub(e) }

  const ticks = []
  for (let a = 0; a <= OMEGA; a += 5) ticks.push(a)

  return (
    <div ref={box} aria-hidden="true" className="age-ruler" onPointerDown={down} onPointerMove={drag}>
      {ticks.map(a => (
        <span key={a} className={`age-ruler-tick ${a % 20 === 0 ? 'is-major' : ''}`} style={{ top: `${(a / OMEGA) * 100}%` }} />
      ))}
      {MAJOR.map(a => (
        <span key={a} className="age-ruler-label" style={{ top: `${(a / OMEGA) * 100}%` }}>{a}</span>
      ))}
      <span className="age-ruler-label" style={{ top: '100%' }}>ω</span>
      <span ref={marker} className="age-ruler-marker" />
      <span ref={readout} className="age-ruler-readout" />
    </div>
  )
}
