// Theme preference: 'system' (follow the visitor's OS), 'light' or 'dark'.
// Light is the fallback when the system gives no preference (see index.css).
// An inline script in index.html applies a saved choice before first paint.
// A change made with the toggle reveals the new theme in a circle from the button (View Transitions).
// The state lives in one small shared store, so the toggle and the command menu always agree.
import { useSyncExternalStore } from 'react'
import { withTransition } from './transition'

const KEY = 'theme'
const COLORS = { light: '#FFF4EA', dark: '#07162B' } // browser chrome color on phones
const DARK_QUERY = '(prefers-color-scheme: dark)'

function readSaved() {
  try {
    const v = localStorage.getItem(KEY)
    return v === 'light' || v === 'dark' ? v : 'system'
  } catch {
    return 'system'
  }
}

function apply(mode) {
  const root = document.documentElement
  if (mode === 'system') root.removeAttribute('data-theme')
  else root.setAttribute('data-theme', mode)
  const dark = mode === 'dark' || (mode === 'system' && window.matchMedia(DARK_QUERY).matches)
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? COLORS.dark : COLORS.light)
}

let mode = readSaved()
const listeners = new Set()
const emit = () => listeners.forEach(l => l())

apply(mode)
window.matchMedia(DARK_QUERY).addEventListener('change', () => { if (mode === 'system') apply('system') })

export function setTheme(next, origin) {
  if (next === mode) return
  // The DOM change has to happen inside the transition callback
  withTransition(() => { mode = next; apply(next); emit() }, { kind: 'theme', origin })
  try {
    if (next === 'system') localStorage.removeItem(KEY)
    else localStorage.setItem(KEY, next)
  } catch { /* private mode: the choice just lasts for this visit */ }
}

const subscribe = l => { listeners.add(l); return () => listeners.delete(l) }

export function useTheme() {
  const current = useSyncExternalStore(subscribe, () => mode)
  return [current, setTheme]
}
