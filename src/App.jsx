import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Contact from './components/Contact'
import Footer from './components/Footer'
import NeonSymbols from './components/NeonSymbols'
import { MotionConfig } from 'motion/react'

export default function App() {
  return (
    // reducedMotion="user": Motion animations calm down for visitors who ask for less motion
    <MotionConfig reducedMotion="user">
    <div className="min-h-screen bg-[#0a0a0f] text-slate-200 antialiased">
      {/* Fixed neon background behind every section */}
      <NeonSymbols />
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Contact />
      </main>
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
    </MotionConfig>
  )
}
