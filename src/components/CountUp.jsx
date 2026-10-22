import { useEffect, useRef, useState } from 'react'
import { animate, useInView, useReducedMotion } from 'motion/react'

// A number that counts up to its value when it scrolls into view.
// `format` turns the running value into text (units, separators); digits stay aligned.
export default function CountUp({ to, decimals = 0, duration = 1.8, delay = 0, format }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const reduce = useReducedMotion()
  const [value, setValue] = useState(reduce ? to : 0)

  useEffect(() => {
    if (!inView || reduce) return undefined
    // `delay` is on the page's timeline: if the number scrolls into view later (a phone, where the
    // chart is below the fold), the time already passed counts, so it starts straight away.
    const wait = Math.max(0, delay - performance.now() / 1000)
    const controls = animate(0, to, {
      duration, delay: wait, ease: [0.22, 1, 0.36, 1], onUpdate: setValue,
    })
    return () => controls.stop()
  }, [inView, reduce, to, duration, delay])

  return <span ref={ref} className="tabular-nums">{format ? format(value) : value.toFixed(decimals)}</span>
}
