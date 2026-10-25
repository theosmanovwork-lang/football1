import { Sparkles } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button-variants'
import { cn } from '@/lib/utils'
import { BOARD_GOALS, LEAGUE_SLICE, NEXT_MATCH } from './homeData'

const FORM_TONE = { В: 'text-brand', Н: 'text-fg-3', П: 'text-danger' } as const
const RING = 2 * Math.PI * 8

/** Block title with an optional same-line note in regular gray: «**Следующий матч** · через 6 дней». */
function SectionTitle({ id, children, note }: { id: string; children: string; note?: string }) {
  return (
    <h2 id={id} className="m-0 text-body font-semibold text-fg">
      {children}
      {note && <span className="font-normal text-fg-subtle"> · {note}</span>}
    </h2>
  )
}

/** Right panel of the home screen: next fixture, comparison, table slice, board goals. */
export function NextMatchPanel() {
  return (
    <div className="flex flex-col gap-5 p-4">
      <section aria-labelledby="h-match" className="flex flex-col gap-3">
        <SectionTitle id="h-match" note={NEXT_MATCH.headingNote}>
          {NEXT_MATCH.heading}
        </SectionTitle>
        <div className="flex flex-col gap-1">
          <span className="text-object font-semibold text-fg-strong">{NEXT_MATCH.fixture}</span>
          <span className="text-meta text-fg-muted">{NEXT_MATCH.details}</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-label text-fg-subtle">Форма соперника</span>
          {NEXT_MATCH.opponentForm.map((r, i) => (
            <span
              key={i}
              className={cn(
                'flex size-5 items-center justify-center rounded-[4px] border border-line-control text-micro font-semibold',
                FORM_TONE[r],
              )}
            >
              {r}
            </span>
          ))}
        </div>
        <div className="overflow-hidden rounded-lg border border-line-card">
          <div className="flex border-b border-line-card px-2.5 py-[7px] text-label text-fg-subtle">
            <span className="flex-1">Центр данных · 10 туров</span>
            <span className="w-12 text-right">Мы</span>
            <span className="w-14 text-right">Они</span>
          </div>
          {NEXT_MATCH.comparison.map((c) => (
            <div
              key={c.metric}
              className="flex items-center border-b border-line-faint px-2.5 py-1.5 text-meta last:border-b-0"
            >
              <span className="min-w-0 flex-1 text-fg-2">{c.metric}</span>
              <span
                className={cn('w-12 text-right font-mono', c.weBetter ? 'text-brand' : 'text-fg-2')}
              >
                {c.us}
              </span>
              <span
                className={cn(
                  'w-14 text-right font-mono',
                  c.weBetter ? 'text-fg-muted' : 'text-fg',
                )}
              >
                {c.them}
              </span>
            </div>
          ))}
        </div>
        <div className="flex gap-2.5 rounded-lg bg-raised p-2.5 text-meta">
          <Sparkles
            size={15}
            strokeWidth={1.75}
            aria-hidden
            className="mt-px flex-none text-info"
          />
          <span className="text-fg-2">{NEXT_MATCH.analystNote}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <a href="#" className={cn(buttonVariants({ variant: 'secondary' }), 'flex-auto px-1.5')}>
            Пакет подготовки
          </a>
          <a href="#" className={cn(buttonVariants({ variant: 'quiet' }), 'flex-auto px-1.5')}>
            Тактическая карта
          </a>
        </div>
      </section>

      <section aria-labelledby="h-table" className="flex flex-col gap-1.5">
        <div className="mb-1">
          <SectionTitle id="h-table">Таблица</SectionTitle>
        </div>
        {LEAGUE_SLICE.map((t) => (
          <div
            key={t.club}
            className={cn(
              'flex h-table-row items-center gap-2.5 rounded-md px-2 text-meta',
              t.own ? 'bg-selected text-fg-strong' : 'text-fg-2',
            )}
          >
            <span className="w-4 font-mono text-fg-subtle">{t.position}</span>
            <span className={cn('min-w-0 flex-1 truncate', t.own && 'font-semibold')}>
              {t.club}
            </span>
            <span className="font-mono text-fg-muted">{t.goalDiff}</span>
            <span className={cn('w-[22px] text-right font-mono', t.own && 'font-semibold')}>
              {t.points}
            </span>
          </div>
        ))}
      </section>

      <section aria-labelledby="h-goals" className="flex flex-col gap-2.5">
        <SectionTitle id="h-goals">Цели совета</SectionTitle>
        {BOARD_GOALS.map((g) => (
          <div key={g.goal} className="flex items-center gap-2.5 text-meta">
            <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden className="flex-none">
              <circle
                cx="12"
                cy="12"
                r="8"
                fill="none"
                strokeWidth="3"
                className="stroke-line-strong"
              />
              <circle
                cx="12"
                cy="12"
                r="8"
                fill="none"
                strokeWidth="3"
                className="stroke-brand"
                strokeDasharray={`${(RING * g.progress).toFixed(1)} ${RING}`}
                transform="rotate(-90 12 12)"
              />
            </svg>
            <span className="min-w-0 flex-1">{g.goal}</span>
            <span className="whitespace-nowrap text-fg-subtle">{g.state}</span>
          </div>
        ))}
      </section>
    </div>
  )
}
