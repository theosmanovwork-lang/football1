import { useState } from 'react'
import { ChevronDown, LayoutGrid, PanelRight } from 'lucide-react'
import { WithSidePanel } from '@/shell/SidePanel'
import { useUi, type HomeTab } from '@/store/ui'
import { cn } from '@/lib/utils'
import { FeedSection } from './Feed'
import { DECISIONS, INSIGHTS, WEEK_PLAN } from './homeData'
import { NextMatchPanel } from './NextMatchPanel'
import { AvailabilityCard, KpiStrip, LoadQuadrant } from './Widgets'

const TABS = [
  { id: 'today', label: 'Сегодня' },
  { id: 'week', label: 'Неделя' },
  { id: 'all', label: 'Все события' },
] as const satisfies readonly { id: HomeTab; label: string }[]

const GROUPS_BY_TAB = {
  today: [DECISIONS, INSIGHTS],
  week: [WEEK_PLAN],
  all: [DECISIONS, INSIGHTS, WEEK_PLAN],
} as const

function pillClass(on: boolean): string {
  return cn(
    'h-7 cursor-pointer rounded-full border px-3 text-xs font-medium transition-colors duration-[120ms]',
    on
      ? 'border-line-strong bg-selected-strong text-fg-strong'
      : 'border-line-control bg-transparent text-fg-3 hover:bg-selected',
  )
}

function Toolbar() {
  const tab = useUi((s) => s.homeTab)
  const setTab = useUi((s) => s.setHomeTab)
  const bucket = useUi((s) => s.bucket)
  const panelOpen = useUi((s) => s.panelOpen)
  const togglePanel = useUi((s) => s.togglePanel)
  const [menuOpen, setMenuOpen] = useState(false)
  const asMenu = bucket === 'xs'
  const current = TABS.find((t) => t.id === tab) ?? TABS[0]

  return (
    <div className="flex flex-none flex-wrap items-center gap-1.5 border-b border-line px-3 py-2">
      {asMenu ? (
        <div className="relative">
          <button
            type="button"
            aria-haspopup="listbox"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
            className={cn(pillClass(true), 'flex items-center gap-1.5 pr-2.5')}
          >
            {current.label}
            <ChevronDown size={12} strokeWidth={2} aria-hidden />
          </button>
          {menuOpen && (
            <div
              role="listbox"
              aria-label="Вид главной"
              className="absolute top-[34px] left-0 z-[6] flex min-w-[168px] flex-col gap-px rounded-lg border border-line-control bg-raised p-1 shadow-overlay"
            >
              {TABS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  role="option"
                  aria-selected={t.id === tab}
                  onClick={() => {
                    setTab(t.id)
                    setMenuOpen(false)
                  }}
                  className={cn(
                    'hover-surface h-[30px] rounded-md border-0 px-2.5 text-left text-xs',
                    t.id === tab ? 'bg-selected-strong text-fg-strong' : 'bg-transparent text-fg-3',
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            aria-pressed={t.id === tab}
            onClick={() => setTab(t.id)}
            className={pillClass(t.id === tab)}
          >
            {t.label}
          </button>
        ))
      )}
      <div className="flex-1" />
      <button
        type="button"
        aria-label="Настроить виджеты"
        title="Настроить виджеты"
        className="hover-surface flex size-[30px] items-center justify-center rounded-full border border-line-control bg-transparent text-fg-muted"
      >
        <LayoutGrid size={14} strokeWidth={1.75} aria-hidden />
      </button>
      <button
        type="button"
        aria-pressed={panelOpen}
        aria-label="Боковая панель: следующий матч"
        title="Боковая панель · ]"
        onClick={togglePanel}
        className={cn(
          'flex size-[30px] items-center justify-center rounded-full border transition-colors duration-[120ms]',
          panelOpen
            ? 'border-line-strong bg-selected-strong text-fg-strong'
            : 'border-line-control bg-transparent text-fg-muted hover:bg-selected',
        )}
      >
        <PanelRight size={14} strokeWidth={1.75} aria-hidden />
      </button>
    </div>
  )
}

/** Coach's desk, built from the home v2 mockup (docs/design/home-*.png). */
export function HomeScreen() {
  const tab = useUi((s) => s.homeTab)
  const bucket = useUi((s) => s.bucket)
  const singleColumn = bucket === 'xs'
  const showWidgets = tab !== 'week'

  return (
    <>
      <Toolbar />
      <WithSidePanel label="Следующий матч" panel={<NextMatchPanel />}>
        <div className="flex flex-col gap-3 px-2.5 pt-2.5 pb-[18px]">
          {showWidgets && <KpiStrip />}
          {GROUPS_BY_TAB[tab].map((group) => (
            <FeedSection key={group.id} group={group} />
          ))}
          {showWidgets && (
            <div className="flex flex-wrap gap-3">
              <LoadQuadrant fullWidth={singleColumn} />
              <AvailabilityCard fullWidth={singleColumn} />
            </div>
          )}
        </div>
      </WithSidePanel>
    </>
  )
}
