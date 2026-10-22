// Small building blocks of the electric look. All of them are decoration (aria-hidden).

// A bright segment that orbits the border of the parent. The parent needs `relative` and a border radius.
export function BeamBorder({ slow = false }) {
  return <span aria-hidden="true" className={`beam-line ${slow ? 'is-slow' : ''}`} />
}

// A hairline divider with a light pulse running along it
export function CircuitDivider({ late = false }) {
  return (
    <div aria-hidden="true" className="mx-auto max-w-5xl px-6">
      <div className="circuit">
        <span className={`circuit-pulse ${late ? 'is-late' : ''}`} />
      </div>
    </div>
  )
}

// A vertical line with a pulse running down it (timeline)
export function CircuitLine({ className = '' }) {
  return (
    <div aria-hidden="true" className={`circuit-v ${className}`}>
      <span className="circuit-pulse-v" />
    </div>
  )
}
