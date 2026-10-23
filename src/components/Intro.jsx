// The first-visit intro: a neon survival curve drawn from the project's own mortality tables.
//
// A light rides the curve of 100,000 men from birth to the last age of the table while a counter
// ticks through the ages and a ring of light circles it. The name ignites, then a spectral ring
// opens the page. It is real data on purpose: the intro is the first proof of what the site shows.
//
// One requestAnimationFrame loop drives the curve, the light and the counters by writing to DOM
// nodes directly (no React re-renders), so it stays smooth. Everything else is CSS (see intro.css).
// Skippable at every moment: the button, Escape, Enter, or a click anywhere.
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useIntro } from '../intro'
import { useLang } from '../i18n'
import data from '../data/mortality'

const W = 880
const H = 280
const PAD = 26
const DRAW_MS = 1350
const BURST_AT = 1900
const END_AT = 2550
const RADIX = 100000

// l(x): the share still alive at each age, from the one-year probabilities of dying
function survivors(q) {
  const l = [1]
  for (let x = 0; x < q.length - 1; x++) l.push(l[x] * (1 - q[x]))
  return l
}

function pathOf(l) {
  const last = l.length - 1
  return l.map((v, x) => {
    const px = PAD + (x / last) * (W - 2 * PAD)
    const py = PAD + (1 - v) * (H - 2 * PAD)
    return `${x ? 'L' : 'M'}${px.toFixed(1)} ${py.toFixed(1)}`
  }).join(' ')
}

const ease = t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

export default function Intro() {
  const { reveal, finish } = useIntro()
  const { lang, c: copy } = useLang()
  const c = copy.intro
  const locale = lang === 'es' ? 'es-MX' : 'en-US'
  const root = useRef(null)
  const curve = useRef(null)
  const curveIns = useRef(null)
  const dot = useRef(null)
  const ageEl = useRef(null)
  const aliveEl = useRef(null)
  const leaving = useRef(false)
  const timers = useRef([])

  const pop = useMemo(() => survivors(data.qx.M), [])
  const ins = useMemo(() => survivors(data.qx.IM), [])
  const dPop = useMemo(() => pathOf(pop), [pop])
  const dIns = useMemo(() => pathOf(ins), [ins])

  const skip = useCallback(() => {
    if (leaving.current) return
    leaving.current = true
    reveal() // the page builds itself while the overlay fades
    timers.current.forEach(clearTimeout)
    root.current?.classList.add('is-leaving')
    timers.current = [setTimeout(finish, 320)]
  }, [reveal, finish])

  useEffect(() => {
    const node = root.current
    const path = curve.current
    const second = curveIns.current
    const light = dot.current
    if (!node || !path || !second || !light) return undefined
    const len = path.getTotalLength()
    const len2 = second.getTotalLength()
    path.style.strokeDasharray = `${len}`
    second.style.strokeDasharray = `${len2}`

    let raf = 0
    const start = performance.now()
    const step = now => {
      const p = ease(Math.min(1, (now - start) / DRAW_MS))
      path.style.strokeDashoffset = `${len * (1 - p)}`
      second.style.strokeDashoffset = `${len2 * (1 - Math.max(0, p * 1.12 - 0.12))}`
      const pt = path.getPointAtLength(len * p)
      light.setAttribute('cx', pt.x.toFixed(1))
      light.setAttribute('cy', pt.y.toFixed(1))
      const age = p * (pop.length - 1)
      const i = Math.min(pop.length - 2, Math.floor(age))
      const frac = age - i
      const alive = (pop[i] + (pop[i + 1] - pop[i]) * frac) * RADIX
      if (ageEl.current) ageEl.current.textContent = String(Math.round(age))
      if (aliveEl.current) aliveEl.current.textContent = Math.round(alive).toLocaleString(locale)
      if (p < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)

    timers.current = [
      setTimeout(() => { node.classList.add('is-bursting'); reveal() }, BURST_AT),
      setTimeout(() => { if (!leaving.current) finish() }, END_AT),
    ]
    node.querySelector('button')?.focus({ preventScroll: true })

    const onKey = e => { if (e.key === 'Escape' || e.key === 'Enter') skip() }
    window.addEventListener('keydown', onKey)
    return () => {
      cancelAnimationFrame(raf)
      timers.current.forEach(clearTimeout)
      window.removeEventListener('keydown', onKey)
    }
  }, [reveal, finish, skip, pop, locale])

  const name = c.name.split('')
  return (
    <div ref={root} className="intro" role="dialog" aria-modal="true" aria-label={c.aria} onClick={skip}>
      <div className="intro-grid" aria-hidden="true" />
      <div className="intro-stage">
        <p className="intro-eyebrow" aria-hidden="true">{c.eyebrow}</p>

        <svg className="intro-chart" viewBox={`0 0 ${W} ${H}`} aria-hidden="true" focusable="false">
          <defs>
            <linearGradient id="intro-spectrum" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0" stopColor="#FF8A3D" />
              <stop offset="0.30" stopColor="#FF4D8D" />
              <stop offset="0.58" stopColor="#8B5CF6" />
              <stop offset="0.82" stopColor="#22D3EE" />
              <stop offset="1" stopColor="#34D399" />
            </linearGradient>
            <filter id="intro-glow" x="-10%" y="-30%" width="120%" height="160%">
              <feGaussianBlur stdDeviation="5" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          {[0, 0.25, 0.5, 0.75, 1].map(g => (
            <line key={g} x1={PAD} x2={W - PAD} y1={PAD + g * (H - 2 * PAD)} y2={PAD + g * (H - 2 * PAD)} className="intro-gridline" />
          ))}
          <path ref={curveIns} d={dIns} className="intro-curve intro-curve-ins" />
          <path ref={curve} d={dPop} className="intro-curve" filter="url(#intro-glow)" />
          <circle ref={dot} r="7" className="intro-dot" cx={PAD} cy={PAD} />
        </svg>

        <div className="intro-counter" aria-hidden="true">
          <span className="intro-ring"><span className="intro-ring-core">
            <span className="intro-age-label">{c.age}</span>
            <span ref={ageEl} className="intro-age">0</span>
          </span></span>
          <span className="intro-alive">
            <span ref={aliveEl} className="intro-alive-n">100,000</span>
            <span className="intro-alive-l">{c.alive}</span>
          </span>
        </div>

        <h2 className="intro-name" aria-label={c.name}>
          {name.map((ch, i) => (
            <span key={i} aria-hidden="true" className="intro-letter" style={{ '--i': i }}>{ch === ' ' ? ' ' : ch}</span>
          ))}
        </h2>
        <p className="intro-tagline">{copy.hero.tagline}</p>
      </div>

      <button type="button" className="intro-skip" onClick={e => { e.stopPropagation(); skip() }}>{c.skip}</button>
      <div className="intro-edge" aria-hidden="true" />
    </div>
  )
}
