// The language context and the hooks components use to read their text.
import { createContext, createElement, useContext } from 'react'
import en from './en'
import es from './es'

export const DEFAULT_LANG = 'en'
export const COPY = { en, es }

export const LangCtx = createContext({ lang: DEFAULT_LANG, c: COPY[DEFAULT_LANG], setLang() {} })
export const useLang = () => useContext(LangCtx)
export const useCopy = () => useContext(LangCtx).c

// **bold** markers in the copy become spans in the stronger text color
export function rich(text) {
  return text.split('**').map((part, i) => (i % 2 ? createElement('span', { key: i, className: 'text-fg' }, part) : part))
}
