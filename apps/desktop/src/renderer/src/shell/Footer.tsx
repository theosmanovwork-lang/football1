import { MessageCircle } from 'lucide-react'
import type { Bucket, LayoutMetrics } from '@/layout/layout'

const BUCKET_NAME: Record<Bucket, string> = {
  xl: 'полный вид',
  lg: 'узкая панель',
  md: 'панель выезжает',
  sm: 'меню иконками',
  xs: 'меню скрыто',
}

export function Footer({
  width,
  bucket,
  metrics,
}: {
  width: number
  bucket: Bucket
  metrics: LayoutMetrics
}) {
  return (
    <footer className="flex h-[34px] flex-none items-center gap-3.5 px-2 text-xs text-fg-muted">
      <span className="whitespace-nowrap">Автосохранение · 10:12</span>
      {/* Layout readout from the mockup; handy while the layout rules are being tuned. */}
      <span className="truncate font-mono text-[11px] text-fg-faint" data-testid="layout-readout">
        окно {width} px · контент {metrics.contentWidth} px · {BUCKET_NAME[bucket]}
      </span>
      <div className="flex-1" />
      <a href="#" className="flex items-center gap-1.5 whitespace-nowrap text-fg-muted">
        <MessageCircle size={14} strokeWidth={1.75} aria-hidden />
        Штаб · 3 новых
      </a>
    </footer>
  )
}
