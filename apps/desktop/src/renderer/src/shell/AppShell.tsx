import { useEffect } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { api } from '@/bridge'
import { NAV_DRAWER } from '@/layout/layout'
import { useLayoutMetrics, useWindowWidth } from '@/layout/useLayout'
import { HomeScreen } from '@/screens/home/HomeScreen'
import { PlaceholderScreen } from '@/screens/PlaceholderScreen'
import { SettingsScreen } from '@/screens/SettingsScreen'
import { useUi } from '@/store/ui'
import { CommandPalette } from './CommandPalette'
import { Footer } from './Footer'
import { Header } from './Header'
import { Resizer } from './Resizer'
import { Sidebar } from './Sidebar'
import { useShortcuts } from './useShortcuts'

const SLIDE = { duration: 0.18, ease: [0.16, 1, 0.3, 1] } as const

/** Applies theme, density and zoom to the document and the native window. */
function useAppearance(): void {
  const theme = useUi((s) => s.theme)
  const density = useUi((s) => s.density)
  const zoom = useUi((s) => s.zoom)
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    document.documentElement.style.colorScheme = theme
    void api.setTheme(theme)
  }, [theme])
  useEffect(() => {
    document.documentElement.dataset['density'] = density
  }, [density])
  useEffect(() => {
    void api.setZoom(zoom)
  }, [zoom])
}

function SectionView() {
  const section = useUi((s) => s.section)
  if (section === 'home') return <HomeScreen />
  if (section === 'settings') return <SettingsScreen />
  return <PlaceholderScreen section={section} />
}

export function AppShell() {
  useWindowWidth()
  useShortcuts()
  useAppearance()

  const width = useUi((s) => s.width)
  const bucket = useUi((s) => s.bucket)
  const navCompact = useUi((s) => s.navCompact)
  const navOpen = useUi((s) => s.navOpen)
  const navPx = useUi((s) => s.navPx)
  const setNavOpen = useUi((s) => s.setNavOpen)
  const setNavPx = useUi((s) => s.setNavPx)
  const resetNavPx = useUi((s) => s.resetNavPx)
  const metrics = useLayoutMetrics()
  const narrowest = bucket === 'xs'

  return (
    <div className="relative flex h-full bg-app text-fg">
      {!narrowest && (
        <aside
          style={{ width: metrics.navWidth }}
          className="relative flex-none transition-[width] duration-150 ease-out"
        >
          <Sidebar compact={navCompact} drawer={false} />
          {!navCompact && (
            <Resizer
              edge="right"
              label="Ширина меню"
              value={navPx}
              min={metrics.navMin}
              max={metrics.navMax}
              onChange={setNavPx}
              onReset={resetNavPx}
            />
          )}
        </aside>
      )}

      <AnimatePresence>
        {narrowest && navOpen && (
          <>
            <motion.button
              key="nav-scrim"
              type="button"
              aria-label="Закрыть меню"
              onClick={() => setNavOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={SLIDE}
              className="absolute inset-0 z-[9] cursor-default border-0 bg-scrim p-0"
            />
            <motion.aside
              key="nav-drawer"
              style={{ width: NAV_DRAWER }}
              initial={{ x: -24, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -24, opacity: 0 }}
              transition={SLIDE}
              className="absolute top-0 bottom-0 left-0 z-10 max-w-full border-r border-line-control bg-app shadow-overlay"
            >
              <Sidebar compact={false} drawer />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex min-w-0 flex-1 flex-col pt-2 pr-2">
        <main className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[10px] border border-line-card bg-surface">
          <Header />
          <SectionView />
        </main>
        <Footer width={width} bucket={bucket} metrics={metrics} />
      </div>

      <CommandPalette />
    </div>
  )
}
