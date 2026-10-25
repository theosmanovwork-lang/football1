import { useEffect } from 'react'
import { useUi, panelPxFor } from '@/store/ui'
import { computeLayout, type LayoutMetrics } from './layout'

/** Follows the window width live (during drag-resize too) and feeds it to the store. */
export function useWindowWidth(): void {
  const setWidth = useUi((s) => s.setWidth)
  useEffect(() => {
    let frame = 0
    const onResize = (): void => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => setWidth(window.innerWidth))
    }
    window.addEventListener('resize', onResize)
    onResize()
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', onResize)
    }
  }, [setWidth])
}

export function useLayoutMetrics(): LayoutMetrics {
  const width = useUi((s) => s.width)
  const bucket = useUi((s) => s.bucket)
  const navCompact = useUi((s) => s.navCompact)
  const navPx = useUi((s) => s.navPx)
  const panelOpen = useUi((s) => s.panelOpen)
  const panelPx = useUi(panelPxFor)
  return computeLayout({ width, bucket, navCompact, navPx, panelPx, panelOpen })
}
