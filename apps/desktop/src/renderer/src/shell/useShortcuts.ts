import { useEffect } from 'react'
import { useUi } from '@/store/ui'

function isTyping(target: EventTarget | null): boolean {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))
  )
}

/**
 * Global keys: Ctrl/Cmd+K palette, Ctrl/Cmd+, settings, [ menu, ] side panel.
 * Remapping comes with the customization task (ADR-014).
 */
export function useShortcuts(): void {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent): void => {
      const ui = useUi.getState()
      const mod = e.metaKey || e.ctrlKey
      if (mod && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        ui.setPaletteOpen(!ui.paletteOpen)
        return
      }
      if (ui.paletteOpen || isTyping(e.target)) return
      if (mod && e.key === ',') {
        e.preventDefault()
        ui.setSection('settings')
      } else if (!mod && !e.altKey && e.key === '[') {
        ui.toggleNav()
      } else if (!mod && !e.altKey && e.key === ']') {
        ui.togglePanel()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])
}
