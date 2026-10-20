import SectionHeader from './SectionHeader'

const EMAIL = 'migue.vilchis@ciencias.unam.mx'
const PHONE_DISPLAY = '+1 (914) 707-0185'
const PHONE_TEL = '+19147070185'
const WHATSAPP_URL = 'https://wa.me/19147070185'
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

/* ── Preview "images": small mockups of each channel ── */
const previewBox = 'relative h-44 overflow-hidden rounded-t-2xl border-b border-white/5 bg-gradient-to-br from-[#0b1a33] via-[#0a0f1f] to-[#0a0a12] p-5'

function EmailPreview() {
  return (
    <div className={previewBox} aria-hidden="true">
      <div className="rounded-lg border border-white/10 bg-[#0d1426]/90 shadow-[0_0_30px_rgba(0,180,255,0.12)] transition-transform duration-500 group-hover:-translate-y-1">
        <div className="flex gap-1.5 px-3 py-2 border-b border-white/5">
          <span className="w-2 h-2 rounded-full bg-rose-400/70" />
          <span className="w-2 h-2 rounded-full bg-amber-300/70" />
          <span className="w-2 h-2 rounded-full bg-emerald-400/70" />
        </div>
        <div className="px-3 py-2.5 space-y-1.5 text-[11px]">
          <p className="text-slate-500">To: <span className="text-sky-200">{EMAIL}</span></p>
          <p className="text-slate-500">Subject: <span className="text-slate-200">Let's build something</span></p>
          <p className="text-slate-300 pt-1">Hi Miguel, we'd love to chat about a role<span className="caret text-sky-300">|</span></p>
        </div>
      </div>
    </div>
  )
}

function WhatsAppPreview() {
  return (
    <div className={previewBox} aria-hidden="true">
      <div className="flex items-center gap-2 mb-3">
        <span className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-400/40 grid place-items-center text-[10px] font-semibold text-emerald-200">MV</span>
        <div className="leading-tight">
          <p className="text-[11px] text-slate-200 font-medium">Miguel Vilchis</p>
          <p className="text-[10px] text-emerald-300">online</p>
        </div>
      </div>
      <div className="space-y-2 text-[11px]">
        <p className="ml-auto w-fit max-w-[80%] rounded-lg rounded-tr-sm bg-emerald-600/30 border border-emerald-400/20 px-3 py-1.5 text-emerald-50 transition-transform duration-500 group-hover:-translate-x-1">
          Hi Miguel! Free for a quick call this week?
        </p>
        <p className="w-fit max-w-[80%] rounded-lg rounded-tl-sm bg-white/5 border border-white/10 px-3 py-1.5 text-slate-200 transition-transform duration-500 group-hover:translate-x-1">
          Absolutely. Calling you now.
        </p>
      </div>
    </div>
  )
}

function LinkedInPreview() {
  return (
    <div className={previewBox} aria-hidden="true">
      <div className="rounded-lg overflow-hidden border border-white/10 bg-[#0d1426]/90 transition-transform duration-500 group-hover:-translate-y-1">
        <div className="h-10 bg-gradient-to-r from-sky-600/60 via-blue-600/50 to-indigo-600/50" />
        <div className="px-3 pb-3 -mt-5 flex items-end gap-3">
          <span className="w-11 h-11 rounded-full border-2 border-[#0d1426] bg-gradient-to-br from-sky-400 to-blue-700 grid place-items-center text-xs font-bold text-white shadow-[0_0_14px_rgba(56,189,248,0.5)]">MV</span>
          <div className="flex-1 min-w-0 leading-tight">
            <p className="text-[12px] text-white font-semibold truncate">Miguel Vilchis</p>
            <p className="text-[10px] text-slate-400 truncate">Actuary · Pricing &amp; Risk · Data &amp; AI</p>
          </div>
          <span className="shrink-0 rounded-full bg-sky-500 px-2.5 py-0.5 text-[10px] font-semibold text-white">Connect</span>
        </div>
      </div>
    </div>
  )
}

// Fixed pattern so the "contribution graph" looks the same on every visit
const contribCells = Array.from({ length: 7 * 20 }, (_, i) => {
  const col = Math.floor(i / 7)
  const row = i % 7
  return (row * 7 + col * 13 + row * col) % 5
})
const contribShade = [
  'bg-white/[0.04]',
  'bg-sky-900/80',
  'bg-sky-700/80',
  'bg-sky-500/80',
  'bg-cyan-300 shadow-[0_0_6px_rgba(103,232,249,0.8)]',
]

function GitHubPreview() {
  return (
    <div className={previewBox} aria-hidden="true">
      <div className="flex items-center gap-3 mb-4">
        <div className="relative w-10 h-10 rounded-full overflow-hidden border border-sky-400/40 bg-sky-900/40 grid place-items-center text-xs font-bold text-sky-200 shadow-[0_0_14px_rgba(56,189,248,0.35)]">
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
          <p className="text-[12px] text-white font-semibold">{GITHUB_HANDLE}</p>
          <p className="text-[10px] text-slate-400">Shipping projects in public</p>
        </div>
      </div>
      <div className="grid grid-flow-col grid-rows-7 gap-[3px] w-fit">
        {contribCells.map((level, i) => (
          <span key={i} className={`w-2 h-2 rounded-[2px] ${contribShade[level]}`} />
        ))}
      </div>
    </div>
  )
}

/* ── Card shell ── */
const cardClass = 'neon-ring group flex flex-col rounded-2xl border border-white/10 bg-[#0c0c14]/85 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1'

function CardBody({ icon, label, value, note, external }) {
  return (
    <div className="flex items-center gap-4 p-5">
      <span className="w-11 h-11 shrink-0 rounded-xl border border-sky-400/20 bg-sky-500/10 grid place-items-center text-sky-300 group-hover:shadow-[0_0_18px_rgba(56,189,248,0.45)] transition-shadow">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs uppercase tracking-wider text-slate-500 mb-0.5">{label}</p>
        <p className="text-slate-100 text-base md:text-lg font-medium break-all group-hover:text-white">{value}</p>
        {note && <p className="text-slate-400 text-sm mt-0.5">{note}</p>}
      </div>
      {external && <span className="text-slate-500 group-hover:text-sky-300 transition-colors">{Icon.arrow}</span>}
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
      {preview}
      <CardBody {...body} external />
    </a>
  )
}

function PhoneCard() {
  return (
    <div className={cardClass}>
      <WhatsAppPreview />
      <CardBody
        icon={Icon.phone}
        label="Phone · WhatsApp"
        value={PHONE_DISPLAY}
        note="Available for phone calls or WhatsApp"
      />
      <div className="flex gap-3 px-5 pb-5 -mt-1">
        <a href={`tel:${PHONE_TEL}`}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-sky-400/30 bg-sky-500/10 px-4 py-2.5 text-sm font-medium text-sky-200 hover:bg-sky-500/20 hover:shadow-[0_0_18px_rgba(56,189,248,0.35)] transition-all">
          {Icon.phone} Call
        </a>
        <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-emerald-400/30 bg-emerald-500/10 px-4 py-2.5 text-sm font-medium text-emerald-200 hover:bg-emerald-500/20 hover:shadow-[0_0_18px_rgba(52,211,153,0.35)] transition-all">
          {Icon.chat} WhatsApp
        </a>
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
          <LinkCard href={`mailto:${EMAIL}`} preview={<EmailPreview />}
            icon={Icon.email} label="Email" value={EMAIL} />
          <PhoneCard />
          <LinkCard href={`https://www.linkedin.com/in/${LINKEDIN_HANDLE}`} preview={<LinkedInPreview />}
            icon={Icon.linkedin} label="LinkedIn" value={`linkedin.com/in/${LINKEDIN_HANDLE}`} />
          <LinkCard href={`https://github.com/${GITHUB_HANDLE}`} preview={<GitHubPreview />}
            icon={Icon.github} label="GitHub" value={`github.com/${GITHUB_HANDLE}`} />
        </div>
      </div>
    </section>
  )
}
