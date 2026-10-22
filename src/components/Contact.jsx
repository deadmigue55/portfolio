import SectionHeader from './SectionHeader'
import Magnetic from './Magnetic'
import Reveal from './Reveal'
import CopyButton from './CopyButton'
import { SpotLayer } from './Electric'
import { PlayBox } from './Previews'

const EMAIL = 'migue.vilchis@ciencias.unam.mx'
const PHONE_DISPLAY = '+1 (913) 707-0185'
const PHONE_TEL = '+19137070185'
const WHATSAPP_URL = 'https://wa.me/19137070185'
const LINKEDIN_HANDLE = 'deadmigue'
const GITHUB_HANDLE = 'deadmigue55'

/* ── Icons ── */
const Icon = {
  email: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  phone: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.517l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  ),
  chat: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  ),
  linkedin: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  ),
  github: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
    </svg>
  ),
  arrow: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M9 7h8v8" />
    </svg>
  ),
}

/* ── Preview "images": small mockups of each channel, each with its own little story ── */
const previewBox = 'relative h-44 overflow-hidden rounded-t-2xl border-b border-line bg-gradient-to-br from-card-2 to-card p-5'
const d = seconds => ({ '--d': `${seconds}s` })
const typed = (text, start) => ({ '--w': `${text.length}ch`, '--n': text.length, '--t': `${text.length * 0.035}s`, '--d': `${start}s` })

const SUBJECT = "Let's build something"
const BODY = "Hi Miguel, we'd love to chat about a role"

// The message writes itself, then "sends"
function EmailPreview() {
  return (
    <PlayBox className={previewBox}>
      <div className="rounded-lg border border-line bg-card shadow-[0_0_30px_var(--glow)] transition-transform duration-500 group-hover:-translate-y-1">
        <div className="flex items-center gap-1.5 px-3 py-2 border-b border-line">
          <span className="w-2 h-2 rounded-full bg-rose-400/70" />
          <span className="w-2 h-2 rounded-full bg-amber-300/70" />
          <span className="w-2 h-2 rounded-full bg-emerald-400/70" />
          <span className="pv-slide ml-auto flex items-center gap-1 text-[10px] font-medium text-good" style={d(4.3)}>
            <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
            Sent
          </span>
        </div>
        <div className="px-3 py-2.5 space-y-1.5 font-mono text-[11px]">
          <p className="text-faint whitespace-nowrap">To: <span className="pv-type inline-block align-bottom text-fg" style={typed(EMAIL, 0.3)}>{EMAIL}</span></p>
          <p className="text-faint whitespace-nowrap">Subject: <span className="pv-type inline-block align-bottom text-fg" style={typed(SUBJECT, 1.5)}>{SUBJECT}</span></p>
          <p className="pt-1 text-soft whitespace-nowrap">
            <span className="pv-type inline-block align-bottom" style={typed(BODY, 2.4)}>{BODY}</span>
            <span className="pv-caret inline-block h-3 w-1 translate-y-0.5 bg-accent" style={d(2.4)} />
          </p>
        </div>
      </div>
    </PlayBox>
  )
}

// A message arrives, a typing indicator shows, then the reply
function WhatsAppPreview() {
  return (
    <PlayBox className={previewBox}>
      <div className="pv-fade flex items-center gap-2 mb-3" style={d(0.1)}>
        <span className="w-7 h-7 rounded-full bg-good/20 border border-good/40 grid place-items-center text-[10px] font-semibold text-good">MV</span>
        <div className="leading-tight">
          <p className="text-[11px] text-fg font-medium">Miguel Vilchis</p>
          <p className="text-[10px] text-good">online</p>
        </div>
      </div>
      <div className="space-y-2 text-[11px]">
        <p className="pv-slide ml-auto w-fit max-w-[80%] rounded-lg rounded-tr-sm bg-good/30 border border-good/20 px-3 py-1.5 text-fg" style={d(0.5)}>
          Hi Miguel! Free for a quick call this week?
        </p>
        <div className="grid">
          <div className="pv-dots col-start-1 row-start-1 w-fit items-center gap-1 rounded-lg rounded-tl-sm border border-line bg-subtle px-3 py-2.5"
            style={{ '--d': '1.5s', '--len': '1.4s' }}>
            <i /><i /><i />
          </div>
          <p className="pv-slide col-start-1 row-start-1 w-fit max-w-[80%] rounded-lg rounded-tl-sm bg-subtle border border-line px-3 py-1.5 text-fg" style={d(2.9)}>
            Absolutely. Calling you now.
          </p>
        </div>
      </div>
    </PlayBox>
  )
}

// The profile card lands, its banner shimmers and the Connect button keeps pulsing
function LinkedInPreview() {
  return (
    <PlayBox className={previewBox}>
      <div className="pv-slide rounded-lg overflow-hidden border border-line bg-card transition-transform duration-500 group-hover:-translate-y-1" style={d(0.2)}>
        <div className="pv-banner h-10 bg-gradient-to-r from-accent/60 via-accent-2/40 to-accent/60" />
        <div className="px-3 pb-3 -mt-5 flex items-end gap-3">
          <span className="w-11 h-11 rounded-full border-2 border-card bg-gradient-to-br from-accent to-accent-2 grid place-items-center text-xs font-bold text-on-accent shadow-[0_0_14px_var(--glow)]">MV</span>
          <div className="flex-1 min-w-0 leading-tight">
            <p className="text-[12px] text-fg font-semibold truncate">Miguel Vilchis</p>
            <p className="text-[10px] text-muted truncate">Actuary · Pricing &amp; Risk · Data &amp; AI</p>
          </div>
          <span className="pv-ping shrink-0 rounded-full bg-accent px-2.5 py-0.5 text-[10px] font-semibold text-on-accent" style={d(1.8)}>Connect</span>
        </div>
      </div>
    </PlayBox>
  )
}

// Fixed pattern so the "contribution graph" looks the same on every visit
const contribCells = Array.from({ length: 7 * 20 }, (_, i) => {
  const col = Math.floor(i / 7)
  const row = i % 7
  return { col, level: (row * 7 + col * 13 + row * col) % 5 }
})
const contribShade = [
  'bg-subtle',
  'bg-accent/20',
  'bg-accent/40',
  'bg-accent/65',
  'bg-accent shadow-[0_0_6px_var(--glow)]',
]

// The graph fills in column by column, then the brightest days keep twinkling
function GitHubPreview() {
  return (
    <PlayBox className={previewBox}>
      <div className="flex items-center gap-3 mb-4">
        <div className="relative w-10 h-10 rounded-full overflow-hidden border border-accent/40 bg-accent/15 grid place-items-center text-xs font-bold text-fg shadow-[0_0_14px_var(--glow)]">
          MV
          <img
            src={`https://github.com/${GITHUB_HANDLE}.png?size=80`}
            alt=""
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover"
            onError={e => { e.currentTarget.style.display = 'none' }}
          />
        </div>
        <div className="leading-tight">
          <p className="text-[12px] text-fg font-semibold">{GITHUB_HANDLE}</p>
          <p className="text-[10px] text-muted">Shipping projects in public</p>
        </div>
      </div>
      <div className="grid grid-flow-col grid-rows-7 gap-[3px] w-fit">
        {contribCells.map(({ col, level }, i) => (
          <span key={i} className="pv-fade block" style={d(0.2 + col * 0.045)}>
            <span className={`block w-2 h-2 rounded-[2px] ${contribShade[level]} ${level === 4 ? 'pv-shimmer' : ''}`}
              style={level === 4 ? d(2 + (i % 9) * 0.35) : undefined} />
          </span>
        ))}
      </div>
    </PlayBox>
  )
}

/* ── Card shell ── */
const cardClass = 'spot-card relative group flex h-full flex-col rounded-2xl border border-line bg-card transition-[transform,border-color] duration-300 ease-out hover:-translate-y-1'

function CardBody({ icon, label, value, note, external }) {
  return (
    <div className="flex items-center gap-4 p-5">
      <span className="w-11 h-11 shrink-0 rounded-xl border border-accent/20 bg-accent/10 grid place-items-center text-accent group-hover:shadow-[0_0_18px_var(--glow)] transition-shadow">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs uppercase tracking-wider text-faint mb-0.5">{label}</p>
        <p className="text-fg text-base md:text-lg font-medium break-all group-hover:text-fg">{value}</p>
        {note && <p className="text-muted text-sm mt-0.5">{note}</p>}
      </div>
      {external && <span className="text-faint group-hover:text-accent transition-colors">{Icon.arrow}</span>}
    </div>
  )
}

function LinkCard({ href, preview, ...body }) {
  const external = href.startsWith('http')
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className={cardClass}
    >
      <SpotLayer />
      {preview}
      <CardBody {...body} external />
    </a>
  )
}

const actionBase = 'group/btn inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-[transform,background-color,box-shadow,border-color] duration-200 active:scale-95 hover:shadow-[0_0_18px_var(--glow)]'
const iconNudge = 'transition-transform duration-200 group-hover/btn:-rotate-12 group-hover/btn:scale-110'

function EmailCard() {
  return (
    <div className={cardClass}>
      <SpotLayer />
      <EmailPreview />
      <CardBody icon={Icon.email} label="Email" value={EMAIL} />
      <div className="mt-auto flex flex-wrap gap-3 px-5 pb-5 pt-1">
        <Magnetic className="flex-1" strength={0.2}>
          <a href={`mailto:${EMAIL}`}
            className={`${actionBase} w-full border-accent/30 bg-accent/10 text-fg hover:bg-accent/20`}>
            <span className={iconNudge}>{Icon.email}</span> Write an email
          </a>
        </Magnetic>
        <CopyButton text={EMAIL} doneMessage="Email address copied" label="Copy" />
      </div>
    </div>
  )
}

function PhoneCard() {
  return (
    <div className={cardClass}>
      <SpotLayer />
      <WhatsAppPreview />
      <CardBody
        icon={Icon.phone}
        label="Phone · WhatsApp"
        value={PHONE_DISPLAY}
        note="Available for phone calls or WhatsApp"
      />
      <div className="mt-auto flex flex-wrap gap-3 px-5 pb-5 pt-1">
        <Magnetic className="flex-1" strength={0.2}>
          <a href={`tel:${PHONE_TEL}`}
            className={`${actionBase} w-full border-accent/30 bg-accent/10 text-fg hover:bg-accent/20`}>
            <span className={iconNudge}>{Icon.phone}</span> Call
          </a>
        </Magnetic>
        <Magnetic className="flex-1" strength={0.2}>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"
            className={`${actionBase} w-full border-good/30 bg-good/10 text-good hover:bg-good/20`}>
            <span className={iconNudge}>{Icon.chat}</span> WhatsApp
          </a>
        </Magnetic>
        <CopyButton text={PHONE_DISPLAY} doneMessage="Phone number copied" label="Copy number" className="basis-full" />
      </div>
    </div>
  )
}

export default function Contact() {
  return (
    <section id="contact" className="py-28 px-6">
      <div className="max-w-5xl mx-auto">

        <SectionHeader eyebrow="Contact" title="Let's talk" size="lg">
          I'm open to data science, pricing, risk and AI roles on fast-moving teams, especially
          startups and fintech. Prefer a quick call? Call or WhatsApp me any time.
        </SectionHeader>

        <div className="grid md:grid-cols-2 gap-6">
          <Reveal className="h-full"><EmailCard /></Reveal>
          <Reveal delay={0.12} className="h-full"><PhoneCard /></Reveal>
          <Reveal className="h-full">
            <LinkCard href={`https://www.linkedin.com/in/${LINKEDIN_HANDLE}`} preview={<LinkedInPreview />}
              icon={Icon.linkedin} label="LinkedIn" value={`linkedin.com/in/${LINKEDIN_HANDLE}`} />
          </Reveal>
          <Reveal delay={0.12} className="h-full">
            <LinkCard href={`https://github.com/${GITHUB_HANDLE}`} preview={<GitHubPreview />}
              icon={Icon.github} label="GitHub" value={`github.com/${GITHUB_HANDLE}`} />
          </Reveal>
        </div>
      </div>
    </section>
  )
}
