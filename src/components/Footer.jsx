export default function Footer() {
  return (
    <footer className="py-8 px-6 border-t border-white/5">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-slate-600 text-sm">
        <span>© {new Date().getFullYear()} Miguel Vilchis</span>
        <span>Built with React + Vite + Tailwind · Hosted on Vercel</span>
      </div>
    </footer>
  )
}
