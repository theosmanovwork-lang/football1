import { cn } from '@/lib/utils'

export type Status = 'urgent' | 'todo' | 'progress' | 'ready' | 'insight'

const LABEL: Record<Status, string> = {
  urgent: 'Срочно',
  todo: 'Ждёт решения',
  progress: 'В работе',
  ready: 'Готово',
  insight: 'Инсайт',
}

/**
 * Filled status marks for list rows, drawn after the home mockup (ADR-018: the one exception
 * to "Lucide outline icons only"). Colors come from the theme tokens.
 */
export function StatusIcon({ status, className }: { status: Status; className?: string }) {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      role="img"
      aria-label={LABEL[status]}
      className={cn('flex-none', className)}
    >
      {status === 'urgent' && (
        <>
          <circle cx="12" cy="12" r="9" className="fill-warn" />
          <path
            d="M12 7v6M12 16.5v.5"
            strokeWidth="2.4"
            strokeLinecap="round"
            className="stroke-surface"
          />
        </>
      )}
      {status === 'todo' && (
        <circle cx="12" cy="12" r="8" fill="none" strokeWidth="1.8" className="stroke-fg-subtle" />
      )}
      {status === 'progress' && (
        <>
          <circle cx="12" cy="12" r="8" fill="none" strokeWidth="1.8" className="stroke-progress" />
          <path d="M12 7a5 5 0 0 1 0 10z" className="fill-progress" />
        </>
      )}
      {status === 'ready' && (
        <>
          <circle cx="12" cy="12" r="9" className="fill-brand" />
          <path
            d="M8 12.5l2.7 2.5L16 9.5"
            fill="none"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="stroke-surface"
          />
        </>
      )}
      {status === 'insight' && (
        <path
          d="M5 20V11M11 20V5M17 20v-6"
          fill="none"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="stroke-info"
        />
      )}
    </svg>
  )
}
