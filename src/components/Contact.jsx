const links = [
  {
    label: 'Email',
    value: 'migue.vilchis@ciencias.unam.mx',
    href: 'mailto:migue.vilchis@ciencias.unam.mx',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    value: 'linkedin.com/in/miguevilchis',
    href: 'https://linkedin.com/in/miguevilchis',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
  {
    label: 'GitHub',
    value: 'github.com/jonyxnx',
    href: 'https://github.com/jonyxnx',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
      </svg>
    ),
  },
]

export default function Contact() {
  return (
    <section id="contact" className="py-28 px-6 bg-white/[0.02]">
      <div className="max-w-5xl mx-auto">

        <p className="text-indigo-400 text-sm font-medium mb-3 tracking-widest uppercase">Contact</p>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Let's talk</h2>
        <p className="text-slate-400 max-w-lg mb-12 leading-relaxed">
          I'm open to data science internships, junior roles in fintech, and collaboration on
          quantitative projects. Feel free to reach out.
        </p>

        <div className="flex flex-col gap-4 max-w-md">
          {links.map(link => (
            <a key={link.label} href={link.href}
              target={link.href.startsWith('http') ? '_blank' : undefined}
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:border-indigo-500/30 hover:bg-white/[0.04] transition-all duration-200 group">
              <span className="text-slate-500 group-hover:text-indigo-400 transition-colors">
                {link.icon}
              </span>
              <div>
                <p className="text-xs text-slate-500 mb-0.5">{link.label}</p>
                <p className="text-slate-300 text-sm group-hover:text-white transition-colors">{link.value}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
