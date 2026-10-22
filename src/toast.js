// Call toast('Email copied') from anywhere; <Toaster /> in App shows it.
export const TOAST_EVENT = 'portfolio:toast'
export const toast = message => window.dispatchEvent(new CustomEvent(TOAST_EVENT, { detail: message }))
