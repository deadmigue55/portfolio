import { useState, useEffect } from 'react'
import { motion, AnimatePresence, useScroll, useSpring } from 'motion/react'
import ThemeToggle from './ThemeToggle'

const links = ['About', 'Skills', 'Projects', 'Contact']

const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.35 } },
}
const itemVariants = {
  hidden: { opacity: 0, y: -12, filter: 'blur(6px)' },
  show:   { opacity: 1, y: 0, filter: 'blur(0px)', transition: { type: 'spring', stiffness: 260, damping: 22 } },
}

// Which section is currently on screen (for the glowing underline)
function useActiveSection() {
  const [active, setActive] = useState('')
  useEffect(() => {
    const ids = links.map(l => l.toLowerCase())
    const onScroll = () => {
      const line = window.innerHeight * 0.4
      let current = ''
      for (const id of ids) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= line) current = id
      }
      setActive(current)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return active
}

function MenuIcon({ open }) {
  const line = 'absolute left-0 block h-0.5 w-6 rounded-full bg-current'
  const spring = { type: 'spring', stiffness: 300, damping: 24 }
  return (
    <span className="relative block w-6 h-5">
      <motion.span className={line} style={{ top: 0 }}
        animate={open ? { top: 9, rotate: 45 } : { top: 0, rotate: 0 }} transition={spring} />
      <motion.span className={line} style={{ top: 9 }}
        animate={{ opacity: open ? 0 : 1, scaleX: open ? 0 : 1 }} transition={spring} />
      <motion.span className={line} style={{ top: 18 }}
        animate={open ? { top: 9, rotate: -45 } : { top: 18, rotate: 0 }} transition={spring} />
    </span>
  )
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [hovered, setHovered] = useState(null)
  const active = useActiveSection()

  // Neon progress bar along the bottom of the navbar
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 26, restDelta: 0.001 })

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const solid = scrolled || menuOpen

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 120, damping: 20 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-[background-color,backdrop-filter] duration-300 ${solid ? 'bg-bg/85 backdrop-blur-md' : ''}`}
    >
      <div className={`max-w-5xl mx-auto px-6 flex items-center justify-between transition-[padding] duration-300 ${scrolled ? 'py-3' : 'py-4'}`}>

        {/* Logo */}
        <motion.a href="#home" className="text-fg font-semibold tracking-tight text-lg"
          whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}>
          MV
          <motion.span
            className="inline-block text-accent [text-shadow:0_0_10px_var(--glow)]"
            animate={{ opacity: [1, 0.35, 1, 1, 0.6, 1] }}
            transition={{ duration: 4, repeat: Infinity, times: [0, 0.05, 0.1, 0.7, 0.75, 0.8] }}
          >.</motion.span>
        </motion.a>

        <div className="flex items-center gap-1 md:gap-3">
        {/* Desktop links */}
        <motion.ul
          className="hidden md:flex gap-1"
          variants={listVariants} initial="hidden" animate="show"
          onMouseLeave={() => setHovered(null)}
        >
          {links.map(link => {
            const id = link.toLowerCase()
            const isActive = active === id
            return (
              <motion.li key={link} variants={itemVariants} className="relative">
                <a
                  href={`#${id}`}
                  onMouseEnter={() => setHovered(id)}
                  className={`nav-link relative z-10 block px-4 py-2 text-sm ${isActive ? 'text-fg' : 'text-muted'}`}
                >
                  {link}
                </a>

                {/* Hover pill slides between links */}
                {hovered === id && (
                  <motion.span
                    layoutId="nav-hover"
                    className="absolute inset-0 rounded-lg bg-accent/10 border border-accent/20"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}

                {/* Glowing underline under the section you're reading */}
                {isActive && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute left-3 right-3 -bottom-0.5 h-0.5 rounded-full bg-accent shadow-[0_0_10px_var(--glow)]"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </motion.li>
            )
          })}
        </motion.ul>

        <ThemeToggle />

        {/* Mobile hamburger */}
        <motion.button
          className="md:hidden text-soft hover:text-fg p-1"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          whileTap={{ scale: 0.88 }}
        >
          <MenuIcon open={menuOpen} />
        </motion.button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            className="md:hidden overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 30 }}
          >
            <motion.div className="px-6 pb-4" initial="hidden" animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } } }}>
              {links.map(link => {
                const id = link.toLowerCase()
                return (
                  <motion.a
                    key={link}
                    href={`#${id}`}
                    variants={{
                      hidden: { opacity: 0, x: -16 },
                      show: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
                    }}
                    onClick={() => setMenuOpen(false)}
                    className={`nav-link block py-2.5 text-base ${active === id ? 'text-fg' : 'text-muted'}`}
                  >
                    {link}
                  </motion.a>
                )
              })}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll progress: neon line that fills as you read */}
      <motion.div
        aria-hidden="true"
        style={{ scaleX: progress }}
        className="absolute bottom-0 inset-x-0 h-px origin-left bg-gradient-to-r from-accent via-accent-2 to-accent shadow-[0_0_8px_var(--glow)]"
      />
    </motion.nav>
  )
}
