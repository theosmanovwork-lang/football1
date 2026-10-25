import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { ThemeName, ZoomLevel } from '@fm/shared'
import { bucketDefaults, bucketFor, NAV_DEFAULT, type Bucket } from '@/layout/layout'
import type { SectionId } from '@/navigation'

export type Density = 'compact' | 'comfortable'
export type HomeTab = 'today' | 'week' | 'all'

interface Preferences {
  theme: ThemeName
  density: Density
  zoom: ZoomLevel
  section: SectionId
  homeTab: HomeTab
  navPx: number
  /** Panel widths the user dragged to, per layout bucket; absent means the bucket default. */
  panelPx: Partial<Record<Bucket, number>>
  collapsedGroups: string[]
}

interface Session {
  width: number
  bucket: Bucket
  navCompact: boolean
  /** Drawer state of the hidden menu in the narrowest bucket. */
  navOpen: boolean
  panelOpen: boolean
  paletteOpen: boolean
}

interface Actions {
  setWidth(width: number): void
  toggleNav(): void
  setNavOpen(open: boolean): void
  togglePanel(): void
  setNavPx(px: number): void
  setPanelPx(px: number): void
  resetNavPx(): void
  resetPanelPx(): void
  setSection(section: SectionId): void
  setHomeTab(tab: HomeTab): void
  toggleGroup(id: string): void
  setTheme(theme: ThemeName): void
  setDensity(density: Density): void
  setZoom(zoom: ZoomLevel): void
  setPaletteOpen(open: boolean): void
}

export type UiState = Preferences & Session & Actions

function initialWidth(): number {
  return typeof window === 'undefined' ? 1440 : window.innerWidth
}

/** Layout state every bucket starts from (CLAUDE.md: crossing a breakpoint resets to its defaults). */
function sessionFor(
  width: number,
): Pick<Session, 'width' | 'bucket' | 'navCompact' | 'navOpen' | 'panelOpen'> {
  const bucket = bucketFor(width)
  const d = bucketDefaults(bucket)
  return { width, bucket, navCompact: d.navCompact, navOpen: false, panelOpen: d.panelOpen }
}

export function panelPxFor(state: Pick<UiState, 'panelPx' | 'bucket'>): number {
  return state.panelPx[state.bucket] ?? bucketDefaults(state.bucket).panelPx
}

/** Bump when the shape of persisted preferences changes, and migrate instead of resetting. */
const PREFERENCES_VERSION = 1

export const useUi = create<UiState>()(
  persist(
    (set) => ({
      theme: 'dark',
      density: 'compact',
      zoom: 1,
      section: 'home',
      homeTab: 'today',
      navPx: NAV_DEFAULT,
      panelPx: {},
      collapsedGroups: [],
      ...sessionFor(initialWidth()),
      paletteOpen: false,

      setWidth: (width) =>
        set((s) => (bucketFor(width) === s.bucket ? { width } : sessionFor(width))),
      toggleNav: () =>
        set((s) => (s.bucket === 'xs' ? { navOpen: !s.navOpen } : { navCompact: !s.navCompact })),
      setNavOpen: (navOpen) => set({ navOpen }),
      togglePanel: () => set((s) => ({ panelOpen: !s.panelOpen })),
      setNavPx: (navPx) => set({ navPx }),
      setPanelPx: (px) => set((s) => ({ panelPx: { ...s.panelPx, [s.bucket]: px } })),
      resetNavPx: () => set({ navPx: NAV_DEFAULT }),
      resetPanelPx: () =>
        set((s) => ({
          panelPx: Object.fromEntries(Object.entries(s.panelPx).filter(([b]) => b !== s.bucket)),
        })),
      setSection: (section) => set({ section, navOpen: false }),
      setHomeTab: (homeTab) => set({ homeTab }),
      toggleGroup: (id) =>
        set((s) => ({
          collapsedGroups: s.collapsedGroups.includes(id)
            ? s.collapsedGroups.filter((g) => g !== id)
            : [...s.collapsedGroups, id],
        })),
      setTheme: (theme) => set({ theme }),
      setDensity: (density) => set({ density }),
      setZoom: (zoom) => set({ zoom }),
      setPaletteOpen: (paletteOpen) => set({ paletteOpen }),
    }),
    {
      name: 'fm.ui-preferences',
      version: PREFERENCES_VERSION,
      storage: createJSONStorage(() => localStorage),
      partialize: (s): Preferences => ({
        theme: s.theme,
        density: s.density,
        zoom: s.zoom,
        section: s.section,
        homeTab: s.homeTab,
        navPx: s.navPx,
        panelPx: s.panelPx,
        collapsedGroups: s.collapsedGroups,
      }),
    },
  ),
)
