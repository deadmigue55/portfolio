// The shared answer to "is the intro playing?". The provider (components/IntroProvider.jsx) fills it;
// components read it with useIntro(). Phases: 'off' (no intro for this visitor), 'playing', 'revealing' (the burst has started and the page is
// live underneath), 'done'.
import { createContext, useContext } from 'react'

export const IntroCtx = createContext({ phase: 'off', reveal() {}, finish() {}, replay() {} })
export const useIntro = () => useContext(IntroCtx)
