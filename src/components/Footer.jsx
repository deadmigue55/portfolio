import { useLang } from '../i18n'
import { SITE_REPO } from '../links'
import { useIntro } from '../intro'

// Computed once when the page loads (keeps render pure). The build date and commit are filled in by vite.config.js.
const YEAR = new Date().getFullYear()
const BUILT = typeof __BUILD_DATE__ === 'undefined' ? '' : __BUILD_DATE__
const COMMIT = typeof __COMMIT__ === 'undefined' ? '' : __COMMIT__

export default function Footer() {
  const { lang, c } = useLang()
  const f = c.footer
  const { replay } = useIntro()
  // "Updated 22 Oct 2026": a visible sign that the page is looked after
  const updated = BUILT
    ? new Date(`${BUILT}T12:00:00`).toLocaleDateString(lang === 'es' ? 'es-MX' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    : ''

  return (
    <footer className="relative py-8 px-6">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" aria-hidden="true" />
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-faint text-sm">
        <span>© {YEAR} {f.rights}{updated && <> · <span title={COMMIT}>{f.updated(updated)}</span></>}</span>
        <span className="flex items-center gap-5">
          <a href="#home" className="font-mono text-[11px] uppercase tracking-[0.2em] transition-colors hover:text-accent">{f.top} ↑</a>
          <button type="button" onClick={replay} className="font-mono text-[11px] uppercase tracking-[0.2em] transition-colors hover:text-accent">{f.replay}</button>
        </span>
        <span>
          {f.built} · <a href={SITE_REPO} target="_blank" rel="noopener noreferrer" className="underline decoration-line underline-offset-4 transition-colors hover:text-accent">{f.source}</a>
        </span>
      </div>
    </footer>
  )
}
