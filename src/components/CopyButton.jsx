import { useState } from 'react'
import { toast } from '../toast'
import { copyText } from '../lib/clipboard'

// Copies text to the clipboard (lib/clipboard.js), swaps its icon for a check, and confirms with a toast.

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

export default function CopyButton({ text, doneMessage, label = 'Copy', doneLabel = 'Copied', className = '' }) {
  const [done, setDone] = useState(false)
  const onClick = async () => {
    if (await copyText(text)) {
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
      {done ? doneLabel : label}
    </button>
  )
}
