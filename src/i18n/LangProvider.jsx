// English and Spanish. The language comes from ?lang=es (a link you can share), then the visitor's
// last choice, then DEFAULT_LANG. Components read their text with `const c = useCopy()`.
import { useCallback, useEffect, useMemo, useState } from 'react'
import { COPY, DEFAULT_LANG, LangCtx } from './context'
import { withTransition } from '../transition'

const KEY = 'lang'

function detect() {
  try {
    const q = new URLSearchParams(window.location.search).get('lang')
    if (q === 'en' || q === 'es') return q
    const saved = localStorage.getItem(KEY)
    if (saved === 'en' || saved === 'es') return saved
  } catch { /* storage blocked: use the default */ }
  return DEFAULT_LANG
}

export default function LangProvider({ children }) {
  const [lang, setLangState] = useState(detect)
  const c = COPY[lang]

  useEffect(() => {
    document.documentElement.lang = lang
    document.title = c.meta.title
    document.querySelector('meta[name="description"]')?.setAttribute('content', c.meta.description)
  }, [lang, c])

  const setLang = useCallback((next, origin) => {
    if (next === lang) return
    withTransition(() => setLangState(next), { kind: 'fade', origin })
    try {
      localStorage.setItem(KEY, next)
      // Keep a shared ?lang= link honest: if the address carries one, update it
      const url = new URL(window.location.href)
      if (url.searchParams.has('lang')) {
        url.searchParams.set('lang', next)
        window.history.replaceState(null, '', url)
      }
    } catch { /* private mode: the choice just lasts for this visit */ }
  }, [lang])

  const value = useMemo(() => ({ lang, c, setLang }), [lang, c, setLang])
  return <LangCtx.Provider value={value}>{children}</LangCtx.Provider>
}
