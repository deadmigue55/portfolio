import { motion } from 'motion/react'
import Reveal from './Reveal'

const rise = { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
const word = { hidden: { y: '115%' }, show: { y: 0, transition: rise } }

// Shared heading for each section: glowing label, title, animated light bar, optional intro text.
// The title slides up word by word through a mask, the same way the hero headline does.
// The heading itself is what the browser watches: a word that starts hidden inside its mask is clipped,
// and a clipped element is never "in view", so the words follow their parent instead.
export default function SectionHeader({ eyebrow, title, children, size = 'md', id }) {
  const titleSize = size === 'lg' ? 'text-4xl md:text-6xl' : 'text-3xl md:text-4xl'
  const words = title.split(' ')

  return (
    <div className="mb-12">
      <Reveal y={10} blur={4}>
        <p className="neon-eyebrow text-sm font-medium mb-3 tracking-widest uppercase">{eyebrow}</p>
      </Reveal>
      {/* key={title}: a new language mounts a fresh heading, so extra words are revealed too */}
      <motion.h2 key={title} id={id} className={`${titleSize} font-bold text-fg`}
        initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.5 }}
        transition={{ staggerChildren: 0.035, delayChildren: 0.03 }}>
        {words.map((w, i) => (
          <span key={i} className="inline-block overflow-hidden pb-[0.12em] align-bottom">
            <motion.span className="inline-block" variants={word}>
              {w}{i < words.length - 1 ? ' ' : ''}
            </motion.span>
          </span>
        ))}
      </motion.h2>
      <Reveal y={6} blur={0} delay={0.2}>
        <span className="neon-bar mt-4" />
        {children && <p className="text-muted max-w-xl mt-5 leading-relaxed">{children}</p>}
      </Reveal>
    </div>
  )
}
