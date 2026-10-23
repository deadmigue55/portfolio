import { useEffect, useRef } from 'react'
import { useMotionPref } from '../motion-pref'

const CLICKABLE = 'a, button, summary, input, select, textarea, label, [role="button"], [role="tab"], [data-cursor="link"]'

// A glowing ring that trails the pointer and swells over anything clickable, with a dot that sticks
// to the pointer itself. The real cursor stays: this only adds light around it.
// Fine pointers only (never on touch), and not at all when motion is reduced.
export default function CursorGlow() {
  const { reduced } = useMotionPref()
  const ring = useRef(null)
  const dot = useRef(null)

  useEffect(() => {
    if (reduced || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return undefined
    const ringEl = ring.current
    const dotEl = dot.current
    let raf = 0
    let tx = 0
    let ty = 0
    let x = 0
    let y = 0
    let seen = false

    const frame = () => {
      x += (tx - x) * 0.2
      y += (ty - y) * 0.2
      ringEl.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.3 ? requestAnimationFrame(frame) : 0
    }
    const onMove = e => {
      tx = e.clientX
      ty = e.clientY
      dotEl.style.transform = `translate3d(${tx}px, ${ty}px, 0)`
      if (!seen) { x = tx; y = ty; seen = true; ringEl.classList.add('is-on'); dotEl.classList.add('is-on') }
      ringEl.classList.toggle('is-link', Boolean(e.target.closest?.(CLICKABLE)))
      if (!raf) raf = requestAnimationFrame(frame)
    }
    const onLeave = () => { seen = false; ringEl.classList.remove('is-on'); dotEl.classList.remove('is-on') }

    window.addEventListener('pointermove', onMove, { passive: true })
    document.documentElement.addEventListener('mouseleave', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('mouseleave', onLeave)
      cancelAnimationFrame(raf)
    }
  }, [reduced])

  return (
    <>
      <div ref={ring} aria-hidden="true" className="cursor-ring" />
      <div ref={dot} aria-hidden="true" className="cursor-dot" />
    </>
  )
}
