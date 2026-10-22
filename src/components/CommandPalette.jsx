import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useLang } from '../i18n'
import { useMotionPref } from '../motion-pref'
import { setTheme } from '../theme'
import { toast } from '../toast'
import { copyText } from '../lib/clipboard'
import { PALETTE_EVENT } from '../palette'
import { DASHBOARD, REPORT, REPO, GITHUB, LINKEDIN, WHATSAPP, EMAIL, PHONE_DISPLAY } from '../links'

/*
  Command menu (Ctrl/Cmd+K, or the Search button): jump to a section, open a project link, copy the
  email, switch theme or language, pause the animations. A native <dialog> gives it focus trapping,
  Escape and a backdrop. Arrow keys move, Enter runs, typing filters (accents are ignored).
*/

const fold = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
const SECTIONS = ['home', 'projects', 'explore', 'story', 'skills', 'about', 'contact']

export default function CommandPalette() {
  const { lang, c, setLang } = useLang()
  const { reduced, system, toggle } = useMotionPref()
  const p = c.palette
  const ref = useRef(null)
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [sel, setSel] = useState(0)

  const show = useCallback(() => setOpen(true), [])
  const hide = useCallback(() => setOpen(false), [])

  // `open` is the one source of truth; this effect makes the dialog follow it
  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (open && !d.open) d.showModal()
    if (!open && d.open) d.close()
  }, [open])

  useEffect(() => {
    const onKey = e => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen(o => !o)
      }
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener(PALETTE_EVENT, show)
    return () => { window.removeEventListener('keydown', onKey); window.removeEventListener(PALETTE_EVENT, show) }
  }, [show])

  // Escape and the backdrop close the dialog natively; either way the search starts fresh next time
  const onClose = () => { setOpen(false); setQuery(''); setSel(0) }

  const items = useMemo(() => {
    const behavior = reduced ? 'auto' : 'smooth'
    const scrollTo = id => () => {
      // Closes first: the page behind a modal cannot scroll while it is open
      hide()
      setTimeout(() => {
        if (id === 'home') window.scrollTo({ top: 0, behavior })
        else document.getElementById(id)?.scrollIntoView({ behavior })
      }, 0)
    }
    const link = url => () => { hide(); window.open(url, '_blank', 'noopener,noreferrer') }
    const copy = (text, message) => async () => { hide(); if (await copyText(text)) toast(message) }
    const theme = mode => () => { hide(); setTimeout(() => setTheme(mode), 0) }

    const list = [
      ...SECTIONS.map(id => ({ group: 'go', label: p.go[id], hint: id === 'home' ? '↑' : `#${id}`, run: scrollTo(id) })),
      { group: 'open', label: p.open.dashboard, hint: '↗', run: link(DASHBOARD) },
      { group: 'open', label: p.open.report, hint: '↗', run: link(REPORT) },
      { group: 'open', label: p.open.repo, hint: '↗', run: link(REPO) },
      { group: 'open', label: p.open.github, hint: '↗', run: link(GITHUB) },
      { group: 'open', label: p.open.linkedin, hint: '↗', run: link(LINKEDIN) },
      { group: 'open', label: p.open.whatsapp, hint: '↗', run: link(WHATSAPP) },
      { group: 'actions', label: p.actions.copyEmail, hint: EMAIL, run: copy(EMAIL, c.contact.emailCopied) },
      { group: 'actions', label: p.actions.copyPhone, hint: PHONE_DISPLAY, run: copy(PHONE_DISPLAY, c.contact.phoneCopied) },
      { group: 'actions', label: p.actions.themeLight, run: theme('light') },
      { group: 'actions', label: p.actions.themeDark, run: theme('dark') },
      { group: 'actions', label: p.actions.themeSystem, run: theme('system') },
      { group: 'actions', label: lang === 'en' ? p.actions.langEs : p.actions.langEn, hint: lang === 'en' ? 'ES' : 'EN', run: () => { hide(); setTimeout(() => setLang(lang === 'en' ? 'es' : 'en'), 0) } },
    ]
    if (!system) list.push({ group: 'actions', label: reduced ? p.actions.motionPlay : p.actions.motionPause, run: () => { hide(); toggle() } })
    return list
  }, [p, c, lang, reduced, system, toggle, setLang, hide])

  const shown = useMemo(() => {
    const q = fold(query.trim())
    return q ? items.filter(i => fold(i.label).includes(q) || fold(p.groups[i.group]).includes(q)) : items
  }, [items, query, p])

  const active = Math.min(sel, Math.max(0, shown.length - 1))
  useEffect(() => { document.getElementById(`cmd-${active}`)?.scrollIntoView({ block: 'nearest' }) }, [active, open])

  const onKeyDown = e => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSel(i => (shown.length ? (i + 1) % shown.length : 0)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setSel(i => (shown.length ? (i - 1 + shown.length) % shown.length : 0)) }
    else if (e.key === 'Enter') { e.preventDefault(); shown[active]?.run() }
  }

  // Group headers appear where the group changes
  let last = null
  return (
    <dialog ref={ref} aria-label={p.title} onClose={onClose}
      onClick={e => { if (e.target === e.currentTarget) hide() }}
      className="mx-auto mt-[12vh] w-[min(92vw,560px)] max-w-none rounded-2xl border border-line bg-bg p-0 text-fg shadow-[0_30px_120px_rgba(0,0,0,0.5)] backdrop:bg-[rgba(7,22,43,0.7)] backdrop:backdrop-blur-sm">
      {open && (
        <div onKeyDown={onKeyDown}>
          <div className="flex items-center gap-3 border-b border-line px-4">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className="shrink-0 text-muted" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
            <input autoFocus value={query} onChange={e => { setQuery(e.target.value); setSel(0) }}
              role="combobox" aria-expanded="true" aria-controls="cmd-list" aria-activedescendant={shown.length ? `cmd-${active}` : undefined}
              placeholder={p.placeholder} aria-label={p.placeholder} spellCheck={false} autoComplete="off"
              style={{ outline: 'none' }} className="h-14 w-full bg-transparent text-[15px] text-fg placeholder:text-faint" />
            <kbd className="shrink-0 rounded border border-line px-1.5 py-0.5 font-mono text-[10px] text-faint">Esc</kbd>
          </div>

          <ul id="cmd-list" role="listbox" aria-label={p.title} className="max-h-[52vh] overflow-y-auto p-2">
            {shown.length === 0 && <li className="px-3 py-8 text-center text-sm text-muted">{p.empty}</li>}
            {shown.map((it, i) => {
              const header = it.group !== last ? p.groups[it.group] : null
              last = it.group
              return (
                <li key={`${it.group}-${it.label}`} role="presentation">
                  {header && <p className="px-3 pb-1 pt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-faint">{header}</p>}
                  <div id={`cmd-${i}`} role="option" aria-selected={i === active}
                    onMouseMove={() => setSel(i)} onClick={() => it.run()}
                    className={`flex cursor-pointer items-center justify-between gap-4 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                      i === active ? 'bg-accent/15 text-fg' : 'text-soft'}`}>
                    <span>{it.label}</span>
                    {it.hint && <span className={`truncate font-mono text-[11px] ${i === active ? 'text-accent' : 'text-faint'}`}>{it.hint}</span>}
                  </div>
                </li>
              )
            })}
          </ul>

          <p className="border-t border-line px-4 py-2.5 font-mono text-[10px] tracking-wider text-faint">{p.hint}</p>
        </div>
      )}
    </dialog>
  )
}
