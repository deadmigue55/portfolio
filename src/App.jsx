import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Story from './components/Story'
import Projects from './components/Projects'
import Contact from './components/Contact'
import Footer from './components/Footer'
import NeonSymbols from './components/NeonSymbols'
import Toaster from './components/Toast'
import Spotlight from './components/Spotlight'
import { CircuitDivider } from './components/Electric'
import { MotionConfig } from 'motion/react'

export default function App() {
  return (
    // reducedMotion="user": Motion animations calm down for visitors who ask for less motion
    <MotionConfig reducedMotion="user">
    <div className="min-h-screen bg-bg text-fg antialiased">
      {/* Fixed neon background behind every section */}
      <NeonSymbols />
      <Navbar />
      <Toaster />
      <Spotlight />
      <main className="relative z-10">
        <Hero />
        <CircuitDivider />
        <About />
        <CircuitDivider late />
        <Skills />
        <CircuitDivider />
        <Story />
        <CircuitDivider late />
        <Projects />
        <CircuitDivider />
        <Contact />
      </main>
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
    </MotionConfig>
  )
}
