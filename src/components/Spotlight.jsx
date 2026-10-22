import { useEffect } from 'react'

// Tells every `.spot-card` where the cursor is, so its border can light up around the pointer.
// One listener for the whole page. Positions are read for all cards first and written after, so the
// browser lays out once per frame; cards far from the cursor are left alone. Mouse and trackpad only.
export default function Spotlight() {
  useEffect(() => {
    if (!window.matchMedia('(hover: hover)').matches) return undefined
    let raf = 0
    let x = 0
    let y = 0
    let active = false
    const REACH = 260 // how far from a card's edge the light still reaches

    const update = () => {
      raf = 0
      const cards = document.querySelectorAll('.spot-card')
      const rects = Array.from(cards, el => el.getBoundingClientRect())
      cards.forEach((el, i) => {
        const r = rects[i]
        const dx = Math.max(r.left - x, 0, x - r.right)
        const dy = Math.max(r.top - y, 0, y - r.bottom)
        const strength = active ? Math.max(0, 1 - Math.hypot(dx, dy) / REACH) : 0
        if (strength === 0 && el.dataset.spot === '0') return
        el.dataset.spot = strength === 0 ? '0' : '1'
        el.style.setProperty('--mx', `${x - r.left}px`)
        el.style.setProperty('--my', `${y - r.top}px`)
        el.style.setProperty('--spot', strength.toFixed(2))
      })
    }
    const schedule = () => { if (!raf) raf = requestAnimationFrame(update) }
    const onMove = e => { x = e.clientX; y = e.clientY; active = true; schedule() }
    const onLeave = () => { active = false; schedule() }
    const onScroll = () => { if (active) schedule() }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    document.documentElement.addEventListener('mouseleave', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('scroll', onScroll)
      document.documentElement.removeEventListener('mouseleave', onLeave)
      cancelAnimationFrame(raf)
    }
  }, [])

  return null
}
