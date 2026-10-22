import { useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'motion/react'

// Wraps a button or link so it leans toward the cursor and springs back on leave.
// Mouse and trackpad only, and off for visitors who ask for less motion.
const canHover = () =>
  window.matchMedia('(hover: hover) and (prefers-reduced-motion: no-preference)').matches

export default function Magnetic({ children, strength = 0.3, max = 10, className = '' }) {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const spring = { stiffness: 240, damping: 18, mass: 0.4 }
  const sx = useSpring(x, spring)
  const sy = useSpring(y, spring)
  const clamp = v => Math.max(-max, Math.min(max, v))

  const move = e => {
    if (!canHover() || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    x.set(clamp((e.clientX - (r.left + r.width / 2)) * strength))
    y.set(clamp((e.clientY - (r.top + r.height / 2)) * strength))
  }
  const leave = () => { x.set(0); y.set(0) }

  return (
    <motion.div ref={ref} onPointerMove={move} onPointerLeave={leave}
      style={{ x: sx, y: sy }} className={`inline-block ${className}`}>
      {children}
    </motion.div>
  )
}
