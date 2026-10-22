import { useMotionPref } from '../motion-pref'
import { useCopy } from '../i18n'

// Pause animations / play animations (WCAG 2.2.2). When the visitor's system already asks for less
// motion the button shows "paused" and cannot be switched back on, so their choice is respected.
export default function MotionToggle({ className = '' }) {
  const { reduced, system, toggle } = useMotionPref()
  const c = useCopy().controls
  const label = system ? c.motionSystem : reduced ? c.motionPlay : c.motionPause
  return (
    <button type="button" onClick={toggle} disabled={system} aria-pressed={reduced} aria-label={label} title={label}
      className={`grid size-8 place-items-center rounded-full border border-line bg-subtle text-muted transition-colors hover:text-fg disabled:cursor-not-allowed disabled:opacity-60 ${reduced ? 'text-accent' : ''} ${className}`}>
      <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
        {reduced
          ? <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z" />
          : <><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></>}
      </svg>
    </button>
  )
}
