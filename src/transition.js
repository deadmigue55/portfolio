// Runs a state change inside a View Transition when the browser supports it, so the page cross-fades
// (language) or reveals in a circle from the button you pressed (theme). Everywhere else, and for
// visitors who ask for less motion, the change simply happens. `kind` picks the animation in index.css.
import { flushSync } from 'react-dom'

export function withTransition(update, { kind = 'fade', origin } = {}) {
  const root = document.documentElement
  const skip = root.dataset.motion === 'reduced' || typeof document.startViewTransition !== 'function'
  if (skip) {
    update()
    return
  }
  if (origin) {
    const r = origin.getBoundingClientRect()
    root.style.setProperty('--vt-x', `${r.left + r.width / 2}px`)
    root.style.setProperty('--vt-y', `${r.top + r.height / 2}px`)
  }
  root.dataset.vt = kind
  const t = document.startViewTransition(() => { flushSync(update) })
  t.finished.finally(() => { delete root.dataset.vt })
}
