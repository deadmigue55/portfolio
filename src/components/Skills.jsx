import { useState } from 'react'
import NeonButton from './NeonButton'
import Reveal from './Reveal'
import { SpotLayer } from './Electric'
import SectionHeader from './SectionHeader'
import { StatsPreview, ActuarialPreview, QuantPreview, ToolsPreview } from './Previews'
import { useCopy } from '../i18n'

/*
  Skills as evidence. A skill that was used in a shipped project is marked with a dot and highlighted;
  hovering, focusing or tapping it says where (in a caption inside the card, so nothing is clipped on a phone).
  The others are quieter and show a short line about using the skill in other work (`eg` in the copy). A skill earns its mark only when
  a project really uses it: the goal is to move every skill from an example to a project (replace its
  `eg` with a `proof` in the copy).
  The previews are in the same order as the categories in the copy.
*/

const PREVIEWS = [StatsPreview, ActuarialPreview, QuantPreview, ToolsPreview]

function Chip({ skill, onHint }) {
  const c = useCopy().skills
  const show = () => onHint(skill)
  const shipped = Boolean(skill.proof)
  return (
    <button type="button" onMouseEnter={show} onFocus={show} onClick={show} onMouseLeave={() => onHint(null)} onBlur={() => onHint(null)}
      aria-label={`${skill.n}. ${shipped ? c.proofIn(skill.proof) : `${c.egLabel}: ${skill.eg}`}`}
      className={shipped
        ? 'inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-medium text-fg transition-colors hover:border-accent hover:bg-accent/20 focus-visible:border-accent'
        : 'inline-flex items-center rounded-full border border-line bg-subtle px-3 py-1 text-xs font-medium text-muted transition-colors hover:border-accent/40 hover:text-fg focus-visible:border-accent'}>
      {shipped && <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-accent shadow-[0_0_6px_var(--glow)]" />}
      {skill.n}
    </button>
  )
}

function SkillCard({ cat, Preview }) {
  const c = useCopy().skills
  const [hint, setHint] = useState(null)
  return (
    <div className="spot-card relative h-full p-6 rounded-xl border border-line bg-card">
      <SpotLayer />

      <div className="relative z-10 mb-5">
        <Preview />
      </div>

      <h3 className="text-accent font-semibold mb-4 text-sm tracking-wide uppercase relative z-10">{cat.label}</h3>
      <div className="flex flex-wrap gap-2 relative z-10">
        {cat.skills.map(s => <Chip key={s.n} skill={s} onHint={setHint} />)}
      </div>

      {/* Where the highlighted skill was used */}
      <p aria-live="polite" className="relative z-10 mt-4 min-h-[2.6rem] border-t border-line pt-3 text-[12.5px] leading-snug text-muted">
        {hint
          ? <><span className="font-medium text-fg">{hint.n}</span> · {hint.proof ?? <>{c.egLabel}: {hint.eg}</>}</>
          : <span className="text-faint">{c.legend}</span>}
      </p>
    </div>
  )
}

export default function Skills() {
  const c = useCopy().skills
  return (
    <section id="skills" aria-labelledby="skills-title" className="py-28 px-6 bg-subtle/40">
      <div className="max-w-5xl mx-auto">

        <SectionHeader id="skills-title" eyebrow={c.eyebrow} title={c.title}>{c.intro}</SectionHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {c.categories.map((cat, i) => (
            <Reveal key={i} delay={(i % 2) * 0.12} className="h-full">
              <SkillCard cat={cat} Preview={PREVIEWS[i]} />
            </Reveal>
          ))}
        </div>

        {/* Certs / learning callout */}
        <div className="spot-card relative mt-10 p-5 rounded-xl border border-line bg-card flex flex-col md:flex-row items-start md:items-center gap-4">
          <SpotLayer />
          <div className="flex-1">
            <p className="text-fg font-medium">{c.levelingTitle}</p>
            <p className="text-muted text-sm mt-1">{c.leveling}</p>
          </div>
          <NeonButton href="#contact" variant="ghost">{c.talk}</NeonButton>
        </div>
      </div>
    </section>
  )
}
