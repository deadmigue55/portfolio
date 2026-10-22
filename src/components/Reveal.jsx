import { motion } from 'motion/react'

// Fades a block in as it scrolls into view: a short rise, a touch of blur that sharpens.
// Plays once. Visitors who ask for less motion get the plain fade (see MotionConfig in App).
export default function Reveal({ children, delay = 0, y = 22, blur = 8, className = '', as = 'div' }) {
  const Tag = motion[as]
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y, filter: `blur(${blur}px)` }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.15, margin: '0px 0px -6% 0px' }}
      transition={{ duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Tag>
  )
}
