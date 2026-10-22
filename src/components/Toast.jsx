import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { TOAST_EVENT } from '../toast'

// A small confirmation that slides up from the bottom (trigger it with toast() from ../toast).

export default function Toaster() {
  const [message, setMessage] = useState(null)

  useEffect(() => {
    let timer
    const show = e => {
      setMessage(e.detail)
      clearTimeout(timer)
      timer = setTimeout(() => setMessage(null), 2200)
    }
    window.addEventListener(TOAST_EVENT, show)
    return () => { window.removeEventListener(TOAST_EVENT, show); clearTimeout(timer) }
  }, [])

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-[60] flex justify-center px-4" role="status" aria-live="polite">
      <AnimatePresence>
        {message && (
          <motion.div key={message}
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
            className="flex items-center gap-2 rounded-full border border-accent/40 bg-card-2 px-4 py-2 text-sm text-fg shadow-[0_8px_30px_var(--glow-soft)]">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-accent" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>
            {message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
