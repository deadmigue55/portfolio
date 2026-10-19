// Floating neon math/actuarial symbols in the background
const symbols = [
  // symbol, float class, neon class, position, font-size, delay, duration
  { s: 'Σ',       f: 'float-a', n: 'neon-blue',   top: '12%', left: '5%',  size: '3.5rem', delay: '0s',    dur: '8s'  },
  { s: 'σ²',      f: 'float-b', n: 'neon-violet', top: '20%', left: '88%', size: '2.8rem', delay: '1.2s',  dur: '10s' },
  { s: 'μ',       f: 'float-c', n: 'neon-cyan',   top: '55%', left: '3%',  size: '3rem',   delay: '0.5s',  dur: '7s'  },
  { s: '∫',       f: 'float-a', n: 'neon-indigo', top: '70%', left: '90%', size: '3.8rem', delay: '2s',    dur: '9s'  },
  { s: 'λ',       f: 'float-b', n: 'neon-blue',   top: '40%', left: '93%', size: '2.5rem', delay: '0.8s',  dur: '11s' },
  { s: 'P(A|B)',  f: 'float-c', n: 'neon-violet', top: '80%', left: '8%',  size: '1.4rem', delay: '1.5s',  dur: '13s' },
  { s: 'χ²',     f: 'float-a', n: 'neon-cyan',   top: '8%',  left: '75%', size: '2.6rem', delay: '3s',    dur: '8.5s'},
  { s: 'E[X]',   f: 'float-b', n: 'neon-indigo', top: '85%', left: '60%', size: '1.5rem', delay: '0.3s',  dur: '10s' },
  { s: '∂',      f: 'float-c', n: 'neon-blue',   top: '30%', left: '8%',  size: '2.8rem', delay: '2.5s',  dur: '12s' },
  { s: 'Φ(z)',   f: 'float-a', n: 'neon-violet', top: '62%', left: '78%', size: '1.6rem', delay: '1.8s',  dur: '9.5s'},
  { s: '∇',      f: 'float-b', n: 'neon-cyan',   top: '48%', left: '50%', size: '3rem',   delay: '4s',    dur: '14s' },
  { s: 'α',      f: 'float-c', n: 'neon-indigo', top: '15%', left: '40%', size: '2.2rem', delay: '0.7s',  dur: '7.5s'},
  { s: 'β',      f: 'float-a', n: 'neon-blue',   top: '90%', left: '35%', size: '2.4rem', delay: '3.5s',  dur: '11s' },
  { s: 'π',      f: 'float-b', n: 'neon-violet', top: '75%', left: '25%', size: '2rem',   delay: '1s',    dur: '8s'  },
  { s: 'Var(X)', f: 'float-c', n: 'neon-cyan',   top: '5%',  left: '55%', size: '1.3rem', delay: '2.2s',  dur: '10s' },
  { s: 'ρ',      f: 'float-a', n: 'neon-indigo', top: '35%', left: '70%', size: '2.6rem', delay: '0.4s',  dur: '9s'  },
]

export default function NeonSymbols() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden="true">
      {symbols.map((sym, i) => (
        <span
          key={i}
          className={`absolute font-bold ${sym.f} ${sym.n}`}
          style={{
            top: sym.top,
            left: sym.left,
            fontSize: sym.size,
            '--delay': sym.delay,
            '--dur': sym.dur,
            fontFamily: 'serif',
            userSelect: 'none',
            zIndex: 0,
          }}
        >
          {sym.s}
        </span>
      ))}
    </div>
  )
}
