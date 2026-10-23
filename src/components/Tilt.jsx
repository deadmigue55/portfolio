import { useRef } from 'react'

const MAX = 4.5 // degrees of lean at the very edge

// Wraps a card so it leans toward the cursor and a soft light follows the pointer across it.
// Mouse and pen only (touch never tilts), and neon2.css switches it off with the motion setting.
// Positions go straight to CSS variables, so React never re-renders while the pointer moves.
export default function Tilt({ className = '', children }) {
  const ref = useRef(null)

  const move = e => {
    if (e.pointerType === 'touch') return
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    el.style.setProperty('--ry', `${((px - 0.5) * 2 * MAX).toFixed(2)}deg`)
    el.style.setProperty('--rx', `${((0.5 - py) * 2 * MAX).toFixed(2)}deg`)
    el.style.setProperty('--gx', `${(px * 100).toFixed(1)}%`)
    el.style.setProperty('--gy', `${(py * 100).toFixed(1)}%`)
    el.dataset.tilt = 'on'
  }
  const leave = () => {
    const el = ref.current
    if (!el) return
    el.style.setProperty('--rx', '0deg')
    el.style.setProperty('--ry', '0deg')
    delete el.dataset.tilt
  }

  return (
    <div ref={ref} className={`tilt ${className}`} onPointerMove={move} onPointerLeave={leave}>
      {children}
      <span aria-hidden="true" className="tilt-glare" />
    </div>
  )
}
