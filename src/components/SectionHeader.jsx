// Shared heading for each section: glowing label, title, animated light bar, optional intro text.
export default function SectionHeader({ eyebrow, title, children, size = 'md' }) {
  const titleSize = size === 'lg' ? 'text-4xl md:text-6xl' : 'text-3xl md:text-4xl'

  return (
    <div className="mb-12">
      <p className="neon-eyebrow text-sm font-medium mb-3 tracking-widest uppercase">{eyebrow}</p>
      <h2 className={`${titleSize} font-bold text-fg`}>{title}</h2>
      <span className="neon-bar mt-4" />
      {children && (
        <p className="text-muted max-w-xl mt-5 leading-relaxed">{children}</p>
      )}
    </div>
  )
}
