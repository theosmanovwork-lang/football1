import type { ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useLayoutMetrics } from '@/layout/useLayout'
import { useUi } from '@/store/ui'
import { cn } from '@/lib/utils'
import { Resizer } from './Resizer'

const SLIDE = { duration: 0.18, ease: [0.16, 1, 0.3, 1] } as const

interface WithSidePanelProps {
  label: string
  panel: ReactNode
  children: ReactNode
}

/**
 * Content area with the right panel: inline next to the content on wide windows,
 * sliding over it with a scrim on narrow ones (CLAUDE.md breakpoints).
 */
export function WithSidePanel({ label, panel, children }: WithSidePanelProps) {
  const metrics = useLayoutMetrics()
  const panelOpen = useUi((s) => s.panelOpen)
  const togglePanel = useUi((s) => s.togglePanel)
  const setPanelPx = useUi((s) => s.setPanelPx)
  const resetPanelPx = useUi((s) => s.resetPanelPx)
  const overlay = !metrics.panelInline

  const resizer = (
    <Resizer
      edge="left"
      label="Ширина панели"
      value={metrics.panelPx}
      min={metrics.panelMin}
      max={metrics.panelMax}
      onChange={setPanelPx}
      onReset={resetPanelPx}
    />
  )

  return (
    <div className="relative min-h-0 flex-1">
      <div className="absolute inset-0 overflow-y-auto">
        <div className="flex min-h-full">
          <div className="min-w-0 flex-1">{children}</div>
          {panelOpen && !overlay && (
            <aside
              aria-label={label}
              style={{ width: metrics.panelPx }}
              className="relative flex-none border-l border-line bg-surface"
            >
              {resizer}
              {panel}
            </aside>
          )}
        </div>
      </div>
      <AnimatePresence>
        {panelOpen && overlay && (
          <>
            <motion.button
              key="scrim"
              type="button"
              aria-label="Закрыть боковую панель"
              onClick={togglePanel}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={SLIDE}
              className="absolute inset-0 z-[4] cursor-default border-0 bg-scrim p-0"
            />
            <motion.aside
              key="panel"
              aria-label={label}
              style={{ width: metrics.panelPx }}
              initial={{ x: 24, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 24, opacity: 0 }}
              transition={SLIDE}
              className={cn(
                'absolute top-0 right-0 bottom-0 z-[5] max-w-full overflow-y-auto border-l border-line-control bg-surface shadow-overlay',
              )}
            >
              {resizer}
              {panel}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
