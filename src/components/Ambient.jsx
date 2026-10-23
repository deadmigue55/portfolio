import { useEffect } from 'react'

const SECTIONS = ['home', 'projects', 'explore', 'story', 'skills', 'about', 'contact']

// A wash of color fixed behind the page whose two hues follow the section being read.
// The page only has to say which section is under the middle of the screen (html[data-section]);
// neon2.css turns that into colors and eases between them.
export default function Ambient() {
  useEffect(() => {
    const root = document.documentElement
    const els = SECTIONS.map(id => document.getElementById(id)).filter(Boolean)
    if (!els.length || !('IntersectionObserver' in window)) return undefined
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) root.dataset.section = e.target.id })
    }, { rootMargin: '-45% 0px -54% 0px' }) // a thin band across the middle of the screen
    els.forEach(el => io.observe(el))
    return () => { io.disconnect(); delete root.dataset.section }
  }, [])

  return <div aria-hidden="true" className="ambient-wash" />
}
