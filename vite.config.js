import { execSync } from 'node:child_process'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// Shown in the footer as "Updated ...": the day this build was made
const buildDate = new Date().toISOString().slice(0, 10)
const commit = (() => {
  if (process.env.VERCEL_GIT_COMMIT_SHA) return process.env.VERCEL_GIT_COMMIT_SHA.slice(0, 7)
  try { return execSync('git rev-parse --short HEAD', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim() } catch { return 'dev' }
})()

// The fonts above the fold are fetched in parallel with the CSS instead of after it
const CRITICAL_FONTS = [/bricolage-grotesque-latin-opsz-normal/, /ibm-plex-sans-latin-400-normal/, /instrument-serif-latin-400-italic/]
function preloadCriticalFonts() {
  return {
    name: 'preload-critical-fonts',
    transformIndexHtml: {
      order: 'post',
      handler(_html, ctx) {
        if (!ctx.bundle) return []
        return Object.keys(ctx.bundle)
          .filter(file => CRITICAL_FONTS.some(re => re.test(file)))
          .map(file => ({
            tag: 'link',
            attrs: { rel: 'preload', as: 'font', type: 'font/woff2', href: `/${file}`, crossorigin: '' },
            injectTo: 'head',
          }))
      },
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), preloadCriticalFonts()],
  define: {
    __BUILD_DATE__: JSON.stringify(buildDate),
    __COMMIT__: JSON.stringify(commit),
  },
})
