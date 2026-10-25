import { cn } from '@/lib/utils'
import { AVAILABILITY, KPIS, LOAD_POINTS, type Availability, type LoadZone } from './homeData'
import { TONE_BG, TONE_TEXT } from './tones'

/*
 * Card bases tuned so the two cards sit side by side at 1440 and 1024 px and stack at 1200 px,
 * as in the mockup (docs/design/home-*.png).
 */
const QUAD_BASIS = 360
const AVAILABILITY_BASIS = 340

export function KpiStrip() {
  return (
    <section
      aria-label="Показатели дня"
      className="flex flex-wrap gap-px overflow-hidden rounded-lg border border-line-card bg-line-card"
    >
      {KPIS.map((k) => (
        <a
          key={k.label}
          href="#"
          className="flex min-w-0 flex-[1_1_170px] flex-col gap-1.5 bg-surface px-3 py-2.5 text-fg"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] text-fg-subtle">{k.label}</span>
            <span className="whitespace-nowrap rounded-[4px] border border-line-control px-[5px] text-[10px] text-fg-faint">
              {k.source}
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-xl font-medium">{k.value}</span>
            <span className={cn('text-[11px]', TONE_TEXT[k.deltaTone])}>{k.delta}</span>
          </div>
          <div className="flex h-1 overflow-hidden rounded-sm bg-track">
            {k.bars.map((b, i) => (
              <span
                key={i}
                className={cn('block h-1', TONE_BG[b.tone])}
                style={{ width: `${b.percent}%` }}
              />
            ))}
          </div>
          <span className="text-[11px] text-fg-subtle">{k.note}</span>
        </a>
      ))}
    </section>
  )
}

const ZONE_DOT: Record<LoadZone, string> = {
  risk: 'bg-warn',
  fit: 'bg-fg-3',
  under: 'bg-fg-dim',
}

function CardHeader({
  id,
  title,
  hint,
  link,
}: {
  id: string
  title: string
  hint: string
  link: string
}) {
  return (
    <div className="flex items-center gap-2">
      <h2 id={id} className="m-0 text-[13px] font-medium">
        {title}
      </h2>
      <span className="text-[11px] text-fg-subtle">{hint}</span>
      <div className="flex-1" />
      <a href="#" className="text-xs whitespace-nowrap text-fg-subtle">
        {link} →
      </a>
    </div>
  )
}

export function LoadQuadrant({ fullWidth }: { fullWidth: boolean }) {
  return (
    <section
      aria-labelledby="h-quad"
      style={{ flexBasis: fullWidth ? '100%' : QUAD_BASIS }}
      className="flex min-w-0 flex-1 flex-col gap-2.5 rounded-lg border border-line-card p-3"
    >
      <CardHeader
        id="h-quad"
        title="Нагрузка × готовность"
        hint="GPS + анкеты утром"
        link="Медцентр"
      />
      <div className="flex gap-2">
        <div className="rotate-180 text-center text-[10px] text-fg-faint [writing-mode:vertical-rl]">
          готовность ↑
        </div>
        <div className="flex flex-1 flex-col gap-1">
          <div
            role="img"
            aria-label="Точечный график: игроки по нагрузке и готовности; в зоне риска Окафор и Бреннан"
            className="relative h-[200px] overflow-hidden rounded-md border border-line-card bg-surface-sunken"
          >
            <div className="absolute top-1/2 right-0 bottom-0 left-1/2 bg-risk-zone" />
            <div className="absolute top-0 bottom-0 left-1/2 w-px bg-line-control" />
            <div className="absolute top-1/2 right-0 left-0 h-px bg-line-control" />
            <span className="absolute top-1.5 left-2 text-[10px] text-fg-faint">Свежие</span>
            <span className="absolute top-1.5 right-2 text-[10px] text-fg-faint">В форме</span>
            <span className="absolute bottom-1.5 left-2 text-[10px] text-fg-faint">
              Недогружены
            </span>
            <span className="absolute right-2 bottom-1.5 text-[10px] text-warn">
              Риск перегрузки
            </span>
            {LOAD_POINTS.map((p) => (
              <span
                key={p.name}
                title={p.name}
                style={{ left: `${p.load}%`, top: `${100 - p.readiness}%` }}
                className={cn(
                  '-mt-1 -ml-1 absolute size-2 rounded-full shadow-[0_0_0_2px_var(--surface-sunken)]',
                  ZONE_DOT[p.zone],
                )}
              />
            ))}
            {LOAD_POINTS.filter((p) => p.labelled).map((p) => (
              <span
                key={`${p.name}-label`}
                style={{ left: `${p.load}%`, top: `${100 - p.readiness}%` }}
                className="-mt-5 ml-1.5 absolute whitespace-nowrap text-[10px] text-fg"
              >
                {p.name}
              </span>
            ))}
          </div>
          <div className="text-right text-[10px] text-fg-faint">нагрузка за 7 дней →</div>
        </div>
      </div>
    </section>
  )
}

const AVAILABILITY_BADGE: Record<Availability, { label: string; className: string }> = {
  ok: { label: 'Доступен', className: 'bg-ok-bg text-ok-fg' },
  limited: { label: 'Ограниченно', className: 'bg-mod-bg text-mod-fg' },
  out: { label: 'Недоступен', className: 'bg-out-bg text-out-fg' },
}

export function AvailabilityCard({ fullWidth }: { fullWidth: boolean }) {
  return (
    <section
      aria-labelledby="h-avail"
      style={{ flexBasis: fullWidth ? '100%' : AVAILABILITY_BASIS }}
      className="flex min-w-0 flex-1 flex-col gap-2 rounded-lg border border-line-card p-3"
    >
      <CardHeader id="h-avail" title="Доступность" hint="21 · 2 · 3" link="Весь состав" />
      {AVAILABILITY.map((a) => {
        const badge = AVAILABILITY_BADGE[a.status]
        return (
          <a
            key={a.name}
            href="#"
            className="hover-surface flex min-h-list-row items-center gap-2.5 rounded-md px-1.5 text-fg"
          >
            <span className="w-[34px] flex-none font-mono text-[11px] text-fg-subtle">
              {a.position}
            </span>
            <span className="min-w-0 flex-1 truncate">{a.name}</span>
            <span
              className={cn(
                'flex h-5 flex-none items-center whitespace-nowrap rounded-[4px] px-[7px] text-[11px]',
                badge.className,
              )}
            >
              {badge.label}
            </span>
            <span className="w-[58px] flex-none text-right text-[11px] text-fg-subtle">
              {a.back}
            </span>
          </a>
        )
      })}
    </section>
  )
}
