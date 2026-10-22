// The command menu is opened from anywhere (the navbar button, Ctrl/Cmd+K) with this event.
export const PALETTE_EVENT = 'open-palette'
export const openPalette = () => window.dispatchEvent(new Event(PALETTE_EVENT))
