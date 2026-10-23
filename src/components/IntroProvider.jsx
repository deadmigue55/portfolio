// Decides whether the intro plays, and keeps the page still while it does.
//
// The intro plays once per visitor (a flag in localStorage), never for people who asked for less
// motion (system setting or the Pause animations button), and never when the address carries
// ?nointro. ?intro forces it, which is also what the footer's "Replay" does without a reload.
// It is skippable at any moment, so it can never be a gate: the page is already rendered underneath.
import { useCallback, useEffect, useMemo, useState } from 'react'
import { IntroCtx } from '../intro'
import { useMotionPref } from '../motion-pref'

const SEEN = 'intro-seen'

function wantsIntro(reduced) {
  if (reduced) return false
  const q = new URLSearchParams(window.location.search)
  if (q.has('nointro')) return false
  if (q.has('intro')) return true
  try { return localStorage.getItem(SEEN) !== '1' } catch { return false }
}

export default function IntroProvider({ children }) {
  const { reduced } = useMotionPref()
  const [state, setPhase] = useState(() => (wantsIntro(reduced) ? 'playing' : 'off'))
  // Someone who turns motion off while it plays should not have to wait for it
  const phase = reduced && (state === 'playing' || state === 'revealing') ? 'done' : state

  const reveal = useCallback(() => setPhase(p => (p === 'playing' ? 'revealing' : p)), [])

  const finish = useCallback(() => {
    try { localStorage.setItem(SEEN, '1') } catch { /* private mode: it simply plays again next time */ }
    setPhase('done')
  }, [])

  const replay = useCallback(() => {
    window.scrollTo(0, 0)
    setPhase('playing')
  }, [])

  // Keep the page from scrolling behind the overlay
  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('intro-lock', phase === 'playing' || phase === 'revealing')
    return () => root.classList.remove('intro-lock')
  }, [phase])

  const value = useMemo(() => ({ phase, reveal, finish, replay }), [phase, reveal, finish, replay])
  return <IntroCtx.Provider value={value}>{children}</IntroCtx.Provider>
}
