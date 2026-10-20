import { useEffect } from 'react'

// Floating neon math/actuarial symbols, fixed behind the whole page.
// tone: blue shade · drift: movement path · dur: drift time
// flash: flicker cycle length · fd: flicker offset (negative = starts mid-cycle)
// desk: only shown on wider screens (keeps phones uncluttered)
const symbols = [
  { s: 'Σ',      tone: 'electric', drift: 'a', top: '12%', left: '5%',  size: '3.5rem', dur: '16s', flash: '9s',  fd: '-1s'  },
  { s: 'σ²',     tone: 'sky',      drift: 'b', top: '20%', left: '88%', size: '2.8rem', dur: '20s', flash: '11s', fd: '-6s'  },
  { s: 'μ',      tone: 'cobalt',   drift: 'c', top: '55%', left: '3%',  size: '3rem',   dur: '14s', flash: '8s',  fd: '-3s'  },
  { s: '∫',      tone: 'electric', drift: 'a', top: '70%', left: '90%', size: '3.8rem', dur: '18s', flash: '12s', fd: '-9s'  },
  { s: 'λ',      tone: 'sky',      drift: 'c', top: '40%', left: '93%', size: '2.5rem', dur: '22s', flash: '10s', fd: '-2s'  },
  { s: 'P(A|B)', tone: 'cobalt',   drift: 'b', top: '80%', left: '8%',  size: '1.4rem', dur: '26s', flash: '13s', fd: '-7s',  desk: true },
  { s: 'χ²',     tone: 'electric', drift: 'b', top: '8%',  left: '75%', size: '2.6rem', dur: '17s', flash: '9.5s',fd: '-5s'  },
  { s: 'E[X]',   tone: 'sky',      drift: 'a', top: '85%', left: '60%', size: '1.5rem', dur: '20s', flash: '11.5s',fd: '-10s', desk: true },
  { s: '∂',      tone: 'cobalt',   drift: 'c', top: '30%', left: '8%',  size: '2.8rem', dur: '24s', flash: '8.5s',fd: '-4s'  },
  { s: 'Φ(z)',   tone: 'electric', drift: 'a', top: '62%', left: '78%', size: '1.6rem', dur: '19s', flash: '12.5s',fd: '-8s', desk: true },
  { s: '∇',      tone: 'sky',      drift: 'b', top: '48%', left: '50%', size: '3rem',   dur: '28s', flash: '14s', fd: '-11s', desk: true },
  { s: 'α',      tone: 'cobalt',   drift: 'c', top: '15%', left: '40%', size: '2.2rem', dur: '15s', flash: '10.5s',fd: '-1.5s', desk: true },
  { s: 'β',      tone: 'electric', drift: 'a', top: '90%', left: '35%', size: '2.4rem', dur: '22s', flash: '9s',  fd: '-6.5s' },
  { s: 'π',      tone: 'sky',      drift: 'b', top: '75%', left: '25%', size: '2rem',   dur: '16s', flash: '13.5s',fd: '-12s', desk: true },
  { s: 'Var(X)', tone: 'cobalt',   drift: 'c', top: '5%',  left: '55%', size: '1.3rem', dur: '20s', flash: '11s', fd: '-3.5s', desk: true },
  { s: 'ρ',      tone: 'electric', drift: 'a', top: '35%', left: '70%', size: '2.6rem', dur: '18s', flash: '10s', fd: '-8.5s', desk: true },
]

// Dims the glow, fades out the flashes and shrinks the movement as you scroll,
// so the hero is flashy and the rest of the page stays calm.
function useScrollFade() {
  useEffect(() => {
    const root = document.documentElement
    let raf = 0

    const update = () => {
      raf = 0
      const screens = window.scrollY / window.innerHeight
      const e = Math.exp(-screens / 1.2)           // 1 at top → ~0 far down
      root.style.setProperty('--bg-glow', (0.15 + 0.85 * e).toFixed(3))
      root.style.setProperty('--bg-flash', Math.pow(e, 1.5).toFixed(3))
      root.style.setProperty('--bg-amp', (0.3 + 0.7 * e).toFixed(3))
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])
}

export default function NeonSymbols() {
  useScrollFade()

  return (
    <div className="neon-bg" aria-hidden="true">
      <div className="ns-ambient ns-ambient-1" />
      <div className="ns-ambient ns-ambient-2" />

      {symbols.map((sym, i) => (
        <span
          key={i}
          className={`ns-drift ns-drift-${sym.drift} ns-tone-${sym.tone} ${sym.desk ? 'max-sm:hidden' : ''}`}
          style={{
            top: sym.top,
            left: sym.left,
            fontSize: sym.size,
            '--dur': sym.dur,
            '--flash': sym.flash,
            '--fd': sym.fd,
          }}
        >
          <span className="ns-glyph ns-pulse">{sym.s}</span>
          <span className="ns-flash-wrap">
            <span className="ns-glyph ns-flash">{sym.s}</span>
          </span>
        </span>
      ))}
    </div>
  )
}
