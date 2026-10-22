// Theme preference: 'system' (follow the visitor's OS), 'light' or 'dark'.
// Light is the fallback when the system gives no preference (see index.css).
// An inline script in index.html applies a saved choice before first paint.
import { useCallback, useEffect, useState } from 'react'

const KEY = 'theme'
const COLORS = { light: '#FFF4EA', dark: '#07162B' } // browser chrome color on phones

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
  const dark = mode === 'dark' || (mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? COLORS.dark : COLORS.light)
}

export function useTheme() {
  const [mode, setMode] = useState(readSaved)

  useEffect(() => {
    apply(mode)
    if (mode !== 'system') return undefined
    const query = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => apply('system')
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [mode])

  const choose = useCallback(next => {
    setMode(next)
    try {
      if (next === 'system') localStorage.removeItem(KEY)
      else localStorage.setItem(KEY, next)
    } catch { /* private mode: the choice just lasts for this visit */ }
  }, [])

  return [mode, choose]
}
