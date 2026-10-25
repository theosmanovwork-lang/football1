import { sectionById, type SectionId } from '@/navigation'

/** Empty section until its mockup arrives (ADR-006: screens are built from mockups only). */
export function PlaceholderScreen({ section }: { section: SectionId }) {
  const { label, icon: Icon } = sectionById(section)
  return (
    <div className="flex flex-1 items-center justify-center p-6" data-testid="placeholder-screen">
      <div className="flex max-w-sm flex-col items-center gap-2 text-center">
        <Icon size={20} strokeWidth={1.5} className="text-fg-faint" aria-hidden />
        <h2 className="m-0 text-body font-medium">{label}</h2>
        <p className="m-0 text-meta text-fg-subtle">
          Раздел появится, когда будет готов его макет.
        </p>
      </div>
    </div>
  )
}
