// Computed once when the page loads (keeps render pure)
const YEAR = new Date().getFullYear()

export default function Footer() {
  return (
    <footer className="relative py-8 px-6">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-sky-400/40 to-transparent" aria-hidden="true" />
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-slate-500 text-sm">
        <span>© {YEAR} Miguel Vilchis</span>
        <span>Built with React, Vite and Tailwind · Hosted on Vercel</span>
      </div>
    </footer>
  )
}
