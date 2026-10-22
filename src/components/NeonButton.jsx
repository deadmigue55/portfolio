import { useRef, useState } from 'react'

/**
 * NeonButton — a button/link with a mouse-tracking LED radial glow.
 * Move your cursor across it and a neon light follows your mouse.
 *
 * Props:
 *   href      — renders as <a> if provided, otherwise <button>
 *   variant   — 'primary' (solid accent) | 'ghost' (outlined)
 *   children  — label
 *   className — extra classes
 */
export default function NeonButton({ href, variant = 'primary', children, className = '', onClick }) {
  const ref = useRef(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(false)

  const handleMouseMove = (e) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  const glowColor = variant === 'primary' ? 'var(--sheen)' : 'var(--glow)'

  const baseClass = variant === 'primary'
    ? 'bg-accent border border-accent text-on-accent'
    : 'bg-subtle border border-line text-soft'

  const sharedClass = `
    relative overflow-hidden px-6 py-3 rounded-lg text-sm font-medium
    transition-all duration-200 cursor-pointer
    hover:scale-[1.03] active:scale-[0.98]
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

  // Outer neon ring glow when hovered
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
    onClick,
  }

  if (href) {
    return (
      <a href={href} {...props}>
        {glowOverlay}
        <span className="relative z-10">{children}</span>
      </a>
    )
  }

  return (
    <button type="button" {...props}>
      {glowOverlay}
      <span className="relative z-10">{children}</span>
    </button>
  )
}
