// Live GitHub numbers for the contact card: public endpoints, no token and no server. The visitor's
// browser asks GitHub directly (its API allows cross-origin reads) and keeps the answer for ten
// minutes. Any failure gives null and the card falls back to its decorative graph, so the page
// never shows a number it did not just read.
import { useEffect, useState } from 'react'
import { GITHUB_HANDLE } from '../links.js'

const API = 'https://api.github.com'
// The calendar is not in GitHub's REST API (it needs a token); this open service reads the public profile page
const CALENDAR = `https://github-contributions-api.jogruber.de/v4/${GITHUB_HANDLE}?y=last`
const KEY = `gh-live:${GITHUB_HANDLE}`
const TTL_MS = 10 * 60 * 1000
const TIMEOUT_MS = 6000
export const WEEKS = 20

async function getJSON(url, signal) {
  const timer = AbortSignal.timeout(TIMEOUT_MS)
  const res = await fetch(url, { signal: AbortSignal.any([signal, timer]), headers: { Accept: 'application/vnd.github+json' } })
  if (!res.ok) throw new Error(`${res.status} ${url}`)
  return res.json()
}

// Days arrive oldest first. Group them into Sunday-first weeks, pad the ends to full 7-day columns
// with null (a day that has not happened yet), and keep the last WEEKS columns.
export function toWeeks(days, weeks = WEEKS) {
  const cols = []
  for (const { date, level } of days) {
    const weekday = new Date(`${date}T00:00:00Z`).getUTCDay()
    if (!cols.length || weekday === 0) cols.push(Array(7).fill(null))
    cols[cols.length - 1][weekday] = level
  }
  return cols.slice(-weeks)
}

export async function loadGithubLive(signal) {
  try {
    const cached = JSON.parse(sessionStorage.getItem(KEY) || 'null')
    if (cached && Date.now() - cached.at < TTL_MS) return cached.data
  } catch { /* storage can be blocked: just ask again */ }

  const [user, repos, calendar] = await Promise.allSettled([
    getJSON(`${API}/users/${GITHUB_HANDLE}`, signal),
    getJSON(`${API}/users/${GITHUB_HANDLE}/repos?sort=pushed&per_page=5`, signal),
    getJSON(CALENDAR, signal),
  ])
  if (user.status !== 'fulfilled') return null // the one call the card cannot do without

  const pushed = repos.status === 'fulfilled' ? repos.value.find(r => !r.fork) : null
  const data = {
    repos: user.value.public_repos,
    total: calendar.status === 'fulfilled' ? calendar.value.total?.lastYear ?? null : null,
    weeks: calendar.status === 'fulfilled' ? toWeeks(calendar.value.contributions) : null,
    lastPush: pushed ? { repo: pushed.name, at: pushed.pushed_at } : null,
  }
  try { sessionStorage.setItem(KEY, JSON.stringify({ at: Date.now(), data })) } catch { /* see above */ }
  return data
}

// Starts asking only when the section is within a screen of the viewport, so the first paint stays light
export function useGithubLive(ref) {
  const [data, setData] = useState(null)
  useEffect(() => {
    const ac = new AbortController()
    const start = () => loadGithubLive(ac.signal).then(setData, () => {})
    const el = ref.current
    if (!el || !('IntersectionObserver' in window)) { start(); return () => ac.abort() }
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { io.disconnect(); start() }
    }, { rootMargin: '600px' })
    io.observe(el)
    return () => { io.disconnect(); ac.abort() }
  }, [ref])
  return data
}

export function formatAgo(iso, lang) {
  const minutes = Math.round((new Date(iso).getTime() - Date.now()) / 60000)
  const rtf = new Intl.RelativeTimeFormat(lang, { numeric: 'auto' })
  const abs = Math.abs(minutes)
  if (abs < 60) return rtf.format(minutes, 'minute')
  if (abs < 60 * 24) return rtf.format(Math.round(minutes / 60), 'hour')
  if (abs < 60 * 24 * 60) return rtf.format(Math.round(minutes / 60 / 24), 'day')
  return rtf.format(Math.round(minutes / 60 / 24 / 30), 'month')
}
