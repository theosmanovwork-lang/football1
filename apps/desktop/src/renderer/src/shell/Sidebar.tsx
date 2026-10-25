import { ChevronDown, PanelLeftClose, PanelLeftOpen, Search, SquarePen } from 'lucide-react'
import { NAV_GROUPS, NAV_TOP, type Section } from '@/navigation'
import { useUi } from '@/store/ui'
import { cn } from '@/lib/utils'
import { ClubMark } from './ClubMark'

const ICON = { size: 16, strokeWidth: 1.7 } as const

interface SidebarProps {
  /** Icons only (60 px), counts become dots. */
  compact: boolean
  /** Rendered as the slide-in drawer of the narrowest layout. */
  drawer: boolean
}

export function Sidebar({ compact, drawer }: SidebarProps) {
  const section = useUi((s) => s.section)
  const setSection = useUi((s) => s.setSection)
  const toggleNav = useUi((s) => s.toggleNav)
  const setPaletteOpen = useUi((s) => s.setPaletteOpen)

  const toggleLabel = drawer ? 'Закрыть меню' : compact ? 'Развернуть меню' : 'Свернуть меню'

  function renderItem(item: Section) {
    const active = item.id === section
    const Icon = item.icon
    return (
      <a
        key={item.id}
        href="#"
        aria-label={item.label}
        aria-current={active ? 'page' : undefined}
        title={compact ? item.label : undefined}
        onClick={(e) => {
          e.preventDefault()
          setSection(item.id)
        }}
        className={cn(
          'hover-surface relative flex h-nav-item items-center gap-2.5 rounded-md',
          compact ? 'justify-center px-0' : 'px-2.5',
          active ? 'bg-selected text-fg-strong' : 'text-fg-2',
        )}
      >
        <Icon {...ICON} className="flex-none" aria-hidden />
        {!compact && (
          <>
            <span className={cn('flex-1 truncate', active && 'font-medium')}>{item.label}</span>
            {item.count ? <span className="text-meta text-fg-muted">{item.count}</span> : null}
          </>
        )}
        {compact && item.count ? (
          <span aria-hidden className="absolute top-1.5 right-2 size-1.5 rounded-full bg-warn" />
        ) : null}
      </a>
    )
  }

  return (
    <div className={cn('flex h-full flex-col gap-4 pt-2.5 pb-2', compact ? 'px-2' : 'px-2.5')}>
      {compact ? (
        <div className="flex flex-col items-center gap-1.5">
          <a
            href="#"
            aria-label="Норт Ривер — сменить клуб"
            className="hover-surface flex h-8 w-9 items-center justify-center rounded-md"
          >
            <ClubMark size="md" />
          </a>
          <button
            type="button"
            aria-label="Поиск"
            onClick={() => setPaletteOpen(true)}
            className="hover-surface flex h-8 w-9 items-center justify-center rounded-md border-0 bg-transparent text-fg-muted"
          >
            <Search size={15} strokeWidth={1.8} aria-hidden />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-1.5 px-1 py-0.5">
          <a
            href="#"
            className="hover-surface flex min-w-0 flex-1 items-center gap-1 rounded-md py-1 pr-1 pl-1.5 text-fg"
          >
            <ClubMark size="md" />
            <span className="truncate font-semibold">Норт Ривер</span>
            <ChevronDown
              size={12}
              strokeWidth={2}
              aria-hidden
              className="flex-none text-fg-muted"
            />
          </a>
          <button
            type="button"
            aria-label="Поиск"
            title="Поиск и команды · Ctrl+K"
            onClick={() => setPaletteOpen(true)}
            className="hover-surface flex size-7 flex-none items-center justify-center rounded-md border-0 bg-transparent text-fg-muted"
          >
            <Search size={15} strokeWidth={1.8} aria-hidden />
          </button>
          <button
            type="button"
            aria-label="Тактический блокнот"
            onClick={() => setSection('notes')}
            className="hover-surface flex size-7 flex-none items-center justify-center rounded-full border border-line-control bg-raised text-fg-2"
          >
            <SquarePen size={14} strokeWidth={1.8} aria-hidden />
          </button>
        </div>
      )}

      <nav
        aria-label="Основное меню"
        className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto"
      >
        <div className="flex flex-col gap-px">{NAV_TOP.map(renderItem)}</div>
        {NAV_GROUPS.map((group) => (
          <div key={group.title} className="flex flex-col gap-px">
            {compact ? (
              <div className="mx-2 my-1.5 h-px bg-line" />
            ) : (
              <div className="flex h-6.5 items-center gap-1 px-2.5 text-meta font-medium text-fg-subtle">
                <span>{group.title}</span>
                <ChevronDown size={10} strokeWidth={2.5} aria-hidden />
              </div>
            )}
            {group.items.map(renderItem)}
          </div>
        ))}
      </nav>

      <div className={cn('flex items-center gap-1.5 px-1', compact && 'flex-col')}>
        <button
          type="button"
          aria-label="Справка"
          className="hover-surface size-6.5 rounded-full border border-line-control bg-transparent text-meta text-fg-muted"
        >
          ?
        </button>
        {!compact && <span className="flex-1" />}
        <button
          type="button"
          aria-label={toggleLabel}
          title={`${toggleLabel} · [`}
          onClick={toggleNav}
          className="hover-surface flex size-7 items-center justify-center rounded-md border-0 bg-transparent text-fg-muted"
        >
          {compact ? (
            <PanelLeftOpen size={15} strokeWidth={1.75} aria-hidden />
          ) : (
            <PanelLeftClose size={15} strokeWidth={1.75} aria-hidden />
          )}
        </button>
      </div>
    </div>
  )
}
