import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Projects from './components/Projects'
import Explore from './components/Explore'
import Story from './components/Story'
import Skills from './components/Skills'
import About from './components/About'
import Contact from './components/Contact'
import Footer from './components/Footer'
import NeonSymbols from './components/NeonSymbols'
import Toaster from './components/Toast'
import Spotlight from './components/Spotlight'
import Ambient from './components/Ambient'
import CursorGlow from './components/CursorGlow'
import AgeRuler from './components/AgeRuler'
import CommandPalette from './components/CommandPalette'
import { CircuitDivider } from './components/Electric'
import { MotionConfig } from 'motion/react'
import IntroProvider from './components/IntroProvider'
import Intro from './components/Intro'
import { useIntro } from './intro'
import MotionPrefProvider from './components/MotionPrefProvider'
import LangProvider from './i18n/LangProvider'
import { useMotionPref } from './motion-pref'
import { useCopy } from './i18n'

function Page() {
  const c = useCopy()
  const { phase } = useIntro()
  const playing = phase === 'playing'
  const overlay = playing || phase === 'revealing'
  return (
    <>
    {overlay && <Intro />}
    <div className="min-h-screen bg-bg text-fg antialiased" inert={playing}>
      <a href="#main" className="skip-link">{c.skip}</a>
      {/* Fixed neon background behind every section */}
      <NeonSymbols />
      <Ambient />
      <Navbar />
      <Toaster />
      <Spotlight />
      <CursorGlow />
      <AgeRuler />
      <CommandPalette />
      {/* Evidence first: the project and the numbers, then how it was built, then the claims and the person */}
      <main id="main" tabIndex={-1} className="relative z-10 outline-none">
        {/* Remounted when the intro ends, so its entrance plays when the visitor can see it */}
        <Hero key={playing ? 'intro' : 'ready'} />
        <CircuitDivider />
        <Projects />
        <CircuitDivider late />
        <Explore />
        <CircuitDivider />
        <Story />
        <CircuitDivider late />
        <Skills />
        <CircuitDivider />
        <About />
        <CircuitDivider late />
        <Contact />
      </main>
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
    </>
  )
}

// MotionConfig follows the one motion switch (system setting or the Pause animations button)
function Shell() {
  const { reduced } = useMotionPref()
  return (
    <MotionConfig reducedMotion={reduced ? 'always' : 'never'}>
      <IntroProvider>
        <Page />
      </IntroProvider>
    </MotionConfig>
  )
}

export default function App() {
  return (
    <MotionPrefProvider>
      <LangProvider>
        <Shell />
      </LangProvider>
    </MotionPrefProvider>
  )
}
