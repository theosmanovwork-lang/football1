import { cn } from '@/lib/utils'

/** Placeholder club badge in the accent color (fictional club from the mockup). */
export function ClubMark({
  size,
  withInitials = true,
}: {
  size: 'sm' | 'md'
  withInitials?: boolean
}) {
  return (
    <span
      aria-hidden
      className={cn(
        'flex flex-none items-center justify-center bg-brand font-semibold text-brand-fg',
        size === 'md' ? 'size-5 rounded-[5px] text-micro' : 'size-4 rounded-[4px]',
      )}
    >
      {withInitials && size === 'md' ? 'NR' : null}
    </span>
  )
}
