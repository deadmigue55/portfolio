import SectionHeader from './SectionHeader'
import Reveal from './Reveal'
import { CircuitLine } from './Electric'
import { useCopy, rich } from '../i18n'

export default function About() {
  const c = useCopy().about
  return (
    <section id="about" aria-labelledby="about-title" className="py-28 px-6">
      <div className="max-w-5xl mx-auto">

        <SectionHeader id="about-title" eyebrow={c.eyebrow} title={c.title} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

          {/* Left: bio */}
          <div className="space-y-5 text-muted leading-relaxed">
            <p>{rich(c.p1)}</p>
            <p>{rich(c.p2)}</p>
            <p>{rich(c.p3)}</p>
            <p className="text-faint">{c.p4}</p>
          </div>

          {/* Right: timeline */}
          <ol className="space-y-6">
            {c.timeline.map((item, i) => (
              <Reveal as="li" key={item.title} delay={0.1 + i * 0.15} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="neon-dot w-2 h-2 rounded-full mt-1.5 shrink-0"></div>
                  {i < c.timeline.length - 1 && <CircuitLine className="mt-2 flex-1" />}
                </div>
                <div className="pb-6">
                  <span className="text-xs text-accent font-medium">{item.year}</span>
                  <h3 className="text-fg font-semibold mt-1">{item.title}</h3>
                  <p className="text-faint text-sm">{item.org}</p>
                  <p className="text-muted text-sm mt-2 leading-relaxed">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
