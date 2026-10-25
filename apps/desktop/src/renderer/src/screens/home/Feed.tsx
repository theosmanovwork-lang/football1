import {
  ChartNoAxesColumn,
  Circle,
  CircleAlert,
  CircleCheck,
  CircleDotDashed,
  type LucideIcon,
} from 'lucide-react'
import { useUi } from '@/store/ui'
import { cn } from '@/lib/utils'
import type { FeedGroup, RowStatus } from './homeData'
import { TONE_BG, TONE_BORDER, TONE_TEXT } from './tones'

const STATUS_ICON: Record<RowStatus, { icon: LucideIcon; className: string; label: string }> = {
  urgent: { icon: CircleAlert, className: 'text-warn', label: 'Срочно' },
  todo: { icon: Circle, className: 'text-fg-subtle', label: 'Ждёт решения' },
  progress: { icon: CircleDotDashed, className: 'text-progress', label: 'В работе' },
  ready: { icon: CircleCheck, className: 'text-brand', label: 'Готово' },
  insight: { icon: ChartNoAxesColumn, className: 'text-info', label: 'Инсайт' },
}

/** Collapsible list group in the Linear style: tinted header, dense rows. */
export function FeedSection({ group }: { group: FeedGroup }) {
  const collapsed = useUi((s) => s.collapsedGroups.includes(group.id))
  const toggleGroup = useUi((s) => s.toggleGroup)
  const bucket = useUi((s) => s.bucket)
  const narrow = bucket === 'md' || bucket === 'sm' || bucket === 'xs'
  const showOwner = bucket !== 'xs'

  return (
    <section>
      <button
        type="button"
        aria-expanded={!collapsed}
        onClick={() => toggleGroup(group.id)}
        className="flex h-group w-full min-w-0 cursor-pointer items-center gap-2.5 rounded-md border-0 bg-raised px-3 text-left text-[13px] text-fg"
      >
        <svg
          width="10"
          height="10"
          viewBox="0 0 24 24"
          aria-hidden
          className={cn(
            'flex-none fill-fg-faint transition-transform duration-150',
            collapsed && '-rotate-90',
          )}
        >
          <path d="M6 9h12l-6 7z" />
        </svg>
        <span
          className={cn('size-3.5 flex-none rounded-full border-[1.5px]', TONE_BORDER[group.tone])}
        />
        <span className="whitespace-nowrap font-medium">{group.title}</span>
        <span className="text-fg-subtle">{group.rows.length}</span>
        <span className="flex-1" />
        <span className="min-w-0 truncate text-xs text-fg-subtle">{group.hint}</span>
      </button>
      {!collapsed && (
        <div>
          {group.rows.map((row, i) => {
            const status = STATUS_ICON[row.status]
            const StatusIcon = status.icon
            return (
              <a
                key={`${row.code}-${i}`}
                href="#"
                className={cn(
                  'hover-surface flex min-h-row items-center gap-3 rounded-md pr-3 text-fg',
                  narrow ? 'pl-[22px]' : 'pl-[34px]',
                )}
              >
                <span className="w-[52px] flex-none font-mono text-[11px] text-fg-subtle">
                  {row.code}
                </span>
                <StatusIcon
                  size={15}
                  strokeWidth={1.75}
                  aria-label={status.label}
                  className={cn('flex-none', status.className)}
                />
                <span className="min-w-0 flex-1 truncate">{row.title}</span>
                {row.load && (
                  <span className="block h-1 w-16 flex-none rounded-sm bg-track">
                    <span
                      className={cn('block h-1 rounded-sm', TONE_BG[row.load.tone])}
                      style={{ width: `${row.load.percent}%` }}
                    />
                  </span>
                )}
                {row.chip && (
                  <span
                    className={cn(
                      'flex h-[22px] flex-none items-center gap-1.5 whitespace-nowrap rounded-full border border-line-control px-2 text-[11px]',
                      TONE_TEXT[row.chip.tone],
                    )}
                  >
                    <span className={cn('size-1.5 rounded-full', TONE_BG[row.chip.tone])} />
                    {row.chip.label}
                  </span>
                )}
                {showOwner && row.owner && (
                  <span className="flex size-5 flex-none items-center justify-center rounded-full bg-track text-[9px] font-semibold text-fg-3">
                    {row.owner}
                  </span>
                )}
                <span className="w-[60px] flex-none whitespace-nowrap text-right text-xs text-fg-subtle">
                  {row.meta}
                </span>
              </a>
            )
          })}
        </div>
      )}
    </section>
  )
}
