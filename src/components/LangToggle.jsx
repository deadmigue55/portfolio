import { useLang } from '../i18n'

// English | Español. The names are written in their own language, so each one can be found by someone who only reads it.
const options = [
  { id: 'en', short: 'EN', label: 'English' },
  { id: 'es', short: 'ES', label: 'Español' },
]

export default function LangToggle({ className = '' }) {
  const { lang, setLang, c } = useLang()
  return (
    <div role="group" aria-label={c.controls.lang}
      className={`inline-flex items-center rounded-full border border-line bg-subtle p-0.5 ${className}`}>
      {options.map(o => (
        <button key={o.id} type="button" lang={o.id} onClick={e => setLang(o.id, e.currentTarget)}
          aria-label={o.label} aria-pressed={lang === o.id} title={o.label}
          className={`h-7 rounded-full px-2.5 font-mono text-[11px] font-medium tracking-wider transition-colors ${
            lang === o.id ? 'bg-accent text-on-accent' : 'text-muted hover:text-fg'}`}>
          {o.short}
        </button>
      ))}
    </div>
  )
}
