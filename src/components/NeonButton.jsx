import { useRef, useState } from 'react'
import Magnetic from './Magnetic'

/**
 * NeonButton: a button/link with a cursor-tracking glow, a press ripple and an optional arrow.
 * The whole button also leans toward the cursor (see Magnetic).
 *
 * Props:
 *   href      renders as <a> if provided, otherwise <button>
 *   variant   'primary' (solid accent) | 'ghost' (outlined)
 *   arrow     adds an arrow that slides forward on hover
 *   children  label
 *   className extra classes
 */
export default function NeonButton({ href, variant = 'primary', arrow = false, children, className = '', onClick }) {
  const ref = useRef(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(false)
  const [ripples, setRipples] = useState([])

  const local = e => {
    const rect = ref.current.getBoundingClientRect()
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  const handleMouseMove = e => {
    if (ref.current) setPos(local(e))
  }

  // A soft ring that grows from the point you pressed
  const handlePointerDown = e => {
    if (!ref.current) return
    const id = performance.now()
    setRipples(r => [...r, { id, ...local(e) }])
    setTimeout(() => setRipples(r => r.filter(x => x.id !== id)), 650)
  }

  const glowColor = variant === 'primary' ? 'var(--sheen)' : 'var(--glow)'

  const baseClass = variant === 'primary'
    ? 'bg-accent border border-accent text-on-accent'
    : 'bg-subtle border border-line text-soft hover:text-fg hover:border-accent/50'

  const sharedClass = `
    group relative overflow-hidden px-6 py-3 rounded-lg text-sm font-medium inline-flex items-center gap-2
    transition-[transform,box-shadow,background-color,border-color,color] duration-200 ease-out cursor-pointer
    hover:scale-[1.03] active:scale-[0.97]
    ${baseClass} ${className}
  `

  const glowOverlay = (
    <span
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none transition-opacity duration-150 rounded-lg"
      style={{
        opacity: hovered ? 1 : 0,
        background: `radial-gradient(circle 90px at ${pos.x}px ${pos.y}px, ${glowColor} 0%, transparent 70%)`,
      }}
    />
  )

  const rippleLayer = ripples.map(r => (
    <span key={r.id} aria-hidden="true" className="btn-ripple"
      style={{ left: r.x, top: r.y, background: glowColor }} />
  ))

  // Outer glow when hovered
  const ringStyle = hovered
    ? {
        boxShadow: variant === 'primary'
          ? '0 0 15px var(--glow), 0 0 30px var(--glow-soft)'
          : '0 0 15px var(--glow-soft), 0 0 30px var(--glow-soft)',
      }
    : {}

  const props = {
    ref,
    className: sharedClass,
    style: ringStyle,
    onMouseMove: handleMouseMove,
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
    onPointerDown: handlePointerDown,
    onClick,
  }

  const content = (
    <>
      {glowOverlay}
      {rippleLayer}
      <span className="relative z-10">{children}</span>
      {arrow && (
        <span aria-hidden="true" className="relative z-10 transition-transform duration-300 ease-out group-hover:translate-x-1">→</span>
      )}
    </>
  )

  const element = href
    ? <a href={href} {...props}>{content}</a>
    : <button type="button" {...props}>{content}</button>

  return <Magnetic strength={0.22} max={8}>{element}</Magnetic>
}
