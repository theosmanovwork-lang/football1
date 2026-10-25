import { Bell, ChevronRight, Menu } from 'lucide-react'
import { sectionById } from '@/navigation'
import { useUi } from '@/store/ui'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ClubMark } from './ClubMark'

export function Header() {
  const section = useUi((s) => s.section)
  const bucket = useUi((s) => s.bucket)
  const navOpen = useUi((s) => s.navOpen)
  const setNavOpen = useUi((s) => s.setNavOpen)
  const narrowest = bucket === 'xs'
  const showDate = bucket !== 'sm' && bucket !== 'xs'

  return (
    <header
      className={cn(
        'flex h-11 min-w-0 flex-none items-center gap-2 border-b border-line pr-3',
        narrowest ? 'pl-2.5' : 'pl-4',
      )}
    >
      {narrowest && (
        <button
          type="button"
          aria-label="Открыть меню"
          aria-expanded={navOpen}
          title="Меню · ["
          onClick={() => setNavOpen(true)}
          className="hover-surface flex size-7 flex-none items-center justify-center rounded-md border border-line-control bg-transparent text-fg-2"
        >
          <Menu size={15} strokeWidth={1.8} aria-hidden />
        </button>
      )}
      <ClubMark size="sm" withInitials={false} />
      <span className="whitespace-nowrap text-fg-muted">Норт Ривер</span>
      <ChevronRight size={12} strokeWidth={2} aria-hidden className="flex-none text-fg-faint" />
      <h1 className="m-0 truncate text-section font-semibold text-fg-strong">
        {sectionById(section).label}
      </h1>
      <div className="flex-1" />
      {showDate && (
        <span className="whitespace-nowrap text-meta text-fg-subtle">
          Вс, 25 окт · MD+1 · Неделя 10
        </span>
      )}
      <button
        type="button"
        aria-label="Уведомления"
        className="hover-surface flex size-7 flex-none items-center justify-center rounded-md border-0 bg-transparent text-fg-muted"
      >
        <Bell size={15} strokeWidth={1.75} aria-hidden />
      </button>
      {/* Advances the game day; wired to the simulation core in T001 step 3. */}
      <Button variant="primary" className="pr-2">
        Продолжить
        <kbd className="rounded-[4px] bg-black/12 px-[5px] py-px font-mono text-micro font-medium text-brand-fg/80">
          Space
        </kbd>
      </Button>
    </header>
  )
}
