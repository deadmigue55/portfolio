import SectionHeader from './SectionHeader'
import Reveal from './Reveal'
import { CircuitLine } from './Electric'

const timeline = [
  {
    year: '2025 – Present',
    title: 'Pricing & Risk Analytics',
    org: 'SCOR Reinsurance · Mexico City',
    desc: 'Working on reinsurance pricing and actuarial reserving: analyzing loss experience, supporting pricing models and working with large actuarial datasets.',
  },
  {
    year: '2022 – 2025',
    title: 'B.Sc. Actuarial Science',
    org: 'Facultad de Ciencias, UNAM',
    desc: 'Probability, statistics, financial mathematics and stochastic processes, the quantitative core behind everything I build.',
  },
]

export default function About() {
  return (
    <section id="about" className="py-28 px-6">
      <div className="max-w-5xl mx-auto">

        <SectionHeader eyebrow="About" title="An actuary who builds" />

        <div className="grid md:grid-cols-2 gap-12">

          {/* Left: bio */}
          <div className="space-y-5 text-muted leading-relaxed">
            <p>
              I'm an Actuarial Science graduate from UNAM working in pricing and risk analytics at{' '}
              <span className="text-fg">SCOR</span>, one of the world's largest reinsurers.
              My day-to-day is pricing models, reserving methods and actuarial data.
            </p>
            <p>
              Outside work, I build projects where{' '}
              <span className="text-fg">quantitative finance</span>,{' '}
              <span className="text-fg">machine learning</span> and{' '}
              <span className="text-fg">AI</span> meet risk modeling. That's where an
              actuarial background is a real edge. I'm also preparing for{' '}
              <span className="text-fg">SOA Exam FM</span>.
            </p>
            <p>
              I'm looking for a fast-moving team (a startup, a fintech, anywhere the learning curve
              is steep) in Mexico City or remote.
            </p>
            <p className="text-faint">
              Off the keyboard: lifting, and working through boulder problems, which is the same
              mindset as debugging, with more chalk.
            </p>
          </div>

          {/* Right: timeline */}
          <div className="space-y-6">
            {timeline.map((item, i) => (
              <Reveal key={item.title} delay={0.1 + i * 0.15} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="neon-dot w-2 h-2 rounded-full mt-1.5 shrink-0"></div>
                  {i < timeline.length - 1 && <CircuitLine className="mt-2 flex-1" />}
                </div>
                <div className="pb-6">
                  <span className="text-xs text-accent font-medium">{item.year}</span>
                  <h3 className="text-fg font-semibold mt-1">{item.title}</h3>
                  <p className="text-faint text-sm">{item.org}</p>
                  <p className="text-muted text-sm mt-2 leading-relaxed">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
