import { useTheme } from '../theme'

const icons = {
  light: (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  ),
  system: (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path d="M8 20h8M12 16v4" />
    </svg>
  ),
  dark: (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
    </svg>
  ),
}

const options = [
  { id: 'light', label: 'Light theme' },
  { id: 'system', label: 'Match my system' },
  { id: 'dark', label: 'Dark theme' },
]

// Three-way switch: the visitor's system by default, or an explicit light/dark choice
export default function ThemeToggle({ className = '' }) {
  const [mode, choose] = useTheme()
  return (
    <div role="group" aria-label="Color theme"
      className={`inline-flex items-center rounded-full border border-line bg-subtle p-0.5 ${className}`}>
      {options.map(o => (
        <button key={o.id} type="button" onClick={() => choose(o.id)}
          aria-label={o.label} aria-pressed={mode === o.id} title={o.label}
          className={`grid size-7 place-items-center rounded-full transition-colors ${
            mode === o.id ? 'bg-accent text-on-accent' : 'text-muted hover:text-fg'}`}>
          {icons[o.id]}
        </button>
      ))}
    </div>
  )
}
