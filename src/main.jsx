import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Fonts are bundled with the site (only the Latin subset is downloaded, and the critical ones are preloaded)
import '@fontsource-variable/bricolage-grotesque/opsz.css'
import '@fontsource/ibm-plex-sans/latin-300.css'
import '@fontsource/ibm-plex-sans/latin-400.css'
import '@fontsource/ibm-plex-sans/latin-500.css'
import '@fontsource/ibm-plex-sans/latin-600.css'
import '@fontsource/ibm-plex-mono/latin-400.css'
import '@fontsource/ibm-plex-mono/latin-500.css'
import '@fontsource/instrument-serif/latin-400.css'
import '@fontsource/instrument-serif/latin-400-italic.css'
import './index.css'
import './intro.css'
import './neon2.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// For anyone who opens the developer tools
console.log(
  '%cHi, you found the source.%c\nBuilt with React, Vite, Tailwind and Motion. Real data, checked against the Python project.\nhttps://github.com/deadmigue55/portfolio',
  'font:600 14px system-ui;color:#FF8A3D',
  'font:12px system-ui',
)
