import { useState } from 'react'
import { toast } from '../toast'

// Copies text to the clipboard, swaps its icon for a check, and confirms with a toast.
async function copy(text) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    // Older browsers and some embedded views refuse the clipboard API: select-and-copy instead
    const area = document.createElement('textarea')
    area.value = text
    area.setAttribute('readonly', '')
    area.style.position = 'fixed'
    area.style.opacity = '0'
    document.body.appendChild(area)
    area.select()
    const ok = document.execCommand('copy')
    area.remove()
    return ok
  }
}

const copyIcon = (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V5a2 2 0 0 1 2-2h10" />
  </svg>
)
const checkIcon = (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 6 9 17l-5-5" />
  </svg>
)

export default function CopyButton({ text, doneMessage, label = 'Copy', className = '' }) {
  const [done, setDone] = useState(false)
  const onClick = async () => {
    if (await copy(text)) {
      setDone(true)
      toast(doneMessage)
      setTimeout(() => setDone(false), 1600)
    }
  }
  return (
    <button type="button" onClick={onClick}
      className={`group/btn inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-[transform,background-color,border-color,color] duration-200 active:scale-95 ${
        done ? 'border-good/50 bg-good/15 text-good' : 'border-line bg-subtle text-soft hover:border-accent/50 hover:text-fg'} ${className}`}>
      <span className="transition-transform duration-200 group-hover/btn:scale-110">{done ? checkIcon : copyIcon}</span>
      {done ? 'Copied' : label}
    </button>
  )
}
