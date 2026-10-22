// The shared answer to "should things move?": the visitor's system setting, or the Pause animations
// button. The provider (components/MotionPrefProvider.jsx) fills it; components read it with useMotionPref().
import { createContext, useContext } from 'react'

export const MotionCtx = createContext({ paused: false, system: false, reduced: false, toggle() {} })
export const useMotionPref = () => useContext(MotionCtx)
