// One switch for "less motion": the visitor's system setting, or the Pause animations button.
// It sets data-motion="reduced" on <html> (index.css and the inline script in index.html use it),
// and gives React code the same answer, so CSS, Motion and SVG animations all stop together.
// This is what WCAG 2.2.2 (Pause, Stop, Hide) asks for: a way to stop moving content that starts by itself.
import { useCallback, useEffect, useMemo, useState } from 'react'
import { MotionCtx } from '../motion-pref'

const KEY = 'motion'
const QUERY = '(prefers-reduced-motion: reduce)'

function readPaused() {
  try { return localStorage.getItem(KEY) === 'paused' } catch { return false }
}

export default function MotionPrefProvider({ children }) {
  const [paused, setPaused] = useState(readPaused)
  const [system, setSystem] = useState(() => window.matchMedia(QUERY).matches)

  useEffect(() => {
    const mq = window.matchMedia(QUERY)
    const on = () => setSystem(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])

  const reduced = paused || system
  useEffect(() => { document.documentElement.dataset.motion = reduced ? 'reduced' : 'full' }, [reduced])

  const toggle = useCallback(() => {
    setPaused(p => {
      const next = !p
      try { if (next) localStorage.setItem(KEY, 'paused'); else localStorage.removeItem(KEY) } catch { /* private mode */ }
      return next
    })
  }, [])

  const value = useMemo(() => ({ paused, system, reduced, toggle }), [paused, system, reduced, toggle])
  return <MotionCtx.Provider value={value}>{children}</MotionCtx.Provider>
}
